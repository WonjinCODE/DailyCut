package com.dailycut.backend.repository;

import com.dailycut.backend.entity.UserOtt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserOttRepository extends JpaRepository<UserOtt, Long> {
    List<UserOtt> findByUser_UserId(Long userId);
    void deleteByUser_UserId(Long userId);
}