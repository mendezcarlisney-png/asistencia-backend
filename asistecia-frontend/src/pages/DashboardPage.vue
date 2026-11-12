<!-- src/pages/DashboardPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Barra superior (Header) -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Sistema de Control de Asistencia - Dashboard
        </q-toolbar-title>
        
        <!-- Información del usuario y botón de salir -->
        <div v-if="user" class="q-mr-md text-subtitle2">
          {{ user.nombre }} (<span class="text-weight-bold">{{ user.rol }}</span>)
        </div>
        <q-btn flat dense icon="logout" label="Cerrar Sesión" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <q-page class="q-pa-md bg-grey-2">
        <div class="row q-col-gutter-md">
          
          <!-- Tarjeta de bienvenida -->
          <div class="col-12">
            <q-card class="q-pa-lg">
              <div class="text-h4 text-primary text-weight-bold">¡Bienvenido al Sistema!</div>
              <p class="text-grey-7 q-mt-sm">
                Has iniciado sesión correctamente en el sistema de gestión de asistencias conectado a NestJS y PostgreSQL.
              </p>
            </q-card>
          </div>

          <!-- Sección dinámica según el Rol -->
          <div class="col-12 col-md-4" v-if="user?.rol === 'ADMIN'">
            <q-card class="q-pa-md bg-blue-1">
              <div class="text-h6 text-blue-9">Panel de Administrador</div>
              <p class="text-grey-8">Gestión completa de usuarios, profesores y reportes globales.</p>
            </q-card>
          </div>

          <div class="col-12 col-md-4" v-if="user?.rol === 'PROFESOR'">
            <q-card class="q-pa-md bg-green-1">
              <div class="text-h6 text-green-9">Panel de Profesor</div>
              <p class="text-grey-8">Creación de clases y pase de lista a los estudiantes.</p>
            </q-card>
          </div>

          <div class="col-12 col-md-4" v-if="user?.rol === 'ESTUDIANTE'">
            <q-card class="q-pa-md bg-orange-1">
              <div class="text-h6 text-orange-9">Panel de Estudiante</div>
              <p class="text-grey-8">Consulta de asistencias registradas y horarios.</p>
            </q-card>
          </div>

        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const user = ref(null);

// Al cargar la vista, recuperamos los datos del usuario guardados en el navegador
onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  $q.notify({
    color: 'info',
    message: 'Has cerrado sesión',
    icon: 'logout'
  });

  router.push('/login');
};
</script>