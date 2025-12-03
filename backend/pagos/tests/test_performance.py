from django.test import TestCase
from django.utils import timezone
from pagos.models import PagoPersona
from personas.models import Persona
from cursos.models import Curso
from usuarios.models import Usuario
import time

class PerformanceTestCase(TestCase):
    def setUp(self):
        # Crear datos base para las pruebas
        self.usuario = Usuario.objects.create(username='testuser', email='test@example.com')
        self.curso = Curso.objects.create(cur_descripcion='Curso Test Rendimiento', cur_vigente=True)
        
        # Crear 100 personas para pruebas masivas
        self.personas = []
        for i in range(100):
            p = Persona.objects.create(
                per_run=f'1111111{i}-9',
                per_nombres=f'Persona {i}',
                per_apelpat=f'Apellido {i}',
                per_email=f'persona{i}@test.com'
            )
            self.personas.append(p)

    def test_bulk_payment_creation_performance(self):
        """
        Prueba de rendimiento: Mide el tiempo que toma crear 1000 pagos.
        Meta: Menos de 2 segundos para 1000 registros simples.
        """
        start_time = time.time()
        
        pagos_to_create = []
        for i in range(1000):
            # Usamos modulo para asignar pagos a las 100 personas cíclicamente
            persona = self.personas[i % 100]
            pagos_to_create.append(
                PagoPersona(
                    per_id=persona,
                    cur_id=self.curso,
                    usu_id=self.usuario,
                    pap_fecha_hora=timezone.now(),
                    pap_tipo=1, # Ingreso
                    pap_valor=10000 + i,
                    pap_estado=1,
                    pap_observacion=f'Pago masivo test {i}'
                )
            )
        
        # Bulk create es mucho más eficiente que save() en loop
        PagoPersona.objects.bulk_create(pagos_to_create)
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"\n[PERFORMANCE] Tiempo para crear 1000 pagos: {duration:.4f} segundos")
        
        # Verificaciones
        self.assertEqual(PagoPersona.objects.count(), 1000)
        self.assertLess(duration, 2.0, "El rendimiento de inserción masiva es inferior al esperado (< 2s)")

    def test_dashboard_query_performance(self):
        """
        Prueba de rendimiento: Simula la carga del dashboard con 5000 registros históricos.
        """
        # 1. Poblar BD con 5000 registros
        pagos_batch = []
        for i in range(5000):
            pagos_batch.append(
                PagoPersona(
                    per_id=self.personas[0],
                    cur_id=self.curso,
                    usu_id=self.usuario,
                    pap_fecha_hora=timezone.now(),
                    pap_tipo=1,
                    pap_valor=5000,
                    pap_estado=1
                )
            )
        PagoPersona.objects.bulk_create(pagos_batch)
        
        # 2. Medir tiempo de consulta de agregación (SUM)
        start_time = time.time()
        
        from django.db.models import Sum
        total_ingresos = PagoPersona.objects.filter(pap_tipo=1).aggregate(Sum('pap_valor'))
        
        end_time = time.time()
        query_duration = end_time - start_time
        
        print(f"\n[PERFORMANCE] Tiempo para sumar 5000 pagos: {query_duration:.4f} segundos")
        
        self.assertIsNotNone(total_ingresos['pap_valor__sum'])
        self.assertLess(query_duration, 0.5, "La consulta de agregación es demasiado lenta")

