import {createApp} from 'vue'
import {VueFire, VueFireAuthWithDependencies} from "vuefire";
import './style.css'
import App from './App.vue'
import router from "./router";
import vuetifyPlugin from "@/plugins/vuetify.ts";
import {firebaseApp} from "@/plugins/vuefire.ts";
import {browserLocalPersistence, indexedDBLocalPersistence} from 'firebase/auth';

const app = createApp(App);

app.use(VueFire, {
    firebaseApp: firebaseApp,
    modules: [
        VueFireAuthWithDependencies({
            dependencies: {
                persistence: [
                    indexedDBLocalPersistence,
                    browserLocalPersistence
                ]
            }
        })
    ]
})
app.use(vuetifyPlugin);
app.use(router);
app.mount('#app');
