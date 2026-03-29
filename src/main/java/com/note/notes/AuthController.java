package com.note.notes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({ "/auth", "/api/auth" })
@CrossOrigin
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Value("${app.auth.username:admin}")
    private String configuredUsername;

    @Value("${app.auth.password:1234}")
    private String configuredPassword;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> user) {

        String username = normalize(user.get("username"));
        String password = normalize(user.get("password"));

        if (configuredUsername.equals(username) && configuredPassword.equals(password)) {
            return ResponseEntity.ok(jwtService.generateToken(username));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
