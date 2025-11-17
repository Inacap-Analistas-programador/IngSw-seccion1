"""
Middleware de seguridad para GIC
Implementa protecciones adicionales contra XSS, CSRF, y otros ataques
"""
import logging
import re
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('scout_project.security')


class SecurityHeadersMiddleware:
    """
    Agrega headers de seguridad a todas las respuestas
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Content Security Policy - Previene XSS
        # Mejorado: reducir uso de unsafe-inline y unsafe-eval
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "img-src 'self' data: https: blob:; "
            "font-src 'self' data: https://fonts.gstatic.com; "
            "connect-src 'self' http://localhost:* https:; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        
        # Prevenir clickjacking
        response['X-Frame-Options'] = 'DENY'
        
        # Prevenir MIME type sniffing
        response['X-Content-Type-Options'] = 'nosniff'
        
        # XSS Protection (legacy pero útil para navegadores antiguos)
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy (antes Feature Policy)
        response['Permissions-Policy'] = (
            "geolocation=(self), "
            "microphone=(), "
            "camera=(), "
            "payment=()"
        )
        
        return response


class XSSProtectionMiddleware:
    """
    Detecta y bloquea intentos de XSS en parámetros de request
    """
    XSS_PATTERNS = [
        '<script',
        'javascript:',
        'onerror=',
        'onload=',
        'onclick=',
        'onmouseover=',
        '<iframe',
        'eval(',
        'document.cookie',
        'document.write',
        'window.location',
        '<object',
        '<embed',
    ]
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Verificar parámetros GET
        if self._contains_xss(request.GET):
            logger.warning(
                f'XSS attempt blocked in GET parameters from IP {self._get_client_ip(request)} '
                f'Path: {request.path}'
            )
            return JsonResponse({
                'error': 'Contenido peligroso detectado en la solicitud'
            }, status=400)
        
        # Verificar parámetros POST (solo para form data, no JSON)
        if request.content_type == 'application/x-www-form-urlencoded':
            if self._contains_xss(request.POST):
                logger.warning(
                    f'XSS attempt blocked in POST parameters from IP {self._get_client_ip(request)} '
                    f'Path: {request.path}'
                )
                return JsonResponse({
                    'error': 'Contenido peligroso detectado en la solicitud'
                }, status=400)
        
        return self.get_response(request)
    
    def _contains_xss(self, params):
        """Verifica si los parámetros contienen patrones XSS"""
        for value in params.values():
            value_str = str(value).lower()
            for pattern in self.XSS_PATTERNS:
                if pattern in value_str:
                    return True
        return False
    
    def _get_client_ip(self, request):
        """Obtiene la IP del cliente considerando proxies"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SecurityLoggingMiddleware(MiddlewareMixin):
    """
    Registra eventos de seguridad importantes
    """
    SENSITIVE_PATHS = [
        '/api/auth/login',
        '/api/auth/logout',
        '/api/usuarios',
        '/api/pagos',
        '/admin',
    ]
    
    def process_request(self, request):
        """Registra requests a rutas sensibles"""
        if any(request.path.startswith(path) for path in self.SENSITIVE_PATHS):
            logger.info(
                f'Access to sensitive path: {request.path} '
                f'Method: {request.method} '
                f'IP: {self._get_client_ip(request)} '
                f'User: {request.user if request.user.is_authenticated else "Anonymous"}'
            )
        return None
    
    def process_response(self, request, response):
        """Registra responses de error de autenticación"""
        if response.status_code in [401, 403]:
            logger.warning(
                f'Authentication/Authorization failure: {request.path} '
                f'Status: {response.status_code} '
                f'IP: {self._get_client_ip(request)} '
                f'User: {request.user if request.user.is_authenticated else "Anonymous"}'
            )
        return response
    
    def _get_client_ip(self, request):
        """Obtiene la IP del cliente considerando proxies"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
