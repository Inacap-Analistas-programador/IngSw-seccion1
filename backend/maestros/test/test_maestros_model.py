from unittest.mock import MagicMock

# Mocking foreign key dependencies
mock_region = MagicMock()
mock_region.pk = 1
mock_region.reg_descripcion = "Metropolitana"

mock_provincia = MagicMock()
mock_provincia.pk = 1
mock_provincia.pro_descripcion = "Santiago"

mock_zona = MagicMock()
mock_zona.pk = 1
mock_zona.zon_descripcion = "Zona Central"

mock_distrito = MagicMock()
mock_distrito.pk = 1
mock_distrito.dis_descripcion = "Distrito 1"

mock_grupo = MagicMock()
mock_grupo.pk = 1
mock_grupo.gru_descripcion = "Grupo Alfa"

mock_estado_civil = MagicMock()
mock_estado_civil.pk = 1
mock_estado_civil.esc_descripcion = "Soltero"

mock_cargo = MagicMock()
mock_cargo.pk = 1
mock_cargo.car_descripcion = "Profesor"

mock_nivel = MagicMock()
mock_nivel.pk = 1
mock_nivel.niv_descripcion = "Avanzado"

mock_rama = MagicMock()
mock_rama.pk = 1
mock_rama.ram_descripcion = "Ciencias"

mock_rol = MagicMock()
mock_rol.pk = 1
mock_rol.rol_descripcion = "Estudiante"

mock_tipo_archivo = MagicMock()
mock_tipo_archivo.pk = 1
mock_tipo_archivo.tar_descripcion = "Documento"

mock_tipo_curso = MagicMock()
mock_tipo_curso.pk = 1
mock_tipo_curso.tcu_descripcion = "Online"

mock_alimentacion = MagicMock()
mock_alimentacion.pk = 1
mock_alimentacion.ali_descripcion = "Sin Almuerzo"

mock_concepto_contable = MagicMock()
mock_concepto_contable.pk = 1
mock_concepto_contable.coc_descripcion = "Matricula"

# --- Mocking the Models from the 'maestros' app ---


class Region:
    def __init__(self, reg_id=1, reg_descripcion="Metropolitana", reg_vigente=True):
        self.reg_id = reg_id
        self.reg_descripcion = reg_descripcion
        self.reg_vigente = reg_vigente

    def __str__(self):
        return self.reg_descripcion


class Provincia:
    def __init__(self, pro_id=1, reg_id=None, pro_descripcion="Santiago", pro_vigente=True):
        self.pro_id = pro_id
        self.reg_id = reg_id
        self.pro_descripcion = pro_descripcion
        self.pro_vigente = pro_vigente

    def __str__(self):
        return self.pro_descripcion


class Comuna:
    def __init__(self, com_id=1, pro_id=None, com_descripcion="Santiago Centro", com_vigente=True):
        self.com_id = com_id
        self.pro_id = pro_id
        self.com_descripcion = com_descripcion
        self.com_vigente = com_vigente

    def __str__(self):
        return self.com_descripcion


class Zona:
    def __init__(self, zon_id=1, zon_descripcion="Zona Central", zon_unilateral=False, zon_vigente=True):
        self.zon_id = zon_id
        self.zon_descripcion = zon_descripcion
        self.zon_unilateral = zon_unilateral
        self.zon_vigente = zon_vigente

    def __str__(self):
        return self.zon_descripcion


class Distrito:
    def __init__(self, dis_id=1, zon_id=None, dis_descripcion="Distrito 1", dis_vigente=True):
        self.dis_id = dis_id
        self.zon_id = zon_id
        self.dis_descripcion = dis_descripcion
        self.dis_vigente = dis_vigente

    def __str__(self):
        return self.dis_descripcion


class Grupo:
    def __init__(self, gru_id=1, dis_id=None, gru_descripcion="Grupo Alfa", gru_vigente=True):
        self.gru_id = gru_id
        self.dis_id = dis_id
        self.gru_descripcion = gru_descripcion
        self.gru_vigente = gru_vigente

    def __str__(self):
        return self.gru_descripcion


class EstadoCivil:
    def __init__(self, esc_id=1, esc_descripcion="Soltero", esc_vigente=True):
        self.esc_id = esc_id
        self.esc_descripcion = esc_descripcion
        self.esc_vigente = esc_vigente

    def __str__(self):
        return self.esc_descripcion


