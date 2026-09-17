package com.pedidos360.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    // ============================================================
    // ENDPOINT DE PRUEBA
    //
    // Este endpoint se utiliza únicamente para comprobar que
    // el backend de Pedidos360 está funcionando correctamente.
    //
    // Actualmente funciona de forma LOCAL:
    // http://localhost:8080/api/test
    //
    // Cuando el backend sea desplegado en AWS, la URL cambiará
    // dependiendo de la configuración de API Gateway.
    // ============================================================

    @GetMapping("/test")
    public String test() {
        return "Backend Pedidos360 funcionando correctamente";
    }
}