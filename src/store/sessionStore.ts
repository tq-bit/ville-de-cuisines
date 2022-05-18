import { defineStore } from 'pinia';
import Cookie from 'js-cookie';
import { AppwriteException, Models } from 'appwrite';
import { AppUserLoginPayload, AppServerResponseOrError } from '@/@types/index';
import { v4 as uuid } from 'uuid';

import { appwriteClient } from '@/classes/AppWrite';
import { SESSION_ID_KEY } from '@/constants/index';

const useSessionStore = defineStore('session', {
  state: () => ({
    _sessionId: '',
  }),

  getters: {
    isUserLoggedIn: (state): boolean => !!state._sessionId,
    sessionId: (state) => ({
      sessionId: state._sessionId,
    }),
  },

  actions: {
    async signup({
      id,
      email,
      password,
      username,
    }: AppUserLoginPayload): AppServerResponseOrError<
      Models.User<Models.Preferences>
    > {
      try {
        const response = await appwriteClient.account.create(
          id || uuid(),
          email,
          password,
          username,
        );
        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async login({
      password,
      email,
    }: AppUserLoginPayload): AppServerResponseOrError<string> {
      try {
        const { $id: sessionId } = await appwriteClient.account.createSession(
          email,
          password,
        );
        this.setSessionId(sessionId);

        return [sessionId, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    async destroyServerSession(): AppServerResponseOrError<any> {
      try {
        const response = await appwriteClient.account.deleteSession(
          this._sessionId,
        );
        this.resetUserSession();

        return [response, null];
      } catch (error) {
        return [null, error as AppwriteException];
      }
    },

    syncLocalSessionIdWithCookie() {
      const cookieTokenState = Cookie.get(SESSION_ID_KEY) || null;
      if (this._sessionId !== '') {
        Cookie.set(SESSION_ID_KEY, this._sessionId);
      }

      if (!!cookieTokenState) {
        this._sessionId = cookieTokenState;
      }
    },

    setSessionId(sessionId: string) {
      Cookie.set(SESSION_ID_KEY, sessionId);
      this._sessionId = sessionId;
    },

    resetUserSession() {
      this.setSessionId('');
    },
  },
});

export default useSessionStore;
