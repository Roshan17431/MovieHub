package com.example.MovieHub.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MovieDto {
    Long id;
    @NotBlank
    @Size(max = 150)
    String title;

    @NotBlank
    @Size(max = 100)
    String genre;

    @NotNull
    @DecimalMin("0.0")
    @Digits(integer = 3, fraction = 1)
    BigDecimal rating;

    @NotNull
    @PastOrPresent
    LocalDate releaseDate;

    @NotBlank @Size(max = 500)
    String posterUrl;

    @Size(max = 2000)
    String description;
}
