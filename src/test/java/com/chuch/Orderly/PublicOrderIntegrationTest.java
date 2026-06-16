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
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
@AutoConfigureMockMvc
@Sql(scripts = "/test-data/public-order-flow.sql")
class PublicOrderIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createOrderFromQr_returnsCreatedOrderWithTableNumber() throws Exception {
        String body = """
            {
              "items": [
                { "menuItemId": "201e1da9-2a01-44b2-a297-3abf074e5ffa", "quantity": 1 }
              ]
            }
            """;

        mockMvc.perform(
                post("/api/v1/public/tables/qr/d656853e-d0df-47a3-873b-b42511fbbea3/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.tableNumber").value("1"))
                .andExpect(jsonPath("$.totalAmount").value(12.50))
                .andExpect(jsonPath("$.items[0].menuItemName").value("Margherita"))
                .andExpect(jsonPath("$.createdAt").exists());
    }
}
