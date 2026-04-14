package com.dailycut.backend.service;

import com.dailycut.backend.dto.ContentResponseDto;
import com.dailycut.backend.dto.TmdbDetailDto;
import com.dailycut.backend.dto.TmdbResponseDto;
import com.dailycut.backend.utils.OttProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RestTemplate restTemplate;
    private final ScoreCalculator scoreCalculator;

    @Value("${tmdb.api-url}")
    private String apiUrl;

    private static final String IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    public List<ContentResponseDto> getRecommendations(
            Integer time,
            String otts,
            Set<Integer> selectedGenreIds) {

        String providerIds = OttProvider.parseOtts(otts);

        TmdbResponseDto movieResponse = fetchDiscoverData("movie", providerIds);
        TmdbResponseDto tvResponse    = fetchDiscoverData("tv",    providerIds);

        List<TmdbResponseDto.Result> movieResults = Optional.ofNullable(movieResponse)
                .map(TmdbResponseDto::getResults).orElse(Collections.emptyList());
        List<TmdbResponseDto.Result> tvResults = Optional.ofNullable(tvResponse)
                .map(TmdbResponseDto::getResults).orElse(Collections.emptyList());

        List<List<Integer>> recentGenreHistory = Collections.emptyList();

        return Stream.concat(
                        movieResults.stream().map(r -> new Object[]{r, "movie"}),
                        tvResults.stream().map(r -> new Object[]{r, "tv"})
                )
                .filter(obj -> {
                    TmdbResponseDto.Result r = (TmdbResponseDto.Result) obj[0];
                    return r != null && r.getPosterPath() != null;
                })
                .parallel()
                .map(obj -> {
                    TmdbResponseDto.Result result = (TmdbResponseDto.Result) obj[0];
                    String type = (String) obj[1];

                    TmdbDetailDto detail = fetchDetail(type, result.getId());
                    int runtime        = (detail != null) ? detail.getEffectiveRuntime() : 0;
                    Double voteAverage = (detail != null) ? detail.getVoteAverage()      : null;
                    Double popularity  = result.getPopularity();

                    double scoreT = scoreCalculator.calculateT(time, runtime);

                    boolean isRuntimeFallback = false;
                    if (scoreT == 0.0) {
                        double genreScore = scoreCalculator.calculateG(selectedGenreIds, result.getGenreIds());
                        if (genreScore > 0.0) {
                            isRuntimeFallback = true;
                        } else {
                            return null;
                        }
                    }

                    double scoreG = scoreCalculator.calculateG(selectedGenreIds, result.getGenreIds());
                    double scoreQ = scoreCalculator.calculateQ(voteAverage);
                    double scoreP = scoreCalculator.calculateP(popularity);
                    double scoreD = scoreCalculator.calculateD(result.getGenreIds(), recentGenreHistory);
                    double scoreE = scoreCalculator.calculateE(scoreT, scoreG);
                    double scoreU = scoreCalculator.calculateU(0.0);

                    double finalScore = scoreT + scoreG + scoreQ + scoreP + scoreD + scoreE + scoreU;

                    return ContentResponseDto.builder()
                            .id(result.getId())
                            .type(type)
                            .title(type.equals("movie") ? result.getTitle() : result.getName())
                            .posterUrl(IMAGE_BASE_URL + result.getPosterPath())
                            .overview(result.getOverview())
                            .genreIds(result.getGenreIds())
                            .isRuntimeFallback(isRuntimeFallback)
                            .runtime(runtime)
                            .tmdbRating(voteAverage)
                            .popularity(popularity)
                            .scoreT(scoreT)
                            .scoreG(scoreG)
                            .scoreQ(scoreQ)
                            .scoreP(scoreP)
                            .scoreD(scoreD)
                            .scoreE(scoreE)
                            .scoreU(scoreU)
                            .finalScore(finalScore)
                            .build();
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingDouble(ContentResponseDto::getFinalScore).reversed())
                .limit(20)
                .collect(Collectors.toList());
    }

    private TmdbResponseDto fetchDiscoverData(String type, String providerIds) {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl + "/discover/" + type)
                    .queryParam("language",             "ko-KR")
                    .queryParam("watch_region",         "KR")
                    .queryParam("sort_by",              "popularity.desc")
                    .queryParam("with_watch_providers", providerIds)
                    .build()
                    .toUri();
            return restTemplate.getForObject(uri, TmdbResponseDto.class);
        } catch (Exception e) {
            System.err.println("[RecommendService] Discover fetch 실패 (" + type + "): " + e.getMessage());
            return null;
        }
    }

    private TmdbDetailDto fetchDetail(String type, Long id) {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl + "/" + type + "/" + id)
                    .queryParam("language", "ko-KR")
                    .build()
                    .toUri();
            return restTemplate.getForObject(uri, TmdbDetailDto.class);
        } catch (Exception e) {
            System.err.println("[RecommendService] Detail fetch 실패 (id=" + id + "): " + e.getMessage());
            return null;
        }
    }
}