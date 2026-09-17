import {
    InteractionRequiredAuthError,
} from "@azure/msal-browser";

import {
    msalInstance,
    loginRequest,
} from "./msalConfig";


/*
 * ============================================================
 * OBTENER ACCESS TOKEN
 * ============================================================
 *
 * Primero intentamos obtener el token silenciosamente.
 *
 * Esto permite que el usuario no tenga que autenticarse
 * nuevamente cada vez que React realiza una petición.
 *
 * Si Microsoft Entra determina que se necesita interacción
 * adicional, por ejemplo MFA, utilizamos redirect.
 *
 * ============================================================
 */

export async function getAccessToken() {

    const accounts = msalInstance.getAllAccounts();

    if (accounts.length === 0) {
        throw new Error("No hay una sesión iniciada");
    }

    const account = accounts[0];

    try {

        /*
         * Intentamos obtener el token sin mostrar ninguna
         * ventana al usuario.
         */
        const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account,
        });

        return response.accessToken;

    } catch (error) {

        console.warn(
            "No se pudo obtener el token silenciosamente:",
            error
        );

        /*
         * Microsoft puede requerir interacción adicional.
         *
         * Ejemplo:
         * - MFA
         * - cambio de contraseña
         * - consentimiento
         * - sesión expirada
         */
        if (error instanceof InteractionRequiredAuthError) {

            /*
             * Redirigimos al usuario a Microsoft.
             *
             * Después de completar MFA, Microsoft devuelve
             * al usuario a nuestra aplicación.
             */
            await msalInstance.acquireTokenRedirect({
                ...loginRequest,
                account,
            });

            /*
             * La página será redirigida, por lo que normalmente
             * esta línea no llegará a ejecutarse.
             */
            return null;
        }

        throw error;
    }
}