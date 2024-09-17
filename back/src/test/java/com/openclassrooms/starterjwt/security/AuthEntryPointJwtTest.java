// Définition du package dans lequel se trouve la classe
package com.openclassrooms.starterjwt.security;

// Importations statiques nécessaires pour les assertions
import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.MimeTypeUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;

// Extension du test pour utiliser Mockito, un framework de mock pour les tests unitaires
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthEntryPointJwtTest {

    // Création d'une instance de la classe AuthEntryPointJwt, qui gère les erreurs d'authentification
    private AuthEntryPointJwt authEntryPointJwt = new AuthEntryPointJwt();

    // Test unitaire de la méthode 'commence' de la classe AuthEntryPointJwt
    @Test
    void testCommence() throws IOException, ServletException {

        // Simule une requête HTTP entrante
        MockHttpServletRequest request = new MockHttpServletRequest();
        
        // Simule une réponse HTTP sortante
        MockHttpServletResponse response = new MockHttpServletResponse();

        // Crée une exception d'authentification simulée, utilisée pour déclencher la logique dans 'commence'
        AuthenticationException authException = new AuthenticationException("Unauthorized error message") {};

        // Appel de la méthode 'commence' de la classe AuthEntryPointJwt
        // Elle est appelée lorsque l'utilisateur tente d'accéder à une ressource sans être authentifié
        authEntryPointJwt.commence(request, response, authException);

        // Vérifie que le statut HTTP de la réponse est 401 (Unauthorized)
        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);

        // Vérifie que le type de contenu de la réponse est du JSON
        assertThat(response.getContentType()).isEqualTo(MimeTypeUtils.APPLICATION_JSON_VALUE);

        // Convertit la réponse JSON en une Map pour vérifier son contenu
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> responseBody = objectMapper.readValue(response.getContentAsString(), Map.class);

        // Vérifie que le champ "status" de la réponse est bien égal à 401
        assertThat(responseBody.get("status")).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);

        // Vérifie que le champ "error" de la réponse est bien "Unauthorized"
        assertThat(responseBody.get("error")).isEqualTo("Unauthorized");

        // Vérifie que le message de l'erreur est bien celui passé dans l'exception
        assertThat(responseBody.get("message")).isEqualTo("Unauthorized error message");

        // Vérifie que le chemin de la requête est celui utilisé dans la requête
        assertThat(responseBody.get("path")).isEqualTo(request.getServletPath());
    }
}
