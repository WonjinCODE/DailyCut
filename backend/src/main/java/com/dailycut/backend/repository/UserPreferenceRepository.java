package com.dailycut.backend.repository;

import com.dailycut.backend.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    List<UserPreference> findByUser_UserIdOrderByPriorityAsc(Long userId);
    void deleteByUser_UserId(Long userId);
}