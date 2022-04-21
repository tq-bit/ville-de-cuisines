import { createRouter, createWebHistory, RouterOptions, RouteLocationNormalized } from 'vue-router';
import Home from '../pages/Home.vue';
export interface AppNavigationItem {
	name: string;
	requiresLogin: boolean;
	path?: string;
	fn?: Function;
}

import { redirectToLoginIfUserIsLoggedOut, redirectToProfileIfUserIsLoggedIn } from './routeGuards';

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
		beforeEnter: redirectToProfileIfUserIsLoggedIn
	},

	{
		path: '/profile',
		component: () => import('../pages/Profile.vue'),
		beforeEnter: redirectToLoginIfUserIsLoggedOut,
	},

	{
		path: '/my-follows',
		component: () => import('../pages/MyFollows.vue'),
		beforeEnter: redirectToLoginIfUserIsLoggedOut,
	},
	{
		path: '/my-kitchen',
		component: () => import('../pages/MyKitchen.vue'),
		beforeEnter: redirectToLoginIfUserIsLoggedOut,
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