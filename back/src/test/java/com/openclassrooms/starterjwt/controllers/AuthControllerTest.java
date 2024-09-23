package com.openclassrooms.starterjwt.controllers;

// Importation des bibliothèques nécessaires pour les tests, les assertions, et les mocks
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

// Annotation pour utiliser Mockito avec JUnit 5
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthControllerTest {

    // Création des objets simulés (mocks) pour les dépendances du contrôleur
    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    // Injection des mocks dans l'instance du contrôleur
    @InjectMocks
    private AuthController authController;

    // Méthode exécutée avant chaque test pour préparer l'environnement de test
    @BeforeEach
    public void setup() {
        // Configuration du contexte de sécurité pour les tests
        SecurityContextHolder.setContext(securityContext);
    }

    // Test de la méthode authenticateUser() pour un utilisateur avec des identifiants valides
    @Test
    void authenticateUserTest() {
        // GIVEN
        // Création d'une requête de connexion factice
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("email@test.com");
        loginRequest.setPassword("password");

        // Création d'un utilisateur avec des détails simulés
        UserDetailsImpl userDetails = mock(UserDetailsImpl.class);
        when(userDetails.getUsername()).thenReturn("user@example.com");

        // Configuration des comportements attendus des mocks
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockJwtToken");

        // Création d'un utilisateur factice en utilisant le constructeur avec des arguments
        User mockUser = new User(
                "user1@mail.com",  // email
                "USER",            // lastName
                "User",            // firstName
                "password",        // password
                false              // admin
        );
        mockUser.setId(1L);  // Utilisation de `setId` pour l'ID
        mockUser.setCreatedAt(LocalDateTime.now());
        mockUser.setUpdatedAt(LocalDateTime.now());

        when(userRepository.findByEmail(any())).thenReturn(java.util.Optional.of(mockUser));

        // WHEN
        // Appel de la méthode authenticateUser du contrôleur
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // THEN
        // Vérification du code de statut HTTP et du contenu de la réponse
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(JwtResponse.class);
        JwtResponse jwtResponse = (JwtResponse) response.getBody();
        assertThat(jwtResponse.getToken()).isEqualTo("mockJwtToken");
        assertThat(jwtResponse.getUsername()).isEqualTo("user@example.com");
    }

    // Test de la méthode registerUser() pour un utilisateur avec des informations valides
    @Test
    void registerUserSuccessTest() {
        // GIVEN
        // Création d'une requête d'inscription factice
        SignupRequest signUpRequest = new SignupRequest();
        signUpRequest.setEmail("user@example.com");
        signUpRequest.setFirstName("User");
        signUpRequest.setLastName("USER");
        signUpRequest.setPassword("password");

        // Configuration des comportements attendus des mocks
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        // WHEN
        // Appel de la méthode registerUser du contrôleur
        ResponseEntity<?> response = authController.registerUser(signUpRequest);

        // THEN
        // Vérification du code de statut HTTP et du contenu de la réponse
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(MessageResponse.class);
        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertThat(messageResponse.getMessage()).isEqualTo("User registered successfully!");
    }

    // Test de la méthode registerUser() pour un utilisateur dont l'email existe déjà
    @Test
    void registerUserBadRequestTest() {
        // GIVEN
        // Création d'une requête d'inscription factice avec un email déjà existant
        SignupRequest invalidSignUpRequest = new SignupRequest();
        invalidSignUpRequest.setEmail("user@example.com");
        invalidSignUpRequest.setFirstName("User");
        invalidSignUpRequest.setLastName("USER");
        invalidSignUpRequest.setPassword("password");

        // Configuration des comportements attendus des mocks
        when(userRepository.existsByEmail(any())).thenReturn(true);

        // WHEN
        // Appel de la méthode registerUser du contrôleur
        ResponseEntity<?> response = authController.registerUser(invalidSignUpRequest);

        // THEN
        // Vérification du code de statut HTTP pour un email existant
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
