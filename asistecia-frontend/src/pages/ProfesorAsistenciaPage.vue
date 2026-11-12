<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md bg-grey-2">
        <q-card class="q-pa-md shadow-2">
          
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h5 text-weight-bold text-primary">Control de Asistencia</div>
              <div class="text-subtitle2 text-grey-7">Materia: Programación Full-Stack | Fecha: {{ fechaActual }}</div>
            </div>
            <q-btn flat color="primary" icon="arrow_back" label="Volver al Dashboard" to="/dashboard" />
          </div>

          <!-- Tabla de Estudiantes -->
          <q-table
            :rows="estudiantes"
            :columns="columns"
            row-key="id"
            flat
            bordered
          >
            <!-- Slot personalizado para los botones de estado de asistencia -->
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-btn-toggle
                  v-model="props.row.estado"
                  glossy
                  push
                  toggle-color="primary"
                  :options="[
                    { label: 'Presente', value: 'PRESENTE', color: 'positive' },
                    { label: 'Tardanza', value: 'TARDANZA', color: 'warning' },
                    { label: 'Ausente', value: 'AUSENTE', color: 'negative' }
                  ]"
                />
              </q-td>
            </template>
          </q-table>

          <!-- Botón de Guardar -->
          <div class="row justify-end q-mt-md">
            <q-btn label="Guardar Asistencia" color="primary" icon="save" @click="guardarAsistencia" unelevated />
          </div>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { Notify } from 'quasar';
import api from '../services/api';

const fechaActual = new Date().toLocaleDateString();

// Lista de ejemplo (en el futuro esto vendrá de una petición GET a tu backend de alumnos/clases)
const estudiantes = ref([
  { id: '1', nombre: 'Juan Pérez', email: 'juan@test.com', estado: 'PRESENTE' },
  { id: '2', nombre: 'María Gómez', email: 'maria@test.com', estado: 'PRESENTE' },
  { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@test.com', estado: 'AUSENTE' },
]);

const columns = [
  { name: 'nombre', label: 'Estudiante', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'Correo', field: 'email', align: 'left' },
  { name: 'estado', label: 'Estado de Asistencia', field: 'estado', align: 'center' }
];

const guardarAsistencia = async () => {
  try {
    // Aquí mapearemos los datos para enviarlos al backend en un POST /asistencias
    const payload = estudiantes.value.map(est => ({
      estudianteId: est.id,
      estado: est.estado,
      fecha: new Date().toISOString()
    }));

    // Simulación o llamada real:
    // await api.post('/asistencias', payload);

    Notify.create({
      color: 'positive',
      message: '¡Asistencia guardada correctamente!',
      icon: 'check_circle'
    });
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: 'Error al guardar la asistencia',
      icon: 'error'
    });
  }
};
</script>