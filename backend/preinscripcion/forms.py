from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import Preinscripcion, CupoConfiguracion, PreinscripcionEstadoLog
from personas.models import Persona, Region, Provincia, Comuna, Grupo, Rol, Rama
from usuarios.models import Usuario
from maestros.models import EstadoCivil # Assuming EstadoCivil is in maestros
from archivos.models import Archivo # Assuming Archivo is in archivos
from .models import Documento # Import Documento model

# Re-using existing PersonaForm logic, but adapting for Preinscripcion context
class PreinscripcionPersonaForm(forms.ModelForm):
    # Campos para RUN y DV
    per_run = forms.IntegerField(label="RUN (sin dígito verificador)", required=True)
    per_dv = forms.CharField(label="Dígito Verificador", max_length=1, required=True)

    # Campos de texto y email
    per_nombres = forms.CharField(label="Nombres", max_length=50, required=True)
    per_apelpat = forms.CharField(label="Apellido Paterno", max_length=50, required=True)
    per_apelmat = forms.CharField(label="Apellido Materno", max_length=50, required=False)
    per_apodo = forms.CharField(label="Apodo (para credencial)", max_length=50, required=True)
    per_email = forms.EmailField(label="Correo Electrónico", max_length=100, required=True)
    per_fecha_nac = forms.DateField(label="Fecha de Nacimiento", widget=forms.DateInput(attrs={'type': 'date'}), required=True)
    per_direccion = forms.CharField(label="Dirección", max_length=255, required=True)

    # Campos de selección (ForeignKey)
    esc_id = forms.ModelChoiceField(queryset=EstadoCivil.objects.filter(esc_vigente=True), label="Estado Civil", required=True)
    reg_id = forms.ModelChoiceField(queryset=Region.objects.filter(reg_vigente=True), label="Región", required=True)

    # Define pro_id and com_id here with initial querysets.
    # The __init__ method will update these querysets dynamically.
    pro_id = forms.ModelChoiceField(queryset=Provincia.objects.none(), label="Provincia", required=True) # Initial empty queryset
    com_id = forms.ModelChoiceField(queryset=Comuna.objects.none(), label="Comuna", required=True) # Initial empty queryset

    # Campos de teléfono
    per_tipo_fono = forms.ChoiceField(
        label="Tipo de Teléfono",
        choices=[(1, 'Fijo'), (2, 'Celular'), (3, 'Celular/WhatsApp'), (4, 'WhatsApp')],
        widget=forms.RadioSelect,
        required=True
    )
    per_fono = forms.CharField(label="Número de Teléfono", max_length=15, required=True)

    # Campos opcionales de texto
    per_alergia_enfermedad = forms.CharField(label="Alergias o Enfermedades", widget=forms.Textarea, required=False)
    per_limitacion = forms.CharField(label="Limitaciones", widget=forms.Textarea, required=False)
    per_nom_emergencia = forms.CharField(label="Nombre Contacto de Emergencia", max_length=50, required=False)
    per_fono_emergencia = forms.CharField(label="Teléfono Contacto de Emergencia", max_length=15, required=False)
    per_otros = forms.CharField(label="Otros Datos Relevantes", widget=forms.Textarea, required=False)
    per_num_mmaa = forms.IntegerField(label="Número de Hijos/Menores a Cargo", required=False, min_value=0)
    per_profesion = forms.CharField(label="Profesión u Oficio", max_length=100, required=False)
    per_tiempo_nnaj = forms.CharField(label="Tiempo en situación de calle/vulnerabilidad", max_length=50, required=False)
    per_tiempo_adulto = forms.CharField(label="Tiempo como adulto responsable", max_length=50, required=False)
    per_religion = forms.CharField(label="Religión", max_length=50, required=False)

    # Campo de carga de archivo para ficha médica
    ficha_medica = forms.FileField(label="Ficha Médica (Obligatorio)", required=True)

    class Meta:
        model = Persona
        fields = [
            'per_run', 'per_dv', 'per_nombres', 'per_apelpat', 'per_apelmat', 'per_apodo',
            'per_email', 'per_fecha_nac', 'per_direccion', 'reg_id', 'pro_id', 'com_id', 'esc_id',
            'per_tipo_fono', 'per_fono', 'per_alergia_enfermedad', 'per_limitacion',
            'per_nom_emergencia', 'per_fono_emergencia', 'per_otros', 'per_num_mmaa',
            'per_profesion', 'per_tiempo_nnaj', 'per_tiempo_adulto', 'per_religion',
            'ficha_medica' # Added ficha_medica
        ]

    def clean_per_dv(self):
        per_run = self.cleaned_data.get('per_run')
        per_dv = self.cleaned_data.get('per_dv')

        if per_run is not None and per_dv:
            # Lógica para validar RUN y DV (reutilizando la del modelo Persona si está disponible o implementando aquí)
            dv_calculado = self.calcular_dv(per_run)
            if dv_calculado.upper() != per_dv.upper():
                raise ValidationError("El dígito verificador no es válido para el RUN ingresado.")
        return per_dv

    def calcular_dv(self, run):
        # Implementación simplificada del cálculo del dígito verificador
        if not run:
            return ''
        run_str = str(run)
        f = 2
        s = 0
        while run_str:
            s += int(run_str[-1]) * f
            run_str = run_str[:-1]
            f = 3 if f > 6 else f + 1
        dv = 11 - (s % 11)
        if dv == 11:
            return '0'
        elif dv == 10:
            return 'K'
        else:
            return str(dv)

    # Override __init__ to handle dynamic filtering of FKs
    def __init__(self, *args, **kwargs):
        # Extract reg_id and pro_id from kwargs if they are passed
        self.reg_id_param = kwargs.pop('reg_id', None)
        self.pro_id_param = kwargs.pop('pro_id', None)

        super().__init__(*args, **kwargs)

        # Access fields and explicitly declare their types to help Pylance
        pro_field: forms.ModelChoiceField = self.fields['pro_id']
        com_field: forms.ModelChoiceField = self.fields['com_id']

        # Filter Provincia queryset based on reg_id
        if self.reg_id_param:
            pro_field.queryset = Provincia.objects.filter(reg_id=self.reg_id_param, pro_vigente=True)
        else:
            pro_field.queryset = Provincia.objects.none()

        # Filter Comuna queryset based on pro_id
        if self.pro_id_param:
            com_field.queryset = Comuna.objects.filter(pro_id=self.pro_id_param, com_vigente=True)
        else:
            com_field.queryset = Comuna.objects.none()

        # Ensure required fields are marked as required in the form definition
        self.fields['per_run'].required = True
        self.fields['per_dv'].required = True
        self.fields['per_nombres'].required = True
        self.fields['per_apelpat'].required = True
        self.fields['per_apodo'].required = True
        self.fields['per_email'].required = True
        self.fields['per_fecha_nac'].required = True
        self.fields['per_direccion'].required = True
        self.fields['esc_id'].required = True
        self.fields['reg_id'].required = True
        self.fields['pro_id'].required = True
        self.fields['com_id'].required = True
        self.fields['per_tipo_fono'].required = True
        self.fields['per_fono'].required = True
        self.fields['ficha_medica'].required = True # Ensure ficha_medica is required

