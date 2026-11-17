<!-- src/pages/GestionAulasSeccionesPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="meeting_room" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Gestión de Aulas y Secciones</div>
            <div class="text-caption text-grey-6">Infraestructura y Estructura Académica</div>
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

        <!-- Pestañas de Navegación Interna (Aulas vs Secciones) -->
        <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-mb-lg">
          <q-tabs
            v-model="tabActual"
            dense
            class="text-grey-7"
            active-color="vinotinto"
            indicator-color="vinotinto"
            align="left"
            narrow-indicator
          >
            <q-tab name="aulas" icon="meeting_room" label="Aulas Disponibles" class="text-weight-bold" />
            <q-tab name="secciones" icon="class" label="Secciones Académicas" class="text-weight-bold" />
          </q-tabs>
        </q-card>

        <!-- SECCIÓN 1: AULAS DISPONIBLES -->
        <div v-if="tabActual === 'aulas'">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h5 text-weight-bold text-navy-dark">Control de Aulas</div>
              <div class="text-caption text-grey-6">Administra espacios físicos, ubicaciones y capacidad de aforo.</div>
            </div>
            <q-btn 
              unelevated 
              rounded 
              color="vinotinto" 
              icon="add" 
              label="Registrar Nueva Aula" 
              @click="dialogAula = true"
              class="q-px-lg q-py-sm text-weight-bold shadow-1" 
            />
          </div>

          <!-- Cuadrícula de Aulas -->
          <div class="row q-col-gutter-lg">
            <div v-for="aula in aulas" :key="aula.id" class="col-12 col-md-4">
              <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 180px;">
                <div>
                  <div class="row items-center justify-between q-mb-sm">
                    <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">
                      Aula {{ aula.codigo }}
                    </q-badge>
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

        <!-- SECCIÓN 2: SECCIONES ACADÉMICAS -->
        <div v-if="tabActual === 'secciones'">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h5 text-weight-bold text-navy-dark">Estructura de Secciones y Asignación</div>
              <div class="text-caption text-grey-6">Vincula materias, aulas físicas y docentes titulares.</div>
            </div>
            <q-btn 
              unelevated 
              rounded 
              color="vinotinto" 
              icon="add" 
              label="Crear Nueva Sección" 
              @click="dialogSeccion = true"
              class="q-px-lg q-py-sm text-weight-bold shadow-1" 
            />
          </div>

          <!-- Cuadrícula de Secciones -->
          <div class="row q-col-gutter-lg">
            <div v-for="seccion in secciones" :key="seccion.id" class="col-12 col-md-4">
              <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 230px;">
                <div>
                  <div class="row items-center justify-between q-mb-sm">
                    <q-badge color="orange-1" text-color="vinotinto" class="text-weight-bold q-px-sm">
                      Sección {{ seccion.codigoSeccion }}
                    </q-badge>
                    <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">
                      {{ seccion.aulaAsignada }}
                    </q-badge>
                  </div>
                  <div class="text-h6 text-weight-bold text-navy-dark q-mt-xs">{{ seccion.materiaNombre }}</div>
                </div>

                <!-- Bloque del Profesor Titular Asignado al Aula/Sección -->
                <div class="q-mt-md">
                  <div class="row items-center q-gutter-x-sm bg-grey-1 q-pa-sm rounded-borders border-subtle">
                    <q-avatar size="sm" color="navy-dark" text-color="white" icon="person" />
                    <div>
                      <div class="text-caption text-grey-6" style="font-size: 10px; line-height: 1;">Docente Titular:</div>
                      <div class="text-caption text-weight-bold text-navy-dark">
                        Prof. {{ seccion.profesorNombre }}
                      </div>
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

      </q-page>
    </q-page-container>

    <!-- Modal para Registrar Aula -->
    <q-dialog v-model="dialogAula" persistent>
      <q-card style="width: 400px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Registrar Nueva Aula</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="nuevaAula.codigo" label="Código de Aula (Ej. 101, Lab-3)" outlined dense class="bg-grey-1" />
          <q-input v-model="nuevaAula.nombre" label="Nombre Descriptivo" outlined dense class="bg-grey-1" />
          <q-input v-model.number="nuevaAula.capacidad" type="number" label="Capacidad de Estudiantes" outlined dense class="bg-grey-1" />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar Aula" color="vinotinto" @click="crearAula" class="text-weight-bold q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para Registrar Sección y Asignar Profesor -->
    <q-dialog v-model="dialogSeccion" persistent>
      <q-card style="width: 450px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Asignar Docente y Aula a Sección</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="nuevaSeccion.codigoSeccion" label="Código de Sección (Ej. 01-INF)" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="class" color="vinotinto" /></template>
          </q-input>

          <q-input v-model="nuevaSeccion.materiaNombre" label="Nombre de la Materia" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="menu_book" color="navy-dark" /></template>
          </q-input>

          <q-input v-model="nuevaSeccion.aulaAsignada" label="Aula Asignada (Ej. LAB-01)" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="meeting_room" color="navy-dark" /></template>
          </q-input>

          <q-input v-model="nuevaSeccion.profesorNombre" label="Profesor Titular" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="person" color="vinotinto" /></template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar Asignación" color="vinotinto" @click="crearSeccion" class="text-weight-bold q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const tabActual = ref('aulas');
