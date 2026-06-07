package com.chuch.Orderly.domain.user.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.chuch.Orderly.domain.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
            try {
                String jwt = getJwtFromRequest(request);

                if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                    String email = jwtTokenProvider.getEmailFromToken(jwt);
                    userRepository.findByEmail(email).ifPresentOrElse(user -> {
                        if (!user.isActive()) {
                            log.warn("JWT valid but user {} is inactive", email);
                            return;
                        }
                        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleType().name()))
                                .toList();
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                user.getId().toString(), null, authorities
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.debug("Authenticated user {} with roles {}", email, authorities);
                    }, () -> log.warn("JWT valid but no user found for email {}", email));
                }
            } catch (Exception e) {
                log.error("Could not set user authentication in security context", e);
            }
            filterChain.doFilter(request, response);
        }

        private String getJwtFromRequest(HttpServletRequest request) {
            String bearerToken = request.getHeader("Authorization");
            if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                return bearerToken.substring(7);
            }
            return null;
        }
}
