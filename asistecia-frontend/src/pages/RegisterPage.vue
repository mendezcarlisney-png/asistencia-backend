<!-- src/pages/RegisterPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-grey-2 flex flex-center">
        <q-card class="q-pa-md shadow-2" style="width: 400px; border-radius: 12px;">
          
          <!-- Encabezado de la tarjeta -->
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">Crear Cuenta</div>
            <div class="text-subtitle2 text-grey-7">Sistema de Control de Asistencia</div>
          </q-card-section>

          <!-- Formulario -->
          <q-card-section>
            <q-form @submit.prevent="handleRegister" class="q-gutter-md">
              
              <q-input
                v-model="form.nombre"
                label="Nombre completo"
                outlined
                dense
                :rules="[val => !!val || 'El nombre es obligatorio']"
              />

              <q-input
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                outlined
                dense
                :rules="[val => !!val || 'El correo es obligatorio']"
              />

              <q-input
                v-model="form.password"
                label="Contraseña"
                type="password"
                outlined
                dense
                :rules="[val => !!val || 'La contraseña es obligatoria']"
              />

              <!-- Selector de rol adaptado estrictamente al Enum de PostgreSQL en MAYÚSCULAS -->
              <q-select
                v-model="form.rol"
                :options="roles"
                label="Selecciona tu rol"
                outlined
                dense
                emit-value
                map-options
                :rules="[val => !!val || 'El rol es obligatorio']"
              />

              <div>
                <q-btn label="Registrarse" type="submit" color="primary" class="full-width q-py-sm" unelevated />
              </div>
            </q-form>
          </q-card-section>

          <!-- Pie de tarjeta para ir al Login -->
          <q-card-section class="text-center q-pt-none">
            <p class="text-grey-7">¿Ya tienes cuenta? <router-link to="/login" class="text-primary">Inicia sesión</router-link></p>
          </q-card-section>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import api from 'src/services/api';

const router = useRouter();
const $q = useQuasar();

// Objeto reactivo que almacena los datos del formulario
const form = ref({
  nombre: '',
  email: '',
  password: '',
  rol: 'ESTUDIANTE' // Valor por defecto en mayúsculas para cumplir con Postgres
});

// Opciones del select alineadas con el enum de la base de datos
const roles = [
  { label: 'Estudiante', value: 'ESTUDIANTE' },
  { label: 'Profesor', value: 'PROFESOR' },
  { label: 'Administrador', value: 'ADMIN' }
];

// Función que se ejecuta al enviar el formulario
const handleRegister = async () => {
  try {
    const response = await api.post('/auth/register', form.value);
    
    // Notificación visual de éxito con Quasar
    $q.notify({
      color: 'positive',
      message: response.data.message || '¡Usuario registrado con éxito!',
      icon: 'check'
    });

    // Redirigir al usuario al Login
    router.push('/login');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al registrar el usuario';
    
    // Notificación visual de error
    $q.notify({
      color: 'negative',
      message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      icon: 'report_problem'
    });
  }
};
</script>