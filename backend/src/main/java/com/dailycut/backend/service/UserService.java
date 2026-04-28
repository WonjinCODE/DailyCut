package com.dailycut.backend.service;

import com.dailycut.backend.dto.MyPageResponseDto;
import com.dailycut.backend.entity.User;
import com.dailycut.backend.entity.UserOtt;
import com.dailycut.backend.entity.UserPreference;
import com.dailycut.backend.repository.UserRepository;
import com.dailycut.backend.repository.UserOttRepository;
import com.dailycut.backend.repository.UserPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserOttRepository userOttRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    @Transactional(readOnly = true)
    public MyPageResponseDto getMyPageData(String email) {
        // 1. 내 정보 가져오기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 내 OTT 목록 가져오기 (원진님의 엔티티에 맞춰 getOttCode() 사용!)
        List<String> otts = userOttRepository.findByUser_UserId(user.getUserId()).stream()
                .map(UserOtt::getOttCode) 
                .collect(Collectors.toList());

        // 3. 내 선호 장르 가져오기 (마찬가지로 getGenreCode() 사용!)
        List<String> genres = userPreferenceRepository.findByUser_UserIdOrderByPriorityAsc(user.getUserId()).stream()
                .map(UserPreference::getGenreCode)
                .collect(Collectors.toList());

        // 4. 조립해서 반환
        return MyPageResponseDto.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .subscribedOtts(otts)
                .preferredGenres(genres)
                .build();
    }
}