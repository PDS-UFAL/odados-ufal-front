import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'BaseLoggedIn',
    component: () => import('@/components/BaseLoggedIn.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/forms',
        name: 'Forms',
        component: () => import('@/views/Forms.vue'),
      },
      {
        path: '/createForms',
        name: 'CreateForms',
        component: () => import('@/views/CreateForms.vue'),
      },
      {
        path: '/notifications',
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
  if (to.name !== 'Login' && !store.getters.authenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
