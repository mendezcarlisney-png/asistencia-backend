import { defineRouter } from "#q-app";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router";

import routes from "./routes";

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  });

  // 🛡️ Guardián de navegación: Protege las rutas que tengan `meta: { requiresAuth: true }`
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    // Si la ruta requiere autenticación y el usuario NO tiene token
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        next({ path: '/login' }); // Redirige al login
      } else {
        next(); // Permite el paso
      }
    } else {
      next(); // Rutas libres (como /login o /register)
    }
  });

  return Router;
});