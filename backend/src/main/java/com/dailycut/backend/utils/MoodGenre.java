package com.dailycut.backend.utils;

import java.util.Arrays;

public enum MoodGenre {
    SLEEP("sleep", "99,18"),
    COMMUTE("commute", "35,16"),
    MEAL("meal", "10764,10751"),
    FREE("free", "28,878,53");

    private final String modeName;
    private final String genreIds;

    MoodGenre(String modeName, String genreIds) {
        this.modeName = modeName;
        this.genreIds = genreIds;
    }

    public String getModeName() { return modeName; }
    public String getGenreIds() { return genreIds; }

    public static String getGenreIds(String mode) {
        if (mode == null || mode.isBlank()) return null;
        return Arrays.stream(MoodGenre.values())
                .filter(m -> m.getModeName().equalsIgnoreCase(mode))
                .map(MoodGenre::getGenreIds)
                .findFirst()
                .orElse(null);
    }
}
