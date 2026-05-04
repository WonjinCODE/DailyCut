package com.dailycut.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class OttSettingsResponseDto {
    private List<String> otts;
}
