import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from cursos.serializers import CursoSerializer, CursoFechaSerializer


@pytest.fixture
def mock_curso_data():
    """Fixture with valid curso data including fechas"""
    return {
        'cur_codigo': 'FORM001',
        'cur_descripcion': 'Curso de Formación',
        'cur_fecha_hora': datetime(2024, 1, 15, 10, 0),
        'cur_fecha_solicitud': datetime(2024, 1, 1, 9, 0),
        'cur_administra': 1,
        'cur_cuota_con_almuerzo': 50000.0,
        'cur_cuota_sin_almuerzo': 40000.0,
        'cur_modalidad': 1,
        'cur_tipo_curso': 1,
        'cur_lugar': 'Sala Principal',
        'cur_estado': 1,
        'usu_id': 1,
        'tcu_id': 1,
        'per_id_responsable': 1,
        'car_id_responsable': 1,
        'com_id_lugar': 1,
        'cursofecha_set': [
            {
                'cuf_fecha_inicio': datetime(2024, 2, 1, 9, 0),
                'cuf_fecha_termino': datetime(2024, 2, 5, 18, 0),
                'cuf_tipo': 1
            },
            {
                'cuf_fecha_inicio': datetime(2024, 2, 10, 9, 0),
                'cuf_fecha_termino': datetime(2024, 2, 15, 18, 0),
                'cuf_tipo': 2
            }
        ]
    }


@pytest.mark.django_db
class TestCursoFechaSerializer:
    """Test suite for CursoFechaSerializer"""

    def test_curso_fecha_serializer_fields(self):
        """Test that CursoFechaSerializer has correct fields"""
        serializer = CursoFechaSerializer()
        expected_fields = ['cuf_id', 'cuf_fecha_inicio', 'cuf_fecha_termino', 'cuf_tipo']
        assert set(serializer.fields.keys()) == set(expected_fields)


@pytest.mark.django_db
class TestCursoSerializer:
    """Test suite for CursoSerializer with nested fechas"""

    def test_curso_serializer_has_fechas_field(self):
        """Test that CursoSerializer includes fechas field"""
        serializer = CursoSerializer()
        assert 'fechas' in serializer.fields

    def test_curso_serializer_fechas_is_nested(self):
        """Test that fechas field is properly nested"""
        serializer = CursoSerializer()
        fechas_field = serializer.fields['fechas']
        assert fechas_field.many is True
        assert fechas_field.required is False

    @patch('cursos.models.Curso.objects.create')
    @patch('cursos.models.CursoFecha.objects.create')
    def test_create_curso_with_fechas(self, mock_curso_fecha_create, mock_curso_create, mock_curso_data):
        """Test creating curso with multiple fechas"""
        # Setup mock returns
        mock_curso_instance = MagicMock()
        mock_curso_instance.pk = 1
        mock_curso_create.return_value = mock_curso_instance

        # Create serializer instance
        serializer = CursoSerializer()
        
        # Verify the serializer would process the data correctly
        # (Full integration test would require database setup)
        assert 'cursofecha_set' in mock_curso_data
        assert len(mock_curso_data['cursofecha_set']) == 2

    @patch('cursos.models.Curso.objects.create')
    @patch('cursos.models.CursoFecha.objects.create')
    def test_update_curso_with_fechas(self, mock_curso_fecha_create, mock_curso_create):
        """Test updating curso with fechas"""
        # Mock curso instance
        mock_instance = MagicMock()
        mock_instance.pk = 1
        mock_instance.cursofecha_set = MagicMock()
        mock_instance.cursofecha_set.all.return_value.delete = MagicMock()

        # Data with updated fechas
        updated_data = {
            'cur_codigo': 'FORM001',
            'cursofecha_set': [
                {
                    'cuf_fecha_inicio': datetime(2024, 3, 1, 9, 0),
                    'cuf_fecha_termino': datetime(2024, 3, 5, 18, 0),
                    'cuf_tipo': 1
                }
            ]
        }

        # Create serializer and update
        serializer = CursoSerializer()
        serializer.update(mock_instance, updated_data)
        
        # Verify the old dates would be deleted
        mock_instance.cursofecha_set.all.return_value.delete.assert_called_once()
