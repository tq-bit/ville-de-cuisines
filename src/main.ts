import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';
import vFocus from './directives/vFocus';

import '@fontsource/montserrat';
import '@fontsource/nunito-sans';
import './css/styles.css';

import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.directive('focus', vFocus);

app.use(router).use(pinia);

app.mount('#app');
