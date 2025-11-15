from rest_framework.throttling import AnonRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    """
    Límite de rate para intentos de login
    Permite máximo 5 intentos por minuto para prevenir ataques de fuerza bruta
    """
    scope = 'login'
    rate = '5/minute'
