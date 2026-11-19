<template>
  <q-card flat bordered class="q-pa-md">
    <div class="text-h6 text-weight-bold q-mb-md">Tomar asistencia</div>
    <div class="row q-col-gutter-md q-mb-md items-center">
      <q-select class="col-12 col-md-6" v-model="materiaId" :options="materias"
        option-value="id" option-label="etiqueta" emit-value map-options outlined
        label="Materia" :loading="cargando" @update:model-value="cargarEstudiantes" />
      <q-input class="col-12 col-md-3" v-model="fecha" type="date" outlined label="Fecha" />
      <q-toggle class="col-12 col-md-3" v-model="claseVista" label="Clase dictada" />
    </div>
    <q-table :rows="estudiantes" :columns="columnas" row-key="id" flat hide-bottom
      :pagination="{ rowsPerPage: 0 }" no-data-label="Selecciona una materia con estudiantes inscritos">
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-btn-toggle v-model="estados[props.row.id]" unelevated no-caps
            toggle-color="primary" :options="opciones" />
        </q-td>
      </template>
    </q-table>
    <div class="row justify-end q-mt-md">
      <q-btn unelevated color="primary" label="Guardar asistencia"
        :disable="!materiaId || !estudiantes.length" :loading="guardando" @click="guardar" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import api from '../services/api';

const $q = useQuasar();
const materias = ref<{ id: string; etiqueta: string }[]>([]);
const materiaId = ref<string | null>(null);
const estudiantes = ref<{ id: string; nombre: string; email: string }[]>([]);
const estados = ref<Record<string, string>>({});
const fecha = ref(new Date().toLocaleDateString('en-CA'));
const claseVista = ref(true);
const cargando = ref(false);
const guardando = ref(false);

const opciones = [
  { label: 'Presente', value: 'PRESENTE' },
  { label: 'Ausente', value: 'AUSENTE' },
];
const columnas = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left' as const },
  { name: 'email', label: 'CORREO', field: 'email', align: 'left' as const },
  { name: 'estado', label: 'ESTATUS', field: 'id', align: 'center' as const },
];

const msg = (e: any) => [].concat(e.response?.data?.message ?? 'Error inesperado').join('. ');

async function cargarMaterias() {
  cargando.value = true;
  try {
    const { data } = await api.get('/materias/mis-materias');
    materias.value = data.map((m: any) => ({
      id: m.id,
      etiqueta: m.grupo ? `${m.nombre} · Grupo ${m.grupo}` : m.nombre,
    }));
  } catch (e: any) {
    $q.notify({ type: 'negative', message: msg(e) });
  } finally {
    cargando.value = false;
  }
}

async function cargarEstudiantes() {
  estudiantes.value = [];
  estados.value = {};
  if (!materiaId.value) return;
  try {
    const { data } = await api.get(`/materias/${materiaId.value}/estudiantes`);
    estudiantes.value = data;
    data.forEach((s: any) => (estados.value[s.id] = 'PRESENTE'));
  } catch (e: any) {
    $q.notify({ type: 'negative', message: msg(e) });
  }
}

async function guardar() {
  guardando.value = true;
  try {
    await api.post('/asistencias', {
      materiaId: materiaId.value,
      fecha: fecha.value,
      claseVista: claseVista.value,
      asistencias: estudiantes.value.map((s) => ({ estudianteId: s.id, estado: estados.value[s.id] })),
    });
    $q.notify({ type: 'positive', message: 'Asistencia guardada' });
  } catch (e: any) {
    $q.notify({ type: 'negative', message: msg(e) });
  } finally {
    guardando.value = false;
  }
}

onMounted(cargarMaterias);
</script>
