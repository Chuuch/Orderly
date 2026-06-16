package com.chuch.Orderly;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
@Sql(scripts = "/test-data/public-order-flow.sql")
@TestPropertySource(properties = {
        "app.rate-limit.enabled=true",
        "app.rate-limit.rules.context.requests=2",
        "app.rate-limit.rules.context.window-seconds=60"
})
class PublicRateLimitIntegrationTest {

    private static final String QR_CONTEXT_URL =
            "/api/v1/public/tables/qr/d656853e-d0df-47a3-873b-b42511fbbea3/context";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicContext_returns429WhenRateLimitExceeded() throws Exception {
        mockMvc.perform(get(QR_CONTEXT_URL)).andExpect(status().isOk());
        mockMvc.perform(get(QR_CONTEXT_URL)).andExpect(status().isOk());

        mockMvc.perform(get(QR_CONTEXT_URL))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "60"))
                .andExpect(jsonPath("$.status").value(429))
                .andExpect(jsonPath("$.error").value("Too Many Requests"));
    }
}
