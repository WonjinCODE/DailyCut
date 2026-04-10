package com.dailycut.backend.utils;

import java.util.Arrays;
import java.util.stream.Collectors;

public enum OttProvider {
    NETFLIX("netflix", 8),
    WATCHA("watcha", 97),
    WAVVE("wavve", 356),
    TVING("tving", 96),
    DISNEY("disney", 337),
    COUPANG("coupang", 564);

    private final String providerName;
    private final int providerId;

    OttProvider(String providerName, int providerId) {
        this.providerName = providerName;
        this.providerId = providerId;
    }

    public String getProviderName() { return providerName; }
    public int getProviderId() { return providerId; }

    public static String parseOtts(String otts) {
        if (otts == null || otts.isBlank()) return "";
        return Arrays.stream(otts.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .flatMap(name -> Arrays.stream(OttProvider.values())
                        .filter(p -> p.getProviderName().equals(name)))
                .map(p -> String.valueOf(p.getProviderId()))
                .distinct()
                .collect(Collectors.joining("|"));
    }
}
