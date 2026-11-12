<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    
    <!-- Barra Superior -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 1px solid #f0f0f0;">
      <q-toolbar class="q-py-md">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="green-1" text-color="positive" icon="fact_check" size="lg" />
          <div>
            <div class="text-weight-bold text-h6 text-dark">Control de Asistencia y Clase Vista</div>
            <div class="text-caption text-grey-6">Panel de Registro Docente</div>
          </div>
        </q-toolbar-title>
        
        <q-btn flat rounded color="dark" icon="arrow_back" label="Volver al Dashboard" to="/dashboard" class="q-px-md" />
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-xl">
        
        <!-- Tarjeta de Configuración (Materia, Fecha y Clase Vista) -->
        <q-card flat bordered class="q-pa-lg q-mb-xl bg-white rounded-xl shadow-1">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-md">Configuración de la Sesión</div>
          
          <div class="row q-col-gutter-lg items-center">
            <div class="col-12 col-md-5">
              <q-select
                v-model="materiaSeleccionada"
                :options="materiasProfesor"
                label="Seleccionar Materia / Grupo"
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

            <div class="col-12 col-md-4">
              <q-input
                v-model="fechaActual"
                label="Fecha de la Sesión"
                outlined
                dense
                readonly
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- Switch de Clase Vista -->
            <div class="col-12 col-md-3">
              <q-toggle
                v-model="claseVista"
                color="positive"
                icon="check_circle"
                label="¿Clase impartida/vista?"
                class="text-weight-medium"
              />
            </div>
          </div>
        </q-card>

        <!-- Tabla Estructurada con Checklists -->
        <q-card flat bordered class="q-pa-lg bg-white rounded-xl shadow-1" v-if="materiaSeleccionada">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h6 text-weight-bold text-dark">Lista de Estudiantes (Asistencia)</div>
              <div class="text-caption text-grey-6">Marca la casilla para confirmar la asistencia del alumno a esta sesión.</div>
            </div>
            
            <div class="row q-gutter-sm items-center">
              <q-badge :color="claseVista ? 'green-1' : 'orange-1'" :text-color="claseVista ? 'positive' : 'warning'" class="q-pa-sm text-subtitle2 rounded-borders">
                {{ claseVista ? '✔ Clase Vista Registrada' : '⚠ Clase Pendiente de Dictar' }}
              </q-badge>
              <q-badge color="blue-1" text-color="primary" class="q-pa-sm text-subtitle2 rounded-borders">
                {{ materiaSeleccionada }}
              </q-badge>
            </div>
          </div>

          <q-table
            :rows="estudiantes"
            :columns="columns"
            row-key="id"
            flat
            bordered
            class="q-mt-md custom-table"
          >
            <!-- Slot para Identificación con Avatar/Iniciales -->
            <template v-slot:body-cell-nombre="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-sm">
                  <q-avatar size="32px" color="primary" text-color="white" class="text-weight-bold">
                    {{ props.row.nombre.charAt(0) }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-dark">{{ props.row.nombre }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.email }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <!-- Slot para el Checklist (Presente / Ausente) -->
            <template v-slot:body-cell-asistencia="props">
              <q-td :props="props" class="text-center">
                <q-checkbox
                  v-model="props.row.presente"
                  color="positive"
                  size="lg"
                  indeterminate-value="false"
                />
                <span class="text-weight-medium q-ml-sm" :class="props.row.presente ? 'text-positive' : 'text-grey-5'">
                  {{ props.row.presente ? 'Presente (✔)' : 'Ausente (X)' }}
                </span>
              </q-td>
            </template>
          </q-table>

          <!-- Botón de Guardar -->
          <div class="row justify-end q-mt-xl">
            <q-btn 
              label="Guardar Asistencia y Estado de Clase" 
              color="positive" 
              icon="save" 
              @click="guardarAsistencia" 
              unelevated 
              rounded
              size="md"
              class="q-px-xl q-py-sm"
            />
          </div>
        </q-card>

        <!-- Mensaje de estado inicial -->
        <q-card flat bordered class="q-pa-xl text-center bg-white rounded-xl shadow-1" v-else>
          <q-icon name="touch_app" size="50px" color="grey-4" class="q-mb-md" />
          <div class="text-h6 text-grey-7 text-weight-medium">Selecciona una materia arriba</div>
          <div class="text-caption text-grey-5">Para desplegar la tabla de identificación y gestionar el pase de lista.</div>
        </q-card>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { Notify } from 'quasar';
import api from '../services/api';

const fechaActual = ref(new Date().toLocaleDateString());
const claseVista = ref(true); // Estado para marcar si la clase fue dictada/vista

const materiaSeleccionada = ref(null);
const materiasProfesor = ref([
  { label: 'Programación Full-Stack (Grupo A)', value: 'Programación Full-Stack - Grupo A' },
  { label: 'Arquitectura de Software (Grupo B)', value: 'Arquitectura de Software - Grupo B' },
  { label: 'Bases de Datos Avanzadas (Grupo A)', value: 'Bases de Datos Avanzadas - Grupo A' }
]);

const estudiantes = ref([
  { id: '1', nombre: 'Juan Pérez', email: 'juan@test.com', presente: true },
  { id: '2', nombre: 'María Gómez', email: 'maria@test.com', presente: true },
  { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@test.com', presente: false },
]);

const columns = [
  { name: 'nombre', label: 'Estudiante Identificado', field: 'nombre', align: 'left', sortable: true },
  { name: 'asistencia', label: 'Registro de Asistencia (Checklist)', field: 'presente', align: 'center' }
];

const guardarAsistencia = async () => {
  try {
    const payload = {
      materia: materiaSeleccionada.value,
      fecha: new Date().toISOString(),
      claseVista: claseVista.value, // Se envía al backend si la clase fue dictada o no
      asistencias: estudiantes.value.map(est => ({
        estudianteId: est.id,
        estado: est.presente ? 'PRESENTE' : 'AUSENTE'
      }))
    };

    console.log('Enviando reporte al backend:', payload);
    // await api.post('/asistencias', payload);

    Notify.create({
      color: 'positive',
      message: `¡Registro guardado con éxito! (Clase Vista: ${claseVista.value ? 'Sí' : 'No'})`,
      icon: 'check_circle',
      position: 'top'
    });
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: 'Error al guardar el registro',
      icon: 'error',
      position: 'top'
    });
  }
};
</script>

<style scoped>
.rounded-xl {
  border-radius: 20px !important;
}

.custom-table >>> .q-table__top,
.custom-table >>> th {
  font-weight: 600;
  color: #333;
}
</style>