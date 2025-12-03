from django.test import TestCase
from django.utils import timezone
from pagos.models import PagoPersona
from personas.models import Persona
from cursos.models import Curso, TipoCurso
from usuarios.models import Usuario
from maestros.models import Perfil, EstadoCivil, Cargo
from geografia.models import Region, Provincia, Comuna
import time
from datetime import date

class PerformanceTestCase(TestCase):
    def setUp(self):
        # 1. Setup Dependencies
        self.perfil = Perfil.objects.create(pel_descripcion='Test Profile', pel_vigente=True)
        self.region = Region.objects.create(reg_descripcion='Test Region', reg_vigente=True)
        self.provincia = Provincia.objects.create(pro_descripcion='Test Prov', reg_id=self.region, pro_vigente=True)
        self.comuna = Comuna.objects.create(com_descripcion='Test Comuna', pro_id=self.provincia, com_vigente=True)
        self.estado_civil = EstadoCivil.objects.create(esc_descripcion='Soltero', esc_vigente=True)
        self.tipo_curso = TipoCurso.objects.create(tcu_descripcion='Test Tipo', tcu_tipo=1, tcu_vigente=True)
        self.cargo = Cargo.objects.create(car_descripcion='Test Cargo', car_vigente=True)

        # 2. Setup User
        self.usuario = Usuario.objects.create(
            pel_id=self.perfil,
            usu_username='testuser',
            usu_email='test@example.com',
            usu_password='pass',
            usu_vigente=True
        )

        # 3. Setup Responsable
        self.responsable = Persona.objects.create(
            per_run=88888888,
            per_dv='8',
            per_nombres='Resp',
            per_apelpat='Onsable',
            per_email='resp@test.com',
            esc_id=self.estado_civil,
            com_id=self.comuna,
            usu_id=self.usuario,
            per_fecha_nac=date(1980, 1, 1),
            per_direccion='Dir',
            per_tipo_fono=1,
            per_fono='123',
            per_vigente=True
        )

        # 4. Setup Curso
        self.curso = Curso.objects.create(
            cur_codigo='CUR-PERF',
            cur_descripcion='Curso Test Rendimiento',
            usu_id=self.usuario,
            tcu_id=self.tipo_curso,
            per_id_responsable=self.responsable,
            car_id_responsable=self.cargo,
            cur_fecha_solicitud=timezone.now(),
            cur_administra=1,
            cur_cuota_con_almuerzo=10000,
            cur_cuota_sin_almuerzo=9000,
            cur_modalidad=1,
            cur_tipo_curso=1,
            cur_estado=1
        )
        
        # 5. Create 100 personas para pruebas masivas
        self.personas = []
        for i in range(100):
            p = Persona.objects.create(
                per_run=10000000 + i,
                per_dv='K',
                per_nombres=f'Persona {i}',
                per_apelpat=f'Apellido {i}',
                per_email=f'persona{i}@test.com',
                esc_id=self.estado_civil,
                com_id=self.comuna,
                usu_id=self.usuario,
                per_fecha_nac=date(2000, 1, 1),
                per_direccion='Calle Test',
                per_tipo_fono=1,
                per_fono='99999999',
                per_vigente=True
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

