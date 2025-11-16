# 📊 Guía de Pruebas de Carga - GIC

Esta guía te ayuda a realizar pruebas de carga para validar el rendimiento y escalabilidad de tu aplicación.

---

## 🎯 Objetivos de las Pruebas

1. **Validar capacidad**: Determinar cuántos usuarios concurrentes soporta el sistema
2. **Identificar cuellos de botella**: Encontrar componentes que limitan el rendimiento
3. **Verificar estabilidad**: Asegurar que el sistema funciona correctamente bajo carga
4. **Optimizar recursos**: Ajustar configuraciones para mejor rendimiento

---

## 🛠️ Herramientas Recomendadas

### 1. Apache Bench (ab)

Simple y efectivo para pruebas básicas.

```bash
# Instalar
sudo apt-get install apache2-utils

# Prueba básica: 1000 requests, 10 concurrentes
ab -n 1000 -c 10 http://localhost/api/health/

# Con autenticación
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/cursos/
```

### 2. wrk (Recomendado)

Más potente y flexible.

```bash
# Instalar
sudo apt-get install wrk

# Prueba de 30 segundos, 10 conexiones
wrk -t4 -c10 -d30s http://localhost/

# Con script Lua para POST
wrk -t4 -c100 -d30s -s post.lua http://localhost/api/auth/login/
```

### 3. Locust

Ideal para pruebas complejas con escenarios de usuario.

```bash
# Instalar
pip install locust

# Ejecutar (ver archivo locustfile.py abajo)
locust -f locustfile.py --host=http://localhost
```

### 4. k6 (Cloud Native)

Moderno y con excelente integración con Prometheus/Grafana.

```bash
# Instalar
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Ejecutar
k6 run load-test.js
```

---

## 📝 Scripts de Prueba

### Apache Bench - Script Básico

```bash
#!/bin/bash
# test-load-basic.sh

echo "=== GIC Load Test ==="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check (baseline)"
ab -n 1000 -c 10 http://localhost/health

echo ""
echo "Test 2: API Health"
ab -n 1000 -c 10 http://localhost/api/health/

echo ""
echo "Test 3: Frontend"
ab -n 500 -c 10 http://localhost/

echo ""
echo "=== Tests Completed ==="
```

### Locust - locustfile.py

```python
from locust import HttpUser, task, between

class GICUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def view_homepage(self):
        self.client.get("/")
    
    @task(2)
    def view_cursos(self):
        self.client.get("/api/cursos/")
    
    @task(1)
    def health_check(self):
        self.client.get("/api/health/")
    
    def on_start(self):
        # Login si es necesario
        pass
```

### k6 - load-test.js

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 100 }, // Ramp-up a 100 usuarios
        { duration: '5m', target: 100 }, // Mantener 100 usuarios
        { duration: '2m', target: 200 }, // Incrementar a 200
        { duration: '5m', target: 200 }, // Mantener 200 usuarios
        { duration: '2m', target: 0 },   // Ramp-down a 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de requests < 500ms
        http_req_failed: ['rate<0.01'],   // < 1% de errores
    },
};

