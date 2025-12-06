package com.example.MovieHub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class MovieHubApplication {

	public static void main(String[] args) {

        SpringApplication.run(MovieHubApplication.class, args);
	}

}