# Form for the main Preinscripcion details
class PreinscripcionForm(forms.ModelForm):
    # Campos relacionados con el curso y la inscripción
    curso = forms.ModelChoiceField(queryset=Curso.objects.filter(estado='published'), label="Curso", required=True)
    rama = forms.ModelChoiceField(queryset=Rama.objects.filter(ram_vigente=True), label="Rama", required=True)
    grupo_asignado = forms.ModelChoiceField(queryset=Grupo.objects.filter(gru_vigente=True), label="Grupo Scout", required=True)
    rol = forms.ModelChoiceField(queryset=Rol.objects.filter(rol_vigente=True), label="Rol en el Curso", required=True) # Assuming Rol is used for role in course

    # Campo para la cuota asignada (puede ser un campo de texto o un FK si hay modelo de cuotas)
    cuota_asignada = forms.CharField(label="Cuota Asignada", max_length=100, required=False)

    # Campo para el usuario que habilita (solo para validadores/admins)
    # Este campo no debería ser editable por el participante. Se manejará en la vista.
    # habilitado_por = forms.ModelChoiceField(queryset=Usuario.objects.filter(role__in=['organizador', 'validador_grupo', 'validador_distrito', 'validador_zona']), label="Validado Por", required=False)

    class Meta:
        model = Preinscripcion
        fields = ['curso', 'rama', 'grupo_asignado', 'rol', 'cuota_asignada']

    # Override __init__ to handle dynamic filtering of FKs based on selected curso
    def __init__(self, *args, **kwargs):
        # Extract curso_id and potentially persona_id if needed for initial data
        self.curso_id_param = kwargs.pop('curso_id', None)
        self.persona_id_param = kwargs.pop('persona_id', None) # Needed if we want to pre-fill persona data

        super().__init__(*args, **kwargs)

        # Access fields
        rama_field: forms.ModelChoiceField = self.fields['rama']
        grupo_field: forms.ModelChoiceField = self.fields['grupo_asignado']
        rol_field: forms.ModelChoiceField = self.fields['rol']

        # Filter Rama queryset based on selected curso (if available)
        if self.curso_id_param:
            # Assuming Curso has a relationship or way to determine valid Ramas
            # For now, we'll filter based on general availability
            rama_field.queryset = Rama.objects.filter(ram_vigente=True)
            grupo_field.queryset = Grupo.objects.filter(gru_vigente=True)
            rol_field.queryset = Rol.objects.filter(rol_vigente=True)
        else:
            # If no curso is selected yet, provide empty querysets or all valid ones
            rama_field.queryset = Rama.objects.filter(ram_vigente=True)
            grupo_field.queryset = Grupo.objects.filter(gru_vigente=True)
            rol_field.queryset = Rol.objects.filter(rol_vigente=True)

        # If persona_id is provided, we might want to pre-fill or validate
        if self.persona_id_param:
            try:
                persona = Persona.objects.get(id=self.persona_id_param)
                # Pre-fill some fields if possible, or use for validation
                # e.g., self.initial['rama'] = persona.rama_nivel
                # e.g., self.initial['grupo_asignado'] = persona.grupo
            except Persona.DoesNotExist:
                pass # Handle error if persona not found

