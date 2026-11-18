<!-- src/pages/AdminDashboardPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional del Administrador -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="vinotinto" text-color="white" icon="admin_panel_settings" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Portal de Gestión Global - Administrador</div>
            <div class="text-caption text-grey-6">Control de Materias, Aulas, Horarios, Estudiantes y Reportes</div>
          </div>
        </q-toolbar-title>

        <div class="row items-center q-gutter-md">
          <q-btn flat rounded color="vinotinto" icon="logout" label="Salir" @click="logout" class="bg-red-1 q-px-md text-weight-medium" />
        </div>
      </q-toolbar>

      <!-- Pestañas de Navegación del Panel de Admin -->
      <q-tabs
        v-model="tabActiva"
        dense
        class="bg-white text-grey-8 text-weight-bold"
        active-color="vinotinto"
        indicator-color="vinotinto"
        align="left"
        narrow-indicator
      >
        <q-tab name="materias" icon="menu_book" label="Materias y Profesores" />
        <q-tab name="aulasSecciones" icon="meeting_room" label="Aulas y Secciones" />
        <q-tab name="horarios" icon="calendar_month" label="Horarios Académicos" />
        <q-tab name="estudiantes" icon="groups" label="Estudiantes Inscritos" />
        <q-tab name="reportes" icon="assessment" label="Reportes y Alertas" />
      </q-tabs>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">

        <q-tab-panels v-model="tabActiva" animated class="bg-transparent">

          <!-- TAB 1: MATERIAS Y ASIGNACIÓN DE PROFESORES -->
          <q-tab-panel name="materias" class="q-px-none">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Asignaturas y Docentes Titulares</div>
                <div class="text-caption text-grey-6">Registra materias y asígnalas al profesor correspondiente mediante el selector.</div>
              </div>
              <q-btn unelevated rounded color="vinotinto" icon="add_circle" label="Registrar y Asignar Materia" @click="abrirModalMateria" class="text-weight-bold shadow-1" />
            </div>

            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table :rows="materiasGlobales" :columns="columnsMaterias" row-key="id" flat>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="nombre" :props="props" class="text-weight-bold text-navy-dark">{{ props.row.nombre }}</q-td>
                    <q-td key="grupo" :props="props">
                      <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold">{{ props.row.grupo || 'Único' }}</q-badge>
                    </q-td>
                    <q-td key="profesor" :props="props">
                      <div class="row items-center q-gutter-x-sm">
                        <q-avatar size="xs" color="navy-dark" text-color="white" icon="person" />
                        <span>{{ props.row.profesor ? props.row.profesor.nombre : 'Sin asignar' }}</span>
                      </div>
                    </q-td>
                    <q-td key="acciones" :props="props" class="text-center">
                      <q-btn flat dense color="negative" icon="delete" label="Eliminar" @click="eliminarMateria(props.row.id)" class="text-caption" />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>

          <!-- TAB 2: AULAS Y SECCIONES -->
          <q-tab-panel name="aulasSecciones" class="q-px-none">
            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-mb-lg">
              <q-tabs v-model="tabSubAulas" dense class="text-grey-7" active-color="vinotinto" indicator-color="vinotinto" align="left" narrow-indicator>
                <q-tab name="aulas" icon="meeting_room" label="Aulas Disponibles" class="text-weight-bold" />
                <q-tab name="secciones" icon="class" label="Secciones Académicas" class="text-weight-bold" />
              </q-tabs>
            </q-card>

            <!-- Sub-vista Aulas -->
            <div v-if="tabSubAulas === 'aulas'">
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="text-h6 text-weight-bold text-navy-dark">Control de Aulas y Aforo</div>
                  <div class="text-caption text-grey-6">Administra espacios físicos y ubicaciones.</div>
                </div>
                <q-btn unelevated rounded color="vinotinto" icon="add" label="Registrar Nueva Aula" @click="dialogAula = true" class="text-weight-bold shadow-1" />
              </div>

              <div class="row q-col-gutter-lg">
                <div v-for="aula in aulas" :key="aula.id" class="col-12 col-md-4">
                  <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 180px;">
                    <div>
                      <div class="row items-center justify-between q-mb-sm">
                        <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">Aula {{ aula.codigo }}</q-badge>
                        <q-icon name="apartment" color="vinotinto" size="md" />
                      </div>
                      <div class="text-h6 text-weight-bold text-navy-dark q-mt-xs">{{ aula.nombre }}</div>
                      <div class="text-caption text-grey-7 q-mt-xs">Capacidad: <strong>{{ aula.capacidad }} estudiantes</strong></div>
                    </div>
                    <div class="q-mt-md q-pt-sm border-top-subtle row items-center justify-between">
                      <span class="text-caption text-positive text-weight-bold">● Disponible</span>
                      <q-btn flat dense color="negative" icon="delete" label="Eliminar" @click="eliminarAula(aula.id)" class="text-caption" />
                    </div>
                  </q-card>
                </div>
              </div>
            </div>

            <!-- Sub-vista Secciones -->
            <div v-if="tabSubAulas === 'secciones'">
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="text-h6 text-weight-bold text-navy-dark">Estructura de Secciones y Asignación</div>
                  <div class="text-caption text-grey-6">Vincula materias, aulas físicas y docentes titulares.</div>
                </div>
                <q-btn unelevated rounded color="vinotinto" icon="add" label="Crear Nueva Sección" @click="dialogSeccion = true" class="text-weight-bold shadow-1" />
              </div>

              <div class="row q-col-gutter-lg">
                <div v-for="seccion in secciones" :key="seccion.id" class="col-12 col-md-4">
                  <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 230px;">
                    <div>
                      <div class="row items-center justify-between q-mb-sm">
                        <q-badge color="orange-1" text-color="vinotinto" class="text-weight-bold q-px-sm">Sección {{ seccion.codigoSeccion }}</q-badge>
                        <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">{{ seccion.aulaAsignada }}</q-badge>
                      </div>
                      <div class="text-h6 text-weight-bold text-navy-dark q-mt-xs">{{ seccion.materiaNombre }}</div>
                    </div>

                    <div class="q-mt-md">
                      <div class="row items-center q-gutter-x-sm bg-grey-1 q-pa-sm rounded-borders border-subtle">
                        <q-avatar size="sm" color="navy-dark" text-color="white" icon="person" />
                        <div>
                          <div class="text-caption text-grey-6" style="font-size: 10px; line-height: 1;">Docente Titular:</div>
                          <div class="text-caption text-weight-bold text-navy-dark">Prof. {{ seccion.profesorNombre }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="q-mt-md q-pt-sm border-top-subtle row items-center justify-between">
                      <span class="text-caption text-grey-6">Período 2026-I</span>
                      <q-btn flat dense color="negative" icon="delete" label="Eliminar" @click="eliminarSeccion(seccion.id)" class="text-caption" />
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- TAB 3: HORARIOS (MATRIZ SEMANAL) -->
          <q-tab-panel name="horarios" class="q-px-none">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Matriz Horaria Institucional</div>
                <div class="text-caption text-grey-6">Control de cruces por docente, salón y período académico.</div>
              </div>
              <q-btn unelevated rounded color="vinotinto" icon="add" label="Asignar Horario a Docente" @click="dialogHorario = true" class="text-weight-bold shadow-1" />
            </div>

            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table :rows="bloquesHorarios" :columns="columnsHorariosMatriz" row-key="id" flat hide-pagination :rows-per-page-options="[0]">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="hora" :props="props" class="text-weight-bold text-navy-dark bg-grey-2">{{ props.row.hora }}</q-td>
                    <q-td v-for="dia in ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']" :key="dia" :props="props">
                      <div v-if="props.row[dia]" class="bg-blue-1 text-navy-dark q-pa-sm rounded-borders border-subtle">
                        <div class="text-weight-bold" style="font-size: 11px;">{{ props.row[dia].materia }}</div>
                        <div class="text-caption text-vinotinto text-weight-bold" style="font-size: 10px;">Prof. {{ props.row[dia].profesor }}</div>
                        <div class="text-caption text-grey-8" style="font-size: 10px;">Aula: {{ props.row[dia].aula }}</div>
                      </div>
                      <span v-else class="text-grey-4 text-caption">— Libre —</span>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>

          <!-- TAB 4: ESTUDIANTES INSCRITOS -->
          <q-tab-panel name="estudiantes" class="q-px-none">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Estudiantes e Inscripciones Activas</div>
                <div class="text-caption text-grey-6">Monitoreo global de matrícula cursante.</div>
              </div>
            </div>
            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table :rows="estudiantesLista" :columns="columnsEstudiantes" row-key="id" flat />
            </q-card>
          </q-tab-panel>

          <!-- TAB 5: REPORTES Y ALERTAS ACADÉMICAS -->
          <q-tab-panel name="reportes" class="q-px-none">
            <!-- Banner de Alertas Automáticas (Estudiantes en riesgo < 75%) -->
            <q-banner v-if="estudiantesEnRiesgo.length > 0" rounded class="bg-red-1 text-negative border-subtle q-mb-lg shadow-1">
              <template v-slot:avatar>
                <q-icon name="warning" color="negative" size="32px" />
              </template>
              <div class="text-weight-bold text-subtitle1">¡Alerta Automática de Inasistencia Global!</div>
              <div class="text-caption">
                Hay <strong>{{ estudiantesEnRiesgo.length }} estudiante(s)</strong> que han superado el límite permitido de faltas y están en riesgo de reprobación.
              </div>
            </q-banner>

            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Consolidado General de Inasistencias</div>
                <div class="text-caption text-grey-6">Porcentajes de asistencia y estado académico actual por estudiante.</div>
              </div>
              <q-btn unelevated rounded color="vinotinto" icon="print" label="Imprimir Reporte General" @click="imprimirReporte" class="text-weight-bold shadow-1" />
            </div>

            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
              <q-table :rows="reportesEstudiantes" :columns="columnsReportes" row-key="id" flat hide-pagination :rows-per-page-options="[0]">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="nombre" :props="props" class="text-weight-bold text-navy-dark">
                      {{ props.row.nombre }}
                      <div class="text-caption text-grey-6" style="font-size: 11px;">{{ props.row.email }}</div>
                    </q-td>
                    <q-td key="materia" :props="props">{{ props.row.materia }}</q-td>
                    <q-td key="totalClases" :props="props" class="text-center">{{ props.row.totalClases }}</q-td>
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

    <!-- MODAL: REGISTRAR Y ASIGNAR MATERIA -->
    <q-dialog v-model="dialogMateria" persistent>
      <q-card style="width: 480px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Registrar y Asignar Asignatura</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md q-mt-sm">
          <q-input v-model="formMateria.nombre" label="Nombre de la Materia" outlined dense class="bg-grey-1" />
          <q-input v-model="formMateria.grupo" label="Grupo / Sección (Ej. Sección 01)" outlined dense class="bg-grey-1" />
          <q-select 
            v-model="formMateria.profesorId" 
            :options="profesoresOptions" 
            option-value="id" 
            option-label="nombre" 
            emit-value 
            map-options 
            label="Seleccionar Profesor Titular" 
            outlined 
            dense 
            class="bg-grey-1" 
          />
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar y Asignar" color="vinotinto" @click="guardarAsignacionMateria" class="text-weight-bold q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL: REGISTRAR AULA -->
    <q-dialog v-model="dialogAula" persistent>
      <q-card style="width: 400px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Registrar Nueva Aula</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="nuevaAula.codigo" label="Código de Aula (Ej. 101)" outlined dense class="bg-grey-1" />
          <q-input v-model="nuevaAula.nombre" label="Nombre Descriptivo" outlined dense class="bg-grey-1" />
          <q-input v-model.number="nuevaAula.capacidad" type="number" label="Capacidad" outlined dense class="bg-grey-1" />
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar Aula" color="vinotinto" @click="crearAula" class="text-weight-bold" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL: REGISTRAR SECCIÓN -->
    <q-dialog v-model="dialogSeccion" persistent>
      <q-card style="width: 450px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Asignar Sección y Docente</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input v-model="nuevaSeccion.codigoSeccion" label="Código Sección (Ej. 01-INF)" outlined dense class="bg-grey-1" />
          <q-input v-model="nuevaSeccion.materiaNombre" label="Materia" outlined dense class="bg-grey-1" />
          <q-input v-model="nuevaSeccion.aulaAsignada" label="Aula" outlined dense class="bg-grey-1" />
          <q-input v-model="nuevaSeccion.profesorNombre" label="Profesor Titular" outlined dense class="bg-grey-1" />
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar" color="vinotinto" @click="crearSeccion" class="text-weight-bold" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL: ASIGNAR HORARIO -->
    <q-dialog v-model="dialogHorario" persistent>
      <q-card style="width: 480px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Asignar Horario a Docente</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-select v-model="nuevoBloque.dia" :options="diasSemana" label="Día de la Semana" outlined dense class="bg-grey-1" />
          <q-select v-model="nuevoBloque.hora" :options="horasBloques" label="Bloque Horario" outlined dense class="bg-grey-1" />
          <q-select
            v-model="nuevoBloque.profesorId"
            :options="profesoresOptions"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            label="Profesor Titular"
            outlined
            dense
            class="bg-grey-1"
            @update:model-value="nuevoBloque.materiaId = null"
          />
          <q-select
            v-model="nuevoBloque.materiaId"
            :options="materiasDelProfesor"
            option-value="id"
            option-label="nombre"
            emit-value
            map-options
            label="Materia del profesor"
            outlined
            dense
            class="bg-grey-1"
          />
          <q-input v-model="nuevoBloque.aula" label="Aula Asignada (Ej. LAB-01)" outlined dense class="bg-grey-1" />
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar Asignación" color="vinotinto" @click="guardarHorario" class="text-weight-bold q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import api from '../services/api';

const router = useRouter();
const $q = useQuasar();

const tabActiva = ref('materias');
const tabSubAulas = ref('aulas');

const dialogMateria = ref(false);
const dialogAula = ref(false);
const dialogSeccion = ref(false);
const dialogHorario = ref(false);

const materiasGlobales = ref([]);
const profesoresOptions = ref([]);

// Aulas y Secciones
const aulas = ref([
  { id: 1, codigo: '101', nombre: 'Edificio A - Planta Baja', capacidad: 40 },
  { id: 2, codigo: '202', nombre: 'Edificio B - Primer Piso', capacidad: 35 },
  { id: 3, codigo: 'LAB-01', nombre: 'Laboratorio de Computación 1', capacidad: 25 }
]);

const secciones = ref([
  { id: 1, codigoSeccion: '01-INF', materiaNombre: 'Arquitectura de Software', aulaAsignada: 'LAB-01', profesorNombre: 'Dra. Carmen Rodríguez' }
]);

const nuevaAula = ref({ codigo: '', nombre: '', capacidad: 30 });
const nuevaSeccion = ref({ codigoSeccion: '', materiaNombre: '', aulaAsignada: '', profesorNombre: '' });
const formMateria = ref({ nombre: '', grupo: '', profesorId: null });

const estudiantesLista = ref([
  { id: 1, nombre: 'Carlos Pérez', email: 'carlos@student.edu', materia: 'Arquitectura de Software', seccion: 'Sección 01' }
]);

// Reportes y Alertas Académicas
const reportesEstudiantes = ref([
  { id: 1, nombre: 'Ana Sofía Pérez', email: 'ana.perez@universidad.edu', materia: 'Arquitectura de Software', totalClases: 20, porcentajeAsistencia: 90 },
  { id: 2, nombre: 'Carlos Eduardo Gómez', email: 'carlos.gomez@universidad.edu', materia: 'Arquitectura de Software', totalClases: 20, porcentajeAsistencia: 60 },
  { id: 3, nombre: 'María Alejandra Díaz', email: 'maria.diaz@universidad.edu', materia: 'Matemáticas Discretas', totalClases: 18, porcentajeAsistencia: 85 },
  { id: 4, nombre: 'José Gregorio Rivas', email: 'jose.rivas@universidad.edu', materia: 'Sistemas Operativos', totalClases: 15, porcentajeAsistencia: 55 }
]);

const estudiantesEnRiesgo = computed(() => {
  return reportesEstudiantes.value.filter(est => est.porcentajeAsistencia < 75);
});

const imprimirReporte = () => {
  window.print();
};

// Matriz Horaria
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horasBloques = ['07:00 AM - 09:15 AM', '09:30 AM - 11:45 AM', '01:00 PM - 03:15 PM', '03:30 PM - 05:45 PM'];

const columnsHorariosMatriz = [
  { name: 'hora', label: 'Bloque Horario', field: 'hora', align: 'left', style: 'width: 150px;' },
  { name: 'lunes', label: 'Lunes', field: 'lunes', align: 'center' },
  { name: 'martes', label: 'Martes', field: 'martes', align: 'center' },
  { name: 'miercoles', label: 'Miércoles', field: 'miercoles', align: 'center' },
  { name: 'jueves', label: 'Jueves', field: 'jueves', align: 'center' },
  { name: 'viernes', label: 'Viernes', field: 'viernes', align: 'center' }
];

const bloquesHorarios = ref([
  {
    id: 1,
    hora: '07:00 AM - 09:15 AM',
    lunes: { materia: 'Arquitectura de Software', profesor: 'Dra. Carmen Rodríguez', aula: 'LAB-01', semestre: '2026-I' },
    martes: null,
    miercoles: { materia: 'Arquitectura de Software', profesor: 'Dra. Carmen Rodríguez', aula: 'LAB-01', semestre: '2026-I' },
    jueves: null,
    viernes: null
  }
]);

const nuevoBloque = ref({
  dia: 'Lunes',
  hora: '07:00 AM - 09:15 AM',
  materiaId: null,
  profesorId: null,
  aula: '',
  semestre: '2026-I'
});

const columnsMaterias = [
  { name: 'nombre', label: 'ASIGNATURA', field: 'nombre', align: 'left', sortable: true },
  { name: 'grupo', label: 'GRUPO / SECCIÓN', field: 'grupo', align: 'left' },
  { name: 'profesor', label: 'PROFESOR TITULAR', field: 'profesor', align: 'left' },
  { name: 'acciones', label: 'ACCIONES', field: 'id', align: 'center' }
];

const columnsEstudiantes = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left' },
  { name: 'email', label: 'CORREO', field: 'email', align: 'left' },
  { name: 'materia', label: 'MATERIA INSCRITA', field: 'materia', align: 'left' },
  { name: 'seccion', label: 'SECCIÓN', field: 'seccion', align: 'left' }
];

