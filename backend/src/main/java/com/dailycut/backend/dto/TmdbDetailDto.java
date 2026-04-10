package com.dailycut.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TmdbDetailDto {
    private Integer runtime;
    @JsonProperty("episode_run_time")
    private List<Integer> episodeRunTime;

    public TmdbDetailDto() {}
    public Integer getRuntime() { return runtime; }
    public List<Integer> getEpisodeRunTime() { return episodeRunTime; }

    public Integer getEffectiveRuntime() {
        if (runtime != null && runtime > 0) return runtime;
        if (episodeRunTime != null && !episodeRunTime.isEmpty()) return episodeRunTime.get(0);
        return 0;
    }
}
