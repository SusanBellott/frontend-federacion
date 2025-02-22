import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue') },

    // Rutas de usuarios
    { path: '/usuarios', name: 'usuarios', component: () => import('../views/usuarios/Index.vue') },
    { path: '/usuarios/create', name: 'usuarios-create', component: () => import('../views/usuarios/Create.vue') },
    { path: '/usuarios/edit/:carnet', name: 'usuarios-edit', component: () => import('../views/usuarios/Edit.vue') },

    // Rutas de instituciones
    { path: '/instituciones', name: 'instituciones', component: () => import('../views/instituciones/Index.vue') },
    { path: '/instituciones/create', name: 'instituciones-create', component: () => import('../views/instituciones/Create.vue') },
    { path: '/instituciones/edit/:id', name: 'instituciones-edit', component: () => import('../views/instituciones/Edit.vue') },

    //Rutas cursos
    { path: '/cursosAdmin', name: 'cursosAdmin', component: () => import('../views/cursosAdmin/Index.vue') },
    { path: '/cursosAdmin/create', name: 'cursosAdmin-create', component: () => import('../views/cursosAdmin/Create.vue') },
    { path: '/cursosAdmin/edit/:id', name: 'cursosAdmin-edit', component: () => import('../views/cursosAdmin/Edit.vue') },
  ]
});

// Middleware para proteger rutas
router.beforeEach( async (to) => {
  const publicPages = ['/login','/register']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  if(authRequired && !auth.user){
    auth.returnUrl = to.fullPath
    return '/login'
  }
})

export default router;
