package com.dmart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> rootHealth() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "ONLINE");
        res.put("service", "Mini D-Mart Spring Boot REST API");
        res.put("version", "1.0.0");
        res.put("swaggerDocs", "/swagger-ui/index.html");
        res.put("categoriesApi", "/api/categories");
        res.put("productsApi", "/api/products");
        return ResponseEntity.ok(res);
    }
}
