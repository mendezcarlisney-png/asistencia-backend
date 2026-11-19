<!-- src/pages/estudiante/MisAsistenciasPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Tipo Campus Virtual -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="school" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Campus Virtual - Estudiante</div>
            <div class="text-caption text-grey-6">Plataforma de Control Académico</div>
          </div>
        </q-toolbar-title>

        <!-- Información del Estudiante y Botón de Salir -->
        <div class="row items-center q-gutter-md">
          <div v-if="user" class="text-right">
            <div class="text-weight-bold text-navy-dark text-body2">{{ user.nombre }}</div>
            <q-badge color="orange-1" text-color="orange-9" class="text-weight-bold q-mt-xs">
              ESTUDIANTE
            </q-badge>
          </div>
          <q-btn flat rounded color="vinotinto" icon="logout" label="Salir" @click="logout" class="bg-red-1 q-px-md text-weight-medium" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">

        <!-- Pestañas de Navegación tipo Moodle (Cursos / Asistencias) -->
        <div class="row q-mb-lg">
          <q-tabs
            v-model="tabActiva"
            dense
            class="text-grey-7 bg-white rounded-xl shadow-1 q-pa-xs border-subtle"
            active-color="navy-dark"
            indicator-color="vinotinto"
            align="left"
            narrow-indicator
          >
            <q-tab name="materias" icon="menu_book" label="Mis Materias Inscritas" class="text-weight-bold q-px-md rounded-borders" />
            <q-tab name="asistencias" icon="fact_check" label="Historial de Asistencias" class="text-weight-bold q-px-md rounded-borders" />
          </q-tabs>

          <q-space />

          <!-- Botón de Inscripción Rápida -->
          <q-btn 
            unelevated 
            rounded 
            color="navy-dark" 
            icon="add_circle" 
            label="Inscribirse a Materia" 
            @click="dialogInscribir = true"
            class="q-px-md text-weight-bold shadow-1 self-center" 
          />
        </div>

        <!-- CONTENIDO DE LA PESTAÑA: MIS MATERIAS (TIPO CURSOS MOODLE) -->
        <div v-if="tabActiva === 'materias'">
          <div class="text-h6 text-weight-bold text-navy-dark q-mb-md">Mis Cursos Activos</div>
          
          <div class="row q-col-gutter-lg">
            <div v-for="materia in materiasInscritas" :key="materia.id" class="col-12 col-md-4">
              <q-card flat class="bg-white rounded-xl shadow-2 border-subtle q-pa-md column justify-between" style="min-height: 200px;">
                <div>
                  <div class="row items-center justify-between q-mb-sm">
                    <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold">Código: {{ materia.id }}</q-badge>
                    <q-icon name="bookmark" color="vinotinto" size="sm" />
                  </div>
                  <div class="text-h6 text-weight-bold text-navy-dark q-mt-xs">{{ materia.nombre }}</div>
                  <div class="text-caption text-grey-6 q-mt-xs">{{ materia.descripcion || 'Asignatura oficial del período académico.' }}</div>
                </div>

                <div class="q-mt-md q-pt-sm border-top-subtle row items-center justify-between">
                  <div class="text-caption text-grey-7">Prof. {{ materia.profesor?.nombre || 'Asignado' }}</div>
                </div>
              </q-card>
            </div>

            <!-- Estado Vacío si no hay materias -->
            <div v-if="materiasInscritas.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="school" size="64px" color="grey-5" />
              <div class="text-h6 text-grey-6 q-mt-md">Aún no estás inscrito en ninguna materia.</div>
              <div class="text-caption text-grey-5">Utiliza el botón superior para unirte usando tu código.</div>
            </div>
          </div>
        </div>

        <!-- CONTENIDO DE LA PESTAÑA: HISTORIAL DE ASISTENCIAS -->
        <div v-if="tabActiva === 'asistencias'">
          <q-card flat class="q-pa-lg bg-white rounded-xl shadow-2 border-subtle">
            <div class="row items-center justify-between q-mb-md">
              <div>
                <div class="text-h6 text-weight-bold text-navy-dark">Registro General de Asistencias</div>
                <div class="text-caption text-grey-6">Control de asistencia sincronizado con PostgreSQL.</div>
              </div>
              <q-btn flat rounded color="navy-dark" icon="refresh" label="Actualizar" @click="cargarDatos" />
            </div>

            <q-table
              :rows="asistencias"
              :columns="columns"
              row-key="id"
              flat
              class="custom-table"
              no-data-label="No hay registros de asistencia disponibles."
            >
              <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                  <q-chip 
                    :color="props.row.presente ? 'green-1' : 'red-1'" 
                    :text-color="props.row.presente ? 'positive' : 'negative'"
                    class="text-weight-bold"
                    size="sm"
                  >
                    <q-icon :name="props.row.presente ? 'check_circle' : 'cancel'" class="q-mr-xs" />
                    {{ props.row.presente ? 'Presente' : 'Ausente' }}
                  </q-chip>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>

      </q-page>
    </q-page-container>

    <!-- Modal: materias disponibles en acordeon -->
    <DialogInscribir v-model="dialogInscribir" />


  </q-layout>
