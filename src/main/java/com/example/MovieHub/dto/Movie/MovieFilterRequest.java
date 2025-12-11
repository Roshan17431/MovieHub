package com.example.MovieHub.dto.Movie;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class MovieFilterRequest {

    private String title;
    private List<String> genres;
    private BigDecimal minRating;
    private BigDecimal maxRating;
    private LocalDate releasedAfter;
    private LocalDate releasedBefore;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public BigDecimal getMinRating() {
        return minRating;
    }

    public void setMinRating(BigDecimal minRating) {
        this.minRating = minRating;
    }

    public BigDecimal getMaxRating() {
        return maxRating;
    }

    public void setMaxRating(BigDecimal maxRating) {
        this.maxRating = maxRating;
    }

    public LocalDate getReleasedAfter() {
        return releasedAfter;
    }

    public void setReleasedAfter(LocalDate releasedAfter) {
        this.releasedAfter = releasedAfter;
    }

    public LocalDate getReleasedBefore() {
        return releasedBefore;
    }

    public void setReleasedBefore(LocalDate releasedBefore) {
        this.releasedBefore = releasedBefore;
    }
}
