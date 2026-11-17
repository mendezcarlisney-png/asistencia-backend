const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('../pages/RegisterPage.vue')
  },
  {
  path: '/profesor/asistencia',
  component: () => import('../pages/ProfesorAsistenciaPage.vue')
  },
  {
  path: '/estudiante/asistencia',
  component: () => import('../pages/MisAsistenciaPage.vue'), // 👈 Quita la "s" de MisAsistencias
},
  {
    path: '/dashboard',
    component: () => import('../pages/DashboardPage.vue')
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
];

export default routes;