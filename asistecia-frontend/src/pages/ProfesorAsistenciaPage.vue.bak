<!-- src/pages/ProfesorAsistenciaPage.vue -->
<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">

    <!-- Barra Superior Institucional -->
    <q-header elevated class="bg-white text-dark q-px-md" style="border-bottom: 2px solid #1b2a47;">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center q-gutter-md">
          <q-avatar rounded color="navy-dark" text-color="white" icon="fact_check" size="md" class="shadow-1" />
          <div>
            <div class="text-weight-bold text-subtitle1 text-navy-dark">Control de Asistencia por Sesión</div>
            <div class="text-caption text-grey-6">Materia ID: {{ materiaId }} | Semestre 2026-I</div>
          </div>
        </q-toolbar-title>

        <!-- Accesos Rápidos y Botón de QR -->
        <div class="row items-center q-gutter-md">
          <q-btn 
            unelevated 
            rounded 
            color="vinotinto" 
            icon="qr_code_scanner" 
            label="Escanear QR Estudiante" 
            @click="abrirEscanerQR"
            class="q-px-md text-weight-bold shadow-1" 
          />
          <q-btn flat rounded color="navy-dark" icon="menu_book" label="Mis Materias" to="/materias" />
          <q-btn flat rounded color="vinotinto" icon="logout" label="Salir" @click="logout" class="bg-red-1 q-px-md text-weight-medium" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Contenido Principal -->
    <q-page-container>
      <q-page class="q-pa-lg q-pa-md-xl maxWidthContainer">

        <!-- Cabecera de la Clase -->
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold text-navy-dark">Nómina de Estudiantes y Estados</div>
            <div class="text-caption text-grey-6">Marque la asistencia manual o utilice el escáner de códigos QR corporativo.</div>
          </div>
          <q-btn 
            unelevated 
            rounded 
            color="navy-dark" 
            icon="save" 
            label="Guardar Asistencia" 
            @click="guardarAsistencia"
            class="q-px-lg q-py-sm text-weight-bold shadow-1" 
          />
        </div>

        <!-- Tabla de Asistencia Estilo Moodle -->
        <q-card flat class="bg-white rounded-xl shadow-2 border-subtle overflow-hidden">
          <q-table
            :rows="estudiantes"
            :columns="columns"
            row-key="id"
            flat
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="nombre" :props="props" class="text-weight-bold text-navy-dark">
                  {{ props.row.nombre }}
                  <div class="text-caption text-grey-6" style="font-size: 11px;">{{ props.row.email }}</div>
                </q-td>
                <q-td key="qrStatus" :props="props" class="text-center">
                  <q-badge color="blue-1" text-color="navy-dark" class="text-weight-bold">
                    {{ props.row.codigoQR }}
                  </q-badge>
                </q-td>
                <q-td key="estado" :props="props">
                  <q-option-group
                    v-model="props.row.estado"
                    :options="opcionesAsistencia"
                    inline
                    dense
                    color="vinotinto"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>

      </q-page>
    </q-page-container>

    <!-- Modal del Escáner QR para el Profesor -->
    <q-dialog v-model="dialogQR" persistent>
      <q-card style="width: 450px; border-radius: 16px;" class="q-pa-md text-center">
        <q-card-section class="row items-center justify-between q-pb-none">
          <div class="text-h6 text-navy-dark text-weight-bold">Escáner QR de Asistencia</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-my-md">
          <div class="bg-grey-2 rounded-xl q-pa-xl column items-center justify-center border-subtle" style="min-height: 220px;">
            <q-icon name="qr_code_scanner" size="64px" color="vinotinto" class="q-mb-md animate-pulse" />
            <div class="text-weight-bold text-navy-dark">Apunta la cámara al carnet QR del estudiante</div>
            <div class="text-caption text-grey-6 q-mt-xs">El sistema detectará automáticamente los datos y marcará "Presente".</div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-px-md q-pb-md">
          <q-btn unelevated label="Simular Lectura Exitosa (Mock)" color="vinotinto" @click="simularLecturaQR" class="text-weight-bold q-px-md full-width" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const materiaId = route.params.id || '101';
const dialogQR = ref(false);

const columns = [
  { name: 'nombre', label: 'ESTUDIANTE', field: 'nombre', align: 'left', sortable: true },
  { name: 'qrStatus', label: 'CÓDIGO QR / CARNET', field: 'codigoQR', align: 'center' },
  { name: 'estado', label: 'ESTADO DE ASISTENCIA', field: 'estado', align: 'left' }
];

// Opciones de asistencia requeridas por la rúbrica
const opcionesAsistencia = [
  { label: 'Presente', value: 'Presente' },
  { label: 'Ausente', value: 'Ausente' },
  { label: 'Tardanza', value: 'Tardanza' },
  { label: 'Justificado', value: 'Justificado' }
];

// Nómina mock de estudiantes
const estudiantes = ref([
  { id: 1, nombre: 'Ana Sofía Pérez', email: 'ana.perez@universidad.edu', codigoQR: 'QR-EST-8842', estado: 'Presente' },
  { id: 2, nombre: 'Carlos Eduardo Gómez', email: 'carlos.gomez@universidad.edu', codigoQR: 'QR-EST-9310', estado: 'Ausente' },
  { id: 3, nombre: 'María Alejandra Díaz', email: 'maria.diaz@universidad.edu', codigoQR: 'QR-EST-1045', estado: 'Presente' }
]);

const abrirEscanerQR = () => {
  dialogQR.value = true;
};

// Simulación de lo que hará el escáner al enviar el QR al backend
const simularLecturaQR = () => {
  dialogQR.value = false;
  
  // Simulamos que el primer estudiante ausente pasa su QR exitosamente
  const estudianteEncontrado = estudiantes.value.find(e => e.estado === 'Ausente');
  if (estudianteEncontrado) {
    estudianteEncontrado.estado = 'Presente';
  }

  $q.notify({
    color: 'navy-dark',
    textColor: 'white',
    message: '¡QR escaneado con éxito! Asistencia registrada.',
    icon: 'verified',
    position: 'top'
  });
};

const guardarAsistencia = () => {
  $q.notify({
    color: 'navy-dark',
    textColor: 'white',
    message: '¡Nómina de asistencia guardada correctamente (Modo Local)!',
    icon: 'check_circle',
    position: 'top'
  });
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