</template>

<script setup>
import DialogInscribir from "../components/DialogInscribir.vue";
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import api from '../services/api';

const router = useRouter();
const $q = useQuasar();
const user = ref(null);
const tabActiva = ref('materias');
const materiasInscritas = ref([]);
const materiasDisponibles = ref([]);
const asistencias = ref([]);
const dialogInscribir = ref(false);
const cargandoDisponibles = ref(false);
const inscribiendoId = ref(null);

const columns = [
  { name: 'materia', label: 'ASIGNATURA', field: (row) => row.materiaNombre || 'Materia', align: 'left', sortable: true },
  { name: 'fecha', label: 'FECHA DE CLASE', field: (row) => row.fecha || '-', align: 'left', sortable: true },
  { name: 'estado', label: 'ESTATUS', field: 'presente', align: 'center', sortable: true },
];

const mapAsistencias = (lista) =>
  (lista || []).map((a) => ({
    ...a,
    presente: a.estado === 'PRESENTE' || a.presente === true,
    materiaNombre: typeof a.materia === 'string' ? a.materia : a.materia?.nombre || 'Materia',
  }));

const cargarDisponibles = async () => {
  cargandoDisponibles.value = true;
  try {
    const res = await api.get('/materias/disponibles');
    materiasDisponibles.value = res.data || [];
  } catch (e) {
    materiasDisponibles.value = [];
    $q.notify({
      color: 'negative',
      message: 'No se pudieron cargar las materias disponibles',
      icon: 'report_problem',
      position: 'top',
    });
  } finally {
    cargandoDisponibles.value = false;
  }
};

const cargarDatos = async () => {
  $q.loading.show({ message: 'Sincronizando campus virtual...' });
  try {
    const resAsistencias = await api.get('/asistencias/estudiante');
    const resMaterias = await api.get('/materias/mis-materias');
    asistencias.value = mapAsistencias(resAsistencias.data);
    materiasInscritas.value = resMaterias.data || [];
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al cargar los datos del campus',
      icon: 'report_problem',
      position: 'top',
    });
  } finally {
    $q.loading.hide();
  }
};

const inscribirMateria = async (materiaId) => {
  if (!materiaId) return;
  inscribiendoId.value = materiaId;
  try {
    await api.post('/materias/' + materiaId + '/inscribir', {});
    $q.notify({
      color: 'positive',
      message: 'Te has matriculado en el curso exitosamente',
      icon: 'check_circle',
      position: 'top',
    });
    dialogInscribir.value = false;
    await cargarDatos();
    await cargarDisponibles();
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'No se pudo completar la inscripcion';
    $q.notify({
      color: 'negative',
      message: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
      icon: 'error',
      position: 'top',
    });
  } finally {
    inscribiendoId.value = null;
  }
};

watch(dialogInscribir, (abierto) => {
  if (abierto) cargarDisponibles();
});

onMounted(async () => {
  const userData = localStorage.getItem('user');
  if (userData) user.value = JSON.parse(userData);
  await cargarDatos();
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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

.custom-table :deep(th) {
  font-weight: 700;
  color: #1b2a47;
  background-color: #f8fafc;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
</style>