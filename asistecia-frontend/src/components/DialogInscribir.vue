<template>
  <q-dialog v-model="abierto" @show="cargar">
    <q-card style="min-width: 420px; border-radius: 16px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Inscribirse a una materia</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="seleccion" :options="opciones"
          option-value="id" option-label="etiqueta"
          emit-value map-options outlined
          label="Selecciona tu materia"
          :loading="cargando" :disable="!opciones.length"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn unelevated color="primary" label="Inscribirme"
          :disable="!seleccion" :loading="enviando" @click="inscribir" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import api from "../services/api";

const abierto = defineModel<boolean>({ default: false });
const emit = defineEmits<{ inscrito: [] }>();
const $q = useQuasar();

const opciones = ref<{ id: string; etiqueta: string }[]>([]);
const seleccion = ref<string | null>(null);
const cargando = ref(false);
const enviando = ref(false);

async function cargar() {
  cargando.value = true;
  seleccion.value = null;
  try {
    const { data } = await api.get('/materias/disponibles');
    opciones.value = data.map((m: any) => ({
      id: m.id,
      etiqueta: [m.nombre, m.grupo && `Grupo ${m.grupo}`, m.profesor?.nombre && `Prof. ${m.profesor.nombre}`]
        .filter(Boolean).join(' · '),
    }));
  } catch (e: any) {
    console.error('disponibles:', e.response?.status, e.response?.data);
    $q.notify({ type: 'negative', message: e.response?.data?.message ?? 'No se pudieron cargar las materias' });
  } finally {
    cargando.value = false;
  }
}

async function inscribir() {
  enviando.value = true;
  try {
    await api.post(`/materias/${seleccion.value}/inscribir`);
    $q.notify({ type: 'positive', message: 'Inscripción realizada' });
    abierto.value = false;
    emit('inscrito');
  } catch (e: any) {
    $q.notify({ type: 'negative', message: e.response?.data?.message ?? 'No se pudo inscribir' });
  } finally {
    enviando.value = false;
  }
}
</script>
