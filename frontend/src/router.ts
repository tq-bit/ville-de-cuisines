import { createRouter, createWebHistory, RouterOptions, RouteLocationNormalized } from 'vue-router';
import Home from './pages/Home.vue';
export interface AppNavigationItem {
	name: string;
	requiresLogin: boolean;
	path?: string;
	fn?: Function;
}

// const verifyUserState = async (
// 	to: RouteLocationNormalized,
// 	from: RouteLocationNormalized,
// 	next: any
// ) => {
// 	const [response, error] = await validateLocalUserState();
// 	if (error) {
// 		next('/login');
// 	} else {
// 		next();
// 	}
// };

export const navigation: AppNavigationItem[] = [
	{
		path: '/',
		name: 'Home',
		requiresLogin: false,
	},
	{
		path: '/login',
		name: 'Login',
		requiresLogin: false,
	},
	{
		path: '/signup',
		name: 'Signup',
		requiresLogin: false,
	},
	{
		path: '/profile',
		name: 'Profile',
		requiresLogin: true,
	},
	{
		path: '/about',
		name: 'About',
		requiresLogin: false,
	},
	{
		name: 'Logout',
		requiresLogin: true,
	},
];

export const routes: RouterOptions['routes'] = [
	{
		path: '/',
		component: Home,
	},
	{
		path: '/login',
		component: () => import('./pages/Login.vue'),
	},
	{
		path: '/signup',
		component: () => import('./pages/Signup.vue'),
	},
	{
		path: '/profile',
		component: () => import('./pages/Profile.vue'),
	},

	{
		path: '/about',
		component: () => import('./pages/About.vue'),
	},
	{
		path: '/*',
		component: () => import('./pages/Error.vue'),
	},
];

export default createRouter({
	history: createWebHistory(),
	routes,
});
