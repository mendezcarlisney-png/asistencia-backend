<!-- src/pages/PlanificacionHorariosPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="calendar_month" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Planificación de Horarios y Asignaciones</div>
            <div class="text-caption text-grey-6">Docente, Aula, Semestre y Materia</div>
          </div>
        </q-toolbar-title>

        <!-- Accesos Rápidos -->
        <div class="row items-center q-gutter-md">
          <q-btn flat rounded color="navy-dark" icon="meeting_room" label="Aulas y Secciones" to="/gestion/aulas-secciones" />
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
            <div class="text-h5 text-weight-bold text-navy-dark">Matriz Horaria Institucional</div>
            <div class="text-caption text-grey-6">Control de cruces por docente, salón y período académico.</div>
          </div>
          <q-btn 
            unelevated 
            rounded 
            color="vinotinto" 
            icon="add" 
            label="Asignar Horario a Docente" 
            @click="dialogHorario = true"
            class="q-px-lg q-py-sm text-weight-bold shadow-1" 
          />
        </div>

        <!-- Tabla / Grilla Semanal Estilo Moodle -->
        <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
          <q-table
            :rows="bloquesHorarios"
            :columns="columns"
            row-key="id"
            flat
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <!-- Personalización de celdas para cada día de la semana -->
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="hora" :props="props" class="text-weight-bold text-navy-dark bg-grey-2">
                  {{ props.row.hora }}
                </q-td>
                <q-td v-for="dia in ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']" :key="dia" :props="props">
                  <div v-if="props.row[dia]" class="bg-blue-1 text-navy-dark q-pa-sm rounded-borders border-subtle">
                    <div class="text-weight-bold" style="font-size: 11px;">{{ props.row[dia].materia }}</div>
                    <div class="text-caption text-vinotinto text-weight-bold" style="font-size: 10px;">Prof. {{ props.row[dia].profesor }}</div>
                    <div class="text-caption text-grey-8" style="font-size: 10px;">Aula: {{ props.row[dia].aula }} | {{ props.row[dia].semestre }}</div>
                  </div>
                  <span v-else class="text-grey-4 text-caption">— Libre —</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>

      </q-page>
    </q-page-container>

    <!-- Modal para Agregar Bloque Horario con Asignación Completa -->
    <q-dialog v-model="dialogHorario" persistent>
      <q-card style="width: 480px; border-radius: 16px;" class="q-pa-md">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Asignar Horario a Docente</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select v-model="nuevoBloque.dia" :options="diasSemana" label="Día de la Semana" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="calendar_today" color="vinotinto" /></template>
          </q-select>

          <q-select v-model="nuevoBloque.hora" :options="horasBloques" label="Bloque Horario" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="schedule" color="navy-dark" /></template>
          </q-select>

          <q-input v-model="nuevoBloque.materia" label="Nombre de la Materia" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="menu_book" color="navy-dark" /></template>
          </q-input>

          <q-input v-model="nuevoBloque.profesor" label="Profesor Titular" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="person" color="vinotinto" /></template>
          </q-input>

          <q-input v-model="nuevoBloque.aula" label="Aula Asignada (Ej. LAB-01)" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="meeting_room" color="navy-dark" /></template>
          </q-input>

          <q-select v-model="nuevoBloque.semestre" :options="['2026-I', '2026-II']" label="Semestre / Período Académico" outlined dense class="bg-grey-1">
            <template v-slot:prepend><q-icon name="event" color="vinotinto" /></template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Guardar Asignación" color="vinotinto" @click="guardarBloque" class="text-weight-bold q-px-md" />
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

const dialogHorario = ref(false);

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const horasBloques = ['07:00 AM - 09:15 AM', '09:30 AM - 11:45 AM', '01:00 PM - 03:15 PM', '03:30 PM - 05:45 PM'];

const columns = [
  { name: 'hora', label: 'Bloque Horario', field: 'hora', align: 'left', style: 'width: 150px;' },
  { name: 'lunes', label: 'Lunes', field: 'lunes', align: 'center' },
  { name: 'martes', label: 'Martes', field: 'martes', align: 'center' },
  { name: 'miercoles', label: 'Miércoles', field: 'miercoles', align: 'center' },
  { name: 'jueves', label: 'Jueves', field: 'jueves', align: 'center' },
  { name: 'viernes', label: 'Viernes', field: 'viernes', align: 'center' }
];

// Datos Mock que incluyen profesor, aula, semestre y materia
const bloquesHorarios = ref([
  {
    id: 1,
    hora: '07:00 AM - 09:15 AM',
    lunes: { materia: 'Matemáticas Discretas', profesor: 'Dr. Alejandro Silva', aula: 'Aula 101', semestre: '2026-I' },
    martes: null,
    miercoles: { materia: 'Matemáticas Discretas', profesor: 'Dr. Alejandro Silva', aula: 'Aula 101', semestre: '2026-I' },
    jueves: null,
    viernes: null
  },
  {
    id: 2,
    hora: '09:30 AM - 11:45 AM',
    lunes: null,
    martes: { materia: 'Arquitectura de Software', profesor: 'Dra. Carmen Rodríguez', aula: 'LAB-01', semestre: '2026-I' },
    miercoles: null,
    jueves: { materia: 'Arquitectura de Software', profesor: 'Dra. Carmen Rodríguez', aula: 'LAB-01', semestre: '2026-I' },
    viernes: null
  }
]);

const nuevoBloque = ref({
  dia: 'Lunes',
  hora: '07:00 AM - 09:15 AM',
  materia: '',
  profesor: '',
  aula: '',
  semestre: '2026-I'
});

const guardarBloque = () => {
  if (!nuevoBloque.value.materia || !nuevoBloque.value.profesor || !nuevoBloque.value.aula) {
    $q.notify({ color: 'negative', message: 'Por favor complete todos los campos obligatorios', position: 'top' });
    return;
  }

  const diaKeyMap = {
    'Lunes': 'lunes',
    'Martes': 'martes',
    'Miércoles': 'miercoles',
    'Jueves': 'jueves',
    'Viernes': 'viernes'
  };

  const key = diaKeyMap[nuevoBloque.value.dia];
  const fila = bloquesHorarios.value.find(b => b.hora === nuevoBloque.value.hora);

  if (fila) {
    fila[key] = {
      materia: nuevoBloque.value.materia,
      profesor: nuevoBloque.value.profesor,
      aula: nuevoBloque.value.aula,
      semestre: nuevoBloque.value.semestre
    };

    $q.notify({
      color: 'navy-dark',
      textColor: 'white',
      message: '¡Horario asignado al docente con éxito!',
      icon: 'check_circle',
      position: 'top'
    });

    dialogHorario.value = false;
    nuevoBloque.value = { dia: 'Lunes', hora: '07:00 AM - 09:15 AM', materia: '', profesor: '', aula: '', semestre: '2026-I' };
  }
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