package com.example.MovieHub.repo;

import com.example.MovieHub.entity.Movie;
import com.example.MovieHub.entity.Review;
import com.example.MovieHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovie(Movie movie);

    Optional<Review> findByMovieAndUser(Movie movie, User user);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.id = :movieId")
    Double findAverageRating(@Param("movieId") Long movieId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.movie.id = :movieId")
    long countByMovieId(@Param("movieId") Long movieId);
}
