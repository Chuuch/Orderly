package com.chuch.Orderly.global.ratelimit;

import com.chuch.Orderly.global.exception.ApiErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RequiredArgsConstructor
@Slf4j
public class PublicRateLimitFilter extends OncePerRequestFilter {

    private static final int TOO_MANY_REQUESTS = 429;
    private static final String PREFIX = "orderly:ratelimit:public:";
    private static final Pattern CONTEXT_PATH =
            Pattern.compile("^/api/v1/public/tables/qr/([0-9a-f-]{36})/context$");
    private static final Pattern PLACE_ORDER_PATH =
            Pattern.compile("^/api/v1/public/tables/qr/([0-9a-f-]{36})/orders$");
    private static final Pattern ORDER_STATUS_PATH =
            Pattern.compile("^/api/v1/public/orders/([0-9a-f-]{36})$");
    private static final Pattern CANCEL_ORDER_PATH =
            Pattern.compile("^/api/v1/public/orders/([0-9a-f-]{36})/cancel$");

    private final RateLimitProperties properties;
    private final RedisRateLimiter rateLimiter;
    private final JsonMapper jsonMapper;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if (!properties.isEnabled()) {
            return true;
        }
        return !request.getRequestURI().startsWith("/api/v1/public/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        ResolvedLimit resolved = resolveLimit(request);
        if (resolved == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!isAllowed(resolved)) {
            writeTooManyRequests(response, request.getRequestURI(), resolved.windowSeconds());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(ResolvedLimit resolved) {
        try {
            return rateLimiter.tryConsume(
                    resolved.redisKey(),
                    resolved.maxRequests(),
                    resolved.windowSeconds()
            );
        } catch (Exception ex) {
            log.warn("Rate limit check failed for key {}, allowing request", resolved.redisKey(), ex);
            return true;
        }
    }

    private void writeTooManyRequests(HttpServletResponse response, String path, int retryAfterSeconds)
            throws IOException {
        response.setStatus(TOO_MANY_REQUESTS);
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(TOO_MANY_REQUESTS)
                .error("Too Many Requests")
                .message("Too many requests. Try again later.")
                .path(path)
                .build();

        response.getWriter().write(jsonMapper.writeValueAsString(body));
    }

    private ResolvedLimit resolveLimit(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getRequestURI();
        String clientIp = clientIp(request);

        Matcher context = CONTEXT_PATH.matcher(path);
        if ("GET".equals(method) && context.matches()) {
            var rule = properties.getRules().getContext();
            return new ResolvedLimit(
                    PREFIX + "context:ip:" + clientIp,
                    rule.getRequests(),
                    rule.getWindowSeconds()
            );
        }

        Matcher placeOrder = PLACE_ORDER_PATH.matcher(path);
        if ("POST".equals(method) && placeOrder.matches()) {
            var rule = properties.getRules().getPlaceOrder();
            String qrToken = placeOrder.group(1);
            return new ResolvedLimit(
                    PREFIX + "place-order:ip:" + clientIp + ":qr:" + qrToken,
                    rule.getRequests(),
                    rule.getWindowSeconds()
            );
        }

        Matcher orderStatus = ORDER_STATUS_PATH.matcher(path);
        if ("GET".equals(method) && orderStatus.matches()) {
            var rule = properties.getRules().getOrderStatus();
            String orderId = orderStatus.group(1);
            return new ResolvedLimit(
                    PREFIX + "order-status:order:" + orderId,
                    rule.getRequests(),
                    rule.getWindowSeconds()
            );
        }

        Matcher cancel = CANCEL_ORDER_PATH.matcher(path);
        if ("POST".equals(method) && cancel.matches()) {
            var rule = properties.getRules().getCancelOrder();
            String orderId = cancel.group(1);
            return new ResolvedLimit(
                    PREFIX + "cancel-order:order:" + orderId,
                    rule.getRequests(),
                    rule.getWindowSeconds()
            );
        }

        return null;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private record ResolvedLimit(String redisKey, int maxRequests, int windowSeconds) {}
}
