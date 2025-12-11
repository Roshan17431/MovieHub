package com.example.MovieHub.dto.Movie;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MovieResponse {
    private Long id;
    private String title;
    private String genre;
    private BigDecimal rating;
    private LocalDate releaseDate;
    private String posterUrl;
    private String description;
    private Double averageReviewRating;
    private Long reviewCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAverageReviewRating() {
        return averageReviewRating;
    }

    public void setAverageReviewRating(Double averageReviewRating) {
        this.averageReviewRating = averageReviewRating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }
}
