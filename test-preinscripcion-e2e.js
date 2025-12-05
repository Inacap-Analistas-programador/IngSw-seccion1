/**
 * Script de Testeo E2E (End-to-End) para Preinscripción
 * 
 * Este script prueba el flujo completo de preinscripción:
 * 1. Backend: API endpoints de personas y preinscripción
 * 2. Frontend: Formulario wizard completo
 * 
 * Uso:
 *   node test-preinscripcion-e2e.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuración
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Colores para console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✖ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}`)
};

// Datos de prueba
const testData = {
  persona: {
    per_run: '12345678',
    per_dv: '9',
    per_nombres: 'Juan Andrés',
    per_apelpat: 'Pérez',
    per_apelmat: 'González',
    per_email: `test-${Date.now()}@example.com`,
    per_fecha_nac: '1990-05-15',
    per_direccion: 'Calle Principal 123',
    per_tipo_fono: 2, // móvil
    per_fono: '+56912345678',
    per_profesion: 'Ingeniero',
    per_religion: 'Católica',
    per_num_mmaa: '12345',
    per_apodo: 'Juanito',
    per_alergia_enfermedad: 'Ninguna',
    per_limitacion: 'Ninguna',
    per_nom_emergencia: 'María González',
    per_fono_emergencia: '+56987654321',
    per_otros: 'Observaciones de prueba',
    per_tiempo_nnaj: '2 años',
    per_tiempo_adulto: '1 año',
    per_vigente: true,
    per_es_formador: false,
    per_hab_1: false,
    per_hab_2: false,
    per_verificacion: false,
    per_historial: ''
  },
  preinscripcion: {
    estado: 'enviado'
  }
};

// Contadores de tests
let testsTotal = 0;
let testsPassed = 0;
let testsFailed = 0;

// Helper para ejecutar tests
async function runTest(name, testFn) {
  testsTotal++;
  log.test(`Test: ${name}`);
  try {
    await testFn();
    testsPassed++;
    log.success(`PASS: ${name}`);
    return true;
  } catch (error) {
    testsFailed++;
    log.error(`FAIL: ${name}`);
    log.error(`  Error: ${error.message}`);
    if (error.response?.data) {
      log.error(`  Response: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 1. Test de Backend - API de Personas
async function testBackendPersonasAPI() {
  log.info('\n=== TESTEO DE BACKEND - API DE PERSONAS ===\n');

  let personaId = null;

  // Test 1.1: Crear persona
  await runTest('Crear nueva persona en backend', async () => {
    const response = await axios.post(`${BACKEND_URL}/api/personas/personas/`, testData.persona);
    
    if (!response.data) throw new Error('No response data');
    personaId = response.data.per_id || response.data.id;
    
    if (!personaId) throw new Error('No persona ID returned');
    log.info(`  → Persona creada con ID: ${personaId}`);
  });

  // Test 1.2: Buscar persona por RUT
  await runTest('Buscar persona por RUT', async () => {
    const rut = `${testData.persona.per_run}${testData.persona.per_dv}`;
    const response = await axios.get(`${BACKEND_URL}/api/personas/personas/search-by-rut/?rut=${rut}`);
    
    if (!response.data) throw new Error('No results found');
    
    const results = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data.results) ? response.data.results : [];
    
    if (results.length === 0) throw new Error('RUT not found');
    log.info(`  → Persona encontrada: ${results[0].per_nombres} ${results[0].per_apelpat}`);
  });

  // Test 1.3: Obtener persona por ID
  if (personaId) {
    await runTest('Obtener persona por ID', async () => {
      const response = await axios.get(`${BACKEND_URL}/api/personas/personas/${personaId}/`);
      
      if (!response.data) throw new Error('Persona not found');
      if (response.data.per_nombres !== testData.persona.per_nombres) {
        throw new Error('Persona data mismatch');
      }
      log.info(`  → Datos verificados correctamente`);
    });
  }

  // Test 1.4: Actualizar persona
  if (personaId) {
    await runTest('Actualizar datos de persona', async () => {
      const updatedData = {
        ...testData.persona,
        per_apodo: 'Juanito Actualizado'
      };
      
      const response = await axios.put(`${BACKEND_URL}/api/personas/personas/${personaId}/`, updatedData);
      
      if (!response.data) throw new Error('Update failed');
      if (response.data.per_apodo !== 'Juanito Actualizado') {
        throw new Error('Update not reflected');
      }
      log.info(`  → Persona actualizada correctamente`);
    });
  }

  return personaId;
}

// 2. Test de Backend - API de Preinscripción
async function testBackendPreinscripcionAPI(personaId, cursoId = 1) {
  log.info('\n=== TESTEO DE BACKEND - API DE PREINSCRIPCIÓN ===\n');

  let preinscripcionId = null;

  // Test 2.1: Crear preinscripción
  await runTest('Crear preinscripción', async () => {
    const response = await axios.post(`${BACKEND_URL}/api/preinscripcion/`, {
      persona: personaId,
      curso: cursoId,
      estado: testData.preinscripcion.estado
    });
    
    if (!response.data) throw new Error('No response data');
    preinscripcionId = response.data.id || response.data.pre_id;
    
    if (!preinscripcionId) throw new Error('No preinscripción ID returned');
    log.info(`  → Preinscripción creada con ID: ${preinscripcionId}`);
  });

  // Test 2.2: Obtener todas las preinscripciones
  await runTest('Listar preinscripciones', async () => {
    const response = await axios.get(`${BACKEND_URL}/api/preinscripcion/`);
    
    if (!response.data) throw new Error('No data returned');
    
    const results = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data.results) ? response.data.results : [];
    
    log.info(`  → Total de preinscripciones: ${results.length}`);
  });

  // Test 2.3: Obtener preinscripción por ID
  if (preinscripcionId) {
    await runTest('Obtener preinscripción por ID', async () => {
      const response = await axios.get(`${BACKEND_URL}/api/preinscripcion/${preinscripcionId}/`);
      
      if (!response.data) throw new Error('Preinscripción not found');
      log.info(`  → Estado: ${response.data.estado}`);
    });
  }

  // Test 2.4: Actualizar estado de preinscripción
  if (preinscripcionId) {
    await runTest('Actualizar estado de preinscripción', async () => {
      const response = await axios.patch(`${BACKEND_URL}/api/preinscripcion/${preinscripcionId}/`, {
        estado: 'aprobado'
      });
      
      if (!response.data) throw new Error('Update failed');
      if (response.data.estado !== 'aprobado') {
        throw new Error('Estado no actualizado');
      }
      log.info(`  → Estado actualizado a: aprobado`);
    });
  }

  return preinscripcionId;
}

// 3. Test de Integración - Flujo completo
async function testIntegrationFlow() {
  log.info('\n=== TESTEO DE INTEGRACIÓN - FLUJO COMPLETO ===\n');

  // Test 3.1: Verificar que frontend está corriendo
  await runTest('Frontend accesible', async () => {
    try {
      await axios.get(FRONTEND_URL, { timeout: 5000 });
      log.info(`  → Frontend corriendo en ${FRONTEND_URL}`);
    } catch (error) {
      throw new Error(`Frontend no accesible en ${FRONTEND_URL}`);
    }
  });

  // Test 3.2: Verificar endpoint de preinscripción del frontend
  await runTest('Ruta de preinscripción disponible', async () => {
    try {
      await axios.get(`${FRONTEND_URL}/preinscripcion`, { timeout: 5000 });
      log.info(`  → Ruta /preinscripcion accesible`);
    } catch (error) {
      throw new Error('Ruta de preinscripción no accesible');
    }
  });
}

// 4. Test de limpieza - Eliminar datos de prueba
async function cleanupTestData(personaId, preinscripcionId) {
  log.info('\n=== LIMPIEZA DE DATOS DE PRUEBA ===\n');

  if (preinscripcionId) {
    await runTest('Eliminar preinscripción de prueba', async () => {
      await axios.delete(`${BACKEND_URL}/api/preinscripcion/${preinscripcionId}/`);
      log.info(`  → Preinscripción ${preinscripcionId} eliminada`);
    });
  }

  if (personaId) {
    await runTest('Eliminar persona de prueba', async () => {
      await axios.delete(`${BACKEND_URL}/api/personas/personas/${personaId}/`);
      log.info(`  → Persona ${personaId} eliminada`);
    });
  }
}

// Función principal
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  SCRIPT DE TESTEO E2E - PREINSCRIPCIÓN');
  console.log('='.repeat(60) + '\n');
  
  log.info(`Backend URL: ${BACKEND_URL}`);
  log.info(`Frontend URL: ${FRONTEND_URL}\n`);

  let personaId = null;
  let preinscripcionId = null;

  try {
    // Ejecutar tests secuencialmente
    personaId = await testBackendPersonasAPI();
    
    if (personaId) {
      preinscripcionId = await testBackendPreinscripcionAPI(personaId);
    }
    
    await testIntegrationFlow();

    // Limpieza
    await cleanupTestData(personaId, preinscripcionId);

  } catch (error) {
    log.error(`Error crítico: ${error.message}`);
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('  RESUMEN DE TESTS');
  console.log('='.repeat(60));
  console.log(`  Total:  ${testsTotal}`);
  console.log(`  ${colors.green}Passed: ${testsPassed}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${testsFailed}${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  // Exit code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Ejecutar
if (require.main === module) {
  main().catch(error => {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runTest, testBackendPersonasAPI, testBackendPreinscripcionAPI };
