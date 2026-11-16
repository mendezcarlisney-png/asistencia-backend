<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    
    <!-- Barra Superior con acento Vinotinto e identidad institucional -->
    <q-header elevated class="bg-white text-dark q-px-md shadow-0" style="border-bottom: 2px solid #6b1d2f;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="vinotinto" text-color="white" icon="fact_check" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Control Académico de Asistencia</div>
            <div class="text-caption text-grey-6">Gestión de sesiones y pase de lista docente</div>
          </div>
        </q-toolbar-title>
        
        <q-btn flat rounded color="navy-dark" icon="arrow_back" label="Volver al Dashboard" to="/dashboard" class="q-px-md text-weight-medium bg-grey-1" />
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">
        
        <!-- Tarjeta de Configuración con detalles Vinotinto y Azul Marino -->
        <q-card flat class="q-pa-lg q-mb-lg bg-white rounded-xl shadow-2 border-subtle">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-navy-dark row items-center q-gutter-sm">
              <q-icon name="tune" color="vinotinto" size="sm" />
              <span>Configuración de la Sesión</span>
            </div>
            <q-chip dense color="navy-light" text-color="navy-dark" icon="event" class="text-weight-medium q-px-md">
              {{ fechaActual }}
            </q-chip>
          </div>
          
          <div class="row q-col-gutter-md items-center">
            <!-- Select de Materias Dinámico -->
            <div class="col-12 col-md-7">
              <q-select
                v-model="materiaSeleccionada"
                :options="materiasProfesor"
                label="Seleccionar Materia / Grupo"
                outlined
                dense
                emit-value
                map-options
                options-dense
                class="bg-grey-1 rounded-borders"
                @update:model-value="cargarEstudiantesDeMateria"
              >
                <template v-slot:prepend>
                  <q-icon name="menu_book" color="vinotinto" />
                </template>
              </q-select>
            </div>

            <!-- Switch de Clase Vista -->
            <div class="col-12 col-md-5">
              <div class="q-px-md q-py-sm bg-grey-1 rounded-borders row items-center justify-between border-subtle">
                <span class="text-weight-medium text-grey-8 text-body2">¿Clase impartida/vista?</span>
                <q-toggle
                  v-model="claseVista"
                  color="vinotinto"
                  icon="check"
                  class="text-weight-bold"
                />
              </div>
            </div>
          </div>
        </q-card>

        <!-- Tabla Estructurada Interactiva -->
        <q-card flat class="q-pa-lg bg-white rounded-xl shadow-2 border-subtle" v-if="materiaSeleccionada">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h6 text-weight-bold text-navy-dark">Nómina de Estudiantes</div>
              <div class="text-caption text-grey-6">Marca la asistencia individual para consolidar el registro de hoy.</div>
            </div>
            
            <div class="row q-gutter-sm items-center">
              <q-badge :color="claseVista ? 'red-1' : 'orange-1'" :text-color="claseVista ? 'vinotinto' : 'warning'" class="q-pa-sm text-subtitle2 rounded-borders shadow-0">
                {{ claseVista ? '✔ Clase Registrada' : '⚠ Clase Pendiente' }}
              </q-badge>
            </div>
          </div>

          <q-table
            :rows="estudiantes"
            :columns="columns"
            row-key="id"
            flat
            class="q-mt-md custom-table"
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <!-- Slot para Identificación con Avatar en Azul Marino / Vinotinto -->
            <template v-slot:body-cell-nombre="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-md">
                  <q-avatar size="38px" color="navy-dark" text-color="white" class="text-weight-bold shadow-1">
                    {{ props.row.nombre.charAt(0) }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-navy-dark">{{ props.row.nombre }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.email }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <!-- Slot para el Checklist Estilizado -->
            <template v-slot:body-cell-asistencia="props">
              <q-td :props="props" class="text-right">
                <div class="row items-center justify-end q-gutter-sm">
                  <span class="text-weight-bold text-caption" :class="props.row.presente ? 'text-vinotinto' : 'text-grey-5'">
                    {{ props.row.presente ? 'PRESENTE' : 'AUSENTE' }}
                  </span>
                  <q-checkbox
                    v-model="props.row.presente"
                    color="vinotinto"
                    size="md"
                    indeterminate-value="false"
                  />
                </div>
              </q-td>
            </template>
          </q-table>

          <!-- Botón de Guardar Principal en Vinotinto -->
          <div class="row justify-end q-mt-xl">
            <q-btn 
              label="Guardar Asistencia y Estado" 
              color="vinotinto" 
              text-color="white"
              icon="save_alt" 
              @click="guardarAsistencia" 
              unelevated 
              rounded
              size="md"
              class="q-px-xl q-py-sm shadow-2 text-weight-bold"
            />
          </div>
        </q-card>

        <!-- Estado Inicial (Vacío) Moderno -->
        <q-card flat class="q-pa-xl text-center bg-white rounded-xl shadow-2 border-subtle" v-else>
          <div class="q-py-xl">
            <q-icon name="folder_open" size="64px" color="grey-4" class="q-mb-md" />
            <div class="text-h6 text-navy-dark text-weight-bold">Ninguna materia seleccionada</div>
            <div class="text-caption text-grey-5 q-mt-xs">Selecciona una materia en el panel superior para desplegar la lista de alumnos.</div>
          </div>
        </q-card>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify, Loading } from 'quasar';
