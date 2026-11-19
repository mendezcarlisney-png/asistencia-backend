import { ref, onMounted } from 'vue';
import api from './api';

export function useReporteTodas() {
  const filas = ref([]);
  const loading = ref(false);

  const cargarReporte = async () => {
    loading.value = true;
    try {
      const { data: materias } = await api.get('/materias/mis-materias');
      const listas = await Promise.all(
        (Array.isArray(materias) ? materias : []).map(async (m) => {
          const res = await api.get('/asistencias/reporte', { params: { materiaId: m.id } });
          const payload = res.data;
          if (Array.isArray(payload)) return payload;
          if (payload && Array.isArray(payload.data)) return payload.data;
          return [];
        })
      );
      filas.value = listas.flat();
    } catch (e) {
      console.error('Error al cargar reporte:', e.response?.status, e.response?.data);
      filas.value = [];
    } finally {
      loading.value = false;
    }
  };
onMounted(() => {
    cargarReporte();
  });

  return {
    filas,
    loading,
    cargarReporte
  };
}
