package com.example.MovieHub.service;

import com.example.MovieHub.dto.review.ReviewRequest;
import com.example.MovieHub.dto.review.ReviewResponse;
import com.example.MovieHub.entity.Movie;
import com.example.MovieHub.entity.Review;
import com.example.MovieHub.entity.User;
import com.example.MovieHub.repo.MovieRepository;
import com.example.MovieHub.repo.ReviewRepository;
import com.example.MovieHub.repo.UserRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public ReviewService(
            ReviewRepository reviewRepository, MovieRepository movieRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewResponse create(Long movieId, String userEmail, ReviewRequest request) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        reviewRepository
                .findByMovieAndUser(movie, user)
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("User already reviewed this movie");
                });
        Review review = new Review();
        review.setMovie(movie);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    @Transactional
    public ReviewResponse update(Long reviewId, String userEmail, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You can only update your own review");
        }
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(Instant.now());
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void delete(Long reviewId, String userEmail, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!isAdmin && !review.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You can only delete your own review");
        }
        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> findByMovie(Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        return reviewRepository.findByMovie(movie).stream().map(this::toResponse).toList();
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setMovieId(review.getMovie().getId());
        response.setUserId(review.getUser().getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        return response;
    }
}
