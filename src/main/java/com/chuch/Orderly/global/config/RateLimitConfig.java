package com.chuch.Orderly.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.chuch.Orderly.global.ratelimit.PublicRateLimitFilter;
import com.chuch.Orderly.global.ratelimit.RateLimitProperties;
import com.chuch.Orderly.global.ratelimit.RedisRateLimiter;

import tools.jackson.databind.json.JsonMapper;

@Configuration
public class RateLimitConfig {

    @Bean
    public PublicRateLimitFilter publicRateLimitFilter(
            RateLimitProperties properties,
            RedisRateLimiter rateLimiter,
            JsonMapper jsonMapper
    ) {
        return new PublicRateLimitFilter(properties, rateLimiter, jsonMapper);
    }
}
