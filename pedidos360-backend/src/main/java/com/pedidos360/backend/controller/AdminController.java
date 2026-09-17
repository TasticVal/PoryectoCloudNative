package com.pedidos360.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * ============================================================
 * PEDIDOS360 - CONTROLADOR ADMINISTRATIVO
 * ============================================================
 *
 * Este controlador contiene endpoints exclusivos
 * para usuarios con el rol ADMIN.
 *
 * El rol viene desde Microsoft Entra ID dentro
 * del claim "roles" del Access Token.
 *
 * Spring Security transforma:
 *
 * ADMIN
 *   ↓
 * ROLE_ADMIN
 *
 * Por eso utilizamos:
 *
 * hasRole("ADMIN")
 *
 * ============================================================
 */

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    /*
     * ============================================================
     * ENDPOINT DE PRUEBA ADMIN
     * ============================================================
     *
     * Solamente un usuario con ROLE_ADMIN puede acceder.
     *
     * Usuario autenticado SIN ADMIN:
     * → HTTP 403 Forbidden
     *
     * Usuario autenticado CON ADMIN:
     * → HTTP 200 OK
     *
     * ============================================================
     */

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminTest() {

        return "Acceso administrativo autorizado correctamente";
    }
}