import {createMemoryHistory, createRouter} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/home', component: HomeView }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router