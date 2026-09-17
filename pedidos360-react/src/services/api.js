import axios from "axios";
import { getAccessToken } from "../auth/authService";


/*
 * ============================================================
 * CLIENTE AXIOS - PEDIDOS360
 * ============================================================
 *
 * Este cliente centraliza las peticiones HTTP realizadas
 * desde React hacia nuestro backend Spring Boot.
 *
 * Actualmente:
 *
 * React:
 * http://localhost:4200
 *
 * Backend:
 * http://localhost:8080/api
 *
 * EN AWS:
 * La URL deberá apuntar posteriormente al endpoint de
 * API Gateway.
 *
 * ============================================================
 */

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});


/*
 * ============================================================
 * INTERCEPTOR DE PETICIONES
 * ============================================================
 *
 * Antes de enviar una petición:
 *
 * 1. Obtenemos el Access Token.
 * 2. Lo agregamos al header Authorization.
 *
 * Resultado:
 *
 * Authorization: Bearer eyJ...
 *
 * Spring Security utilizará ese JWT para autenticar
 * la petición.
 *
 * ============================================================
 */

api.interceptors.request.use(
    async (config) => {

        const token = await getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;