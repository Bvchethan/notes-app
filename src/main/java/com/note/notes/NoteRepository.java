package com.note.notes;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findAllByOwnerUsernameOrderByIdDesc(String ownerUsername);

    List<Note> findAllByOwnerUsernameIsNullOrderByIdDesc();

    Optional<Note> findByIdAndOwnerUsername(Long id, String ownerUsername);
}
