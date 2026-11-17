import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Ruta Raíz / Autenticación
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

  // Módulo del Profesor
  {
    path: '/materias',
    component: () => import('../pages/MisMateriasPage.vue'),
    meta: { requiresAuth: true, rol: 'PROFESOR' }
  },
  {
    path: '/profesor/asistencia',
    component: () => import('../pages/ProfesorAsistenciaPage.vue'),
    meta: { requiresAuth: true, rol: 'PROFESOR' }
  },
  {
    path: '/profesor/asistencia/:id',
    component: () => import('../pages/ProfesorAsistenciaPage.vue'),
    meta: { requiresAuth: true, rol: 'PROFESOR' }
  },
  {
    path: '/profesor/reportes',
    component: () => import('../pages/ReportesAcademicosPage.vue'),
    meta: { requiresAuth: true, rol: 'PROFESOR' }
  },

  // Módulo del Estudiante
  {
    path: '/estudiante/asistencia',
    component: () => import('../pages/MisAsistenciaPage.vue'),
    meta: { requiresAuth: true, rol: 'ESTUDIANTE' }
  },

  // Módulo de Administración (Gestión Global, Aulas, Secciones y Asignaciones)
  {
    path: '/admin/asignaciones',
    component: () => import('../pages/AdminAsignacionPage.vue'),
    meta: { requiresAuth: true, rol: 'ADMIN' }
  },
  {
    path: '/admin/aulas-secciones',
    component: () => import('../pages/GestionAulasSeccionesPage.vue'),
    meta: { requiresAuth: true, rol: 'ADMIN' }
  },
  {
    path: '/admin/horarios',
    component: () => import('../pages/PlanificacionHorariosPage.vue'),
    meta: { requiresAuth: true, rol: 'ADMIN' }
  },

  // Dashboard General / Fallback
  {
    path: '/admin/dashboard',
    component: () => import('../pages/AdminAsignacionPage.vue'),
    meta: { requiresAuth: true }
  },

  // Ruta 404 para páginas no encontradas
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
];

export default routes;