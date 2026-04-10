package com.dailycut.backend.service;

import com.dailycut.backend.dto.ContentResponseDto;
import com.dailycut.backend.dto.TmdbDetailDto;
import com.dailycut.backend.dto.TmdbResponseDto;
import com.dailycut.backend.utils.MoodGenre;
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

    @Value("${tmdb.api-url}")
    private String apiUrl;

    private static final String IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    public List<ContentResponseDto> getRecommendations(Integer time, String otts, String mode) {
        String providerIds = OttProvider.parseOtts(otts);

        TmdbResponseDto movieResponse = fetchDiscoverData("movie", providerIds);
        TmdbResponseDto tvResponse = fetchDiscoverData("tv", providerIds);

        List<TmdbResponseDto.Result> movieResults = (movieResponse != null && movieResponse.getResults() != null) 
                ? movieResponse.getResults() : Collections.emptyList();
        List<TmdbResponseDto.Result> tvResults = (tvResponse != null && tvResponse.getResults() != null) 
                ? tvResponse.getResults() : Collections.emptyList();

        Set<Integer> modeGenreIds = getModeGenreIdSet(mode);

        return Stream.concat(
                        movieResults.stream().map(r -> new Object[]{r, "movie"}),
                        tvResults.stream().map(r -> new Object[]{r, "tv"})
                )
                .filter(obj -> {
                    TmdbResponseDto.Result result = (TmdbResponseDto.Result) obj[0];
                    return result != null && result.getPosterPath() != null;
                })
                .parallel()
                .map(obj -> {
                    TmdbResponseDto.Result result = (TmdbResponseDto.Result) obj[0];
                    String type = (String) obj[1];
                    
                    Integer runtime = fetchRuntime(type, result.getId());
                    
                    boolean isRuntimeValid = (runtime != null && runtime > 0 && runtime <= time);
                    boolean isGenreMatch = false;
                    
                    if (!isRuntimeValid && !modeGenreIds.isEmpty() && result.getGenreIds() != null) {
                        isGenreMatch = result.getGenreIds().stream().anyMatch(modeGenreIds::contains);
                    }

                    if (isRuntimeValid || isGenreMatch) {
                        return ContentResponseDto.builder()
                                .id(result.getId())
                                .type(type)
                                .title(type.equals("movie") ? result.getTitle() : result.getName())
                                .posterUrl(IMAGE_BASE_URL + result.getPosterPath())
                                .overview(result.getOverview())
                                .popularity(result.getPopularity())
                                .genreIds(result.getGenreIds())
                                .isRuntimeFallback(!isRuntimeValid)
                                .build();
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(ContentResponseDto::getPopularity).reversed())
                .limit(20)
                .collect(Collectors.toList());
    }

    private TmdbResponseDto fetchDiscoverData(String type, String providerIds) {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl + "/discover/" + type)
                    .queryParam("language", "ko-KR")
                    .queryParam("watch_region", "KR")
                    .queryParam("sort_by", "popularity.desc")
                    .queryParam("with_watch_providers", providerIds)
                    .build()
                    .toUri();
            return restTemplate.getForObject(uri, TmdbResponseDto.class);
        } catch (Exception e) {
            System.err.println("Error fetching discover data for " + type + ": " + e.getMessage());
            return null;
        }
    }

    private Integer fetchRuntime(String type, Long id) {
        try {
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl + "/" + type + "/" + id)
                    .queryParam("language", "ko-KR")
                    .build()
                    .toUri();
            TmdbDetailDto detail = restTemplate.getForObject(uri, TmdbDetailDto.class);
            return (detail != null) ? detail.getEffectiveRuntime() : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    private Set<Integer> getModeGenreIdSet(String mode) {
        String genreIdsStr = MoodGenre.getGenreIds(mode);
        if (genreIdsStr == null) return Collections.emptySet();
        try {
            return Arrays.stream(genreIdsStr.split(","))
                    .map(String::trim)
                    .map(Integer::parseInt)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            return Collections.emptySet();
        }
    }
}
