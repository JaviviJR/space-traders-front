import { createRouter, createWebHistory } from 'vue-router'

// Shared by home and confirm-email: with the same component, Vue reuses the landing on
// confirm-email's replace to '/'. A dedicated view for confirm-email would remount it.
const HomeView = () => import('@/views/HomeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'confirm-email',
          name: 'confirm-email',
          component: HomeView,
        },
      ],
    },
  ],
})

export default router
