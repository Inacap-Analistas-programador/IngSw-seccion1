"""
SGICS - Sistema de Gestión Integral de Cursos Scout
Package init with optional PyMySQL fallback for MySQL on shared hosting.
"""

# Version: 1.0.0
# Date: October 2025

# MySQL connector fallback
try:
    import pymysql  # type: ignore

    pymysql.install_as_MySQLdb()
except Exception:
    # If PyMySQL isn't installed, Django will try mysqlclient if present.
    pass
