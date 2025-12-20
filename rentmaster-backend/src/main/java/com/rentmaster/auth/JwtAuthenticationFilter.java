package com.rentmaster.auth;

import com.rentmaster.multitenancy.OrganizationContext;
import com.rentmaster.multitenancy.OrganizationRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OrganizationContext organizationContext;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        final String organizationHeader = request.getHeader("X-Organization-Id");

        String username = null;
        String jwt = null;
        String role = null;
        Long organizationId = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
                role = jwtUtil.extractRole(jwt);
                organizationId = jwtUtil.extractOrganizationId(jwt);
            } catch (Exception e) {
                // Invalid token, continue without authentication
            }
        }

        // Set organization context from header or JWT
        if (organizationHeader != null && !organizationHeader.isEmpty()) {
            try {
                Long orgId = Long.parseLong(organizationHeader);
                organizationRepository.findById(orgId).ifPresent(org -> {
                    organizationContext.setOrganization(org);
                });
            } catch (NumberFormatException e) {
                // Invalid organization ID, ignore
            }
        } else if (organizationId != null) {
            organizationRepository.findById(organizationId).ifPresent(org -> {
                organizationContext.setOrganization(org);
            });
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, username)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}

