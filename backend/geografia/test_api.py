"""
Tests completos para las APIs de geografía
"""
import pytest
from rest_framework import status
from geografia.models import Region, Provincia, Comuna, Zona, Distrito, Grupo


@pytest.mark.django_db
class TestRegionAPI:
    """Tests para el endpoint de regiones"""

    def test_list_regiones(self, api_client):
        """Test listar regiones"""
        # Crear datos de prueba
        Region.objects.create(reg_descripcion="Región Metropolitana", reg_vigente=True)
        Region.objects.create(reg_descripcion="Valparaíso", reg_vigente=True)

        response = api_client.get('/api/geografia/regiones/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_create_region(self, authenticated_client):
        """Test crear región"""
        data = {
            'reg_descripcion': 'Biobío',
            'reg_vigente': True
        }

        response = authenticated_client.post('/api/geografia/regiones/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Region.objects.filter(reg_descripcion='Biobío').exists()

    def test_retrieve_region(self, api_client):
        """Test obtener detalle de región"""
        region = Region.objects.create(
            reg_descripcion="Araucanía",
            reg_vigente=True
        )

        response = api_client.get(f'/api/geografia/regiones/{region.reg_id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['reg_descripcion'] == "Araucanía"

    def test_update_region(self, authenticated_client):
        """Test actualizar región"""
        region = Region.objects.create(
            reg_descripcion="Los Lagos",
            reg_vigente=True
        )

        data = {
            'reg_descripcion': 'Los Lagos Actualizada',
            'reg_vigente': False
        }

        response = authenticated_client.put(
            f'/api/geografia/regiones/{region.reg_id}/',
            data
        )

        assert response.status_code == status.HTTP_200_OK
        region.refresh_from_db()
        assert region.reg_descripcion == 'Los Lagos Actualizada'
        assert region.reg_vigente is False

    def test_delete_region(self, authenticated_client):
        """Test eliminar región"""
        region = Region.objects.create(
            reg_descripcion="Aysén",
            reg_vigente=True
        )

        response = authenticated_client.delete(
            f'/api/geografia/regiones/{region.reg_id}/'
        )

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Region.objects.filter(reg_id=region.reg_id).exists()


@pytest.mark.django_db
class TestProvinciaAPI:
    """Tests para el endpoint de provincias"""

    def test_list_provincias(self, api_client):
        """Test listar provincias"""
        region = Region.objects.create(
            reg_descripcion="Metropolitana",
            reg_vigente=True
        )
        Provincia.objects.create(
            reg_id=region,
            pro_descripcion="Santiago",
            pro_vigente=True
        )
        Provincia.objects.create(
            reg_id=region,
            pro_descripcion="Cordillera",
            pro_vigente=True
        )

        response = api_client.get('/api/geografia/provincias/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_create_provincia(self, authenticated_client):
        """Test crear provincia"""
        region = Region.objects.create(
            reg_descripcion="Valparaíso",
            reg_vigente=True
        )

        data = {
            'reg_id': region.reg_id,
            'pro_descripcion': 'Valparaíso',
            'pro_vigente': True
        }

        response = authenticated_client.post('/api/geografia/provincias/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Provincia.objects.filter(pro_descripcion='Valparaíso').exists()


@pytest.mark.django_db
class TestComunaAPI:
    """Tests para el endpoint de comunas"""

    def test_list_comunas(self, api_client):
        """Test listar comunas"""
        region = Region.objects.create(
            reg_descripcion="Metropolitana",
            reg_vigente=True
        )
        provincia = Provincia.objects.create(
            reg_id=region,
            pro_descripcion="Santiago",
            pro_vigente=True
        )
        Comuna.objects.create(
            pro_id=provincia,
            com_descripcion="Santiago Centro",
            com_vigente=True
        )
        Comuna.objects.create(
            pro_id=provincia,
            com_descripcion="Providencia",
            com_vigente=True
        )

        response = api_client.get('/api/geografia/comunas/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_create_comuna(self, authenticated_client):
        """Test crear comuna"""
        region = Region.objects.create(
            reg_descripcion="Metropolitana",
            reg_vigente=True
        )
        provincia = Provincia.objects.create(
            reg_id=region,
            pro_descripcion="Santiago",
            pro_vigente=True
        )

        data = {
            'pro_id': provincia.pro_id,
            'com_descripcion': 'Las Condes',
            'com_vigente': True
        }

        response = authenticated_client.post('/api/geografia/comunas/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Comuna.objects.filter(com_descripcion='Las Condes').exists()

    def test_filter_comunas_by_provincia(self, api_client):
        """Test filtrar comunas por provincia"""
        region = Region.objects.create(
            reg_descripcion="Metropolitana",
            reg_vigente=True
        )
        provincia1 = Provincia.objects.create(
            reg_id=region,
            pro_descripcion="Santiago",
            pro_vigente=True
        )
        provincia2 = Provincia.objects.create(
            reg_id=region,
            pro_descripcion="Maipo",
            pro_vigente=True
        )

        Comuna.objects.create(
            pro_id=provincia1,
            com_descripcion="Santiago",
            com_vigente=True
        )
        Comuna.objects.create(
            pro_id=provincia2,
            com_descripcion="San Bernardo",
            com_vigente=True
        )

        response = api_client.get(
            f'/api/geografia/comunas/?pro_id={provincia1.pro_id}'
        )

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['com_descripcion'] == 'Santiago'


@pytest.mark.django_db
class TestZonaAPI:
    """Tests para el endpoint de zonas"""

    def test_list_zonas(self, api_client):
        """Test listar zonas"""
        Zona.objects.create(
            zon_descripcion="Zona Norte",
            zon_unilateral=False,
            zon_vigente=True
        )
        Zona.objects.create(
            zon_descripcion="Zona Sur",
            zon_unilateral=True,
            zon_vigente=True
        )

        response = api_client.get('/api/geografia/zonas/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_create_zona(self, authenticated_client):
        """Test crear zona"""
        data = {
            'zon_descripcion': 'Zona Centro',
            'zon_unilateral': False,
            'zon_vigente': True
        }

        response = authenticated_client.post('/api/geografia/zonas/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Zona.objects.filter(zon_descripcion='Zona Centro').exists()


@pytest.mark.django_db
class TestDistritoAPI:
    """Tests para el endpoint de distritos"""

    def test_list_distritos(self, api_client):
        """Test listar distritos"""
        zona = Zona.objects.create(
            zon_descripcion="Zona Norte",
            zon_unilateral=False,
            zon_vigente=True
        )
        Distrito.objects.create(
            zon_id=zona,
            dis_descripcion="Distrito 1",
            dis_vigente=True
        )

        response = api_client.get('/api/geografia/distritos/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1


@pytest.mark.django_db
class TestGrupoAPI:
    """Tests para el endpoint de grupos"""

    def test_list_grupos(self, api_client):
        """Test listar grupos scouts"""
        zona = Zona.objects.create(
            zon_descripcion="Zona Metropolitana",
            zon_unilateral=False,
            zon_vigente=True
        )
        distrito = Distrito.objects.create(
            zon_id=zona,
            dis_descripcion="Distrito Santiago",
            dis_vigente=True
        )
        Grupo.objects.create(
            dis_id=distrito,
            gru_descripcion="Grupo Scout 1",
            gru_vigente=True
        )
        Grupo.objects.create(
            dis_id=distrito,
            gru_descripcion="Grupo Scout 2",
            gru_vigente=True
        )

        response = api_client.get('/api/geografia/grupos/')

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    def test_create_grupo(self, authenticated_client):
        """Test crear grupo scout"""
        zona = Zona.objects.create(
            zon_descripcion="Zona Sur",
            zon_unilateral=False,
            zon_vigente=True
        )
        distrito = Distrito.objects.create(
            zon_id=zona,
            dis_descripcion="Distrito Concepción",
            dis_vigente=True
        )

        data = {
            'dis_id': distrito.dis_id,
            'gru_descripcion': 'Grupo Scout Nuevo',
            'gru_vigente': True
        }

        response = authenticated_client.post('/api/geografia/grupos/', data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Grupo.objects.filter(gru_descripcion='Grupo Scout Nuevo').exists()

    def test_deactivate_grupo(self, authenticated_client):
        """Test desactivar grupo scout"""
        zona = Zona.objects.create(
            zon_descripcion="Zona Centro",
            zon_unilateral=False,
            zon_vigente=True
        )
        distrito = Distrito.objects.create(
            zon_id=zona,
            dis_descripcion="Distrito Central",
            dis_vigente=True
        )
        grupo = Grupo.objects.create(
            dis_id=distrito,
            gru_descripcion="Grupo a Desactivar",
            gru_vigente=True
        )

        data = {
            'dis_id': distrito.dis_id,
            'gru_descripcion': 'Grupo a Desactivar',
            'gru_vigente': False
        }

        response = authenticated_client.put(
            f'/api/geografia/grupos/{grupo.gru_id}/',
            data
        )

        assert response.status_code == status.HTTP_200_OK
        grupo.refresh_from_db()
        assert grupo.gru_vigente is False


@pytest.mark.django_db
class TestGeografiaIntegration:
    """Tests de integración para el módulo de geografía"""

    def test_complete_hierarchy(self, authenticated_client):
        """Test crear jerarquía completa: región > provincia > comuna"""
        # Crear región
        region_data = {
            'reg_descripcion': 'Test Region',
            'reg_vigente': True
        }
        region_response = authenticated_client.post(
            '/api/geografia/regiones/',
            region_data
        )
        assert region_response.status_code == status.HTTP_201_CREATED
        region_id = region_response.data['reg_id']

        # Crear provincia
        provincia_data = {
            'reg_id': region_id,
            'pro_descripcion': 'Test Provincia',
            'pro_vigente': True
        }
        provincia_response = authenticated_client.post(
            '/api/geografia/provincias/',
            provincia_data
        )
        assert provincia_response.status_code == status.HTTP_201_CREATED
        provincia_id = provincia_response.data['pro_id']

        # Crear comuna
        comuna_data = {
            'pro_id': provincia_id,
            'com_descripcion': 'Test Comuna',
            'com_vigente': True
        }
        comuna_response = authenticated_client.post(
            '/api/geografia/comunas/',
            comuna_data
        )
        assert comuna_response.status_code == status.HTTP_201_CREATED

        # Verificar que todo existe
        assert Region.objects.filter(reg_id=region_id).exists()
        assert Provincia.objects.filter(pro_id=provincia_id).exists()
        assert Comuna.objects.filter(
            pro_id=provincia_id,
            com_descripcion='Test Comuna'
        ).exists()

    def test_scout_organization_hierarchy(self, authenticated_client):
        """Test crear jerarquía scout: zona > distrito > grupo"""
        # Crear zona
        zona_data = {
            'zon_descripcion': 'Zona Test',
            'zon_unilateral': False,
            'zon_vigente': True
        }
        zona_response = authenticated_client.post(
            '/api/geografia/zonas/',
            zona_data
        )
        assert zona_response.status_code == status.HTTP_201_CREATED
        zona_id = zona_response.data['zon_id']

        # Crear distrito
        distrito_data = {
            'zon_id': zona_id,
            'dis_descripcion': 'Distrito Test',
            'dis_vigente': True
        }
        distrito_response = authenticated_client.post(
            '/api/geografia/distritos/',
            distrito_data
        )
        assert distrito_response.status_code == status.HTTP_201_CREATED
        distrito_id = distrito_response.data['dis_id']

        # Crear grupo
        grupo_data = {
            'dis_id': distrito_id,
            'gru_descripcion': 'Grupo Test',
            'gru_vigente': True
        }
        grupo_response = authenticated_client.post(
            '/api/geografia/grupos/',
            grupo_data
        )
        assert grupo_response.status_code == status.HTTP_201_CREATED

        # Verificar que todo existe
        assert Zona.objects.filter(zon_id=zona_id).exists()
        assert Distrito.objects.filter(dis_id=distrito_id).exists()
        assert Grupo.objects.filter(
            dis_id=distrito_id,
            gru_descripcion='Grupo Test'
        ).exists()
