import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router';

import './css/styles.css';

import '@fontsource/raleway';
import '@fontsource/nunito-sans';

import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.use(router).use(pinia);

app.mount('#app');
