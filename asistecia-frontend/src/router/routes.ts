const routes = [
  {
    path: '/',
    // Redirige automáticamente al login cuando abres la app
    redirect: '/login' 
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue') // Tu vista de login que creamos
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue') // Tu vista de registro que creamos
  },
  {
    path: '/dashboard',
    component: () => import('pages/DashboardPage.vue') // Tu panel principal
  },

  // Siempre es bueno dejar una ruta comodín por si escriben mal una URL
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;