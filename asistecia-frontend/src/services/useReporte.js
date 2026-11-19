import { ref, onMounted } from 'vue';
import api from './api';

export function useReporte() {
  const materiasReporte = ref([]);
  const materiaReporte = ref(null);
  const reportesEstudiantes = ref([]);

  const cargarReporte = async () => {
    if (!materiaReporte.value) return;
    const { data } = await api.get('/asistencias/reporte', { params: { materiaId: materiaReporte.value } });
    reportesEstudiantes.value = data;
  };

  onMounted(async () => {
    const rol = JSON.parse(localStorage.getItem('user') || '{}').rol;
    const { data } = await api.get(rol === 'ADMIN' ? '/materias' : '/materias/mis-materias');
    materiasReporte.value = data.map((m) => ({ id: m.id, etiqueta: m.grupo ? `${m.nombre} · Grupo ${m.grupo}` : m.nombre }));
    if (materiasReporte.value.length) {
      materiaReporte.value = materiasReporte.value[0].id;
      await cargarReporte();
    }
  });

  return { materiasReporte, materiaReporte, reportesEstudiantes, cargarReporte };
}