export default function () {
    // Test homepage
    let res = http.get('http://localhost/');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    sleep(1);
    
    // Test API
    res = http.get('http://localhost/api/health/');
    check(res, {
        'api status is 200': (r) => r.status === 200,
        'api response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    sleep(1);
}
```

---

## 🎮 Escenarios de Prueba

### Escenario 1: Prueba de Humo (Smoke Test)

**Objetivo**: Verificar funcionalidad básica con carga mínima

```bash
# 10 usuarios, 1 minuto
ab -n 600 -c 10 http://localhost/api/health/
```

**Criterios de éxito**:
- 100% de requests exitosos
- Tiempo de respuesta < 200ms

### Escenario 2: Prueba de Carga (Load Test)

**Objetivo**: Simular carga normal esperada

```bash
# 50 usuarios concurrentes, 5 minutos
wrk -t4 -c50 -d5m http://localhost/
```

**Criterios de éxito**:
- > 99% de requests exitosos
- P95 < 500ms
- Sin errores en logs

### Escenario 3: Prueba de Estrés (Stress Test)

**Objetivo**: Encontrar límites del sistema

```bash
# Incrementar usuarios gradualmente
for c in 50 100 150 200 250 300; do
    echo "Testing with $c concurrent users..."
    wrk -t4 -c$c -d2m http://localhost/
    sleep 30
done
```

**Criterios de observación**:
- En qué punto empiezan a aumentar los errores
- Comportamiento de métricas (CPU, memoria, latencia)
- Recuperación después de pico

### Escenario 4: Prueba de Resistencia (Soak Test)

**Objetivo**: Verificar estabilidad a largo plazo

```bash
# 100 usuarios, 2 horas
wrk -t4 -c100 -d2h http://localhost/
```

**Criterios de éxito**:
- Performance estable durante toda la prueba
- Sin memory leaks
- Sin degradación gradual de performance

### Escenario 5: Prueba de Picos (Spike Test)

**Objetivo**: Verificar comportamiento ante picos súbitos de tráfico

```bash
# Usar k6 con stages para simular picos
k6 run spike-test.js
```

```javascript
// spike-test.js
export let options = {
    stages: [
        { duration: '1m', target: 50 },   // Normal
        { duration: '30s', target: 500 }, // Pico súbito
        { duration: '1m', target: 50 },   // Vuelta a normal
    ],
};
```

---

## 📊 Métricas a Monitorear

### Durante las Pruebas

1. **Tiempo de Respuesta**
   - Media
   - P50 (mediana)
   - P95 (percentil 95)
   - P99 (percentil 99)

2. **Throughput**
   - Requests por segundo
   - Bytes transferidos

3. **Tasa de Error**
   - Porcentaje de requests fallidos
   - Códigos de error específicos

4. **Recursos del Sistema**
   ```bash
   # Monitorear en tiempo real
   docker stats
   
   # CPU y memoria del sistema
   top
   htop
   
   # Disco I/O
   iostat -x 2
   ```

5. **Base de Datos**
   ```bash
   # Conexiones MySQL
   docker exec GIC_mysql mysql -u root -p -e "SHOW PROCESSLIST;"
   
   # Slow queries
   docker exec GIC_mysql mysql -u root -p -e "SHOW GLOBAL STATUS LIKE 'Slow_queries';"
   ```

6. **Métricas de Aplicación**
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001

---

## 🎯 Objetivos de Performance

### Objetivos Recomendados

| Métrica | Objetivo | Límite Aceptable |
|---------|----------|------------------|
| Tiempo de respuesta (P95) | < 500ms | < 1s |
| Tasa de error | < 0.1% | < 1% |
| Disponibilidad | > 99.9% | > 99% |
| Throughput | > 100 req/s | > 50 req/s |
| Usuarios concurrentes | > 100 | > 50 |

### Por Endpoint

| Endpoint | P95 Target | P99 Target |
|----------|-----------|-----------|
| /health | < 50ms | < 100ms |
| /api/health/ | < 100ms | < 200ms |
| / (Homepage) | < 500ms | < 1s |
| /api/cursos/ | < 300ms | < 600ms |
| /api/auth/login/ | < 500ms | < 1s |

---

## 🔧 Optimizaciones Basadas en Resultados

### Si el tiempo de respuesta es alto:

1. **Verificar queries de base de datos**
   ```bash
   # Habilitar slow query log
   docker exec GIC_mysql mysql -u root -p -e "SET GLOBAL slow_query_log = 'ON';"
   ```

2. **Optimizar caché**
   - Incrementar cache de Nginx
   - Configurar Redis para cache de Django

3. **Ajustar workers de Gunicorn**
   ```yaml
   # En docker-compose.prod.yml
   command: gunicorn --workers 8 ...  # Aumentar workers
   ```

### Si la tasa de error es alta:

1. **Verificar límites de conexión**
   ```bash
   # MySQL max connections
   docker exec GIC_mysql mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
   ```

2. **Revisar rate limiting**
   - Ajustar límites en nginx/prod.conf

3. **Verificar timeouts**
   - Aumentar timeouts en nginx y gunicorn

### Si el uso de memoria es alto:

1. **Ajustar MySQL buffer pool**
   ```ini
   # En mysql/my.cnf
   innodb_buffer_pool_size = 2G  # Ajustar según RAM
   ```

2. **Limitar workers de Gunicorn**
   ```bash
   # Menos workers si hay memory pressure
   --workers 2
   ```

---

## 📝 Reporte de Pruebas

### Template de Reporte

```markdown
# Reporte de Pruebas de Carga - GIC

**Fecha**: YYYY-MM-DD
**Duración**: X minutos
**Herramienta**: Apache Bench / wrk / k6

## Configuración del Sistema
- CPU: X cores
- RAM: X GB
- Disco: SSD/HDD
- Gunicorn workers: X
- MySQL buffer pool: X GB

## Escenario de Prueba
- Usuarios concurrentes: X
- Duración: X minutos
- Endpoints probados: ...

## Resultados
- Requests totales: X
- Requests por segundo: X
- Tiempo de respuesta promedio: X ms
- P95: X ms
- P99: X ms
- Tasa de error: X%

## Recursos del Sistema Durante la Prueba
- CPU máximo: X%
- Memoria máxima: X GB
- Disco I/O: X MB/s

## Conclusiones
- ✅ Objetivos alcanzados
- ⚠️ Áreas de mejora
- ❌ Problemas encontrados

## Recomendaciones
1. ...
2. ...
```

---

## 🚨 Troubleshooting

### Problema: Muchos errores 502/503

**Causa**: Backend no puede manejar la carga

**Solución**:
```bash
# Aumentar workers
# Verificar logs
docker-compose logs backend

# Aumentar timeouts en nginx
proxy_read_timeout 300s;
```

### Problema: Alto tiempo de respuesta

**Causa**: Queries lentas, sin cache, o recursos insuficientes

**Solución**:
```bash
# Ver queries lentas
docker exec GIC_mysql tail -f /var/log/mysql/slow-query.log

# Verificar conexiones
docker exec GIC_mysql mysql -u root -p -e "SHOW PROCESSLIST;"
```

### Problema: Memory Leaks

**Causa**: Gunicorn workers no se reciclan

**Solución**:
```bash
# Agregar --max-requests
gunicorn --max-requests 1000 --max-requests-jitter 100 ...
```

---

## ✅ Checklist de Pruebas de Carga

Antes de ejecutar:
- [ ] Sistema en configuración de producción
- [ ] Monitoreo activo (Prometheus/Grafana)
- [ ] Backup reciente disponible
- [ ] Plan de rollback preparado
- [ ] Equipo disponible para monitorear

Durante las pruebas:
- [ ] Monitorear métricas en tiempo real
- [ ] Verificar logs continuamente
- [ ] Anotar comportamientos inusuales
- [ ] Tomar screenshots de dashboards

Después de las pruebas:
- [ ] Analizar resultados
- [ ] Documentar hallazgos
- [ ] Identificar optimizaciones
- [ ] Planear próximas pruebas

---

## 🎓 Mejores Prácticas

1. **Empieza pequeño**: Comienza con smoke tests antes de stress tests
2. **Incrementa gradualmente**: No saltes de 10 a 1000 usuarios de golpe
3. **Monitorea todo**: CPU, memoria, disco, red, aplicación
4. **Documenta todo**: Configuración, resultados, observaciones
5. **Prueba en entorno similar**: Lo más cercano a producción posible
6. **Automatiza**: Crea scripts reutilizables
7. **Prueba regularmente**: Antes de releases importantes
8. **Compara resultados**: Mantén histórico de pruebas

---

## 📚 Recursos Adicionales

- [Apache Bench Documentation](https://httpd.apache.org/docs/2.4/programs/ab.html)
- [wrk GitHub](https://github.com/wg/wrk)
- [Locust Documentation](https://docs.locust.io/)
- [k6 Documentation](https://k6.io/docs/)

---

**¡Buenas pruebas! 📊**
