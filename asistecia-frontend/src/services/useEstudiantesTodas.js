import { ref, onMounted } from 'vue';
import api from './api';

export function useEstudiantesTodas() {
  const estudiantes = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const cargarEstudiantes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data: materias } = await api.get('/materias/mis-materias');
      const listas = await Promise.all(
        (Array.isArray(materias) ? materias : []).map(async (m) => {
          const res = await api.get(`/materias/${m.id}/estudiantes`);
          const lista = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          return lista.map((e) => ({ ...e, materia: e.materia ?? m.nombre }));
        })
      );
      estudiantes.value = listas.flat();
    } catch (err) {
      console.error('estudiantes:', err.response?.status, err.response?.data);
      error.value = err.response?.data?.message || 'Error al cargar estudiantes';
      estudiantes.value = [];
    } finally {
      loading.value = false;
    }
  };

  onMounted(cargarEstudiantes);

  return { estudiantes, loading, error, cargarEstudiantes };
}
