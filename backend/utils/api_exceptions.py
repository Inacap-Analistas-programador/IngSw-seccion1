from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Manejador de excepciones personalizado para Django REST Framework.
    Devuelve respuestas de error en un formato JSON consistente.
    """
    response = exception_handler(exc, context)

    if response is not None:
        # Para errores estándar de DRF, envolvemos la respuesta.
        custom_response = {
            'error': {
                'status_code': response.status_code,
                'detail': response.data,
                'type': exc.__class__.__name__
            }
        }
        response.data = custom_response
    else:
        # Para excepciones no manejadas por DRF (ej. 500 Internal Server Error)
        response = Response({
            'error': {
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'detail': 'Se ha producido un error inesperado en el servidor.',
                'type': 'InternalServerError'
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
