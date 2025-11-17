"""
Utilidades compartidas para testing en GIC
Evita duplicación de código y facilita la creación de datos de prueba
"""
from datetime import datetime, date, timedelta
from decimal import Decimal
from django.contrib.auth.models import User

from usuarios.models import Usuario
from maestros.models import (
    Perfil, EstadoCivil, Cargo, Nivel, Rama, Rol,
    TipoArchivo, TipoCurso, Alimentacion, ConceptoContable
)
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo
from personas.models import Persona, PersonaCurso, PersonaEstadoCurso
from cursos.models import Curso, CursoSeccion, CursoFecha, CursoCuota
from pagos.models import PagoPersona, ComprobantePago


class TestDataFactory:
    """Factory para crear datos de prueba consistentes"""
    
    @staticmethod
    def create_perfil(descripcion='Test Profile'):
        """Crear perfil de prueba"""
        return Perfil.objects.create(
            pel_descripcion=descripcion,
            pel_vigente=True
        )
    
    @staticmethod
    def create_usuario(perfil=None, username='testuser', email='test@example.com'):
        """Crear usuario de prueba"""
        if perfil is None:
            perfil = TestDataFactory.create_perfil()
        
        usuario = Usuario.objects.create(
            pel_id=perfil,
            usu_username=username,
            usu_email=email,
            usu_vigente=True
        )
        usuario.set_password('testpass123')
        usuario.save()
        return usuario
    
    @staticmethod
    def create_django_user(username='testuser', email='test@example.com', password='testpass123'):
        """Crear Django User para autenticación"""
        return User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
    
    @staticmethod
    def create_geografia():
        """Crear geografía completa (región, provincia, comuna)"""
        region = Region.objects.create(
            reg_descripcion='Región de Prueba',
            reg_vigente=True
        )
        provincia = Provincia.objects.create(
            reg_id=region,
            pro_descripcion='Provincia de Prueba',
            pro_vigente=True
        )
        comuna = Comuna.objects.create(
            pro_id=provincia,
            com_descripcion='Comuna de Prueba',
            com_vigente=True
        )
        return {
            'region': region,
            'provincia': provincia,
            'comuna': comuna
        }
    
    @staticmethod
    def create_zona_distrito_grupo(geografia=None):
        """Crear estructura scout (zona, distrito, grupo)"""
        if geografia is None:
            geografia = TestDataFactory.create_geografia()
        
        zona = Zona.objects.create(
            zon_descripcion='Zona de Prueba',
            zon_vigente=True
        )
        distrito = Distrito.objects.create(
            zon_id=zona,
            dis_descripcion='Distrito de Prueba',
            dis_vigente=True
        )
        grupo = Grupo.objects.create(
            dis_id=distrito,
            com_id=geografia['comuna'],
            gru_descripcion='Grupo Scout de Prueba',
            gru_vigente=True
        )
        return {
            'zona': zona,
            'distrito': distrito,
            'grupo': grupo
        }
    
    @staticmethod
    def create_estado_civil(descripcion='Soltero'):
        """Crear estado civil"""
        return EstadoCivil.objects.create(
            esc_descripcion=descripcion,
            esc_vigente=True
        )
    
    @staticmethod
    def create_persona(usuario=None, geografia=None, estado_civil=None, **kwargs):
        """Crear persona de prueba con todos los campos requeridos"""
        if usuario is None:
            usuario = TestDataFactory.create_usuario()
        if geografia is None:
            geografia = TestDataFactory.create_geografia()
        if estado_civil is None:
            estado_civil = TestDataFactory.create_estado_civil()
        
        defaults = {
            'usu_id': usuario,
            'esc_id': estado_civil,
            'com_id': geografia['comuna'],
            'per_run': '12345678-9',
            'per_nombres': 'Juan',
            'per_apelpat': 'Pérez',
            'per_apelmat': 'González',
            'per_sexo': 'M',
            'per_fnac': date(1990, 1, 1),
            'per_email': 'juan.perez@example.com',
            'per_fono': '912345678',
            'per_vigente': True
        }
        defaults.update(kwargs)
        
        return Persona.objects.create(**defaults)
    
    @staticmethod
    def create_tipo_curso(descripcion='Formación'):
        """Crear tipo de curso"""
        return TipoCurso.objects.create(
            tic_descripcion=descripcion,
            tic_vigente=True
        )
    
    @staticmethod
    def create_curso(tipo_curso=None, usuario=None, geografia=None, **kwargs):
        """Crear curso de prueba"""
        if tipo_curso is None:
            tipo_curso = TestDataFactory.create_tipo_curso()
        if usuario is None:
            usuario = TestDataFactory.create_usuario()
        if geografia is None:
            geografia = TestDataFactory.create_geografia()
        
        defaults = {
            'tic_id': tipo_curso,
            'usu_id': usuario,
            'com_id_lugar': geografia['comuna'],
            'cur_codigo': 'TEST001',
            'cur_descripcion': 'Curso de Prueba',
            'cur_lugar': 'Sede Central',
            'cur_fecha_solicitud': datetime.now(),
            'cur_estado': 1,
            'cur_vigente': True
        }
        defaults.update(kwargs)
        
        return Curso.objects.create(**defaults)
    
    @staticmethod
    def create_curso_seccion(curso=None, **kwargs):
        """Crear sección de curso"""
        if curso is None:
            curso = TestDataFactory.create_curso()
        
        defaults = {
            'cur_id': curso,
            'cus_descripcion': 'Sección A',
            'cus_cant_participante': 30,
            'cus_vigente': True
        }
        defaults.update(kwargs)
        
        return CursoSeccion.objects.create(**defaults)
    
    @staticmethod
    def create_curso_fecha(curso=None, **kwargs):
        """Crear fecha de curso"""
        if curso is None:
            curso = TestDataFactory.create_curso()
        
        defaults = {
            'cur_id': curso,
            'cuf_fecha_inicio': date.today(),
            'cuf_fecha_fin': date.today() + timedelta(days=3),
            'cuf_vigente': True
        }
        defaults.update(kwargs)
        
        return CursoFecha.objects.create(**defaults)
    
    @staticmethod
    def create_persona_curso(persona=None, seccion=None, **kwargs):
        """Crear inscripción de persona a curso"""
        if persona is None:
            persona = TestDataFactory.create_persona()
        if seccion is None:
            seccion = TestDataFactory.create_curso_seccion()
        
        defaults = {
            'per_id': persona,
            'cus_id': seccion,
            'pec_registro': True
        }
        defaults.update(kwargs)
        
        return PersonaCurso.objects.create(**defaults)
    
    @staticmethod
    def create_pago_persona(persona=None, curso=None, usuario=None, **kwargs):
        """Crear pago de persona"""
        if persona is None:
            persona = TestDataFactory.create_persona()
        if curso is None:
            curso = TestDataFactory.create_curso()
        if usuario is None:
            usuario = persona.usu_id
        
        defaults = {
            'per_id': persona,
            'cur_id': curso,
            'usu_id': usuario,
            'pap_fecha_hora': datetime.now(),
            'pap_tipo': 1,  # Ingreso
            'pap_valor': Decimal('50000.00'),
            'pap_observacion': 'Pago de prueba'
        }
        defaults.update(kwargs)
        
        return PagoPersona.objects.create(**defaults)
    
    @staticmethod
    def create_rama(descripcion='Scouts'):
        """Crear rama"""
        return Rama.objects.create(
            ram_descripcion=descripcion,
            ram_vigente=True
        )
    
    @staticmethod
    def create_rol(descripcion='Dirigente'):
        """Crear rol"""
        return Rol.objects.create(
            rol_descripcion=descripcion,
            rol_vigente=True
        )
    
    @staticmethod
    def create_nivel(descripcion='Básico'):
        """Crear nivel"""
        return Nivel.objects.create(
            niv_descripcion=descripcion,
            niv_vigente=True
        )
    
    @staticmethod
    def create_alimentacion(descripcion='Omnívoro'):
        """Crear alimentación"""
        return Alimentacion.objects.create(
            ali_descripcion=descripcion,
            ali_vigente=True
        )


