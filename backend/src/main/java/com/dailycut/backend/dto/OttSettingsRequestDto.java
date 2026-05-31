package com.dailycut.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OttSettingsRequestDto {
    private List<String> otts;
}
