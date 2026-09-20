package com.reglog.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping({"/", "/api"})
    public Map<String, Object> root() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "RegLogBackApp - Spring Boot Authentication Backend");
        response.put("database", "MySQL (reglogdb)");
        response.put("endpoints", List.of(
                "POST /api/register",
                "POST /api/login",
                "GET /api/auth/me",
                "POST /api/logout"
        ));
        return response;
    }
}
