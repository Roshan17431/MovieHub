package com.example.MovieHub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Data
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String genre;

    @NotNull
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal rating;

    @NotNull
    @Column(nullable = false)
    private LocalDate releaseDate;

    private String posterUrl;

    @Column(length = 4000)
    private String description;


}