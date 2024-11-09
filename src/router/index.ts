import { createMemoryHistory, createRouter } from 'vue-router';
import { getCurrentUser } from 'vuefire';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import PredictionView from '@/views/PredictionView.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/predictions' },
      { path: '/predictions', component: PredictionView }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes
});

router.beforeEach(async (to) => {
  const currentUser = await getCurrentUser();
  if (to.meta.requiresAuth) {
    return !currentUser ? { name: 'Login' } : true;
  } else if (to.name === 'Login' && currentUser) {
    return { name: 'Home' };
  }
});
export default router;
