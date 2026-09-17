import { useState } from "react";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import { loginRequest } from "./auth/msalConfig";

import { getAccessToken } from "./auth/authService";

import ApiTest from "./pages/ApiTest";

import "./App.css";


function App() {

  const { instance, accounts } = useMsal();

  const isAuthenticated = useIsAuthenticated();

  const [token, setToken] = useState("");

  const [tokenError, setTokenError] = useState("");


  /*
   * ============================================================
   * INICIAR SESIÓN
   * ============================================================
   */

  const handleLogin = () => {

    instance.loginRedirect(loginRequest);

  };


  /*
   * ============================================================
   * CERRAR SESIÓN
   * ============================================================
   */

  const handleLogout = () => {

    instance.logoutRedirect({

      postLogoutRedirectUri:
        "http://localhost:4200",

    });

  };


  /*
   * ============================================================
   * OBTENER ACCESS TOKEN
   * ============================================================
   *
   * Esta función mantiene exactamente la lógica que ya
   * teníamos funcionando.
   */

  const handleGetToken = async () => {

    try {

      setTokenError("");

      const accessToken = await getAccessToken();

      setToken(accessToken);

      console.log("ACCESS TOKEN:");

      console.log(accessToken);

    } catch (error) {

      console.error(
        "Error obteniendo Access Token:",
        error
      );

      setTokenError(
        "No se pudo obtener el Access Token."
      );

    }

  };


  /*
   * ============================================================
   * INFORMACIÓN DEL USUARIO
   * ============================================================
   */

  const account = accounts[0];


  return (

    <div className="app-container">


      {!isAuthenticated ? (

        /*
         * ==================================================
         * PANTALLA DE LOGIN
         * ==================================================
         */

        <div className="login-page">

          <div className="login-card">

            <div className="login-logo">
              P
            </div>

            <h1>
              Pedidos<span>360</span>
            </h1>

            <p>
              Sistema de gestión de pedidos
            </p>

            <div className="login-divider"></div>

            <h2>
              Bienvenido
            </h2>

            <p className="login-description">
              Inicia sesión para acceder al sistema.
            </p>

            <button
              className="login-button"
              onClick={handleLogin}
            >
              Iniciar sesión con Microsoft
            </button>

          </div>

        </div>

      ) : (

        /*
         * ==================================================
         * SISTEMA PRINCIPAL
         * ==================================================
         */

        <div className="dashboard">


          {/* ==================================================
                        SIDEBAR
                        ================================================== */}

          <aside className="sidebar">

            <div className="sidebar-brand">

              <div className="sidebar-logo">
                P
              </div>

              <div>

                <div className="sidebar-name">
                  Pedidos<span>360</span>
                </div>

                <div className="sidebar-subtitle">
                  SISTEMA DE GESTIÓN
                </div>

              </div>

            </div>


            <nav className="sidebar-navigation">

              <div className="sidebar-item active">

                <span className="sidebar-item-icon">
                  ▣
                </span>

                <span>
                  Prueba de Backend
                </span>

              </div>


              <div className="sidebar-item">

                <span className="sidebar-item-icon">
                  ♙
                </span>

                <span>
                  Perfil
                </span>

              </div>

            </nav>


            <div className="sidebar-footer">

              <div className="sidebar-footer-line"></div>

              <p>
                Más que pedidos,
                <br />
                soluciones.
              </p>

              <div className="sidebar-info">

                <strong>
                  Pedidos360
                </strong>

                <span>
                  Sistema de Gestión
                </span>

                <span>
                  v1.0.0
                </span>

              </div>

            </div>

          </aside>


          {/* ==================================================
                        CONTENIDO
                        ================================================== */}

          <main className="dashboard-content">


            {/* ==================================================
                            HEADER
                            ================================================== */}

            <header className="dashboard-header">

              <div>

                <span className="header-label">
                  SISTEMA DE GESTIÓN
                </span>

              </div>


              <div className="header-user">

                <div className="header-avatar">
                  {account?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </div>

                <div className="header-user-info">

                  <strong>
                    {account?.name ||
                      "Usuario"}
                  </strong>

                  <span>
                    {account?.username ||
                      "Usuario"}
                  </span>

                </div>

              </div>

            </header>


            {/* ==================================================
                            INFORMACIÓN DEL USUARIO
                            ================================================== */}

            <section className="user-section">

              <div>

                <span className="section-label">
                  CUENTA
                </span>

                <h2>
                  Sesión iniciada
                  <span className="success-check">
                    ✓
                  </span>
                </h2>

                <p>
                  Has iniciado sesión
                  correctamente con Microsoft
                  Entra ID.
                </p>

              </div>


              <div className="user-details">

                <div className="user-detail">

                  <span>
                    Nombre
                  </span>

                  <strong>
                    {account?.name ||
                      "No disponible"}
                  </strong>

                </div>


                <div className="user-detail">

                  <span>
                    Email
                  </span>

                  <strong>
                    {account?.username ||
                      "No disponible"}
                  </strong>

                </div>

              </div>

            </section>


            {/* ==================================================
                            ACCESS TOKEN
                            ================================================== */}

            <section className="token-section">

              <div className="token-header">

                <div>

                  <span className="section-label">
                    AUTENTICACIÓN
                  </span>

                  <h2>
                    Access Token
                  </h2>

                  <p>
                    Obtén el token de acceso
                    utilizado para comunicar
                    React con Spring Boot.
                  </p>

                </div>


                <button
                  className="token-button"
                  onClick={handleGetToken}
                >
                  🔑 Obtener Access Token
                </button>

              </div>


              {tokenError && (

                <div className="token-error">

                  <strong>
                    Error
                  </strong>

                  <p>
                    {tokenError}
                  </p>

                </div>

              )}


              {token && (

                <div className="token-result">

                  <div className="token-result-header">

                    <div className="token-status-icon">
                      ✓
                    </div>

                    <div>

                      <strong>
                        Access Token obtenido
                      </strong>

                      <p>
                        El token JWT fue
                        obtenido correctamente.
                      </p>

                    </div>

                  </div>


                  <div className="token-value">
                    {token}
                  </div>

                </div>

              )}

            </section>


            {/* ==================================================
                            PRUEBAS DEL BACKEND
                            ================================================== */}

            <ApiTest
              onLogout={handleLogout}
            />


          </main>

        </div>

      )}

    </div>

  );

}

export default App;