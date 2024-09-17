package com.openclassrooms.starterjwt.controllers;

// Importation des assertions pour vérifier les résultats des tests
import static org.assertj.core.api.Assertions.assertThat;
// Importation des méthodes pour simuler des comportements avec Mockito
import static org.mockito.Mockito.*;

// Importation des classes nécessaires pour les tests et la manipulation du temps
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

// Importation des classes du projet
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

// Annotation pour utiliser Mockito avec JUnit 5
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserControllerTest {

    // Création des objets simulés pour UserService, UserMapper et SecurityContext
    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private SecurityContext securityContext;

    // Injection des mocks dans l'instance du contrôleur
    @InjectMocks
    private UserController userController;

    // Instance d'utilisateur pour les tests
    private User mockUser;

    // Méthode exécutée avant chaque test pour initialiser les données
    @BeforeEach
    public void setup() {
        SecurityContextHolder.setContext(securityContext);

        // Création d'un utilisateur factice pour les tests
        this.mockUser = new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now());
    }

    // Test de la méthode findById() lorsqu'un utilisateur est trouvé avec succès
    @Test
    void findByIdSuccessTest() {
        // GIVEN
        String userId = "1";
        User user = this.mockUser;
        UserDto userDto = new UserDto();
        // Simulation des méthodes du service et du mapper
        when(userService.findById(anyLong())).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        // WHEN
        ResponseEntity<?> response = userController.findById(userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.userMapper.toDto(user));
    }

    // Test de la méthode findById() lorsqu'aucun utilisateur n'est trouvé
    @Test
    void findByIdNotFoundTest() {
        // GIVEN
        String userId = "1";
        // Simulation du service renvoyant null pour un utilisateur non trouvé
        when(userService.findById(anyLong())).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = userController.findById(userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Test de la méthode findById() lorsqu'un identifiant d'utilisateur invalide est fourni
    @Test
    void findByIdBadRequestTest() {
        // GIVEN
        String invalidUserId = "invalidId";

        // WHEN
        ResponseEntity<?> response = userController.findById(invalidUserId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // Test de la méthode delete() lorsqu'une suppression d'utilisateur réussit
    @Test
    void deleteSuccessTest() {
        // GIVEN
        String userId = "1";
        User mockUser = this.mockUser;

        // Simulation des méthodes du service et du contexte de sécurité
        when(userService.findById(mockUser.getId())).thenReturn(mockUser);
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(mockUserDetails, null));
        when(mockUserDetails.getUsername()).thenReturn(mockUser.getEmail());

        // WHEN
        ResponseEntity<?> response = userController.save(userId.toString());

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(userService, times(1)).delete(Long.parseLong(userId));
    }

    // Test de la méthode delete() lorsqu'un utilisateur à supprimer n'est pas trouvé
    @Test
    void deleteNotFoundTest() {
        // GIVEN
        String userId = "1";
        // Simulation du service renvoyant null pour un utilisateur non trouvé
        when(userService.findById(anyLong())).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = userController.save(userId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Test de la méthode delete() lorsqu'un utilisateur tente de supprimer un autre utilisateur
    @Test
    void deleteUnauthorizedTest() {
        // GIVEN
        String userId = "1";
        User mockUser = this.mockUser;

        // Simulation des méthodes du service et du contexte de sécurité
        when(userService.findById(mockUser.getId())).thenReturn(mockUser);
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(mockUserDetails, null));
        when(mockUserDetails.getUsername()).thenReturn("differentMail@test.com");

        // WHEN
        ResponseEntity<?> response = userController.save(userId.toString());

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    // Test de la méthode delete() lorsqu'un identifiant d'utilisateur invalide est fourni
    @Test
    void deleteBadRequestTest() {
        // GIVEN
        String invalidUserId = "invalidId";

        // WHEN
        ResponseEntity<?> response = userController.save(invalidUserId);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
