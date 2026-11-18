<!-- src/pages/MisMateriasPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional del Profesor -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="school" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Portal Docente - Gestión Académica y Reportes</div>
            <div class="text-caption text-grey-6">Cursos, Horarios, Estudiantes y Alertas de Inasistencia</div>
          </div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-md">
          <q-btn flat rounded color="vinotinto" icon="logout" label="Salir" @click="logout" class="bg-red-1 q-px-md text-weight-medium" />
        </div>
      </q-toolbar>

      <!-- Pestañas de Navegación del Profesor -->
      <q-tabs
        v-model="tabDocente"
        dense
        class="bg-white text-grey-8 text-weight-bold"
        active-color="vinotinto"
        indicator-color="vinotinto"
        align="left"
        narrow-indicator
      >
        <q-tab name="materias" icon="menu_book" label="Mis Asignaturas" />
        <q-tab name="horario" icon="calendar_month" label="Mi Horario" />
        <q-tab name="estudiantes" icon="groups" label="Mis Estudiantes" />
        <q-tab name="reportes" icon="assessment" label="Reportes por Materia y Alertas" />
      </q-tabs>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">

        <q-tab-panels v-model="tabDocente" animated class="bg-transparent">

          <!-- TAB 1: MIS ASIGNATURAS -->
          <q-tab-panel name="materias" class="q-px-none">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Cursos Activos a mi Cargo</div>
                <div class="text-caption text-grey-6">Selecciona una asignatura para pasar asistencia o ver detalles.</div>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div v-for="materia in materiasDocente" :key="materia.id" class="col-12 col-md-4">
                <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 240px;">
                  <div>
                    <div class="row items-center justify-between q-mb-sm">
                      <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">
                        {{ materia.grupo || 'Sección Única' }}
                      </q-badge>
                      <q-badge color="orange-1" text-color="vinotinto" class="text-weight-bold q-px-sm">
                        Aula: {{ materia.aula || 'LAB-01' }}
                      </q-badge>
                    </div>

                    <div class="text-h6 text-weight-bold text-navy-dark q-mt-xs">{{ materia.nombre }}</div>

                    <div class="q-mt-md q-gutter-y-xs">
                      <div class="row items-center q-gutter-x-sm text-caption text-grey-8">
                        <q-icon name="event" color="vinotinto" size="xs" />
                        <span>Período: <strong>{{ materia.semestre || '2026-I' }}</strong></span>
                      </div>
                      <div class="row items-center q-gutter-x-sm text-caption text-grey-8">
                        <q-icon name="schedule" color="navy-dark" size="xs" />
                        <span>Horario: <strong>{{ materia.horario || 'Lun / Mié 07:00 AM' }}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div class="q-mt-md q-pt-sm border-top-subtle row items-center justify-between">
                    <span class="text-caption text-positive text-weight-bold">● Activo</span>
                    <q-btn 
                      unelevated 
                      dense 
                      color="navy-dark" 
                      icon="how_to_reg" 
                      label="Pasar Asistencia" 
                      :to="`/profesor/asistencia/${materia.id}`"
                      class="q-px-sm text-weight-bold text-caption" 
                    />
                  </div>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 2: MI HORARIO -->
          <q-tab-panel name="horario" class="q-px-none">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Matriz Horaria Docente</div>
                <div class="text-caption text-grey-6">Tus bloques de clases asignados para este período.</div>
              </div>
            </div>

            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table :rows="horarioDocente" :columns="columnsHorario" row-key="id" flat />
            </q-card>
          </q-tab-panel>

          <!-- TAB 3: MIS ESTUDIANTES -->
          <q-tab-panel name="estudiantes" class="q-px-none">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Nómina de Estudiantes Inscritos</div>
                <div class="text-caption text-grey-6">Alumnos matriculados en tus asignaturas actuales.</div>
              </div>
            </div>

            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table :rows="estudiantesAsignados" :columns="columnsEstudiantes" row-key="id" flat />
            </q-card>
          </q-tab-panel>

          <!-- TAB 4: REPORTES Y ALERTAS ACADÉMICAS FILTRADOS POR MATERIA -->
          <q-tab-panel name="reportes" class="q-px-none">
            
            <!-- Barra de Filtro por Materia -->
            <div class="row items-center justify-between q-mb-md q-gutter-md">
              <div class="col-12 col-md-5">
                <q-select
                  v-model="materiaSeleccionadaFiltro"
                  :options="opcionesFiltroMaterias"
                  option-value="nombre"
                  option-label="nombre"
                  emit-value
                  map-options
                  clearable
                  outlined
                  dense
                  label="Filtrar Reporte por Asignatura"
                  class="bg-white"
                >
                  <template v-slot:prepend>
                    <q-icon name="filter_list" color="vinotinto" />
                  </template>
                </q-select>
              </div>

              <q-btn 
                unelevated 
                rounded 
                color="vinotinto" 
                icon="print" 
                label="Imprimir Reporte de la Materia" 
                @click="imprimirReporte"
                class="q-px-lg q-py-sm text-weight-bold shadow-1" 
              />
            </div>

            <!-- Banner de Alertas Automáticas (Estudiantes en riesgo < 75% en la materia seleccionada) -->
            <q-banner v-if="estudiantesEnRiesgo.length > 0" rounded class="bg-red-1 text-negative border-subtle q-mb-lg shadow-1">
              <template v-slot:avatar>
                <q-icon name="warning" color="negative" size="32px" />
              </template>
              <div class="text-weight-bold text-subtitle1">¡Alerta de Inasistencia en esta Asignatura!</div>
              <div class="text-caption">
                Hay <strong>{{ estudiantesEnRiesgo.length }} estudiante(s)</strong> que superan el 25% de faltas y están en riesgo de reprobación.
              </div>
            </q-banner>

            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table
                :rows="reportesFiltrados"
                :columns="columnsReportes"
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
          </q-tab-panel>

        </q-tab-panels>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import api from '../services/api';

