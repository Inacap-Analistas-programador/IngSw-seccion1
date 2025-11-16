"""
Middleware de seguridad para GIC
Implementa protecciones adicionales contra XSS, CSRF, y otros ataques
"""

class SecurityHeadersMiddleware:
    """
    Agrega headers de seguridad a todas las respuestas
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Content Security Policy - Previene XSS
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' http://localhost:* https:; "
            "frame-ancestors 'none';"
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
            "geolocation=(), "
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
        '<iframe',
        'eval(',
        'document.cookie',
    ]
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Verificar parámetros GET
        if self._contains_xss(request.GET):
            from django.http import JsonResponse
            return JsonResponse({
                'error': 'Contenido peligroso detectado en la solicitud'
            }, status=400)
        
        # Verificar parámetros POST (solo para form data, no JSON)
        if request.content_type == 'application/x-www-form-urlencoded':
            if self._contains_xss(request.POST):
                from django.http import JsonResponse
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
