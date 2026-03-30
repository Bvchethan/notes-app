package com.note.notes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({ "/notes", "/api/notes" })
@CrossOrigin
public class NoteController {

    @Autowired
    private NoteRepository repo;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public List<Note> getAll(@RequestHeader("Authorization") String token) {
        authorize(token);
        return repo.findAll();
    }

    @PostMapping
    public Note add(@RequestBody Note note,
            @RequestHeader("Authorization") String token) {
        authorize(token);
        return repo.save(note);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        authorize(token);
        repo.deleteById(id);
    }

    private void authorize(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String actualToken = token.substring(7);

        if (!jwtService.isValidToken(actualToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

    }
}
