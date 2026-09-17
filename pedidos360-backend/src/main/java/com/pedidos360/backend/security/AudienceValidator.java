package com.pedidos360.backend.security;

import java.util.List;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

/*
 * ============================================================
 * VALIDACIÓN DE AUDIENCE
 * ============================================================
 *
 * La propiedad "aud" del JWT indica para qué aplicación/API
 * fue emitido el token.
 *
 * Nuestra API registrada en Microsoft Entra ID utiliza:
 *
 * api://6c0ce39d-b8ac-4714-a6cc-e9cd674adebe
 *
 * Si el token tiene una audiencia diferente, será rechazado.
 *
 * Esto evita aceptar tokens destinados a otra aplicación.
 *
 * ============================================================
 */

public class AudienceValidator
        implements OAuth2TokenValidator<Jwt> {

    private final String audience;

    public AudienceValidator(String audience) {
        this.audience = audience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {

        List<String> audiences = jwt.getAudience();

        /*
         * Comprobamos si la audiencia de nuestro backend
         * está incluida dentro del claim "aud".
         */
        if (audiences != null && audiences.contains(audience)) {

            return OAuth2TokenValidatorResult.success();
        }

        /*
         * Si la audiencia no coincide, rechazamos el token.
         */
        OAuth2Error error = new OAuth2Error(
                "invalid_token",
                "La audiencia del JWT no corresponde a Pedidos360-API",
                null);

        return OAuth2TokenValidatorResult.failure(error);
    }
}