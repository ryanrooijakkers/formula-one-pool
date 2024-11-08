import {createRouter, createWebHashHistory} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import {useCurrentUser} from "vuefire";

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/home' }
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to) => {
    console.log(to)
    if (to.meta.requiresAuth) {
        const currentUser = useCurrentUser();
        return !currentUser.value ? { name: 'Login' } : true;
    }
})
export default router;