const columnsReportes = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'materia', label: 'MATERIA', field: 'materia', align: 'left' },
  { name: 'totalClases', label: 'SESIONES', field: 'totalClases', align: 'center' },
  { name: 'porcentaje', label: '% ASISTENCIA', field: 'porcentajeAsistencia', align: 'left' },
  { name: 'estado', label: 'ESTADO ACADÉMICO', field: 'estado', align: 'center' }
];

const cargarDatosAdmin = async () => {
  try {
    const resMaterias = await api.get('/materias');
    materiasGlobales.value = resMaterias.data;

    const resUsuarios = await api.get('/users');
    profesoresOptions.value = resUsuarios.data.filter(u => u.rol === 'PROFESOR');
  } catch (error) {
    console.error('Error al cargar datos del admin:', error);
  }
};

onMounted(() => {
  cargarDatosAdmin();
});

const abrirModalMateria = () => {
  formMateria.value = { nombre: '', grupo: '', profesorId: null };
  dialogMateria.value = true;
};

const guardarAsignacionMateria = async () => {
  if (!formMateria.value.nombre || !formMateria.value.profesorId) {
    $q.notify({ color: 'negative', message: 'Complete los campos y seleccione un profesor', position: 'top' });
    return;
  }
  try {
    await api.post('/materias', formMateria.value);
    $q.notify({ color: 'navy-dark', textColor: 'white', message: '¡Materia creada y asignada con éxito!', icon: 'check_circle', position: 'top' });
    dialogMateria.value = false;
    cargarDatosAdmin();
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al guardar en el servidor', position: 'top' });
  }
};

