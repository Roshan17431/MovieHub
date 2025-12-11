package com.example.MovieHub.controller;

import com.example.MovieHub.dto.review.ReviewRequest;
import com.example.MovieHub.dto.review.ReviewResponse;
import com.example.MovieHub.service.ReviewService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies/{movieId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> list(@PathVariable Long movieId) {
        return ResponseEntity.ok(reviewService.findByMovie(movieId));
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> create(
            @PathVariable Long movieId, Authentication authentication, @Valid @RequestBody ReviewRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(reviewService.create(movieId, email, request));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> update(
            @PathVariable Long reviewId, Authentication authentication, @Valid @RequestBody ReviewRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(reviewService.update(reviewId, email, request));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long reviewId, Authentication authentication, @PathVariable Long movieId) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
        String email = authentication.getName();
        reviewService.delete(reviewId, email, isAdmin);
        return ResponseEntity.noContent().build();
    }
}