class AssertionHelpers:
    """Helpers para assertions comunes en tests"""
    
    @staticmethod
    def assert_valid_api_response(response, allowed_statuses):
        """Verificar que la respuesta API es válida"""
        assert response.status_code in allowed_statuses, (
            f"Status code {response.status_code} not in {allowed_statuses}"
        )
    
    @staticmethod
    def assert_model_created(model_instance):
        """Verificar que el modelo fue creado"""
        assert model_instance is not None
        assert model_instance.pk is not None
    
    @staticmethod
    def assert_contains_fields(data, fields):
        """Verificar que el diccionario contiene los campos"""
        for field in fields:
            assert field in data, f"Campo '{field}' no encontrado en {list(data.keys())}"
    
    @staticmethod
    def assert_datetime_recent(dt, max_seconds=60):
        """Verificar que el datetime es reciente"""
        if isinstance(dt, str):
            from django.utils.dateparse import parse_datetime
            dt = parse_datetime(dt)
        
        now = datetime.now()
        if dt.tzinfo is not None:
            from django.utils import timezone
            now = timezone.now()
        
        diff = abs((now - dt).total_seconds())
        assert diff < max_seconds, f"Datetime {dt} no es reciente (diff: {diff}s)"


def get_api_endpoints():
    """Retorna los endpoints API conocidos del sistema"""
    return {
        'auth': {
            'login': '/api/auth/login/',
            'logout': '/api/auth/logout/',
            'refresh': '/api/auth/token/refresh/',
            'register': '/api/auth/register/',
        },
        'usuarios': {
            'list': '/api/usuarios/',
            'dashboard_stats': '/api/usuarios/dashboard/stats/',
            'dashboard_payment_stats': '/api/usuarios/dashboard/payment-stats/',
        },
        'cursos': {
            'list': '/api/cursos/',
            'fechas': '/api/cursos-fechas/',
            'secciones': '/api/cursos-secciones/',
        },
        'personas': {
            'list': '/api/personas/',
            'inscripciones': '/api/inscripciones/',
        },
        'pagos': {
            'list': '/api/pagos/',
        },
        'geografia': {
            'regiones': '/api/geografia/regiones/',
            'provincias': '/api/geografia/provincias/',
            'comunas': '/api/geografia/comunas/',
        }
    }
