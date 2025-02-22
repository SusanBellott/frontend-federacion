import Swal from 'sweetalert2';
import { nextTick } from '@vue/runtime-core';
import { useAuthStore } from './stores/auth';
import axios from 'axios';

export function show_alerta(msj, icon, focus = null) {
    if (focus && focus.value) {
        nextTick(() => focus.value.focus());
    }
    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true
    });
}


export function confirmation(name,url,redirect){
    const alert = Swal.mixin({buttonsStyling:true});
    alert.fire({
        title:'estas serguro de eliminar'+name+'?',
        icon:'question',showCancelButton:true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Sí, eliminar',
cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'

    }).then( (result) =>{
        if(result.isConfirmed){
            sendRequest('DELETE',{},url,redirect);
        }
    });

}
/*
export async function sendRequest(method, params, url, redirect = '') {   
    const authStore = useAuthStore();
    
    if (authStore.authToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`;
    } else {
        console.error("No hay token de autenticación.");
    }

    try {
        const response = await axios({ method, url, data: params });
        
        show_alerta(response.data.message, 'success', '');
        
        if (redirect) {
            setTimeout(() => (window.location.href = redirect), 2000);
        }
        
        return response.data;  // ✅ Ahora retorna toda la respuesta
    } catch (errors) {
        let desc = 'Ocurrió un error inesperado.';
        
        if (errors.response?.data?.errors && Array.isArray(errors.response.data.errors)) {
            desc = errors.response.data.errors.join(', ');
        } else if (errors.response?.data?.message) {
            desc = errors.response.data.message;
        }

        show_alerta(desc, 'error', '');
        
        throw errors;  // ✅ Asegurar que el error se propague
    }
}*/
/*export async function sendRequest(method, params, url, redirect = '') {   
    const authStore = useAuthStore();
    
    if (authStore.authToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`;
    } else {
        console.error("No hay token de autenticación.");
    }

    try {
        const response = await axios({
            method,
            url,  
            data: params,
            headers: params instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : {} // Solo agregar si es FormData
        });
        
        show_alerta(response.data.message, 'success', '');
        
        if (redirect && typeof redirect === "string") {
            setTimeout(() => (window.location.href = redirect), 2000);
        }
        
        return response.data;
    } catch (errors) {
        let desc = 'Ocurrió un error inesperado.';
        
        if (errors.response?.data?.errors && Array.isArray(errors.response.data.errors)) {
            desc = errors.response.data.errors.join(', ');
        } else if (errors.response?.data?.message) {
            desc = errors.response.data.message;
        }

        show_alerta(desc, 'error', '');
        
        throw errors;
    }
}
*/
export async function sendRequest(method, params, url, redirect = '') {
    const authStore = useAuthStore();

    if (authStore.authToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.authToken}`;
    } else {
        console.error("No hay token de autenticación.");
    }

    try {
        const headers = params instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};

        const response = await axios({ method, url, data: params, headers });

        show_alerta(response.data.message, 'success', '');

        if (redirect) {
            setTimeout(() => (window.location.href = redirect), 2000);
        }

        return response.data;
    } catch (errors) {
        console.error("Error en la petición:", errors.response?.data);
        show_alerta(errors.response?.data?.message || "Ocurrió un error inesperado.", 'error', '');
        throw errors;
    }
}

