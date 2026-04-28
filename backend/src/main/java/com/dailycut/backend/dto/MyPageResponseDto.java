package com.dailycut.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MyPageResponseDto {
    private String email;
    private String nickname;
    private List<String> subscribedOtts;   // 유저가 구독 중인 OTT 목록
    private List<String> preferredGenres;  // 유저의 선호 장르 목록
}