const dialogAula = ref(false);
const dialogSeccion = ref(false);

// Datos Mock de Aulas
const aulas = ref([
  { id: 1, codigo: '101', nombre: 'Edificio A - Planta Baja', capacidad: 40 },
  { id: 2, codigo: '202', nombre: 'Edificio B - Primer Piso', capacidad: 35 },
  { id: 3, codigo: 'LAB-01', nombre: 'Laboratorio de Computación 1', capacidad: 25 }
]);

// Datos Mock de Secciones
const secciones = ref([
  { id: 1, codigoSeccion: '01-INF', materiaNombre: 'Arquitectura de Software', aulaAsignada: 'LAB-01', profesorNombre: 'Dra. Carmen Rodríguez' },
  { id: 2, codigoSeccion: '02-MAT', materiaNombre: 'Matemáticas Discretas', aulaAsignada: 'Aula 101', profesorNombre: 'Dr. Alejandro Silva' }
]);

const nuevaAula = ref({ codigo: '', nombre: '', capacidad: 30 });
const nuevaSeccion = ref({ codigoSeccion: '', materiaNombre: '', aulaAsignada: '', profesorNombre: '' });

const crearAula = () => {
  if (!nuevaAula.value.codigo || !nuevaAula.value.nombre) return;
  aulas.value.push({ id: Date.now(), ...nuevaAula.value });
  $q.notify({ color: 'navy-dark', message: '¡Aula registrada con éxito!', icon: 'check_circle', position: 'top' });
  dialogAula.value = false;
  nuevaAula.value = { codigo: '', nombre: '', capacidad: 30 };
};

const eliminarAula = (id) => {
  aulas.value = aulas.value.filter(a => a.id !== id);
  $q.notify({ color: 'warning', textColor: 'dark', message: 'Aula eliminada', position: 'top' });
};

const crearSeccion = () => {
  if (!nuevaSeccion.value.codigoSeccion || !nuevaSeccion.value.materiaNombre) return;
  secciones.value.push({ id: Date.now(), ...nuevaSeccion.value });
  $q.notify({ color: 'navy-dark', message: '¡Sección académica creada con éxito!', icon: 'check_circle', position: 'top' });
  dialogSeccion.value = false;
  nuevaSeccion.value = { codigoSeccion: '', materiaNombre: '', aulaAsignada: '', profesorNombre: '' };
};

const eliminarSeccion = (id) => {
  secciones.value = secciones.value.filter(s => s.id !== id);
  $q.notify({ color: 'warning', textColor: 'dark', message: 'Sección eliminada', position: 'top' });
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
  max-width: 1200px;
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