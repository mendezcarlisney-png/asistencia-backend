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
    path: '/materias',
    component: () => import('../pages/MisMateriasPage.vue'),
    meta: { requiresAuth: true }
  },
  {
  path: '/estudiante/asistencia',
  component: () => import('../pages/MisAsistenciaPage.vue'), // 👈 Quita la "s" de MisAsistencias
},
{
  path: '/gestion/aulas-secciones',
  component: () => import('../pages/GestionAulasSeccionesPage.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/gestion/horarios',
  component: () => import('../pages/PlanificacionHorariosPage.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/profesor/reportes',
  component: () => import('../pages/ReportesAcademicosPage.vue'),
  meta: { requiresAuth: true, rol: 'PROFESOR' }
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