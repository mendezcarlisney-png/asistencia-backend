<!-- Archivo: src/pages/LoginPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-login-container">
    <q-page-container>
      <q-page class="flex flex-center q-pa-md">
        
        <q-card flat class="bg-white rounded-xl shadow-3 login-card border-subtle">
          <div class="row full-height">
            
            <!-- Columna Izquierda: Identidad Institucional -->
            <div class="col-12 col-md-5 bg-navy-dark text-white q-pa-xl flex flex-center column justify-between rounded-left-xl print-hide">
              <div>
                <q-avatar rounded color="vinotinto" text-color="white" icon="verified" size="lg" class="shadow-2 q-mb-md" />
                <div class="text-h5 text-weight-bold q-mt-sm">Control Académico</div>
                <div class="text-caption text-grey-4 q-mt-xs">Sistema Inteligente de Asistencia y Gestión Docente</div>
              </div>
              <div class="text-caption text-grey-5">
                NestJS • PostgreSQL • Quasar Vue 3
              </div>
            </div>

            <!-- Columna Derecha: Formulario de Acceso -->
            <div class="col-12 col-md-7 q-pa-lg q-pa-md-xl flex column justify-center">
              
              <div class="q-mb-lg">
                <div class="text-h5 text-weight-bold text-navy-dark">Iniciar Sesión</div>
                <div class="text-caption text-grey-6">Ingresa tus credenciales institucionales para continuar.</div>
              </div>

              <q-form @submit.prevent="handleLogin" class="q-gutter-md">
                <q-input
                  v-model="form.email"
                  label="Correo Electrónico"
                  type="email"
                  outlined
                  dense
                  class="bg-grey-1 rounded-borders"
                  lazy-rules
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
                  lazy-rules
                  :rules="[val => !!val || 'La contraseña es obligatoria']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="vinotinto" />
                  </template>
                </q-input>

                <div class="q-mt-md">
                  <q-btn 
                    label="Ingresar al Sistema" 
                    type="submit" 
                    color="vinotinto" 
                    text-color="white"
                    class="full-width q-py-sm text-weight-bold shadow-2 rounded-borders" 
                    unelevated 
                  />
                </div>
              </q-form>

              <div class="text-center q-mt-lg">
                <p class="text-grey-7 text-caption">
                  ¿No tienes una cuenta institucional? 
                  <router-link to="/register" class="text-vinotinto text-weight-bold" style="text-decoration: none;">
                    Regístrate aquí
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
import { Notify } from 'quasar';
import api from '../services/api';

const router = useRouter();

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', form.value);
    
    // Almacenamos token y datos del usuario devueltos por NestJS
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    Notify.create({
      color: 'navy-dark',
      textColor: 'white',
      message: '¡Bienvenido de nuevo!',
      icon: 'login',
      position: 'top',
      classes: 'shadow-2'
    });

    // Extracción segura del rol del usuario
    const userRole = response.data.user?.rol;

    // Redirección inteligente de acuerdo al rol del sistema
    if (userRole === 'PROFESOR') {
      router.push('/profesor/materias');
    } else if (userRole === 'ESTUDIANTE') {
      router.push('/estudiante/asistencia');
    } else if (userRole === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }

  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Credenciales incorrectas';
    
    Notify.create({
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
.bg-login-container { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
.login-card { width: 850px; max-width: 100%; min-height: 480px; overflow: hidden; }
.rounded-xl { border-radius: 20px !important; }
.rounded-left-xl { border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
.border-subtle { border: 1px solid #edf2f7 !important; }
</style>