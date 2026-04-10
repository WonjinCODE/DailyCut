package com.dailycut.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TmdbResponseDto {
    private int page;
    private List<Result> results;

    public TmdbResponseDto() {}
    public int getPage() { return page; }
    public List<Result> getResults() { return results; }

    public static class Result {
        private Long id;
        private String title;
        private String name;
        @JsonProperty("poster_path")
        private String posterPath;
        private String overview;
        private Double popularity;
        @JsonProperty("genre_ids")
        private List<Integer> genreIds;

        public Result() {}
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getName() { return name; }
        public String getPosterPath() { return posterPath; }
        public String getOverview() { return overview; }
        public Double getPopularity() { return popularity; }
        public List<Integer> getGenreIds() { return genreIds; }
    }
}
