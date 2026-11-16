<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    
    <!-- Barra Superior Institucional -->
    <q-header elevated class="bg-white text-dark q-px-md shadow-0" style="border-bottom: 2px solid #6b1d2f;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="vinotinto" text-color="white" icon="menu_book" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Gestión de Materias y Grupos</div>
            <div class="text-caption text-grey-6">Panel Docente • Asignaturas Académicas</div>
          </div>
        </q-toolbar-title>
        
        <div class="row q-gutter-sm">
          <q-btn flat rounded color="vinotinto" icon="add" label="Nueva Materia" @click="abrirModalCrear" class="q-px-md text-weight-medium bg-red-1" />
          <q-btn flat rounded color="navy-dark" icon="dashboard" label="Dashboard" to="/dashboard" class="q-px-md text-weight-medium bg-grey-1" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">
        
        <!-- Encabezado de Sección -->
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h6 text-weight-bold text-navy-dark">Tus Materias Asignadas</div>
            <div class="text-caption text-grey-6">Selecciona una materia para pasar lista o gestionar la inscripción de tus estudiantes.</div>
          </div>
          <q-chip dense color="navy-light" text-color="navy-dark" icon="book" class="text-weight-medium q-px-md">
            Total: {{ materias.length }} Materias
          </q-chip>
        </div>

        <!-- Grid de Tarjetas de Materias -->
        <div class="row q-col-gutter-lg" v-if="materias.length > 0">
          <div class="col-12 col-md-4" v-for="materia in materias" :key="materia.id">
            <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between full-height">
              <div>
                <div class="row items-center justify-between q-mb-sm">
                  <q-badge color="navy-light" text-color="navy-dark" class="text-weight-bold q-px-sm">
                    {{ materia.grupo ? 'Grupo ' + materia.grupo : 'General' }}
                  </q-badge>
                  <q-icon name="school" color="vinotinto" size="sm" />
                </div>
                
                <div class="text-h6 text-weight-bold text-navy-dark q-mb-xs">{{ materia.nombre }}</div>
                <div class="text-caption text-grey-6 q-mb-md">Creada el: {{ new Date(materia.createdAt).toLocaleDateString() }}</div>
              </div>

              <!-- Botones de Acción por Materia -->
              <div class="column q-gutter-sm q-mt-md">
                <q-btn 
                  unelevated 
                  rounded 
                  color="vinotinto" 
                  text-color="white" 
                  icon="fact_check" 
                  label="Pasar Asistencia" 
                  :to="`/profesor/asistencia/${materia.id}`"
                  class="full-width text-weight-bold"
                />
                <q-btn 
                  flat 
                  rounded 
                  color="navy-dark" 
                  icon="group" 
                  label="Gestionar Alumnos" 
                  @click="abrirGestionAlumnos(materia)"
                  class="full-width bg-grey-1 text-weight-medium"
                />
              </div>
            </q-card>
          </div>
        </div>

        <!-- Estado Vacío -->
        <q-card flat class="q-pa-xl text-center bg-white rounded-xl shadow-2 border-subtle" v-else>
          <div class="q-py-xl">
            <q-icon name="menu_book" size="64px" color="grey-4" class="q-mb-md" />
            <div class="text-h6 text-navy-dark text-weight-bold">No tienes materias registradas</div>
            <div class="text-caption text-grey-5 q-mt-xs q-mb-md">Comienza creando tu primera asignatura para habilitar el control de asistencia.</div>
            <q-btn unelevated rounded color="vinotinto" text-color="white" label="Crear Primera Materia" icon="add" @click="abrirModalCrear" />
          </div>
        </q-card>

        <!-- Modal para Crear Materia (CreateMateriaDto) -->
        <q-dialog v-model="modalCrear" persistent>
          <q-card style="min-width: 350px; border-radius: 16px;" class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-weight-bold text-navy-dark">Crear Nueva Materia</div>
              <div class="text-caption text-grey-6">Ingresa los datos correspondientes al DTO del backend.</div>
            </q-card-section>

            <q-card-section class="q-gutter-md">
              <q-input
                v-model="nuevaMateria.nombre"
                label="Nombre de la Materia *"
                outlined
                dense
                class="bg-grey-1"
              />
              <q-input
                v-model="nuevaMateria.grupo"
                label="Grupo (Opcional)"
                outlined
                dense
                class="bg-grey-1"
              />
            </q-card-section>

            <q-card-actions align="right" class="q-mt-md">
              <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
              <q-btn unelevated label="Guardar Materia" color="vinotinto" text-color="white" @click="crearMateria" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Modal de Gestión de Estudiantes (Inscripciones) -->
        <q-dialog v-model="modalAlumnos" maximized>
          <q-card class="bg-grey-2 column">
            <q-bar class="bg-white text-navy-dark q-py-lg" style="border-bottom: 2px solid #6b1d2f;">
              <q-icon name="group" color="vinotinto" />
              <div class="text-weight-bold">Alumnos Inscritos: {{ materiaActual?.nombre }}</div>
              <q-space />
              <q-btn dense flat icon="close" v-close-popup />
            </q-bar>

            <q-card-section class="col q-pa-xl maxWidthContainer full-width">
              <!-- Formulario de Inscripción (InscribirEstudianteDto) -->
              <q-card flat class="q-pa-lg bg-white rounded-xl shadow-2 border-subtle q-mb-lg">
                <div class="text-subtitle1 text-weight-bold text-navy-dark q-mb-md">Inscribir Nuevo Estudiante por Correo</div>
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12 col-md-9">
                    <q-input
                      v-model="emailEstudiante"
                      label="Correo Electrónico del Estudiante (@test.com)"
                      outlined
                      dense
                      class="bg-grey-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" color="vinotinto" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-3">
                    <q-btn
                      unelevated
                      rounded
                      color="vinotinto"
                      text-color="white"
                      icon="person_add"
                      label="Inscribir Alumno"
                      @click="inscribirEstudiante"
                      class="full-width text-weight-bold"
                    />
                  </div>
                </div>
              </q-card>

              <!-- Tabla de Alumnos Inscritos -->
              <q-card flat class="q-pa-lg bg-white rounded-xl shadow-2 border-subtle">
                <div class="text-h6 text-weight-bold text-navy-dark q-mb-md">Nómina Actual</div>
                <q-table
                  :rows="estudiantesInscritos"
                  :columns="columnsEstudiantes"
                  row-key="id"
                  flat
                  class="custom-table"
                >
                  <template v-slot:body-cell-nombre="props">
                    <q-td :props="props">
                      <div class="row items-center q-gutter-sm">
                        <q-avatar size="32px" color="navy-dark" text-color="white" class="text-weight-bold">
                          {{ props.row.nombre.charAt(0) }}
                        </q-avatar>
                        <span class="text-weight-bold text-navy-dark">{{ props.row.nombre }}</span>
                      </div>
                    </q-td>
                  </template>
                </q-table>
              </q-card>
            </q-card-section>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify, Loading } from 'quasar';
