package com.example.MovieHub.service;

import com.example.MovieHub.dto.Movie.MovieFilterRequest;
import com.example.MovieHub.dto.Movie.MovieRequest;
import com.example.MovieHub.dto.Movie.MovieResponse;
import com.example.MovieHub.entity.Movie;
import com.example.MovieHub.repo.MovieRepository;
import com.example.MovieHub.repo.ReviewRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;

    public MovieService(MovieRepository movieRepository, ReviewRepository reviewRepository) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public MovieResponse create(MovieRequest request){
        Movie movie = mapToEntity(new Movie(),request);
        Movie saved = movieRepository.save(movie);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> search(MovieFilterRequest filterRequest, Pageable pageable) {
        Specification<Movie> specification = buildSpecification(filterRequest);
        return movieRepository.findAll(specification, pageable).map(this::toResponseWithAggregates);
    }

    @Transactional(readOnly = true)
    public MovieResponse getById(Long id) {
        Movie movie = movieRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        return toResponseWithAggregates(movie);
    }

    @Transactional
    public MovieResponse update(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        mapToEntity(movie, request);
        Movie saved = movieRepository.save(movie);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new IllegalArgumentException("Movie not found");
        }
        movieRepository.deleteById(id);
    }

    @Transactional
    public MovieResponse updatePoster(Long movieId, String posterUrl) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found"));
        movie.setPosterUrl(posterUrl);
        Movie saved = movieRepository.save(movie);
        return toResponseWithAggregates(saved);
    }

    private Specification<Movie> buildSpecification(MovieFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getTitle() != null && !filter.getTitle().isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")), "%" + filter.getTitle().toLowerCase() + "%"));
            }

            Optional.ofNullable(filter.getGenres())
                    .filter(genres -> !genres.isEmpty())
                    .ifPresent(genres -> predicates.add(root.get("genre").in(genres)));

            Optional.ofNullable(filter.getMinRating())
                    .ifPresent(min -> predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), min)));
            Optional.ofNullable(filter.getMaxRating())
                    .ifPresent(max -> predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("rating"), max)));
            Optional.ofNullable(filter.getReleasedAfter())
                    .ifPresent(date -> predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("releaseDate"), date)));
            Optional.ofNullable(filter.getReleasedBefore())
                    .ifPresent(date -> predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("releaseDate"), date)));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Movie mapToEntity(Movie movie, MovieRequest request) {
        movie.setTitle(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setRating(request.getRating());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setDescription(request.getDescription());
        return movie;
    }

    private MovieResponse toResponse(Movie movie) {
        MovieResponse response = new MovieResponse();
        response.setId(movie.getId());
        response.setTitle(movie.getTitle());
        response.setGenre(movie.getGenre());
        response.setRating(movie.getRating());
        response.setReleaseDate(movie.getReleaseDate());
        response.setPosterUrl(movie.getPosterUrl());
        response.setDescription(movie.getDescription());
        return response;
    }

    private MovieResponse toResponseWithAggregates(Movie movie) {
        MovieResponse response = toResponse(movie);
        Double averageRating = reviewRepository.findAverageRating(movie.getId());
        Long reviewCount = reviewRepository.countByMovieId(movie.getId());
        response.setAverageReviewRating(averageRating != null ? averageRating : 0.0);
        response.setReviewCount(reviewCount);
        return response;
    }

}



