import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

// create a VueJS application
createApp(App)
    .use(store)
    .mount('#app') // reference the root container from index.html
