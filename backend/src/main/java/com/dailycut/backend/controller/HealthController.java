package com.dailycut.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "DailyCut Spring Boot API is running");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}
