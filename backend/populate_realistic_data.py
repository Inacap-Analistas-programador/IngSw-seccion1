
import os
import random
import django
from datetime import datetime, timedelta
from django.utils import timezone
from decimal import Decimal

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scout_project.settings')
django.setup()

from usuarios.models import Usuario
from maestros.models import Perfil, ConceptoContable, TipoCurso, Cargo, EstadoCivil
from geografia.models import Comuna, Region, Provincia
from cursos.models import Curso, CursoSeccion
from personas.models import Persona, PersonaCurso
from pagos.models import PagoPersona, ComprobantePago, PagoComprobante, PagoProveedor, Prepago, PagoCambioPersona
from proveedores.models import Proveedor

def clean_database():
    print("Limpiando base de datos...")
    PagoComprobante.objects.all().delete()
    ComprobantePago.objects.all().delete()
    PagoPersona.objects.all().delete()
    PagoProveedor.objects.all().delete()
    Prepago.objects.all().delete()
    PagoCambioPersona.objects.all().delete()
    PersonaCurso.objects.all().delete()
    CursoSeccion.objects.all().delete()
    Curso.objects.all().delete()
    Persona.objects.all().delete()
    Proveedor.objects.all().delete()
    ConceptoContable.objects.all().delete()
    TipoCurso.objects.all().delete()
    Cargo.objects.all().delete()
    EstadoCivil.objects.all().delete()
    Usuario.objects.all().delete()
    Perfil.objects.all().delete()
    print("Datos eliminados.")

def create_master_data():
    print("Creando Datos Maestros...")
    
    # 1. Conceptos
    conceptos_data = [
        ('Cuota Anual', 1), # 1: Ingreso
        ('Cuota Mensual', 1),
        ('Venta de Uniformes', 1),
        ('Donación', 1),
        ('Compra Materiales', 2), # 2: Egreso
        ('Arriendo Transporte', 2),
        ('Compra Alimentos', 2),
        ('Pago Servicios', 2),
    ]
    
    conceptos_map = {1: [], 2: []}
    for desc, tipo in conceptos_data:
        c = ConceptoContable.objects.create(
            coc_descripcion=desc,
            coc_vigente=True
        )
        conceptos_map[tipo].append(c)
    
    # 2. Dependencies (Profile & User)
    perfil, _ = Perfil.objects.get_or_create(
        pel_descripcion='Administrador', 
        defaults={'pel_vigente': True}
    )
    
    admin_user = Usuario.objects.filter(usu_email='admin@scouts.cl').first()
    if not admin_user:
        print("Creando usuario admin...")
        admin_user = Usuario(
            pel_id=perfil,
            usu_username='admin',
            usu_email='admin@scouts.cl',
            usu_vigente=True
        )
        admin_user.set_password('admin123')
        admin_user.save()
        
    tipo_curso = TipoCurso.objects.create(
        tcu_descripcion='Presencial',
        tcu_tipo=1,
        tcu_vigente=True
    )
    
    cargo = Cargo.objects.create(
        car_descripcion='Responsable de Unidad',
        car_vigente=True
    )
    
    estado_civil = EstadoCivil.objects.create(
        esc_descripcion='Soltero',
        esc_vigente=True
    )
    
    # Geography Creation
    comuna = Comuna.objects.first()
    if not comuna:
        print("Creando datos geográficos por defecto...")
        region = Region.objects.create(
            reg_descripcion='Metropolitana',
            reg_vigente=True
        )
        provincia = Provincia.objects.create(
            reg_id=region,
            pro_descripcion='Santiago',
            pro_vigente=True
        )
        comuna = Comuna.objects.create(
            pro_id=provincia,
            com_descripcion='Providencia',
            com_vigente=True
        )
            
    # Dummy Responsible Person for Course
    responsable = Persona.objects.create(
        esc_id=estado_civil,
        com_id=comuna,
        usu_id=admin_user,
        per_nombres='Jefe',
        per_apelpat='Responsable',
        per_run=11111111,
        per_dv='1',
        per_email='jefe@scout.cl',
        per_fecha_nac=timezone.now() - timedelta(days=365*30),
        per_direccion='Sede',
        per_tipo_fono=1,
        per_fono='99999999',
        per_apodo='Akela',
        per_vigente=True
    )

    # 3. Cursos
    cursos_list = [
        ('Manada', 'M001'),
        ('Tropa', 'T001'),
        ('Compañía', 'C001'),
        ('Avanzada', 'A001'),
        ('Clan', 'K001'),
    ]
    
    cursos_objs = []
    for desc, cod in cursos_list:
        c = Curso.objects.create(
            usu_id=admin_user, 
            tcu_id=tipo_curso,
            per_id_responsable=responsable,
            car_id_responsable=cargo,
            com_id_lugar=comuna,
            cur_fecha_solicitud=timezone.now(),
            cur_codigo=cod,
            cur_descripcion=desc,
            cur_administra=1,
            cur_cuota_con_almuerzo=Decimal('15000'),
            cur_cuota_sin_almuerzo=Decimal('10000'),
            cur_modalidad=1,
            cur_tipo_curso=1,
            cur_estado=1,
            cur_lugar="Sede Scout Principal",
            cur_latitud=Decimal('-33.4372'),
            cur_longitud=Decimal('-70.6506')
        )
        CursoSeccion.objects.create(
            cur_id=c,
            cus_seccion=1,
            cus_cant_participante=30
        )
        cursos_objs.append(c)
        
    return conceptos_map, cursos_objs, estado_civil, comuna, admin_user