const router = useRouter();
const $q = useQuasar();

const tabDocente = ref('materias');
const materiaSeleccionadaFiltro = ref(null);

const materiasDocente = ref([
  { id: 1, nombre: 'Arquitectura de Software', grupo: 'Sección 01', semestre: '2026-I', aula: 'LAB-01', horario: 'Lunes / Miércoles 07:00 AM' },
  { id: 2, nombre: 'Matemáticas Discretas', grupo: 'Sección 02', semestre: '2026-I', aula: 'Aula 101', horario: 'Martes / Jueves 09:30 AM' }
]);

const opcionesFiltroMaterias = computed(() => {
  return [{ nombre: 'Todas las materias' }, ...materiasDocente.value];
});

const horarioDocente = ref([]);

const estudiantesAsignados = ref([
  { id: 1, nombre: 'Ana Sofía Pérez', email: 'ana.perez@universidad.edu', materia: 'Arquitectura de Software', seccion: 'Sección 01', qr: 'QR-EST-8842' },
  { id: 2, nombre: 'Carlos Eduardo Gómez', email: 'carlos.gomez@universidad.edu', materia: 'Arquitectura de Software', seccion: 'Sección 01', qr: 'QR-EST-9310' },
  { id: 3, nombre: 'María Alejandra Díaz', email: 'maria.diaz@universidad.edu', materia: 'Matemáticas Discretas', seccion: 'Sección 02', qr: 'QR-EST-1045' }
]);

