#!/usr/bin/env python3
"""
Script de Verificación de Seguridad GIC
Verifica que las configuraciones de seguridad estén correctamente implementadas
"""

import os
import sys
from pathlib import Path

# Colores para output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text):
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}{text:^60}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

def print_ok(text):
    print(f"{GREEN}✓{RESET} {text}")

def print_error(text):
    print(f"{RED}✗{RESET} {text}")

def print_warning(text):
    print(f"{YELLOW}⚠{RESET} {text}")

def check_file_exists(filepath, description):
    """Verifica que un archivo exista"""
    if Path(filepath).exists():
        print_ok(f"{description}: {filepath}")
        return True
    else:
        print_error(f"{description} no encontrado: {filepath}")
        return False

def check_file_contains(filepath, search_text, description):
    """Verifica que un archivo contenga cierto texto"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            if search_text in content:
                print_ok(description)
                return True
            else:
                print_error(description)
                return False
    except FileNotFoundError:
        print_error(f"Archivo no encontrado: {filepath}")
        return False
    except Exception as e:
        print_error(f"Error leyendo {filepath}: {str(e)}")
        return False

def main():
    print_header("VERIFICACIÓN DE SEGURIDAD GIC")
    
    # Cambiar al directorio raíz del proyecto
    script_dir = Path(__file__).parent.parent  # Go up from scripts/ to root
    os.chdir(script_dir)
    
    backend_dir = Path("backend")
    settings_file = backend_dir / "scout_project" / "settings.py"
    middleware_file = backend_dir / "scout_project" / "security_middleware.py"
    auth_views_file = backend_dir / "usuarios" / "auth_views.py"
    
    passed = 0
    failed = 0
    
    # 1. Verificar archivos clave
    print_header("1. VERIFICACIÓN DE ARCHIVOS")
    
    checks = [
        (settings_file, "Settings.py"),
        (middleware_file, "Security middleware"),
        (auth_views_file, "Auth views"),
        (backend_dir / ".env.example", ".env.example"),
    ]
    
    for filepath, desc in checks:
        if check_file_exists(filepath, desc):
            passed += 1
        else:
            failed += 1
    
    # 2. Verificar configuraciones JWT
    print_header("2. CONFIGURACIÓN JWT")
    
    jwt_checks = [
        (settings_file, "'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15)", 
         "Token de acceso: 15 minutos ✓"),
        (settings_file, "'BLACKLIST_AFTER_ROTATION': True", 
         "Blacklist después de rotación ✓"),
        (settings_file, "'ROTATE_REFRESH_TOKENS': True", 
         "Rotación de refresh tokens ✓"),
        (settings_file, "rest_framework_simplejwt.token_blacklist", 
         "Token blacklist en INSTALLED_APPS ✓"),
    ]
    
    for filepath, search, desc in jwt_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 3. Verificar validadores de contraseña
    print_header("3. VALIDADORES DE CONTRASEÑA")
    
    password_checks = [
        (settings_file, '"min_length": 12', 
         "Longitud mínima: 12 caracteres ✓"),
        (settings_file, "Argon2PasswordHasher", 
         "Argon2 como hasher principal ✓"),
        (settings_file, "PASSWORD_RESET_TIMEOUT", 
         "Timeout de reset configurado ✓"),
    ]
    
    for filepath, search, desc in password_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 4. Verificar middleware de seguridad
    print_header("4. MIDDLEWARE DE SEGURIDAD")
    
    middleware_checks = [
        (settings_file, "SecurityHeadersMiddleware", 
         "SecurityHeadersMiddleware registrado ✓"),
        (settings_file, "XSSProtectionMiddleware", 
         "XSSProtectionMiddleware registrado ✓"),
        (settings_file, "SecurityLoggingMiddleware", 
         "SecurityLoggingMiddleware registrado ✓"),
    ]
    
    for filepath, search, desc in middleware_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 5. Verificar Content Security Policy
    print_header("5. CONTENT SECURITY POLICY")
    
    csp_checks = [
        (middleware_file, "Content-Security-Policy", 
         "CSP header configurado ✓"),
        (middleware_file, "base-uri", 
         "base-uri restrictivo ✓"),
        (middleware_file, "form-action", 
         "form-action restrictivo ✓"),
    ]
    
    for filepath, search, desc in csp_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 6. Verificar protección brute force
    print_header("6. PROTECCIÓN BRUTE FORCE")
    
    brute_force_checks = [
        (auth_views_file, "check_failed_login_attempts", 
         "Función de verificación de intentos ✓"),
        (auth_views_file, "record_failed_login", 
         "Función de registro de intentos fallidos ✓"),
        (auth_views_file, "MAX_ATTEMPTS = 5", 
         "Máximo de 5 intentos configurado ✓"),
        (auth_views_file, "LOCKOUT_DURATION = 900", 
         "Lockout de 15 minutos configurado ✓"),
    ]
    
    for filepath, search, desc in brute_force_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 7. Verificar logging
    print_header("7. CONFIGURACIÓN DE LOGGING")
    
    logging_checks = [
        (settings_file, "LOGGING = {", 
         "Configuración de logging presente ✓"),
        (settings_file, "'security_file'", 
         "Handler de archivo de seguridad ✓"),
        (settings_file, "django.security", 
         "Logger de django.security ✓"),
        (settings_file, "scout_project.security", 
         "Logger de scout_project.security ✓"),
    ]
    
    for filepath, search, desc in logging_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 8. Verificar cookies seguras
    print_header("8. COOKIES SEGURAS")
    
    cookie_checks = [
        (settings_file, "SESSION_COOKIE_HTTPONLY = True", 
         "Session cookie HttpOnly ✓"),
        (settings_file, "SESSION_COOKIE_SAMESITE = 'Lax'", 
         "Session cookie SameSite ✓"),
        (settings_file, "CSRF_COOKIE_HTTPONLY = True", 
         "CSRF cookie HttpOnly ✓"),
        (settings_file, "CSRF_COOKIE_SAMESITE = 'Lax'", 
         "CSRF cookie SameSite ✓"),
    ]
    
    for filepath, search, desc in cookie_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # 9. Verificar protección contra enumeration
    print_header("9. PROTECCIÓN CONTRA USER ENUMERATION")
    
    enum_checks = [
        (auth_views_file, "Credenciales inválidas", 
         "Mensajes de error genéricos ✓"),
        (auth_views_file, "get_client_ip", 
         "Función para obtener IP del cliente ✓"),
        (auth_views_file, "logger.warning", 
         "Logging de intentos sospechosos ✓"),
    ]
    
    for filepath, search, desc in enum_checks:
        if check_file_contains(filepath, search, desc):
            passed += 1
        else:
            failed += 1
    
    # Resumen
    print_header("RESUMEN")
    
    total = passed + failed
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"Total de verificaciones: {total}")
    print(f"{GREEN}Pasadas: {passed}{RESET}")
    print(f"{RED}Fallidas: {failed}{RESET}")
    print(f"Porcentaje: {percentage:.1f}%\n")
    
    if percentage >= 90:
        print(f"{GREEN}✓ EXCELENTE: El sistema tiene una configuración de seguridad sólida{RESET}")
        return 0
    elif percentage >= 70:
        print(f"{YELLOW}⚠ ACEPTABLE: Hay algunas verificaciones que fallaron. Revisar los errores.{RESET}")
        return 1
    else:
        print(f"{RED}✗ CRÍTICO: Múltiples verificaciones de seguridad fallaron. Requiere atención inmediata.{RESET}")
        return 2

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Verificación cancelada por el usuario{RESET}")
        sys.exit(130)
    except Exception as e:
        print(f"\n{RED}Error inesperado: {str(e)}{RESET}")
        sys.exit(1)
