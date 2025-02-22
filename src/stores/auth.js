import axios from 'axios';
import { defineStore } from 'pinia';
import { show_alerta } from '../functions';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authUser: JSON.parse(localStorage.getItem('authUser')) || null,
        authToken: localStorage.getItem('authToken') || null
    }),
    getters: {
        user: (state) => state.authUser,
        token: (state) => state.authToken
    },
    actions: {
        async getToken() {
            await axios.get('/sanctum/csrf-cookie');
        },

        async login(form) {
            try {
                await this.getToken();
                const res = await axios.post('/api/login', form);
        
                this.authToken = res.data.token;
                this.authUser = res.data.user; // Asegurarse de que el usuario tiene un 'role'
        
                // Guardar en localStorage
                localStorage.setItem('authToken', this.authToken);
                localStorage.setItem('authUser', JSON.stringify(this.authUser));
        
                // Configurar el token para futuras solicitudes
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
        
                console.log('Usuario autenticado:', this.authUser);
                console.log('Token guardado:', this.authToken);
        
                // Redireccionar según el rol
                if (this.authUser.role === 'administrador') {
                    router.push('/dashboard-admin'); // Página de administrador
                } else {
                    router.push('/dashboard-user'); // Página de usuario normal
                }
        
            } catch (error) {
                let desc = 'Error de autenticación';
                if (error.response?.data?.errors) {
                    desc = Object.values(error.response.data.errors).flat().join(', ');
                }
                show_alerta(desc, 'error', '');
            }
        },
        
        async register(form) {
            try {
                await this.getToken();
                const res = await axios.post('/api/register', form);
                show_alerta(res.data.message, 'success', '');
                setTimeout(() => this.router.push('/login'), 2000);
            } catch (error) {
                let desc = 'Error en el registro';
                if (error.response?.data?.errors) {
                    desc = Object.values(error.response.data.errors).flat().join(', ');
                }
                show_alerta(desc, 'error', '');
            }
        },
        async logout() {
            try {
                await axios.post('/api/logout');

                // Eliminar datos del estado y de localStorage
                this.authToken = null;
                this.authUser = null;
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');

                delete axios.defaults.headers.common['Authorization'];
                router.push('/login');
            } catch (error) {
                show_alerta('Error al cerrar sesión', 'error', '');
            }
        },

        checkAuth() {
            // Recuperar datos almacenados
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser');

            if (storedToken && storedUser) {
                this.authToken = storedToken;
                this.authUser = JSON.parse(storedUser);
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
            } else {
                this.logout();
            }
        }
    }
});


