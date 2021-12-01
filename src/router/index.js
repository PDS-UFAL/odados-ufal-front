import Vue from 'vue';
import VueRouter from 'vue-router';

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

export default router;