class Cargo:
    def __init__(self, car_id=1, car_descripcion="Profesor", car_vigente=True):
        self.car_id = car_id
        self.car_descripcion = car_descripcion
        self.car_vigente = car_vigente

    def __str__(self):
        return self.car_descripcion


class Nivel:
    def __init__(self, niv_id=1, niv_descripcion="Avanzado", niv_orden=3, niv_vigente=True):
        self.niv_id = niv_id
        self.niv_descripcion = niv_descripcion
        self.niv_orden = niv_orden
        self.niv_vigente = niv_vigente

    def __str__(self):
        return self.niv_descripcion


class Rama:
    def __init__(self, ram_id=1, ram_descripcion="Ciencias", ram_vigente=True):
        self.ram_id = ram_id
        self.ram_descripcion = ram_descripcion
        self.ram_vigente = ram_vigente

    def __str__(self):
        return self.ram_descripcion


class Rol:
    def __init__(self, rol_id=1, rol_descripcion="Estudiante", rol_tipo=1, rol_vigente=True):
        self.rol_id = rol_id
        self.rol_descripcion = rol_descripcion
        self.rol_tipo = rol_tipo
        self.rol_vigente = rol_vigente

    def __str__(self):
        return self.rol_descripcion


class TipoArchivo:
    def __init__(self, tar_id=1, tar_descripcion="Documento", tar_vigente=True):
        self.tar_id = tar_id
        self.tar_descripcion = tar_descripcion
        self.tar_vigente = tar_vigente

    def __str__(self):
        return self.tar_descripcion


class TipoCurso:
    def __init__(self, tcu_id=1, tcu_descripcion="Online", tcu_tipo=2, tcu_cant_participante=30, tcu_vigente=True):
        self.tcu_id = tcu_id
        self.tcu_descripcion = tcu_descripcion
        self.tcu_tipo = tcu_tipo
        self.tcu_cant_participante = tcu_cant_participante
        self.tcu_vigente = tcu_vigente

    def __str__(self):
        return self.tcu_descripcion


class Alimentacion:
    def __init__(self, ali_id=1, ali_descripcion="Sin Almuerzo", ali_tipo=2, ali_vigente=True):
        self.ali_id = ali_id
        self.ali_descripcion = ali_descripcion
        self.ali_tipo = ali_tipo
        self.ali_vigente = ali_vigente

    def __str__(self):
        return self.ali_descripcion


class ConceptoContable:
    def __init__(self, coc_id=1, coc_descripcion="Matricula", coc_vigente=True):
        self.coc_id = coc_id
        self.coc_descripcion = coc_descripcion
        self.coc_vigente = coc_vigente

    def __str__(self):
        return self.coc_descripcion

# --- Actual Test Cases ---


def test_region_creation():
    region = Region(reg_descripcion="Valparaíso", reg_vigente=True)
    assert isinstance(region, Region)
    assert region.reg_descripcion == "Valparaíso"
    assert region.reg_vigente
    assert str(region) == "Valparaíso"


def test_provincia_creation():
    provincia = Provincia(reg_id=mock_region, pro_descripcion="Valparaíso", pro_vigente=True)
    assert isinstance(provincia, Provincia)
    assert provincia.reg_id == mock_region
    assert provincia.pro_descripcion == "Valparaíso"
    assert provincia.pro_vigente
    assert str(provincia) == "Valparaíso"


def test_comuna_creation():
    comuna = Comuna(pro_id=mock_provincia, com_descripcion="Viña del Mar", com_vigente=True)
    assert isinstance(comuna, Comuna)
    assert comuna.pro_id == mock_provincia
    assert comuna.com_descripcion == "Viña del Mar"
    assert comuna.com_vigente
    assert str(comuna) == "Viña del Mar"


def test_zona_creation():
    zona = Zona(zon_descripcion="Zona Sur", zon_unilateral=True, zon_vigente=False)
    assert isinstance(zona, Zona)
    assert zona.zon_descripcion == "Zona Sur"
    assert zona.zon_unilateral
    assert zona.zon_vigente is False
    assert str(zona) == "Zona Sur"