const eliminarMateria = async (id) => {
  try {
    await api.delete(`/materias/${id}`);
    $q.notify({ color: 'warning', textColor: 'dark', message: 'Materia eliminada', position: 'top' });
    cargarDatosAdmin();
  } catch (error) {
    materiasGlobales.value = materiasGlobales.value.filter(m => m.id !== id);
  }
};

const crearAula = () => {
  if (!nuevaAula.value.codigo || !nuevaAula.value.nombre) return;
  aulas.value.push({ id: Date.now(), ...nuevaAula.value });
  $q.notify({ color: 'navy-dark', message: '¡Aula registrada con éxito!', icon: 'check_circle', position: 'top' });
  dialogAula.value = false;
  nuevaAula.value = { codigo: '', nombre: '', capacidad: 30 };
};

const eliminarAula = (id) => {
  aulas.value = aulas.value.filter(a => a.id !== id);
};

const crearSeccion = () => {
  if (!nuevaSeccion.value.codigoSeccion) return;
  secciones.value.push({ id: Date.now(), ...nuevaSeccion.value });
  $q.notify({ color: 'navy-dark', message: '¡Sección creada con éxito!', icon: 'check_circle', position: 'top' });
  dialogSeccion.value = false;
};

const eliminarSeccion = (id) => {
  secciones.value = secciones.value.filter(s => s.id !== id);
};

