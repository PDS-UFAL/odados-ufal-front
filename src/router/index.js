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
        component: () => import('@/views/FormList.vue'),
      },
      {
        path: '/formulario',
        name: 'CreateForms',
        component: () => import('@/views/Forms.vue'),
      },
      {
        path: '/enviar-formulario',
        name: 'SendForms',
        component: () => import('@/views/SendForm.vue'),
      },
      {
        path: '/inserir-historico',
        name: 'CreateHistory',
        component: () => import('@/views/FormHistoric.vue'),
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
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
  },
  {
    path: '/redefinir-senha',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    !['Login', 'ResetPassword', 'ForgotPassword'].includes(to.name) &&
    (!store.getters.authenticated || isJwtExpired(store.getters.authToken))
  ) {
    next({ name: 'Login', path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
