package com.example.MovieHub.service;

import com.example.MovieHub.entity.Movie;
import com.example.MovieHub.repo.MovieRepository;
import com.example.MovieHub.repo.ReviewRepository;
import jakarta.transaction.Transactional;

public class MovieService {
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public MovieService(MovieRepository movieRepository, ReviewRepository reviewRepository) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }


}
