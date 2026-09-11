import { useState } from "react";

import api from "../services/api";

import "./ApiTest.css";


function ApiTest({ onLogout }) {

    const [respuesta, setRespuesta] = useState("");

    const [error, setError] = useState("");

    const [respuestaAdmin, setRespuestaAdmin] = useState("");

    const [errorAdmin, setErrorAdmin] = useState("");


    /*
     * ============================================================
     * PRUEBA DEL ENDPOINT NORMAL
     * ============================================================
     *
     * Requiere:
     *
     * SCOPE_access_as_user
     */

    const probarBackend = async () => {

        try {

            setRespuesta("");

            setError("");

            const response = await api.get("/test");

            setRespuesta(response.data);

        } catch (err) {

            console.error(
                "Error llamando al backend:",
                err
            );

            setError(
                `Error ${err.response?.status || ""}: ${err.response?.data ||
                "No se pudo conectar con el backend"
                }`
            );

        }

    };


    /*
     * ============================================================
     * PRUEBA DEL ENDPOINT ADMIN
     * ============================================================
     *
     * Requiere:
     *
     * ROLE_ADMIN
     *
     * Sin ADMIN:
     * → 403 Forbidden
     */

    const probarAdmin = async () => {

        try {

            setRespuestaAdmin("");

            setErrorAdmin("");

            const response =
                await api.get("/admin/test");

            setRespuestaAdmin(response.data);

        } catch (err) {

            console.error(
                "Error llamando al endpoint ADMIN:",
                err
            );

            setErrorAdmin(
                `Error ${err.response?.status || ""}: ${err.response?.data ||
                "No tienes permisos para acceder"
                }`
            );

        }

    };


    return (

        <section className="backend-section">


            {/* ==================================================
                TÍTULO
                ================================================== */}

            <div className="backend-header">

                <span className="section-label">
                    CONEXIÓN Y SEGURIDAD
                </span>

                <h1>
                    Prueba de <span>Backend</span>
                </h1>

                <p>
                    Esta página comprueba la comunicación entre
                    React y Spring Boot utilizando el Access Token
                    de Microsoft.
                </p>

                <div className="backend-divider">
                    <span></span>
                </div>

            </div>


            {/* ==================================================
                ENDPOINT PROTEGIDO
                ================================================== */}

            <div className="endpoint-card">

                <div className="endpoint-top">

                    <div className="endpoint-icon">
                        🔐
                    </div>

                    <div className="endpoint-info">

                        <h2>
                            Endpoint protegido
                        </h2>

                        <p>
                            Requiere el scope:

                            <span className="permission">
                                access_as_user
                            </span>
                        </p>

                    </div>

                    <button
                        className="endpoint-button"
                        onClick={probarBackend}
                    >
                        ▶ &nbsp; Probar conexión con
                        Spring Boot
                    </button>

                </div>


                <p className="endpoint-description">
                    Este endpoint verifica que el token de
                    Microsoft sea válido y tenga el scope requerido.
                </p>


                {respuesta && (

                    <div className="backend-response success">

                        <div className="response-circle">
                            ✓
                        </div>

                        <div>

                            <strong>
                                Respuesta del backend:
                            </strong>

                            <p>
                                {respuesta}
                            </p>

                        </div>

                    </div>

                )}


                {error && (

                    <div className="backend-response danger">

                        <div className="response-circle">
                            !
                        </div>

                        <div>

                            <strong>
                                Error:
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* ==================================================
                ENDPOINT ADMIN
                ================================================== */}

            <div className="endpoint-card">

                <div className="endpoint-top">

                    <div className="endpoint-icon admin">
                        👑
                    </div>

                    <div className="endpoint-info">

                        <h2>
                            Endpoint administrativo
                        </h2>

                        <p>
                            Requiere el rol:

                            <span className="permission">
                                ADMIN
                            </span>
                        </p>

                    </div>

                    <button
                        className="endpoint-button"
                        onClick={probarAdmin}
                    >
                        ▶ &nbsp; Probar endpoint ADMIN
                    </button>

                </div>


                <p className="endpoint-description">
                    Este endpoint verifica que el token tenga
                    el rol de administrador.
                </p>


                {respuestaAdmin && (

                    <div className="backend-response success">

                        <div className="response-circle">
                            ✓
                        </div>

                        <div>

                            <strong>
                                Respuesta del backend:
                            </strong>

                            <p>
                                {respuestaAdmin}
                            </p>

                        </div>

                    </div>

                )}


                {errorAdmin && (

                    <div className="backend-response danger">

                        <div className="response-circle">
                            ×
                        </div>

                        <div>

                            <strong>
                                Error:
                            </strong>

                            <p>
                                {errorAdmin}
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* ==================================================
                CERRAR SESIÓN
                ================================================== */}

            <div className="logout-container">

                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    ↪ &nbsp; Cerrar sesión
                </button>

            </div>


            {/* ==================================================
                FOOTER
                ================================================== */}

            <footer className="backend-footer">

                <div className="footer-line">
                    <span></span>
                </div>

                <p>
                    <strong>Pedidos360</strong>

                    <span>·</span>

                    Gestiona

                    <span>·</span>

                    Controla

                    <span>·</span>

                    Crece
                </p>

            </footer>

        </section>

    );

}

export default ApiTest;