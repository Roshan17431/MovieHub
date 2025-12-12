package com.example.MovieHub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${aws.s3.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        String normalizedRegion = normalizeRegion(region);
        return S3Client.builder()
                .region(Region.of(normalizedRegion))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
    private String normalizeRegion(String configuredRegion) {
        if (configuredRegion == null || configuredRegion.isBlank()) {
            throw new IllegalStateException("AWS region must be configured via 'aws.s3.region'");
        }

        String normalized = configuredRegion.trim().replace("_", "-").toLowerCase();

        try {
            Region.of(normalized);
            return normalized;
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Invalid AWS region configured for 'aws.s3.region': " + configuredRegion +
                            " (normalized to '" + normalized + "')",
                    ex);
        }
    }
}