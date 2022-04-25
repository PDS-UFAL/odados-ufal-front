import Vue from 'vue';
import VueRouter from 'vue-router';
import { isJwtExpired } from 'jwt-check-expiration';

import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('@/components/BaseLoggedIn.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/formulario',
        name: 'CreateForms',
        component: () => import('@/views/Forms.vue'),
      },
      {
        path: '/formulario/:id',
        name: 'VisualizationForm',
        component: () => import('@/views/FormVisualization.vue'),
      },
      {
        path: '/resposta/:id/:sectorId?',
        name: 'AnswerForm',
        component: () => import('@/views/AnswerForm.vue'),
      },
      {
        path: '/notificacoes',
        name: 'Notifications',
        component: () => import('@/views/Notifications.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.name !== 'Login' &&
    (!store.getters.authenticated || isJwtExpired(store.getters.authToken))
  ) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