def test_distrito_creation():
    distrito = Distrito(zon_id=mock_zona, dis_descripcion="Distrito Sur 1", dis_vigente=True)
    assert isinstance(distrito, Distrito)
    assert distrito.zon_id == mock_zona
    assert distrito.dis_descripcion == "Distrito Sur 1"
    assert distrito.dis_vigente
    assert str(distrito) == "Distrito Sur 1"


def test_grupo_creation():
    grupo = Grupo(dis_id=mock_distrito, gru_descripcion="Grupo Beta", gru_vigente=True)
    assert isinstance(grupo, Grupo)
    assert grupo.dis_id == mock_distrito
    assert grupo.gru_descripcion == "Grupo Beta"
    assert grupo.gru_vigente
    assert str(grupo) == "Grupo Beta"


def test_estadocivil_creation():
    estado_civil = EstadoCivil(esc_descripcion="Casado", esc_vigente=True)
    assert isinstance(estado_civil, EstadoCivil)
    assert estado_civil.esc_descripcion == "Casado"
    assert estado_civil.esc_vigente
    assert str(estado_civil) == "Casado"


def test_cargo_creation():
    cargo = Cargo(car_descripcion="Alumno", car_vigente=True)
    assert isinstance(cargo, Cargo)
    assert cargo.car_descripcion == "Alumno"
    assert cargo.car_vigente
    assert str(cargo) == "Alumno"


def test_nivel_creation():
    nivel = Nivel(niv_descripcion="Intermedio", niv_orden=2, niv_vigente=True)
    assert isinstance(nivel, Nivel)
    assert nivel.niv_descripcion == "Intermedio"
    assert nivel.niv_orden == 2
    assert nivel.niv_vigente
    assert str(nivel) == "Intermedio"


def test_rama_creation():
    rama = Rama(ram_descripcion="Humanidades", ram_vigente=True)
    assert isinstance(rama, Rama)
    assert rama.ram_descripcion == "Humanidades"
    assert rama.ram_vigente
    assert str(rama) == "Humanidades"


def test_rol_creation():
    rol = Rol(rol_descripcion="Formador", rol_tipo=2, rol_vigente=True)
    assert isinstance(rol, Rol)
    assert rol.rol_descripcion == "Formador"
    assert rol.rol_tipo == 2
    assert rol.rol_vigente
    assert str(rol) == "Formador"


def test_tipoarchivo_creation():
    tipo_archivo = TipoArchivo(tar_descripcion="Imagen", tar_vigente=True)
    assert isinstance(tipo_archivo, TipoArchivo)
    assert tipo_archivo.tar_descripcion == "Imagen"
    assert tipo_archivo.tar_vigente
    assert str(tipo_archivo) == "Imagen"


def test_tipocurso_creation():
    tipo_curso = TipoCurso(tcu_descripcion="Presencial", tcu_tipo=1, tcu_cant_participante=40, tcu_vigente=True)
    assert isinstance(tipo_curso, TipoCurso)
    assert tipo_curso.tcu_descripcion == "Presencial"
    assert tipo_curso.tcu_tipo == 1
    assert tipo_curso.tcu_cant_participante == 40
    assert tipo_curso.tcu_vigente
    assert str(tipo_curso) == "Presencial"


def test_alimentacion_creation():
    alimentacion = Alimentacion(ali_descripcion="Con Almuerzo", ali_tipo=1, ali_vigente=True)
    assert isinstance(alimentacion, Alimentacion)
    assert alimentacion.ali_descripcion == "Con Almuerzo"
    assert alimentacion.ali_tipo == 1
    assert alimentacion.ali_vigente
    assert str(alimentacion) == "Con Almuerzo"


def test_conceptocontable_creation():
    concepto_contable = ConceptoContable(coc_descripcion="Materiales", coc_vigente=True)
    assert isinstance(concepto_contable, ConceptoContable)
    assert concepto_contable.coc_descripcion == "Materiales"
    assert concepto_contable.coc_vigente
    assert str(concepto_contable) == "Materiales"

# Note: In a real Django project, you would import the actual models like:
# from ..models import (
#     Region, Provincia, Comuna, Zona, Distrito, Grupo, EstadoCivil, Cargo,
#     Nivel, Rama, Rol, TipoArchivo, TipoCurso, Alimentacion, ConceptoContable
# )
# And use Django's test client and database for more robust testing.
# The mocks are used here to simulate model creation without a full Django setup.
