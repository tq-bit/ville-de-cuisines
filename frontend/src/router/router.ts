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
    path: '/user/:userId',
    component: () => import('../pages/user/index.vue'),
  },

  {
    path: '/my-follows',
    component: () => import('../pages/MyFollows.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
  },

  {
    path: '/discover/users',
    component: () => import('../pages/discover/UserDiscover.vue'),
  },

  {
    path: '/discover/categories',
    component: () => import('../pages/discover/CategoryDiscover.vue'),
  },

  {
    path: '/my-kitchen/recipe/:recipeId/fork',
    component: () => import('../pages/my-kitchen/KitchenRecipe.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
    props: true,
  },

  {
    path: '/my-kitchen/recipe/:recipeId/edit',
    component: () => import('../pages/my-kitchen/KitchenRecipe.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
    props: true,
  },

  {
    path: '/my-kitchen/recipe',
    component: () => import('../pages/my-kitchen/KitchenRecipe.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
  },
  {
    path: '/my-kitchen/recipe-category',
    component: () => import('../pages/my-kitchen/KitchenRecipeCategory.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
  },
  {
    path: '/my-kitchen',
    component: () => import('../pages/my-kitchen/index.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
  },

  {
    path: '/recipe/category/:recipeCategoryId',
    component: () => import('../pages/recipe/RecipeCategory.vue'),
    props: true,
  },

  {
    path: '/recipe/:recipeId',
    component: () => import('../pages/recipe/index.vue'),
    meta: { reuse: false },
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
