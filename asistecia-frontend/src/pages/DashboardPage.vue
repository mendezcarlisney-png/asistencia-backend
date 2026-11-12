<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    
    <!-- Barra Superior -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 1px solid #e0e0e0;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar color="positive" text-color="white" icon="how_to_reg" size="md" />
          <div>
            <div class="text-weight-bold text-subtitle1">Control de Asistencia</div>
            <div class="text-caption text-grey-7">Panel de Registro Docente</div>
          </div>
        </q-toolbar-title>
        
        <q-btn flat color="primary" icon="arrow_back" label="Volver al Dashboard" to="/dashboard" />
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg">
        
        <!-- Tarjeta de Selección de Materia y Fecha -->
        <q-card flat bordered class="q-pa-lg q-mb-md bg-white rounded-borders shadow-1">
          <div class="text-h6 text-weight-bold text-dark q-mb-md">Selección de Clase y Materia</div>
          
          <div class="row q-col-gutter-md items-center">
            <!-- Selector de Materia -->
            <div class="col-12 col-md-6">
              <q-select
                v-model="materiaSeleccionada"
                :options="materiasProfesor"
                label="Seleccionar Materia"
                outlined
                dense
                emit-value
                map-options
                options-dense
              >
                <template v-slot:prepend>
                  <q-icon name="book" color="positive" />
                </template>
              </q-select>
            </div>

            <!-- Fecha Actual (Informativa oEditable) -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="fechaActual"
                label="Fecha de la Clase"
                outlined
                dense
                readonly
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="primary" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card>

        <!-- Tabla de Estudiantes (Se muestra solo si hay una materia seleccionada) -->
        <q-card flat bordered class="q-pa-lg bg-white rounded-borders shadow-1" v-if="materiaSeleccionada">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h6 text-weight-bold">Pase de Lista</div>
              <div class="text-caption text-grey-7">Marque el estatus de asistencia para cada estudiante inscrito.</div>
            </div>
            <q-badge color="green-1" text-color="positive" class="q-pa-sm text-subtitle2">
              Materia Activa: {{ materiaSeleccionada }}
            </q-badge>
          </div>

          <q-table
            :rows="estudiantes"
            :columns="columns"
            row-key="id"
            flat
            bordered
            class="q-mt-md"
          >
            <template v-slot:body-cell-estado="props">
              <q-td :props="props">
                <q-btn-toggle
                  v-model="props.row.estado"
                  push
                  glossy
                  toggle-color="positive"
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
          <div class="row justify-end q-mt-lg">
            <q-btn 
              label="Guardar Registro de Asistencia" 
              color="positive" 
              icon="save" 
              @click="guardarAsistencia" 
              unelevated 
              size="md"
              class="q-px-lg"
            />
          </div>
        </q-card>

        <!-- Mensaje si no ha seleccionado materia -->
        <q-card flat bordered class="q-pa-xl text-center bg-white rounded-borders" v-else>
          <q-icon name="info" size="50px" color="grey-5" class="q-mb-sm" />
          <div class="text-h6 text-grey-7">Por favor, seleccione una materia arriba para comenzar a pasar lista.</div>
        </q-card>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const fechaActual = ref(new Date().toLocaleDateString());

// Materias que imparte el profesor
const materiaSeleccionada = ref(null);
const materiasProfesor = ref([
  { label: 'Programación Full-Stack (Grupo A)', value: 'Programación Full-Stack - Grupo A' },
  { label: 'Arquitectura de Software (Grupo B)', value: 'Arquitectura de Software - Grupo B' },
  { label: 'Bases de Datos Avanzadas (Grupo A)', value: 'Bases de Datos Avanzadas - Grupo A' }
]);

// Lista de estudiantes simulada
const estudiantes = ref([
  { id: '1', nombre: 'Juan Pérez', email: 'juan@test.com', estado: 'PRESENTE' },
  { id: '2', nombre: 'María Gómez', email: 'maria@test.com', estado: 'PRESENTE' },
  { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@test.com', estado: 'AUSENTE' },
  { id: '4', nombre: 'Ana Torres', email: 'ana@test.com', estado: 'PRESENTE' }
]);

const columns = [
  { name: 'nombre', label: 'Estudiante', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'Correo Electrónico', field: 'email', align: 'left' },
  { name: 'estado', label: 'Estatus de Asistencia', field: 'estado', align: 'center' }
];

const guardarAsistencia = () => {
  const payload = {
    materia: materiaSeleccionada.value,
    fecha: new Date().toISOString(),
    asistencias: estudiantes.value.map(est => ({
      estudianteId: est.id,
      nombre: est.nombre,
      estado: est.estado
    }))
  };

  console.log('Enviando datos al backend:', payload);

  $q.notify({
    color: 'positive',
    message: `¡Asistencia guardada con éxito para ${materiaSeleccionada.value}!`,
    icon: 'check_circle',
    position: 'top'
  });
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px !important;
}
</style>