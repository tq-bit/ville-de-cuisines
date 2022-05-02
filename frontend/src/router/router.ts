import {
  createRouter,
  createWebHistory,
  RouterOptions,
  RouteLocationNormalized,
} from 'vue-router';
import Home from '../pages/Home.vue';
export interface AppNavigationItem {
  name: string;
  requiresLogin: boolean;
  path?: string;
  fn?: Function;
}

import {
  redirectToLoginIfUserIsLoggedOut,
  redirectToProfileIfUserIsLoggedIn,
} from './routeGuards';

export const routes: RouterOptions['routes'] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    beforeEnter: redirectToProfileIfUserIsLoggedIn,
  },
  {
    path: '/signup',
    component: () => import('../pages/Signup.vue'),
    beforeEnter: redirectToProfileIfUserIsLoggedIn,
  },

  {
    path: '/profile',
    component: () => import('../pages/profile/index.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
    children: [
      {
        path: '/profile/account',
        component: () => import('../pages/profile/AccountBlend.vue'),
      },
      {
        path: '/profile/preferences',
        component: () => import('../pages/profile/PreferencesBlend.vue'),
      },
    ],
  },

  {
    path: '/my-follows',
    component: () => import('../pages/MyFollows.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
  },

  {
    path: '/my-kitchen/recipe',
    component: () => import('../pages/my-kitchen/KitchenRecipe.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
  },
  {
    path: '/my-kitchen',
    component: () => import('../pages/my-kitchen/index.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
    children: [
      {
        path: '/my-kitchen/ingredient/:ingredientId/edit',
        component: () => import('../pages/my-kitchen/IngredientBlend.vue'),
        props: true,
      },
      {
        path: '/my-kitchen/ingredient',
        component: () => import('../pages/my-kitchen/IngredientBlend.vue'),
      },
    ],
  },

  {
    path: '/about',
    component: () => import('../pages/About.vue'),
  },
  {
    path: '/*',
    component: () => import('../pages/Error.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
