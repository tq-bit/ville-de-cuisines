import { RouteLocationNormalized } from 'vue-router';
import Cookies from 'js-cookie';
import { appwriteClient } from '../api/appwrite';

import { SESSION_ID_KEY } from '../constants/index';

export const redirectToLoginIfUserIsLoggedOut = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: any,
) => {
  try {
    await appwriteClient.account.getSession(
      Cookies.get(SESSION_ID_KEY) as string,
    );
    next();
  } catch (error) {
    next('/login');
  }
};

export const redirectToProfileIfUserIsLoggedIn = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: any,
) => {
  try {
    await appwriteClient.account.getSession(
      Cookies.get(SESSION_ID_KEY) as string,
    );
    next('/profile');
  } catch (error) {
    next();
  }
};
