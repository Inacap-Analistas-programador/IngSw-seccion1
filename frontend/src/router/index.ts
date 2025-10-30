import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/personas',
      name: 'personas',
      component: () => import('../views/PersonasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: () => import('../views/CursosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cursos/:id/acreditacion',
      name: 'acreditacion',
      component: () => import('../views/AcreditacionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cursos/:id',
      name: 'curso-detail',
      component: () => import('../views/CursoDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pagos',
      name: 'pagos',
      component: () => import('../views/PagosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/archivos',
      name: 'archivos',
      component: () => import('../views/ArchivosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalogo',
      name: 'catalogo',
      component: () => import('../views/CatalogoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/email-forwarder',
      name: 'email-forwarder',
      component: () => import('../views/EmailForwarderView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/preinscripcion',
      name: 'preinscripcion',
      component: () => import('../views/PreinscripcionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mantenedores',
      name: 'mantenedores',
      component: () => import('../views/MantenedoresView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/personas/:id',
      name: 'persona-detail',
      component: () => import('../views/PersonaDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/ReportesView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isLoggedIn) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
