package com.dailycut.backend.service;
 
import org.springframework.stereotype.Component;
 
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
 
/**
 * DailyCut 추천 알고리즘 점수 계산 엔진
 *
 * FinalScore(c) = T(c) + G(c) + Q(c) + P(c) + D(c) + E(c) + U(c)
 */
@Component
public class ScoreCalculator {
 
    private static final Map<Integer, List<Integer>> SIMILAR_GENRES = Map.of(
        35,   List.of(18, 10751, 10749),
        53,   List.of(80, 9648, 28),
        878,  List.of(14, 12),
        18,   List.of(35, 10749, 9648),
        28,   List.of(53, 12, 878),
        16,   List.of(35, 10751, 14)
    );
 
    // T(c) — 시간 적합도 (max 50)
    public double calculateT(int inputTime, int runtime) {
        if (runtime <= 0) return 0.0;
        int tolerance = getTolerance(inputTime);
        int diff = Math.abs(inputTime - runtime);
        if (diff > tolerance) return 0.0;
        return Math.max(0.0, 50.0 - 2.0 * diff);
    }
 
    // G(c) — 장르 적합도 (max 20)
    public double calculateG(Set<Integer> selectedGenreIds, List<Integer> contentGenreIds) {
        if (selectedGenreIds == null || selectedGenreIds.isEmpty()) return 10.0;
        if (contentGenreIds == null || contentGenreIds.isEmpty()) return 0.0;
 
        boolean exactMatch = contentGenreIds.stream().anyMatch(selectedGenreIds::contains);
        if (exactMatch) return 20.0;
 
        boolean similarMatch = selectedGenreIds.stream()
                .anyMatch(selectedId -> {
                    List<Integer> similar = SIMILAR_GENRES.getOrDefault(selectedId, Collections.emptyList());
                    return contentGenreIds.stream().anyMatch(similar::contains);
                });
        if (similarMatch) return 12.0;
 
        return 0.0;
    }
 
    // Q(c) — 품질 점수 (max 15)
    public double calculateQ(Double voteAverage) {
        if (voteAverage == null || voteAverage <= 0) return 0.0;
        return Math.min(15.0, 1.5 * voteAverage);
    }
 
    // P(c) — 인기도 점수 (max 10)
    public double calculateP(Double popularity) {
        if (popularity == null || popularity <= 0) return 0.0;
        double normalized = Math.min(popularity / 500.0, 1.0);
        return Math.round(normalized * 10.0 * 10.0) / 10.0;
    }
 
    // D(c) — 다양성 점수 (max 5)
    public double calculateD(List<Integer> contentGenreIds, List<List<Integer>> recentGenreHistory) {
        if (recentGenreHistory == null || recentGenreHistory.isEmpty()) return 5.0;
        if (contentGenreIds == null || contentGenreIds.isEmpty()) return 0.0;
 
        long overlapCount = recentGenreHistory.stream()
                .filter(historyGenres -> historyGenres.stream().anyMatch(contentGenreIds::contains))
                .count();
 
        double overlapRatio = (double) overlapCount / recentGenreHistory.size();
        if (overlapRatio == 0.0) return 5.0;
        if (overlapRatio <= 0.5) return 2.0;
        return 0.0;
    }
 
    // E(c) — 장르 확장 보너스 (5점 or 0점)
    public double calculateE(double scoreT, double scoreG) {
        return (scoreT >= 40.0 && scoreG >= 12.0) ? 5.0 : 0.0;
    }
 
    // U(c) — 사용자 반응 보정 (MVP: 0점 고정)
    public double calculateU(double adjustmentScore) {
        return adjustmentScore;
    }
 
    // 시간 허용 오차
    public int getTolerance(int inputTime) {
        if (inputTime <= 20) return 5;
        if (inputTime <= 60) return 10;
        return 15;
    }
}