package com.chuch.Orderly;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
class OnboardingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void onboard_createsRestaurantAndAdmin() throws Exception {
        String body = """
            {
              "restaurantName": "Test Bistro",
              "subdomain": "test-bistro-%s",
              "firstName": "Ada",
              "lastName": "Admin",
              "email": "ada+%s@example.com",
              "password": "password123"
            }
            """.formatted(System.currentTimeMillis(), System.currentTimeMillis());

        mockMvc.perform(post("/api/v1/auth/onboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.roles[0]").value("RESTAURANT_ADMIN"))
                .andExpect(jsonPath("$.restaurantId").exists());
    }
}