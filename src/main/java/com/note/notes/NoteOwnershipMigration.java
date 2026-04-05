package com.note.notes;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class NoteOwnershipMigration implements CommandLineRunner {

    private final NoteRepository noteRepository;

    @Value("${app.auth.username:admin}")
    private String configuredUsername;

    public NoteOwnershipMigration(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @Override
    public void run(String... args) {
        List<Note> legacyNotes = noteRepository.findAllByOwnerUsernameIsNullOrderByIdDesc();

        if (legacyNotes.isEmpty()) {
            return;
        }

        for (Note note : legacyNotes) {
            note.setOwnerUsername(configuredUsername);
        }

        noteRepository.saveAll(legacyNotes);
    }
}
