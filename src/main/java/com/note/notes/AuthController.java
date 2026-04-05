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

    @Autowired
    private AppUserRepository appUserRepository;

    @Value("${app.auth.username:admin}")
    private String configuredUsername;

    @Value("${app.auth.password:1234}")
    private String configuredPassword;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> user) {

        String username = normalize(user.get("username"));
        String password = normalize(user.get("password"));

        if (isConfiguredUser(username, password) || isRegisteredUser(username, password)) {
            return ResponseEntity.ok(jwtService.generateToken(username));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> user) {
        String username = normalize(user.get("username"));
        String password = normalize(user.get("password"));

        if (username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        if (configuredUsername.equals(username) || appUserRepository.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setPassword(password);
        appUserRepository.save(appUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(jwtService.generateToken(username));
    }

    private boolean isConfiguredUser(String username, String password) {
        return configuredUsername.equals(username) && configuredPassword.equals(password);
    }

    private boolean isRegisteredUser(String username, String password) {
        return appUserRepository.findByUsername(username)
                .map(appUser -> appUser.getPassword().equals(password))
                .orElse(false);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
