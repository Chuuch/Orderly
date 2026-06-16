package com.chuch.Orderly.global.ratelimit;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private Rules rules = new Rules();

    @Getter
    @Setter
    public static class Rules {
        private Rule context = new Rule(60, 60);
        private Rule placeOrder = new Rule(10, 60);
        private Rule orderStatus = new Rule(30, 60);
        private Rule cancelOrder = new Rule(5, 60);

    }

    @Getter
    @Setter
    public static class Rule {
        private int requests;
        private int windowSeconds;
        public Rule() {}
        public Rule(int requests, int windowSeconds) {
            this.requests = requests;
            this.windowSeconds = windowSeconds;
        }
    }
}