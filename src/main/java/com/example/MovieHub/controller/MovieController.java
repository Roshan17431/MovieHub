package com.example.MovieHub.controller;

import com.example.MovieHub.dto.Movie.MovieFilterRequest;
import com.example.MovieHub.dto.Movie.MovieRequest;
import com.example.MovieHub.dto.Movie.MovieResponse;
import com.example.MovieHub.service.MovieService;
import com.example.MovieHub.service.S3StorageService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;
    private final S3StorageService storageService;

    public MovieController(MovieService movieService, S3StorageService storageService) {
        this.movieService = movieService;
        this.storageService = storageService;
    }

    @GetMapping
    public ResponseEntity<Page<MovieResponse>> search(
            MovieFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "releaseDate") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return ResponseEntity.ok(movieService.search(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MovieResponse> create(@Valid @RequestBody MovieRequest request) {
        return ResponseEntity.ok(movieService.create(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MovieResponse> update(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return ResponseEntity.ok(movieService.update(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/poster")
    public ResponseEntity<MovieResponse> uploadPoster(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String posterUrl = storageService.uploadMoviePoster(id, file);
        return ResponseEntity.ok(movieService.updatePoster(id, posterUrl));
    }
}