import api from '../services/api';

const materias = ref([]);
const modalCrear = ref(false);
const modalAlumnos = ref(false);
const materiaActual = ref(null);
const estudiantesInscritos = ref([]);
const emailEstudiante = ref('');

const nuevaMateria = ref({
  nombre: '',
  grupo: ''
});

const columnsEstudiantes = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'CORREO ELECTRÓNICO', field: 'email', align: 'left', sortable: true }
];

// Cargar materias del profesor (GET /materias/mis-materias)
const cargarMaterias = async () => {
  try {
    const { data } = await api.get('/materias/mis-materias');
    materias.value = data;
  } catch (error) {
    Notify.create({ color: 'negative', message: 'Error al cargar las materias', position: 'top' });
  }
};

onMounted(() => {
  cargarMaterias();
});

const abrirModalCrear = () => {
  nuevaMateria.value = { nombre: '', grupo: '' };
  modalCrear.value = true;
};

// Crear materia (POST /materias)
const crearMateria = async () => {
  if (!nuevaMateria.value.nombre) {
    Notify.create({ color: 'warning', message: 'El nombre de la materia es obligatorio', position: 'top' });
    return;
  }

  try {
    await api.post('/materias', nuevaMateria.value);
    Notify.create({ color: 'positive', message: '¡Materia creada con éxito!', icon: 'check_circle', position: 'top' });
    modalCrear.value = false;
    cargarMaterias();
  } catch (error) {
    Notify.create({ color: 'negative', message: 'Error al crear la materia', position: 'top' });
  }
};

// Abrir gestión de alumnos para una materia específica
const abrirGestionAlumnos = async (materia) => {
  materiaActual.value = materia;
  modalAlumnos.value = true;
  emailEstudiante.value = '';
  await cargarEstudiantesMateria(materia.id);
};

// Cargar estudiantes inscritos (GET /materias/:id/estudiantes)
const cargarEstudiantesMateria = async (materiaId) => {
  Loading.show({ message: 'Cargando estudiantes...' });
  try {
    const { data } = await api.get(`/materias/${materiaId}/estudiantes`);
    estudiantesInscritos.value = data;
    Loading.hide();
  } catch (error) {
    Loading.hide();
    Notify.create({ color: 'negative', message: 'Error al cargar los estudiantes inscritos', position: 'top' });
  }
};

// Inscribir estudiante (POST /materias/:id/inscribir con InscribirEstudianteDto)
const inscribirEstudiante = async () => {
  if (!emailEstudiante.value) {
    Notify.create({ color: 'warning', message: 'Ingresa un correo electrónico válido', position: 'top' });
    return;
  }

  try {
    await api.post(`/materias/${materiaActual.value.id}/inscribir`, {
      email: emailEstudiante.value
    });

    Notify.create({ color: 'positive', message: '¡Estudiante inscrito correctamente!', icon: 'check_circle', position: 'top' });
    emailEstudiante.value = '';
    await cargarEstudiantesMateria(materiaActual.value.id);
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al inscribir al estudiante';
    Notify.create({ color: 'negative', message: mensaje, position: 'top' });
  }
};
</script>

<style scoped>
.bg-vinotinto {
  background-color: #6b1d2f !important;
}
.text-vinotinto {
  color: #6b1d2f !important;
}
.bg-navy-dark {
  background-color: #1b2a47 !important;
}
.text-navy-dark {
  color: #1b2a47 !important;
}
.bg-navy-light {
  background-color: #e8ecf4 !important;
}

.maxWidthContainer {
  max-width: 1100px;
  margin: 0 auto;
}

.rounded-xl {
  border-radius: 16px !important;
}

.border-subtle {
  border: 1px solid #edf2f7 !important;
}

.custom-table >>> th {
  font-weight: 700;
  color: #1b2a47;
  background-color: #f8fafc;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.custom-table >>> td {
  border-bottom: 1px solid #f1f5f9;
  padding-top: 14px;
  padding-bottom: 14px;
}
</style>