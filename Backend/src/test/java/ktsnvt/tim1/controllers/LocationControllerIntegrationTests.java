package ktsnvt.tim1.controllers;

import ktsnvt.tim1.DTOs.LocationDTO;
import ktsnvt.tim1.utils.RestResponsePage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LocationControllerIntegrationTests {
    @LocalServerPort
    private int port;

    @Autowired
    TestRestTemplate testRestTemplate;

    @SuppressWarnings("ConstantConditions")
    @Test
    public void getLocations_locationsReturned() {
        ParameterizedTypeReference<RestResponsePage<LocationDTO>> responseType = new ParameterizedTypeReference<RestResponsePage<LocationDTO>>() {
        };

        ResponseEntity<RestResponsePage<LocationDTO>> result = testRestTemplate.exchange(createURLWithPort(
                "/locations?page=0&size=5"), HttpMethod.GET, null, responseType);

        List<LocationDTO> locations = result.getBody().getContent();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(5, locations.size());
    }

    @Test
    public void getLocation_locationExists_locationReturned() {
        ResponseEntity<LocationDTO> result = testRestTemplate
                .exchange(createURLWithPort("/locations/1"), HttpMethod.GET,
                        null, LocationDTO.class);

        LocationDTO location = result.getBody();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(location);
        assertEquals(1L, location.getId());
    }

    @Test
    public void getLocation_locationDoesNotExist_errorMessageReturned() {
        ResponseEntity<String> result = testRestTemplate.exchange(createURLWithPort("/locations/31"), HttpMethod.GET,
                null, String.class);

        String errorMessage = result.getBody();

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertEquals("Location not found", errorMessage);
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void searchLocations_searchParameterProvided_locationsReturned() {
        ParameterizedTypeReference<RestResponsePage<LocationDTO>> responseType = new ParameterizedTypeReference<RestResponsePage<LocationDTO>>() {
        };

        String name = "black";

        ResponseEntity<RestResponsePage<LocationDTO>> result = testRestTemplate.exchange(createURLWithPort(
                "/locations/search?page=0&size=5&name=black"), HttpMethod.GET, null, responseType);

        List<LocationDTO> locations = result.getBody().getContent();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, locations.size());

        for (LocationDTO location : locations) {
            assertTrue(location.getName().toLowerCase().contains(name));
        }
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void searchLocations_searchParameterEmpty_locationsReturned() {
        ParameterizedTypeReference<RestResponsePage<LocationDTO>> responseType = new ParameterizedTypeReference<RestResponsePage<LocationDTO>>() {
        };

        ResponseEntity<RestResponsePage<LocationDTO>> result = testRestTemplate.exchange(createURLWithPort(
                "/locations/search?page=0&size=5&name="), HttpMethod.GET, null, responseType);

        List<LocationDTO> locations = result.getBody().getContent();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(5, locations.size());
        assertEquals(30, result.getBody().getTotalElements());
    }

    @SuppressWarnings("ConstantConditions")
    @Test
    public void searchLocations_searchParameterDoesNotMatchAnyLocation_emptyPageReturned() {
        ParameterizedTypeReference<RestResponsePage<LocationDTO>> responseType = new ParameterizedTypeReference<RestResponsePage<LocationDTO>>() {
        };

        ResponseEntity<RestResponsePage<LocationDTO>> result = testRestTemplate.exchange(createURLWithPort(
                "/locations/search?page=0&size=5&name=dsadahfghbfghvcs"), HttpMethod.GET, null, responseType);

        List<LocationDTO> locations = result.getBody().getContent();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(0, locations.size());
    }


    private String createURLWithPort(String uri) {
        return "http://localhost:" + port + "/api" + uri;
    }


}