def create_people(estado_civil, comuna, admin_user):
    print("Creando Personas...")
    nombres = ['Juan', 'Pedro', 'Maria', 'Ana', 'Luis', 'Sofia', 'Carlos', 'Elena', 'Diego', 'Valentina', 'Jose', 'Camila', 'Felipe', 'Isabella', 'Miguel', 'Agustina', 'Javier', 'Florencia', 'Francisco', 'Martina']
    apellidos = ['Perez', 'Gonzalez', 'Rodriguez', 'Lopez', 'Martinez', 'Garcia', 'Silva', 'Rojas', 'Torres', 'Diaz', 'Soto', 'Vargas', 'Romero', 'Castro', 'Pizarro', 'Muñoz', 'Morales', 'Flores', 'Herrera', 'Jara']
    
    personas = []
    for i in range(50):
        nombre = random.choice(nombres)
        apellido = random.choice(apellidos)
        rut_num = random.randint(10000000, 25000000)
        dv = str(random.randint(0, 9))
        email = f"{nombre.lower()}.{apellido.lower()}{i}@example.com"
        
        p = Persona.objects.create(
            esc_id=estado_civil,
            com_id=comuna,
            usu_id=admin_user,
            per_nombres=nombre,
            per_apelpat=apellido,
            per_apelmat=random.choice(apellidos),
            per_run=rut_num,
            per_dv=dv,
            per_email=email,
            per_fecha_nac=timezone.now() - timedelta(days=random.randint(365*7, 365*25)),
            per_direccion='Calle Falsa 123',
            per_tipo_fono=1,
            per_fono='912345678',
            per_apodo=nombre[:3],
            per_vigente=True
        )
        personas.append(p)
    return personas

def register_enrollments(personas, cursos):
    print("Inscribiendo personas en cursos...")
    # Import Rol if not imported
    from maestros.models import Rol, Alimentacion
    
    # Needs Rol and Alimentacion
    rol = Rol.objects.create(rol_descripcion='Participante', rol_tipo=1, rol_vigente=True)
    alim = Alimentacion.objects.create(ali_descripcion='Normal', ali_tipo=1, ali_vigente=True)
    
    for p in personas:
        if random.random() < 0.8:
            curso = random.choice(cursos)
            seccion = CursoSeccion.objects.filter(cur_id=curso).first()
            PersonaCurso.objects.create(
                per_id=p,
                cus_id=seccion,
                rol_id=rol,
                ali_id=alim,
                pec_registro=True,
                pec_acreditado=True
            )

def create_payments(personas, cursos, conceptos_map, admin_user):
    print("Generando Pagos...")
    
    start_date = timezone.now() - timedelta(days=180)
    
    ingresos_conceptos = conceptos_map[1]
    egresos_conceptos = conceptos_map[2]
    
    # 1. Ingresos
    for _ in range(150):
        persona = random.choice(personas)
        concepto = random.choice(ingresos_conceptos) if ingresos_conceptos else None
        
        days_offset = random.randint(0, 180)
        pay_date = start_date + timedelta(days=days_offset)
        
        enrollment = PersonaCurso.objects.filter(per_id=persona).first()
        curso = enrollment.cus_id.cur_id if enrollment else random.choice(cursos)
        
        monto = random.randint(5000, 50000)
        monto = (monto // 1000) * 1000
        
        PagoPersona.objects.create(
            per_id=persona,
            cur_id=curso,
            pap_fecha_hora=pay_date,
            pap_valor=monto,
            pap_tipo=1, # Ingreso
            pap_estado=1,
            pap_observacion=concepto.coc_descripcion if concepto else "Pago vario",
            usu_id=admin_user
        )

    # 2. Egresos
    for _ in range(30):
        persona = random.choice(personas)
        concepto = random.choice(egresos_conceptos) if egresos_conceptos else None
        
        days_offset = random.randint(0, 180)
        pay_date = start_date + timedelta(days=days_offset)
        curso = random.choice(cursos)
        
        monto = random.randint(10000, 200000)
        monto = (monto // 1000) * 1000
        
        PagoPersona.objects.create(
            per_id=persona,
            cur_id=curso,
            pap_fecha_hora=pay_date,
            pap_valor=monto,
            pap_tipo=2, # Egreso
            pap_estado=1,
            pap_observacion=f"Gasto: {concepto.coc_descripcion}" if concepto else "Gasto vario",
            usu_id=admin_user
        )
        
    print("Pagos generados exitosamente.")

if __name__ == '__main__':
    try:
        clean_database()
        conceptos_map, cursos, estado_civil, comuna, admin_user = create_master_data()
        personas = create_people(estado_civil, comuna, admin_user)
        register_enrollments(personas, cursos)
        create_payments(personas, cursos, conceptos_map, admin_user)
        print("\n=== PROCESO TERMINADO CON ÉXITO ===")
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
