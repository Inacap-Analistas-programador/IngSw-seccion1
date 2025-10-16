#!/usr/bin/env python3
"""
Script de testing completo para SGICS Backend
Sistema de Gestión Integral de Cursos Scout

Este script ejecuta toda la suite de tests del backend con diferentes opciones.
Uso: python run_tests.py [options]
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

# Colores para la salida
class Colors:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_colored(message, color=Colors.ENDC):
    """Imprimir mensaje con color."""
    print(f"{color}{message}{Colors.ENDC}")

def check_environment():
    """Verificar que el entorno esté configurado correctamente."""
    print_colored("Verificando entorno de testing...", Colors.BLUE)
    
    # Verificar que estamos en el directorio correcto
    if not Path('manage.py').exists():
        print_colored("ERROR: No se encuentra manage.py. Ejecuta desde el directorio backend/", Colors.RED)
        return False
    
    # Verificar configuración de Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouts_platform.settings.testing')
    
    return True

def run_command(command, description):
    """Ejecutar comando y manejar errores."""
    print_colored(f"\n{description}...", Colors.YELLOW)
    print_colored(f"Comando: {' '.join(command)}", Colors.BLUE)
    
    result = subprocess.run(command, capture_output=True, text=True)
    
    if result.returncode == 0:
        print_colored("✓ Exitoso", Colors.GREEN)
        if result.stdout:
            print(result.stdout)
        return True
    else:
        print_colored("✗ Error", Colors.RED)
        if result.stderr:
            print_colored(result.stderr, Colors.RED)
        if result.stdout:
            print(result.stdout)
        return False

def run_tests(args):
    """Ejecutar tests según las opciones especificadas."""
    base_command = ['python', '-m', 'pytest']
    
    # Configurar verbosidad
    if args.verbose:
        base_command.extend(['-v', '-s'])
    
    # Configurar cobertura
    if args.coverage:
        base_command.extend([
            '--cov=apps',
            '--cov=scouts_platform',
            '--cov-report=term-missing',
            '--cov-report=html:htmlcov'
        ])
    
    # Configurar tests específicos
    if args.app:
        base_command.append(f'apps/{args.app}/tests/')
    elif args.file:
        base_command.append(args.file)
    elif args.fast:
        base_command.extend(['-m', 'not slow'])
    
    # Configurar paralelismo
    if args.parallel:
        base_command.extend(['-n', str(args.parallel)])
    
    # Ejecutar tests
    success = run_command(
        base_command,
        f"Ejecutando tests {'con cobertura' if args.coverage else ''}"
    )
    
    return success

def run_linting():
    """Ejecutar herramientas de calidad de código."""
    commands = [
        (['python', '-m', 'black', '--check', '.'], "Verificando formato con Black"),
        (['python', '-m', 'isort', '--check-only', '.'], "Verificando imports con isort"),
        (['python', '-m', 'flake8', '.'], "Analizando código con Flake8"),
    ]
    
    all_passed = True
    for command, description in commands:
        if not run_command(command, description):
            all_passed = False
    
    return all_passed

def run_migrations_check():
    """Verificar migraciones."""
    commands = [
        (['python', 'manage.py', 'makemigrations', '--dry-run', '--check'], 
         "Verificando migraciones pendientes"),
        (['python', 'manage.py', 'check'], 
         "Verificando configuración de Django"),
    ]
    
    all_passed = True
    for command, description in commands:
        if not run_command(command, description):
            all_passed = False
    
    return all_passed

def main():
    parser = argparse.ArgumentParser(description='Script de testing para SGICS Backend')
    
    # Opciones generales
    parser.add_argument('-v', '--verbose', action='store_true',
                       help='Salida verbose de los tests')
    parser.add_argument('-c', '--coverage', action='store_true',
                       help='Ejecutar con reporte de cobertura')
    parser.add_argument('-f', '--fast', action='store_true',
                       help='Ejecutar solo tests rápidos (excluir lentos)')
    parser.add_argument('-p', '--parallel', type=int, metavar='N',
                       help='Ejecutar tests en paralelo (requiere pytest-xdist)')
    
    # Opciones de selección
    parser.add_argument('-a', '--app', metavar='APP_NAME',
                       help='Ejecutar tests solo de una app específica')
    parser.add_argument('--file', metavar='FILE_PATH',
                       help='Ejecutar tests de un archivo específico')
    
    # Opciones de calidad
    parser.add_argument('-l', '--lint', action='store_true',
                       help='Ejecutar herramientas de calidad de código')
    parser.add_argument('-m', '--migrations', action='store_true',
                       help='Verificar migraciones')
    
    # Opción todo-en-uno
    parser.add_argument('--all', action='store_true',
                       help='Ejecutar tests, linting y verificaciones')
    
    args = parser.parse_args()
    
    # Verificar entorno
    if not check_environment():
        sys.exit(1)
    
    print_colored("\n🧪 SGICS - Suite de Testing Backend", Colors.BOLD)
    print_colored("=" * 50, Colors.BLUE)
    
    success = True
    
    # Ejecutar según las opciones
    if args.all or (not any([args.lint, args.migrations])):
        success &= run_tests(args)
    
    if args.lint or args.all:
        success &= run_linting()
    
    if args.migrations or args.all:
        success &= run_migrations_check()
    
    # Resultado final
    print_colored("\n" + "=" * 50, Colors.BLUE)
    if success:
        print_colored("✅ Todos los tests y verificaciones pasaron!", Colors.GREEN)
        sys.exit(0)
    else:
        print_colored("❌ Algunos tests o verificaciones fallaron.", Colors.RED)
        sys.exit(1)

if __name__ == '__main__':
    main()