from django.db import models
from maestros.models import Comuna, Zona, Distrito, Grupo, EstadoCivil, Cargo, Nivel, Rama, Alimentacion
from usuarios.models import Usuario
# from preinscripcion.models import Inscripcion # Evitar importación circular

# Create your models here.

class Persona(models.Model):
    """
    Modelo que representa a una persona en el sistema, consolidando su información personal,
    de contacto y scout.
    """
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    ROL_PERSONA_CHOICES = [
        ('participante', 'Participante'),
        ('apoyo_formadores', 'Apoyo de Formadores'),
        ('formador', 'Formador'),
        ('equipo_servicio', 'Equipo de Servicio'),
        ('organizador', 'Organizador'),
        ('salud', 'Salud'),
        ('otro', 'Otro'),
    ]

    id = models.AutoField(primary_key=True, db_column='per_id')
    usuario = models.OneToOneField(Usuario, on_delete=models.SET_NULL, null=True, blank=True, db_column='usu_id')
    
    # Información personal
    rut = models.CharField(max_length=12, unique=True, help_text="RUN de la persona en formato XXXXXXXX-X")
    nombres = models.CharField(max_length=50, db_column='per_nombres')
    apellido_paterno = models.CharField(max_length=50, db_column='per_apelpat')
    apellido_materno = models.CharField(max_length=50, null=True, blank=True, db_column='per_apelmat')
    fecha_nacimiento = models.DateField(db_column='per_fecha_nac')
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, null=True, blank=True)
    
    # Contacto
    email = models.EmailField(max_length=100, unique=True, db_column='per_email')
    telefono = models.CharField(max_length=15, null=True, blank=True, help_text="Número de teléfono normalizado (+56XXXXXXXXX)")
    
    # Dirección y Territorio
    direccion = models.CharField(max_length=255, db_column='per_direccion')
    comuna = models.ForeignKey(Comuna, on_delete=models.SET_NULL, null=True, blank=True, db_column='com_id')
    zona = models.ForeignKey(Zona, on_delete=models.SET_NULL, null=True, blank=True, db_column='zona_id')
    distrito = models.ForeignKey(Distrito, on_delete=models.SET_NULL, null=True, blank=True, db_column='distrito_id')
    grupo = models.ForeignKey(Grupo, on_delete=models.SET_NULL, null=True, blank=True, db_column='grupo_id')

    # Información Scout y Personal Adicional
    rol_persona = models.CharField(max_length=50, choices=ROL_PERSONA_CHOICES, null=True, blank=True)
    apodo_credencial = models.CharField(max_length=50, db_column='per_apodo')
    profesion = models.CharField(max_length=100, null=True, blank=True, db_column='per_profesion')
    estado_civil = models.ForeignKey(EstadoCivil, on_delete=models.SET_NULL, null=True, blank=True, db_column='esc_id')
    religion = models.CharField(max_length=50, null=True, blank=True, db_column='per_religion')
    tiempo_en_unidad = models.IntegerField(null=True, blank=True, help_text="Tiempo en la unidad en meses")
    mmaa_numero = models.CharField(max_length=50, null=True, blank=True, help_text="Número MMAA si aplica")
    
    # Salud y Alimentación
    alimentacion_tipo = models.ForeignKey(Alimentacion, on_delete=models.SET_NULL, null=True, blank=True, db_column='alimentacion_tipo_id')
    alergias = models.TextField(null=True, blank=True, db_column='per_alergia_enfermedad')
    limitacion_fisica = models.TextField(null=True, blank=True, db_column='per_limitacion')
    
    # Contacto de Emergencia
    nombre_emergencia = models.CharField(max_length=50, null=True, blank=True, db_column='per_nom_emergencia')
    fono_emergencia = models.CharField(max_length=15, null=True, blank=True, db_column='per_fono_emergencia')

    # Otros
    observaciones = models.TextField(null=True, blank=True, db_column='per_otros')
    foto_url = models.TextField(null=True, blank=True, db_column='per_foto')
    vigente = models.BooleanField(default=True, db_column='per_vigente')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellido_paterno} {self.apellido_materno or ''}".strip()

    class Meta:
        db_table = 'persona'
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'

    def __str__(self):
        return self.nombre_completo


