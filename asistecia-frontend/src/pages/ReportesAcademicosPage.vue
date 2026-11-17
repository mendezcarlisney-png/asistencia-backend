<!-- src/pages/ReportesAcademicosPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="assessment" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Reportes Académicos y Alertas</div>
            <div class="text-caption text-grey-6">Consolidados de Inasistencia y Seguimiento Estudiantil</div>
          </div>
        </q-toolbar-title>

        <!-- Accesos Rápidos -->
        <div class="row items-center q-gutter-md">
          <q-btn flat rounded color="navy-dark" icon="menu_book" label="Mis Materias" to="/materias" />
          <q-btn flat rounded color="vinotinto" icon="logout" label="Salir" @click="logout" class="bg-red-1 q-px-md text-weight-medium" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">

        <!-- Banner de Alertas Automáticas (Si hay estudiantes en riesgo) -->
        <q-banner v-if="estudiantesEnRiesgo.length > 0" rounded class="bg-red-1 text-negative border-subtle q-mb-lg shadow-1">
          <template v-slot:avatar>
            <q-icon name="warning" color="negative" size="32px" />
          </template>
          <div class="text-weight-bold text-subtitle1">¡Alerta Automática de Inasistencia!</div>
          <div class="text-caption">
            Hay <strong>{{ estudiantesEnRiesgo.length }} estudiante(s)</strong> que han superado el límite permitido de faltas (25%) y se encuentran en riesgo de reprobación por inasistencia.
          </div>
        </q-banner>

        <!-- Cabecera de la Sección -->
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold text-navy-dark">Consolidado por Estudiante</div>
            <div class="text-caption text-grey-6">Porcentajes de asistencia y estado académico actual por asignatura.</div>
          </div>
          <q-btn 
            unelevated 
            rounded 
            color="vinotinto" 
            icon="print" 
            label="Imprimir Reporte General" 
            @click="imprimirReporte"
            class="q-px-lg q-py-sm text-weight-bold shadow-1" 
          />
        </div>

        <!-- Tabla de Reportes e Inasistencias -->
        <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
          <q-table
            :rows="reportesEstudiantes"
            :columns="columns"
            row-key="id"
            flat
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="nombre" :props="props" class="text-weight-bold text-navy-dark">
                  {{ props.row.nombre }}
                  <div class="text-caption text-grey-6" style="font-size: 11px;">{{ props.row.email }}</div>
                </q-td>
                <q-td key="materia" :props="props">
                  {{ props.row.materia }}
                </q-td>
                <q-td key="totalClases" :props="props" class="text-center">
                  {{ props.row.totalClases }}
                </q-td>
                <q-td key="porcentaje" :props="props">
                  <div class="row items-center q-gutter-x-sm">
                    <q-linear-progress 
                      :value="props.row.porcentajeAsistencia / 100" 
                      :color="props.row.porcentajeAsistencia >= 75 ? 'positive' : 'negative'" 
                      class="q-my-sm" 
                      style="width: 100px; height: 8px; border-radius: 4px;"
                    />
                    <span class="text-weight-bold" :class="props.row.porcentajeAsistencia >= 75 ? 'text-positive' : 'text-negative'">
                      {{ props.row.porcentajeAsistencia }}%
                    </span>
                  </div>
                </q-td>
                <q-td key="estado" :props="props" class="text-center">
                  <q-badge 
                    :color="props.row.porcentajeAsistencia >= 75 ? 'green-1' : 'red-1'" 
                    :text-color="props.row.porcentajeAsistencia >= 75 ? 'positive' : 'negative'"
                    class="text-weight-bold q-px-sm q-py-xs"
                  >
                    {{ props.row.porcentajeAsistencia >= 75 ? 'REGULAR' : 'EN RIESGO / REPROBADO' }}
                  </q-badge>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const columns = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'materia', label: 'MATERIA', field: 'materia', align: 'left', sortable: true },
  { name: 'totalClases', label: 'SESIONES', field: 'totalClases', align: 'center' },
  { name: 'porcentaje', label: '% ASISTENCIA', field: 'porcentajeAsistencia', align: 'left' },
  { name: 'estado', label: 'ESTADO ACADÉMICO', field: 'estado', align: 'center' }
];

// Datos Mock de reportes e inasistencias
const reportesEstudiantes = ref([
  { id: 1, nombre: 'Ana Sofía Pérez', email: 'ana.perez@universidad.edu', materia: 'Arquitectura de Software', totalClases: 20, porcentajeAsistencia: 90 },
  { id: 2, nombre: 'Carlos Eduardo Gómez', email: 'carlos.gomez@universidad.edu', materia: 'Arquitectura de Software', totalClases: 20, porcentajeAsistencia: 60 }, // En riesgo (< 75%)
  { id: 3, nombre: 'María Alejandra Díaz', email: 'maria.diaz@universidad.edu', materia: 'Matemáticas Discretas', totalClases: 18, porcentajeAsistencia: 85 },
  { id: 4, nombre: 'José Gregorio Rivas', email: 'jose.rivas@universidad.edu', materia: 'Sistemas Operativos', totalClases: 15, porcentajeAsistencia: 55 } // En riesgo (< 75%)
]);

// Computed para detectar automáticamente estudiantes con menos del 75% de asistencia
const estudiantesEnRiesgo = computed(() => {
  return reportesEstudiantes.value.filter(est => est.porcentajeAsistencia < 75);
});

const imprimirReporte = () => {
  window.print();
};

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<style scoped>
.bg-vinotinto { background-color: #6b1d2f !important; }
.text-vinotinto { color: #6b1d2f !important; }
.bg-navy-dark { background-color: #1b2a47 !important; }
.text-navy-dark { color: #1b2a47 !important; }

.maxWidthContainer {
  max-width: 1250px;
  margin: 0 auto;
}

.rounded-xl {
  border-radius: 16px !important;
}

.border-subtle {
  border: 1px solid #edf2f7 !important;
}
</style>