const guardarBloque = () => {
  if (!nuevoBloque.value.materia || !nuevoBloque.value.profesor || !nuevoBloque.value.aula) {
    $q.notify({ color: 'negative', message: 'Por favor complete todos los campos obligatorios', position: 'top' });
    return;
  }
  const diaKeyMap = { 'Lunes': 'lunes', 'Martes': 'martes', 'Miércoles': 'miercoles', 'Jueves': 'jueves', 'Viernes': 'viernes' };
  const key = diaKeyMap[nuevoBloque.value.dia];
  const fila = bloquesHorarios.value.find(b => b.hora === nuevoBloque.value.hora);

  if (fila) {
    fila[key] = {
      materia: nuevoBloque.value.materia,
      profesor: nuevoBloque.value.profesor,
      aula: nuevoBloque.value.aula,
      semestre: nuevoBloque.value.semestre
    };
    $q.notify({ color: 'navy-dark', textColor: 'white', message: '¡Horario asignado con éxito!', icon: 'check_circle', position: 'top' });
    dialogHorario.value = false;
  }
};

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
const materiasDelProfesor = computed(() =>
  materiasGlobales.value.filter((m) => m.profesorId === nuevoBloque.value.profesorId)
);

const to24 = (h, m, ap) => {
  const hh = (parseInt(h, 10) % 12) + (ap.toUpperCase() === 'PM' ? 12 : 0);
  return String(hh).padStart(2, '0') + ':' + m;
};