# Form for CupoConfiguracion (likely for admin/organizer use)
class CupoConfiguracionForm(forms.ModelForm):
    class Meta:
        model = CupoConfiguracion
        fields = ['curso', 'rol', 'rama', 'cupo_total']

# Form for uploading documents (e.g., ficha_medica)
class DocumentoForm(forms.ModelForm):
    class Meta:
        model = Documento
        fields = ['archivo_relacionado', 'tipo_documento', 'numero', 'file_size', 'verified']
        # 'persona' and 'uploaded_at' will be set by the view

    # Customizing fields for better UX
    archivo_relacionado = forms.FileField(label="Archivo (PDF, DOC, DOCX, JPG, PNG)", required=True)
    tipo_documento = forms.ChoiceField(
        label="Tipo de Documento",
        choices=[
            ('ficha_medica', 'Ficha Médica'),
            ('dni', 'DNI'),
            ('otro', 'Otro')
        ],
        required=True
    )
    # 'verified' should not be editable by the uploader

# Form for Usuario (if needed separately, e.g., for admin creating users)
class UsuarioForm(forms.ModelForm):
    usu_username = forms.CharField(label="Nombre de Usuario", max_length=100, required=True)
    usu_password = forms.CharField(label="Contraseña", max_length=128, widget=forms.PasswordInput, required=True)
    usu_password_confirm = forms.CharField(label="Confirmar Contraseña", max_length=128, widget=forms.PasswordInput, required=True)
    # Assuming role is managed elsewhere or through a separate form/view
    # pel_id = forms.ModelChoiceField(queryset=Perfil.objects.filter(pel_vigente=True), label="Perfil", required=True)

    class Meta:
        model = Usuario
        fields = ['usu_username', 'usu_password'] # Exclude fields managed by Persona or defaults

    def clean_usu_password_confirm(self):
        password = self.cleaned_data.get("usu_password")
        password_confirm = self.cleaned_data.get("usu_password_confirm")
        if password and password_confirm and password != password_confirm:
            raise ValidationError("Las contraseñas no coinciden.")
        return password_confirm

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["usu_password"])
        # Set default values if not provided
        if not user.usu_vigente:
            user.usu_vigente = True # Default to active
        if not user.usu_ruta_foto:
            user.usu_ruta_foto = "" # Default to empty string
        # Assign a default role if necessary, or handle in view
        # if not user.pel_id:
        #     default_role = Perfil.objects.get(pel_descripcion='Participante') # Example default role
        #     user.pel_id = default_role
        if commit:
            user.save()
        return user

# Note: The wizard logic will orchestrate these forms.
# A common pattern is to have a multi-step form or separate views for each step.
# The `PersonaForm` logic is integrated into `PreinscripcionPersonaForm`.
# The `UsuarioForm` is kept separate as it might be handled in a different part of the flow or by an admin.
# For the pre-registration wizard, we'll likely need to create a Persona and then link it to a Preinscripcion.
# The Usuario creation might happen in parallel or after Persona is created.
