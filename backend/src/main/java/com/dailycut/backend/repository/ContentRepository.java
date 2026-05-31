package com.dailycut.backend.repository;

import com.dailycut.backend.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContentRepository extends JpaRepository<Content, Long> {
    Optional<Content> findByTmdbId(String tmdbId);
    boolean existsByTmdbId(String tmdbId);
}