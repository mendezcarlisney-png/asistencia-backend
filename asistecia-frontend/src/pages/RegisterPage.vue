<!-- src/pages/RegisterPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-login-container">
    <q-page-container>
      <q-page class="flex flex-center q-pa-md">
        
        <q-card flat class="bg-white rounded-xl shadow-3 register-card border-subtle">
          <div class="row full-height">
            
            <!-- Columna Izquierda: Identidad Institucional (Idéntica al Login) -->
            <div class="col-12 col-md-5 bg-navy-dark text-white q-pa-xl flex flex-center column justify-between rounded-left-xl print-hide">
              <div>
                <q-avatar rounded color="vinotinto" text-color="white" icon="person_add" size="lg" class="shadow-2 q-mb-md" />
                <div class="text-h5 text-weight-bold q-mt-sm">Portal de Registro</div>
                <div class="text-caption text-grey-4 q-mt-xs">Únete al Sistema Inteligente de Control de Asistencia</div>
              </div>
              <div class="text-caption text-grey-5">
                NestJS • PostgreSQL • Quasar Vue 3
              </div>
            </div>

            <!-- Columna Derecha: Formulario de Registro Moderno -->
            <div class="col-12 col-md-7 q-pa-lg q-pa-md-xl flex column justify-center">
              
              <div class="q-mb-md">
                <div class="text-h5 text-weight-bold text-navy-dark">Crear Cuenta</div>
                <div class="text-caption text-grey-6">Ingresa tus datos institucionales para registrarte.</div>
              </div>

              <q-form @submit.prevent="handleRegister" class="q-gutter-sm">
                
                <q-input
                  v-model="form.nombre"
                  label="Nombre completo"
                  outlined
                  dense
                  class="bg-grey-1 rounded-borders"
                  :rules="[val => !!val || 'El nombre es obligatorio']"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" color="vinotinto" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.email"
                  label="Correo electrónico"
                  type="email"
                  outlined
                  dense
                  class="bg-grey-1 rounded-borders"
                  :rules="[val => !!val || 'El correo es obligatorio']"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="vinotinto" />
                  </template>
                </q-input>

                <q-input
                  v-model="form.password"
                  label="Contraseña"
                  type="password"
                  outlined
                  dense
                  class="bg-grey-1 rounded-borders"
                  :rules="[val => !!val || 'La contraseña es obligatoria']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="vinotinto" />
                  </template>
                </q-input>

                <!-- Selector de rol adaptado estrictamente al Enum de PostgreSQL -->
                <q-select
                  v-model="form.rol"
                  :options="roles"
                  label="Selecciona tu rol institucional"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="bg-grey-1 rounded-borders"
                  :rules="[val => !!val || 'El rol es obligatorio']"
                >
                  <template v-slot:prepend>
                    <q-icon name="admin_panel_settings" color="vinotinto" />
                  </template>
                </q-select>

                <div class="q-mt-md">
                  <q-btn 
                    label="Registrarse en el Sistema" 
                    type="submit" 
                    color="vinotinto" 
                    text-color="white"
                    class="full-width q-py-sm text-weight-bold shadow-2 rounded-borders" 
                    unelevated 
                  />
                </div>
              </q-form>

              <div class="text-center q-mt-md">
                <p class="text-grey-7 text-caption">
                  ¿Ya tienes una cuenta institucional? 
                  <router-link to="/login" class="text-vinotinto text-weight-bold" style="text-decoration: none;">
                    Inicia sesión aquí
                  </router-link>
                </p>
              </div>

            </div>

          </div>
        </q-card>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import api from '../services/api';

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
    
    // Notificación visual de éxito con Quasar adaptada a la paleta
    $q.notify({
      color: 'navy-dark',
      textColor: 'white',
      message: response.data.message || '¡Usuario registrado con éxito!',
      icon: 'check_circle',
      position: 'top',
      classes: 'shadow-2'
    });

    // Redirigir al usuario al Login
    router.push('/login');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al registrar el usuario';
    
    // Notificación visual de error
    $q.notify({
      color: 'negative',
      message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      icon: 'report_problem',
      position: 'top'
    });
  }
};
</script>

<style scoped>
.bg-vinotinto { background-color: #6b1d2f !important; }
.text-vinotinto { color: #6b1d2f !important; }
.bg-navy-dark { background-color: #1b2a47 !important; }
.text-navy-dark { color: #1b2a47 !important; }

.bg-login-container { 
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
}

.register-card { 
  width: 900px; 
  max-width: 100%; 
  min-height: 520px; 
  overflow: hidden; 
}

.rounded-xl { border-radius: 20px !important; }
.rounded-left-xl { border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
.border-subtle { border: 1px solid #edf2f7 !important; }
</style>