const reportesEstudiantes = ref([
  { id: 1, nombre: 'Ana Sofía Pérez', email: 'ana.perez@universidad.edu', materia: 'Arquitectura de Software', totalClases: 20, porcentajeAsistencia: 90 },
  { id: 2, nombre: 'Carlos Eduardo Gómez', email: 'carlos.gomez@universidad.edu', materia: 'Arquitectura de Software', totalClases: 20, porcentajeAsistencia: 60 },
  { id: 3, nombre: 'María Alejandra Díaz', email: 'maria.diaz@universidad.edu', materia: 'Matemáticas Discretas', totalClases: 18, porcentajeAsistencia: 85 }
]);

// Computed para filtrar la tabla según la materia seleccionada
const reportesFiltrados = computed(() => {
  if (!materiaSeleccionadaFiltro.value || materiaSeleccionadaFiltro.value === 'Todas las materias') {
    return reportesEstudiantes.value;
  }
  return reportesEstudiantes.value.filter(est => est.materia === materiaSeleccionadaFiltro.value);
});

// Computed para detectar estudiantes en riesgo basados en el filtro activo
const estudiantesEnRiesgo = computed(() => {
  return reportesFiltrados.value.filter(est => est.porcentajeAsistencia < 75);
});

const columnsHorario = [
  { name: 'dia', label: 'DÍA', field: 'dia', align: 'left', sortable: true },
  { name: 'hora', label: 'BLOQUE HORARIO', field: 'hora', align: 'left' },
  { name: 'materia', label: 'ASIGNATURA', field: 'materia', align: 'left' },
  { name: 'aula', label: 'AULA', field: 'aula', align: 'left' },
  { name: 'seccion', label: 'SECCIÓN', field: 'seccion', align: 'left' }
];

const columnsEstudiantes = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'CORREO INSTITUCIONAL', field: 'email', align: 'left' },
  { name: 'materia', label: 'MATERIA', field: 'materia', align: 'left' },
  { name: 'seccion', label: 'SECCIÓN', field: 'seccion', align: 'left' },
  { name: 'qr', label: 'CÓDIGO QR / CARNET', field: 'qr', align: 'center' }
];

const columnsReportes = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'materia', label: 'MATERIA', field: 'materia', align: 'left' },
  { name: 'totalClases', label: 'SESIONES', field: 'totalClases', align: 'center' },
  { name: 'porcentaje', label: '% ASISTENCIA', field: 'porcentajeAsistencia', align: 'left' },
  { name: 'estado', label: 'ESTADO ACADÉMICO', field: 'estado', align: 'center' }
];

const imprimirReporte = () => {
  window.print();
};

const cargarDatosProfesor = async () => {
  try {
    const res = await api.get('/materias/mis-materias');
    if (res.data) materiasDocente.value = res.data;
  } catch (error) {
    console.error('Usando datos locales para el profesor:', error);
  }
};

onMounted(() => {
  cargarDatosProfesor().then(cargarHorarioDocente);
});

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
const DIAS_LABEL = {
  LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Mi\u00e9rcoles',
  JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'S\u00e1bado', DOMINGO: 'Domingo'
};

const hora12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return String(h12).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
};

const cargarHorarioDocente = async () => {
  try {
    const res = await api.get('/horarios/mios');
    const resumen = {};
    horarioDocente.value = res.data.map((h) => {
      const dia = DIAS_LABEL[h.dia] || h.dia;
      const hora = hora12(h.horaInicio) + ' - ' + hora12(h.horaFin);
      resumen[h.materiaId] = (resumen[h.materiaId] ? resumen[h.materiaId] + ' / ' : '') + dia.slice(0, 3) + ' ' + hora;
      return { id: h.id, dia, hora, materia: h.materia?.nombre, aula: h.aula || '-', seccion: h.materia?.grupo || '-' };
    });
    materiasDocente.value = materiasDocente.value.map((m) => ({
      ...m,
      horario: resumen[m.id] || 'Sin horario asignado'
    }));
  } catch (error) {
    console.error('No se pudo cargar el horario del profesor:', error);
  }
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

.border-top-subtle {
  border-top: 1px solid #f1f5f9;
}
</style>