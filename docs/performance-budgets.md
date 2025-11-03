# Performance Budgets - SGICS

## Métricas de Rendimiento Definidas

### Core Web Vitals
- **First Contentful Paint (FCP)**: ≤ 2.0s
- **Largest Contentful Paint (LCP)**: ≤ 2.5s
- **Cumulative Layout Shift (CLS)**: ≤ 0.1
- **Total Blocking Time (TBT)**: ≤ 300ms
- **Speed Index**: ≤ 3.0s
- **Time to Interactive (TTI)**: ≤ 3.5s

### Lighthouse Scores
- **Performance**: ≥ 80
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 80

### Resource Budgets
- **JavaScript**: ≤ 400KB
- **CSS**: ≤ 100KB
- **Images**: ≤ 500KB
- **Fonts**: ≤ 100KB
- **Total**: ≤ 1MB

## Uso

### Auditoría Local
```powershell
# Desarrollo
.\scripts\performance-check.ps1 -Mode dev

# Producción
.\scripts\performance-check.ps1 -Mode prod
```

### CI/CD
El workflow `.github/workflows/performance.yml` ejecuta automáticamente las auditorías en PRs y pushes a main.

### Comandos NPM
```bash
cd frontend
npm run perf:audit    # Auditoría completa
npm run perf:collect  # Solo recolección
npm run perf:assert   # Solo validación
```

## Configuración

- `lighthouserc.js`: Configuración principal
- `performance-budget.json`: Límites de recursos
- `.github/workflows/performance.yml`: CI/CD automation