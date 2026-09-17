package com.pedidos360.backend.config;

import com.pedidos360.backend.security.AudienceValidator;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/*
 * ============================================================
 * PEDIDOS360 - CONFIGURACIÓN DE SEGURIDAD
 * ============================================================
 *
 * Configuración de seguridad del backend.
 *
 * Microsoft Entra ID
 *        ↓
 *    Access Token
 *        ↓
 *   Spring Security
 *        ↓
 * Validación JWT
 *        ↓
 * Autorización
 *
 * Se validan:
 *
 * - Firma
 * - Issuer
 * - Expiración
 * - Audience
 * - Scope
 * - Roles
 *
 * ============================================================
 */

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    /*
     * ============================================================
     * CONFIGURACIÓN MICROSOFT ENTRA ID
     * ============================================================
     */

    @Value("${pedidos360.security.issuer}")
    private String issuer;

    @Value("${pedidos360.security.jwk-set-uri}")
    private String jwkSetUri;

    @Value("${pedidos360.security.audience}")
    private String audience;

    /*
     * ============================================================
     * SECURITY FILTER CHAIN
     * ============================================================
     */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

                // API REST con JWT: no necesitamos CSRF.
                .csrf(csrf -> csrf.disable())

                // Permitir comunicación entre React y Spring Boot.
                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()))

                /*
                 * ====================================================
                 * AUTORIZACIÓN
                 * ====================================================
                 */

                .authorizeHttpRequests(auth -> auth

                        /*
                         * /api/test necesita el scope
                         * access_as_user.
                         */
                        .requestMatchers("/api/test")
                        .hasAuthority("SCOPE_access_as_user")

                        /*
                         * El resto de /api/** necesita
                         * que el usuario esté autenticado.
                         *
                         * Los permisos específicos de cada endpoint
                         * se controlan mediante @PreAuthorize.
                         */
                        .requestMatchers("/api/**")
                        .authenticated()

                        /*
                         * Cualquier otra ruta también requiere
                         * autenticación.
                         */
                        .anyRequest()
                        .authenticated())

                /*
                 * ====================================================
                 * OAUTH2 RESOURCE SERVER
                 * ====================================================
                 *
                 * Recibe:
                 *
                 * Authorization: Bearer <JWT>
                 *
                 * y valida el token.
                 */

                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(
                                        jwtAuthenticationConverter())));

        return http.build();
    }

    /*
     * ============================================================
     * CONVERSOR DE AUTORIDADES JWT
     * ============================================================
     *
     * Conservamos los scopes:
     *
     * access_as_user
     * ↓
     * SCOPE_access_as_user
     *
     * Y agregamos los roles:
     *
     * ADMIN
     * ↓
     * ROLE_ADMIN
     *
     * Así podemos utilizar:
     *
     * hasAuthority("SCOPE_access_as_user")
     *
     * y:
     *
     * hasRole("ADMIN")
     *
     * ============================================================
     */

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        // Conversor estándar de scopes de Spring Security.
        JwtGrantedAuthoritiesConverter scopeConverter = new JwtGrantedAuthoritiesConverter();

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {

            /*
             * Lista final de permisos.
             *
             * Aquí tendremos scopes + roles.
             */
            Collection<GrantedAuthority> authorities = new ArrayList<>();

            /*
             * ====================================================
             * SCOPES
             * ====================================================
             */

            Collection<GrantedAuthority> scopes = scopeConverter.convert(jwt);

            if (scopes != null) {
                authorities.addAll(scopes);
            }

            /*
             * ====================================================
             * ROLES
             * ====================================================
             *
             * Microsoft Entra envía los roles dentro del claim:
             *
             * "roles"
             *
             * Ejemplo:
             *
             * "roles": ["ADMIN"]
             */

            List<String> roles = jwt.getClaimAsStringList("roles");

            if (roles != null) {

                roles.forEach(role -> {

                    authorities.add(
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role));

                });
            }

            return authorities;
        });

        return converter;
    }

    /*
     * ============================================================
     * JWT DECODER
     * ============================================================
     *
     * Utiliza las claves públicas de Microsoft Entra ID para
     * verificar la firma del JWT.
     *
     * También valida:
     *
     * - Issuer
     * - Expiración
     * - Not Before
     * - Audience
     *
     * ============================================================
     */

    @Bean
    public JwtDecoder jwtDecoder() {

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withJwkSetUri(jwkSetUri)
                .build();

        /*
         * Validación del Tenant de Microsoft Entra ID.
         */

        OAuth2TokenValidator<Jwt> issuerValidator = JwtValidators.createDefaultWithIssuer(issuer);

        /*
         * Validación de la audiencia de nuestra API.
         */

        OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);

        /*
         * El JWT debe pasar ambas validaciones.
         */

        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
                issuerValidator,
                audienceValidator);

        decoder.setJwtValidator(validator);

        return decoder;
    }

    /*
     * ============================================================
     * CONFIGURACIÓN CORS
     * ============================================================
     *
     * React:
     * http://localhost:4200
     *
     * Spring Boot:
     * http://localhost:8080
     *
     * ============================================================
     *
     * IMPORTANTE PARA AWS:
     *
     * Cuando despleguemos React en AWS tendremos que cambiar
     * el origen permitido por el dominio definitivo.
     *
     * ============================================================
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        /*
         * Frontend permitido.
         */

        configuration.setAllowedOrigins(
                List.of("http://localhost:4200"));

        /*
         * Métodos HTTP permitidos.
         */

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"));

        /*
         * Headers permitidos.
         *
         * Authorization es necesario porque contiene
         * el Access Token.
         */

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"));

        /*
         * Headers que React puede leer.
         */

        configuration.setExposedHeaders(
                List.of("Authorization"));

        /*
         * Aplicamos CORS a todas las rutas.
         */

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;
    }
}