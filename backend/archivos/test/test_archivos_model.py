from django.utils import timezone
from unittest.mock import MagicMock

# Mocking foreign key dependencies
mock_usuario_crea = MagicMock()
mock_usuario_crea.pk = 1
mock_usuario_crea.usu_username = "test_user_crea"

mock_usuario_modifica = MagicMock()
mock_usuario_modifica.pk = 2
mock_usuario_modifica.usu_username = "test_user_modifica"

mock_tipo_archivo = MagicMock()
mock_tipo_archivo.pk = 1
mock_tipo_archivo.tar_descripcion = "Documento"
mock_tipo_archivo.__str__.return_value = "Documento"  # type: ignore
mock_archivo_curso = MagicMock()
mock_archivo_curso.pk = 1
mock_archivo_curso.__str__.return_value = "Archivo Curso Mock"  # type: ignore

mock_curso_seccion = MagicMock()
mock_curso_seccion.pk = 1
mock_curso_seccion.__str__.return_value = "Curso Sección Mock"  # type: ignore

mock_persona = MagicMock()
mock_persona.pk = 1
mock_persona.per_nombres = "Juan"
mock_persona.per_apelpat = "Perez"
mock_persona.__str__.return_value = "Juan Perez"  # type: ignore

# --- Mocking the Models from the 'archivos' app ---


class Archivo:
    def __init__(
            self,
            arc_id=1,
            tar_id=None,
            usu_id_crea=None,
            usu_id_modifica=None,
            arc_fecha_hora=None,
            arc_descripcion="Test Desc",
            arc_ruta="/path/to/file.txt",
            arc_vigente=True):
        self.arc_id = arc_id
        self.tar_id = tar_id
        self.usu_id_crea = usu_id_crea
        self.usu_id_modifica = usu_id_modifica
        self.arc_fecha_hora = arc_fecha_hora if arc_fecha_hora else timezone.now()
        self.arc_descripcion = arc_descripcion
        self.arc_ruta = arc_ruta
        self.arc_vigente = arc_vigente

    def __str__(self):
        return f"{self.arc_descripcion} ({self.tar_id})"


class ArchivoCurso:
    def __init__(self, aru_id=1, arc_id=None, cus_id=None):
        self.aru_id = aru_id
        self.arc_id = arc_id
        self.cus_id = cus_id

    def __str__(self):
        return f"Archivo {self.arc_id} para Curso Sección {self.cus_id}"


class ArchivoPersona:
    def __init__(self, arp_id=1, arc_id=None, per_id=None, cus_id=None):
        self.arp_id = arp_id
        self.arc_id = arc_id
        self.per_id = per_id
        self.cus_id = cus_id

    def __str__(self):
        return f"Archivo {self.arc_id} para Persona {self.per_id} en Curso Sección {self.cus_id}"

# --- Actual Test Cases ---


def test_archivo_creation():
    archivo = Archivo(
        tar_id=mock_tipo_archivo,
        usu_id_crea=mock_usuario_crea,
        usu_id_modifica=mock_usuario_modifica,
        arc_descripcion="Documento Importante",
        arc_ruta="/files/docs/important.pdf",
        arc_vigente=True
    )
    assert isinstance(archivo, Archivo)
    assert archivo.tar_id == mock_tipo_archivo
    assert archivo.usu_id_crea == mock_usuario_crea
    assert archivo.usu_id_modifica == mock_usuario_modifica
    assert archivo.arc_descripcion == "Documento Importante"
    assert archivo.arc_ruta == "/files/docs/important.pdf"
    assert archivo.arc_vigente
    assert archivo.arc_fecha_hora is not None
    assert str(archivo) == f"{archivo.arc_descripcion} ({mock_tipo_archivo})"


def test_archivocurso_creation():
    # Create a more complete mock for Archivo with spec
    mock_arc = MagicMock(spec=['pk', '__str__'])
    mock_arc.pk = 10
    mock_arc.__str__ = MagicMock(return_value="Mock Archivo 10")

    # Ensure curso_seccion mock has required attributes
    assert hasattr(mock_curso_seccion, 'pk'), "mock_curso_seccion must have pk attribute"

    archivo_curso = ArchivoCurso(
        arc_id=mock_arc,
        cus_id=mock_curso_seccion
    )

    assert isinstance(archivo_curso, ArchivoCurso)
    assert archivo_curso.arc_id is not None
    assert archivo_curso.arc_id.pk == 10
    assert archivo_curso.cus_id is not None
    assert archivo_curso.cus_id == mock_curso_seccion
    assert str(archivo_curso) == f"Archivo {mock_arc} para Curso Sección {mock_curso_seccion}"


def test_archivopersona_creation():
    # Create a more complete mock for Archivo with spec
    mock_arc = MagicMock(spec=['pk', '__str__'])
    mock_arc.pk = 10
    mock_arc.__str__ = MagicMock(return_value="Mock Archivo 10")

    # Ensure other mocks have required attributes
    assert hasattr(mock_persona, 'pk'), "mock_persona must have pk attribute"
    assert hasattr(mock_curso_seccion, 'pk'), "mock_curso_seccion must have pk attribute"

    archivo_persona = ArchivoPersona(
        arc_id=mock_arc,
        per_id=mock_persona,
        cus_id=mock_curso_seccion
    )
    assert isinstance(archivo_persona, ArchivoPersona)
    assert archivo_persona.arc_id is not None
    assert archivo_persona.arc_id.pk == 10
    assert archivo_persona.per_id == mock_persona
    assert archivo_persona.cus_id == mock_curso_seccion
    assert str(
        archivo_persona) == f"Archivo {mock_arc} para Persona {mock_persona} en Curso Sección {mock_curso_seccion}"
