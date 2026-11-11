<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-grey-2 flex flex-center">
        <q-card class="q-pa-md shadow-2" style="width: 400px; border-radius: 12px;">
          
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">Iniciar Sesión</div>
            <div class="text-subtitle2 text-grey-7">Sistema de Control de Asistencia</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="handleLogin" class="q-gutter-md">
              <q-input
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                outlined
                dense
                lazy-rules
                :rules="[val => !!val || 'El correo es obligatorio']"
              />

              <q-input
                v-model="form.password"
                label="Contraseña"
                type="password"
                outlined
                dense
                lazy-rules
                :rules="[val => !!val || 'La contraseña es obligatoria']"
              />

              <div>
                <q-btn label="Entrar" type="submit" color="primary" class="full-width q-py-sm" unelevated />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pt-none">
            <p class="text-grey-7">¿No tienes cuenta? <router-link to="/register" class="text-primary">Regístrate aquí</router-link></p>
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
import api from '../services/api';

const router = useRouter();
const $q = useQuasar();

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', form.value);
    
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    $q.notify({
      color: 'positive',
      message: '¡Bienvenido de nuevo!',
      icon: 'login'
    });

    router.push('/dashboard');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Credenciales incorrectas';
    $q.notify({
      color: 'negative',
      message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      icon: 'report_problem'
    });
  }
};
</script>