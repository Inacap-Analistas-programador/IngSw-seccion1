// Enrutador principal de la SPA (Single Page Application)
// Define rutas, lazy-load de vistas y un guard global de autenticación
import { createRouter, createWebHistory } from "vue-router";

// Lista de rutas de la aplicación
// Cada ruta carga su vista de forma diferida (code-splitting)
const routes = [
  // Ruta de inicio (página simple de bienvenida)
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
  },
  // Panel principal con KPIs y semáforo (requiere autenticación)
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    // Requiere que el usuario esté autenticado (token presente)
    meta: { requiresAuth: true },
  },
  // Vista de demostración del validador de RUT (ruta pública)
  {
    path: "/rut-demo",
    name: "RutDemo",
    component: () => import("../views/RutDemoView.vue"),
  },
  // Listado de cursos con filtros y paginación (requiere autenticación)
  {
    path: "/courses",
    name: "CoursesList",
    component: () => import("../views/CoursesListView.vue"),
    // Sección protegida: listado de cursos
    meta: { requiresAuth: true },
  },
  // Módulo de pagos (requiere autenticación)
  {
    path: "/payments",
    name: "Payments",
    component: () => import("../views/PaymentsView.vue"),
    // Sección protegida: pagos
    meta: { requiresAuth: true },
  },
  // Pagos - lista, detalle y formularios
  {
    path: "/payments/new",
    name: "Payments.New",
    component: () => import("../views/payments/PaymentForm.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payments/cambio-titular",
    name: "Payments.CambioTitular",
    component: () => import("../views/payments/CambioTitularidad.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payments/:id",
    name: "Payments.Detail",
    component: () => import("../views/payments/PaymentDetailView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payments/:id/edit",
    name: "Payments.Edit",
    component: () => import("../views/payments/PaymentForm.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payments/:id/comprobante",
    name: "Payments.Comprobante",
    component: () => import("../views/payments/ComprobanteForm.vue"),
    meta: { requiresAuth: true },
  },
  // Asistente de preinscripción (requiere autenticación)
  {
    path: "/preinscriptions",
    name: "Preinscriptions",
    component: () => import("../views/PreinscriptionWizardView.vue"),
    // Sección protegida: asistente de preinscripción
    meta: { requiresAuth: true },
  },
  // Pantalla de inicio de sesión (ruta pública)
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
  },
  // Gestión de personas (requiere autenticación)
  {
    path: "/personas",
    name: "Personas",
    component: () => import("../views/PersonasView.vue"),
    meta: { requiresAuth: true },
  },
];

// Instancia del router con historial basado en HTML5
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global de autenticación:
// - Si la ruta requiere auth y no hay token -> redirige a /login
// - Si intenta ir a /login teniendo token -> redirige a /dashboard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token');

  if (to.meta?.requiresAuth && !token) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.name === 'Login' && token) {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

export default router;
