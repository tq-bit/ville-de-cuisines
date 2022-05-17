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
  },

  {
    path: '/user/:userId',
    component: () => import('../pages/user/index.vue'),
  },

  {
    path: '/my-follows',
    component: () => import('../pages/follows/index.vue'),
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
    path: '/my-cuisine',
    component: () => import('../pages/my-cuisine/index.vue'),
    beforeEnter: redirectToLoginIfUserIsLoggedOut,
    children: [
      //  Recipes and ingredients
      {
        path: '/my-cuisine/recipe',
        component: () => import('../pages/my-cuisine/KitchenRecipe.vue'),
        beforeEnter: redirectToLoginIfUserIsLoggedOut,
      },
      {
        path: '/my-cuisine/recipe-category',
        component: () =>
          import('../pages/my-cuisine/KitchenRecipeCategory.vue'),
        beforeEnter: redirectToLoginIfUserIsLoggedOut,
      },
      {
        path: '/my-cuisine/ingredient',
        component: () => import('../pages/my-cuisine/KitchenIngredient.vue'),
        beforeEnter: redirectToLoginIfUserIsLoggedOut,
      },
      {
        path: '/my-cuisine/recipe/:recipeId/refine',
        component: () => import('../pages/my-cuisine/KitchenRecipe.vue'),
        beforeEnter: redirectToLoginIfUserIsLoggedOut,
        props: true,
      },

      {
        path: '/my-cuisine/recipe/:recipeId/edit',
        component: () => import('../pages/my-cuisine/KitchenRecipe.vue'),
        beforeEnter: redirectToLoginIfUserIsLoggedOut,
        props: true,
      },

      // Diet
      {
        path: '/my-cuisine/diet',
        component: () => import('../pages/my-cuisine/diet/KitchenDiet.vue'),
        beforeEnter: redirectToLoginIfUserIsLoggedOut,
        children: [
          {
            path: '/my-cuisine/diet/create',
            component: () =>
              import('../pages/my-cuisine/diet/KitchenDietPlannerBlend.vue'),
            beforeEnter: redirectToLoginIfUserIsLoggedOut,
          },
        ],
      },

      // Account settings
      {
        path: '/my-cuisine/account',
        component: () => import('../pages/my-cuisine/profile/AccountBlend.vue'),
      },
      {
        path: '/my-cuisine/preferences',
        component: () =>
          import('../pages/my-cuisine/profile/PreferencesBlend.vue'),
      },
    ],
  },

  {
    path: '/recipe/category/:recipeCategoryId',
    component: () => import('../pages/recipe/RecipeCategory.vue'),
    props: true,
  },

  {
    path: '/recipe/ingredient/:ingredientId',
    component: () => import('../pages/recipe/RecipeIngredient.vue'),
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
