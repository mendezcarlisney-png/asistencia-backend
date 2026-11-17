<!-- src/pages/MisMateriasPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="menu_book" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Gestión de Materias (Modo Demostración)</div>
            <div class="text-caption text-grey-6">Portal Académico Institucional</div>
          </div>
        </q-toolbar-title>

        <!-- Acceso Rápido / Salir -->
        <div class="row items-center q-gutter-md">
          <q-btn flat rounded color="navy-dark" icon="dashboard" label="Ir al Panel" to="/dashboard" />
          <q-btn flat rounded color="vinotinto" icon="logout" label="Salir" @click="logout" class="bg-red-1 q-px-md text-weight-medium" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">

        <!-- Cabecera de la Sección -->
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold text-navy-dark">Asignaturas Asignadas</div>
            <div class="text-caption text-grey-6">Cursos bajo la responsabilidad de los docentes titulares.</div>
          </div>
          <q-btn 
            unelevated 
            rounded 
            color="vinotinto" 
            icon="add" 
            label="Registrar Nueva Materia" 
            @click="dialogCrear = true"
            class="q-px-lg q-py-sm text-weight-bold shadow-1" 
          />
        </div>

        <!-- Cuadrícula de Materias (Estilo Tarjetas Moodle) -->
        <div class="row q-col-gutter-lg">
          <div v-for="materia in materias" :key="materia.id" class="col-12 col-md-4">
            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 230px;">
              <div>
                <!-- Encabezado de la tarjeta con ID y Período -->
                <div class="row items-center justify-between q-mb-sm">
                  <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">
                    ID: {{ materia.id }}
                  </q-badge>
                  <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold q-px-sm">
                    Período: 2026-I
                  </q-badge>
                </div>

                <div class="text-h6 text-weight-bold text-navy-dark q-mt-xs">{{ materia.nombre }}</div>
                <div class="text-caption text-grey-7 q-mt-xs">{{ materia.descripcion }}</div>
              </div>

              <!-- Bloque del Profesor Asignado -->
              <div class="q-mt-md">
                <div class="row items-center q-gutter-x-sm bg-grey-1 q-pa-xs rounded-borders">
                  <q-avatar size="sm" color="navy-dark" text-color="white" icon="person" />
                  <div class="text-caption text-weight-bold text-navy-dark">
                    Prof. {{ materia.profesorNombre }}
                  </div>
                </div>
              </div>

              <div class="q-mt-md q-pt-sm border-top-subtle row items-center justify-between">
                <span class="text-caption text-grey-6 text-weight-medium">Ciclo Activo</span>
                <q-btn 
                  unelevated 
                  dense 
                  color="navy-dark" 
                  icon="visibility" 
                  label="Ver Asistencia" 
                  :to="`/profesor/asistencia/${materia.id}`"
                  class="q-px-sm text-weight-bold text-caption" 
                />
              </div>
            </q-card>
          </div>
        </div>

      </q-page>
    </q-page-container>

    <!-- Diálogo / Modal para Crear Materia (Mock Local) -->
    <q-dialog v-model="dialogCrear" persistent>
      <q-card style="width: 450px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Registrar Nueva Asignatura</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="nuevaMateria.nombre"
            label="Nombre de la Materia"
            outlined
            dense
            class="bg-grey-1"
            :rules="[val => !!val || 'El nombre es obligatorio']"
          >
            <template v-slot:prepend>
              <q-icon name="menu_book" color="vinotinto" />
            </template>
          </q-input>

          <q-input
            v-model="nuevaMateria.descripcion"
            label="Descripción del Curso"
            type="textarea"
            outlined
            dense
            class="bg-grey-1"
          />

          <q-input
            v-model="nuevaMateria.profesorNombre"
            label="Profesor Titular"
            outlined
            dense
            class="bg-grey-1"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="navy-dark" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar Materia" color="vinotinto" @click="crearMateriaMock" class="text-weight-bold q-px-md" />
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

const dialogCrear = ref(false);
const nuevaMateria = ref({
  nombre: '',
  descripcion: '',
  profesorNombre: ''
});

// Lista estática con nombres y profesores ficticios para pruebas visuales
const materias = ref([
  { 
    id: 101, 
    nombre: 'Matemáticas Discretas', 
    descripcion: 'Estudio de estructuras algebraicas y lógica computacional.', 
    profesorNombre: 'Dr. Alejandro Silva' 
  },
  { 
    id: 102, 
    nombre: 'Arquitectura de Software', 
    descripcion: 'Patrones de diseño avanzados y microservicios.', 
    profesorNombre: 'Dra. Carmen Rodríguez' 
  },
  { 
    id: 103, 
    nombre: 'Sistemas Operativos', 
    descripcion: 'Gestión de procesos, memoria y concurrencia.', 
    profesorNombre: 'Mg. Roberto Gómez' 
  }
]);

const crearMateriaMock = () => {
  if (!nuevaMateria.value.nombre) return;

  materias.value.push({
    id: Date.now().toString().slice(-3),
    nombre: nuevaMateria.value.nombre,
    descripcion: nuevaMateria.value.descripcion || 'Curso académico general.',
    profesorNombre: nuevaMateria.value.profesorNombre || 'Prof. Titular por Asignar'
  });

  $q.notify({
    color: 'navy-dark',
    textColor: 'white',
    message: '¡Materia creada exitosamente (Modo Local)!',
    icon: 'check_circle',
    position: 'top'
  });

  dialogCrear.value = false;
  nuevaMateria.value = { nombre: '', descripcion: '', profesorNombre: '' };
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