const parseBloque = (label) => {
  const r = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(label || '');
  if (!r) return null;
  return { inicio: to24(r[1], r[2], r[3]), fin: to24(r[4], r[5], r[6]) };
};

const to12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return String(h12).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'PM' : 'AM');
};

const construirMatriz = (lista) => {
  const filas = {};
  lista.forEach((h) => {
    const et = to12(h.horaInicio) + ' - ' + to12(h.horaFin);
    if (!filas[et]) {
      filas[et] = { id: et, hora: et, inicio: h.horaInicio, lunes: null, martes: null, miercoles: null, jueves: null, viernes: null };
    }
    const key = h.dia.toLowerCase();
    if (['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].includes(key)) {
      filas[et][key] = { materia: h.materia?.nombre, profesor: h.materia?.profesor?.nombre, aula: h.aula || '-' };
    }
  });
  return Object.values(filas).sort((a, b) => a.inicio.localeCompare(b.inicio));
};

const cargarHorarios = async () => {
  try {
    const res = await api.get('/horarios');
    bloquesHorarios.value = construirMatriz(res.data);
  } catch (error) {
    console.error('Error al cargar horarios:', error);
  }
};

onMounted(cargarHorarios);

const guardarHorario = async () => {
  const b = nuevoBloque.value;
  const t = parseBloque(b.hora);
  if (!b.profesorId || !b.materiaId || !t) {
    $q.notify({ color: 'negative', message: 'Seleccione profesor, materia y bloque horario', position: 'top' });
    return;
  }
  try {
    await api.post('/horarios', {
      materiaId: b.materiaId,
      dia: b.dia,
      horaInicio: t.inicio,
      horaFin: t.fin,
      aula: b.aula || undefined
    });
    $q.notify({ color: 'navy-dark', textColor: 'white', message: 'Horario asignado con exito', icon: 'check_circle', position: 'top' });
    dialogHorario.value = false;
    nuevoBloque.value.materiaId = null;
    nuevoBloque.value.aula = '';
    await cargarHorarios();
  } catch (error) {
    const msg = error.response?.data?.message;
    $q.notify({ color: 'negative', message: Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al guardar el horario'), position: 'top' });
  }
};
</script>

<style scoped>
.bg-vinotinto { background-color: #6b1d2f !important; }
.text-vinotinto { color: #6b1d2f !important; }
.bg-navy-dark { background-color: #1b2a47 !important; }
.text-navy-dark { color: #1b2a47 !important; }

.maxWidthContainer {
  max-width: 1300px;
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