class Vehiculo(models.Model):
    """Vehículos asociados a una persona."""
    id = models.AutoField(primary_key=True, db_column='pev_id')
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, related_name='vehiculos', db_column='per_id')
    patente = models.CharField(max_length=10, db_column='pev_patente')
    marca = models.CharField(max_length=50, db_column='pev_marca')
    modelo = models.CharField(max_length=50, db_column='pev_modelo')
    anio = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'persona_vehiculo'
        verbose_name = 'Vehículo'
        verbose_name_plural = 'Vehículos'

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.patente})"


class PersonaDocumento(models.Model):
    """Documentos asociados a una persona, como la ficha médica."""
    TIPO_DOCUMENTO_CHOICES = [
        ('ficha_medica', 'Ficha Médica'),
        ('dni', 'Documento de Identidad'),
        ('otro', 'Otro'),
    ]

    id = models.AutoField(primary_key=True)
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, related_name='documentos')
    # inscripcion = models.ForeignKey(Inscripcion, on_delete=models.SET_NULL, null=True, blank=True, related_name='documentos')
    
    tipo_documento = models.CharField(max_length=50, choices=TIPO_DOCUMENTO_CHOICES)
    numero = models.CharField(max_length=100, blank=True, null=True)
    file_path = models.CharField(max_length=255, help_text="Ruta en el storage (ej. S3)")
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="Tamaño en bytes")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Documento de Persona'
        verbose_name_plural = 'Documentos de Personas'

    def __str__(self):
        return f"{self.get_tipo_documento_display()} de {self.persona.nombre_completo}"

# --- Modelos existentes (revisados para consistencia) ---

class PersonaGrupo(models.Model):
    id = models.AutoField(primary_key=True, db_column='peg_id')
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE, db_column='gru_id')
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    vigente = models.BooleanField(default=True, db_column='peg_vigente')

    class Meta:
        db_table = 'persona_grupo'
        verbose_name = 'Persona en Grupo'
        verbose_name_plural = 'Personas en Grupos'
        unique_together = ('grupo', 'persona')

    def __str__(self):
        return f"{self.persona} en {self.grupo}"


class PersonaNivel(models.Model):
    id = models.AutoField(primary_key=True, db_column='pen_id')
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE, db_column='niv_id')
    rama = models.ForeignKey(Rama, on_delete=models.CASCADE, db_column='ram_id')

    class Meta:
        db_table = 'persona_nivel'
        verbose_name = 'Persona Nivel'
        verbose_name_plural = 'Personas Niveles'
        unique_together = ('persona', 'nivel', 'rama')

    def __str__(self):
        return f"{self.persona} - {self.nivel} ({self.rama})"


class PersonaFormador(models.Model):
    id = models.AutoField(primary_key=True, db_column='pef_id')
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    hab_1 = models.BooleanField(default=False, db_column='pef_hab_1')
    hab_2 = models.BooleanField(default=False, db_column='pef_hab_2')
    verificado = models.BooleanField(default=False, db_column='pef_verif')
    historial = models.TextField(null=True, blank=True, db_column='pef_historial')

    class Meta:
        db_table = 'persona_formador'
        verbose_name = 'Persona Formador'
        verbose_name_plural = 'Personas Formadores'

    def __str__(self):
        return f"Formador: {self.persona}"


class PersonaIndividual(models.Model):
    id = models.AutoField(primary_key=True, db_column='pei_id')
    persona = models.ForeignKey(Persona, on_delete=models.CASCADE, db_column='per_id')
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, db_column='car_id')
    distrito = models.ForeignKey(Distrito, on_delete=models.CASCADE, db_column='dis_id', null=True, blank=True)
    zona = models.ForeignKey(Zona, on_delete=models.CASCADE, db_column='zon_id', null=True, blank=True)
    vigente = models.BooleanField(default=True, db_column='pei_vigente')

    class Meta:
        db_table = 'persona_individual'
        verbose_name = 'Persona Individual'
        verbose_name_plural = 'Personas Individuales'

    def __str__(self):
        return f"Individual: {self.persona} - Cargo: {self.cargo}"