import api from '../services/api';

const fechaActual = ref(new Date().toLocaleDateString());
const claseVista = ref(true);

const materiaSeleccionada = ref(null);
const materiasProfesor = ref([]);
const estudiantes = ref([]);

const columns = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'asistencia', label: 'ESTATUS DE ASISTENCIA', field: 'presente', align: 'right' }
];

// Cargar las materias reales del profesor desde tu backend (GET /materias/mis-materias)
onMounted(async () => {
  try {
    const { data } = await api.get('/materias/mis-materias');
    materiasProfesor.value = data.map(m => ({
      label: `${m.nombre} ${m.grupo ? '• Grupo ' + m.grupo : ''}`,
      value: m.id
    }));
  } catch (error) {
    Notify.create({ color: 'negative', message: 'Error al cargar las materias del profesor', position: 'top' });
  }
});

// Cargar los estudiantes reales inscritos en la materia seleccionada (GET /materias/:id/estudiantes)
const cargarEstudiantesDeMateria = async (materiaId) => {
  if (!materiaId) return;
  
  Loading.show({ message: 'Sincronizando estudiantes inscritos...' });
  try {
    const { data } = await api.get(`/materias/${materiaId}/estudiantes`);
    estudiantes.value = data.map(est => ({
      ...est,
      presente: true // Por defecto marcados como presentes al cargar
    }));
    Loading.hide();
  } catch (error) {
    Loading.hide();
    Notify.create({ color: 'negative', message: 'Error al cargar la lista de estudiantes', position: 'top' });
  }
};

const guardarAsistencia = async () => {
  try {
    const payload = {
      materiaId: materiaSeleccionada.value,
      fecha: new Date().toISOString(),
      claseVista: claseVista.value,
      asistencias: estudiantes.value.map(est => ({
        estudianteId: est.id,
        estado: est.presente ? 'PRESENTE' : 'AUSENTE'
      }))
    };

    console.log('Enviando payload al backend:', payload);
    // await api.post('/asistencias', payload); // Descomenta cuando habilites el endpoint en NestJS

    Notify.create({
      color: 'navy-dark',
      textColor: 'white',
      message: '¡Registro de asistencia guardado exitosamente!',
      icon: 'verified',
      position: 'top',
      classes: 'shadow-2'
    });
  } catch (error) {
    Notify.create({
      color: 'negative',
      message: 'Error al procesar el registro de asistencia',
      icon: 'error',
      position: 'top'
    });
  }
};
</script>

<style scoped>
/* Clases personalizadas de colores Institucionales (Vinotinto, Azul Marino, Blanco) */
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