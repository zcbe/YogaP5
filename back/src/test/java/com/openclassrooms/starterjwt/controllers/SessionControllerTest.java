package com.openclassrooms.starterjwt.controllers;

// Importation des classes nécessaires pour les tests, la manipulation du temps, et la gestion des données
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;

// Annotation pour utiliser Mockito avec JUnit 5
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SessionControllerTest {

    // Création des objets simulés (mocks) pour SessionService et SessionMapper
    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    // Injection des mocks dans l'instance du contrôleur
    @InjectMocks
    private SessionController sessionController;

    // Instance de session pour les tests
    private Session mockSession;

    // Méthode exécutée avant chaque test pour préparer l'environnement de test
    @BeforeEach
    public void setup() {
        // Création d'utilisateurs factices
        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now()));
        mockUsers.add(new User(2L, "user2@mail.com", "Test", "TEST", "password", true, LocalDateTime.now(), LocalDateTime.now()));

        // Création d'un enseignant factice
        Teacher mockTeacher = new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now());

        // Création d'une session factice
        this.mockSession = new Session(1L, "Session 1", new Date(), "description 1", mockTeacher, mockUsers, LocalDateTime.now(), LocalDateTime.now());
    }

    // Test de la méthode findById() lorsqu'une session est trouvée avec succès
    @Test
    void findByIdSuccessTest() {
        // GIVEN
        String sessionId = "1";
        Session session = this.mockSession;
        // Simulation de la méthode getById du service pour renvoyer la session factice
        when(sessionService.getById(anyLong())).thenReturn(session);

        // WHEN
        ResponseEntity<?> response = sessionController.findById(sessionId);

        // THEN
        // Vérification que le code de statut HTTP est OK et que le corps de la réponse est correct
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(session));
    }

    // Test de la méthode findById() lorsqu'aucune session n'est trouvée
    @Test
    void findByIdNotFoundTest() {
        // GIVEN
        String sessionId = "1";
        // Simulation de la méthode getById du service pour renvoyer null
        when(sessionService.getById(anyLong())).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = sessionController.findById(sessionId);

        // THEN
        // Vérification que le code de statut HTTP est NOT_FOUND
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Test de la méthode findById() lorsqu'un identifiant de session invalide est fourni
    @Test
    void findByIdBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";

        // WHEN
        ResponseEntity<?> response = sessionController.findById(invalidSessionId);

        // THEN
        // Vérification que le code de statut HTTP est BAD_REQUEST
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // Test de la méthode findAll() lorsqu'une liste de sessions est récupérée avec succès
    @Test
    void findAllSuccessTest() {
        // GIVEN
        List<Session> sessions = List.of(this.mockSession);
        // Simulation de la méthode findAll du service pour renvoyer la liste des sessions
        when(sessionService.findAll()).thenReturn(sessions);

        // WHEN
        ResponseEntity<?> response = sessionController.findAll();

        // THEN
        // Vérification que le code de statut HTTP est OK et que le corps de la réponse est correct
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(sessions));
    }

    // Test de la méthode create() lorsqu'une session est créée avec succès
    @Test
    void createSuccessTest() {
        // GIVEN
        SessionDto sessionDto = new SessionDto();
        Session session = this.mockSession;
        // Simulation de la conversion du DTO en entité et de la création de la session
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.create(sessionDto);

        // THEN
        // Vérification que le code de statut HTTP est OK et que le corps de la réponse est correct
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(session));
    }

    // Test de la méthode update() lorsqu'une session est mise à jour avec succès
    @Test
    void updateSuccessTest() {
        // GIVEN
        String sessionId = "1";
        SessionDto sessionDto = new SessionDto();
        Session session = this.mockSession;
        // Simulation de la conversion du DTO en entité et de la mise à jour de la session
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(anyLong(), eq(session))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        // WHEN
        ResponseEntity<?> response = sessionController.update(sessionId, sessionDto);

        // THEN
        // Vérification que le code de statut HTTP est OK et que le corps de la réponse est correct
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.sessionMapper.toDto(session));
    }

    // Test de la méthode update() lorsqu'un identifiant de session invalide est fourni
    @Test
    void updateBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";
        SessionDto sessionDto = new SessionDto();

        // WHEN
        ResponseEntity<?> response = sessionController.update(invalidSessionId, sessionDto);

        // THEN
        // Vérification que le code de statut HTTP est BAD_REQUEST
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // Test de la méthode delete() lorsqu'une session est supprimée avec succès
    @Test
    void deleteSuccessTest() {
        // GIVEN
        String sessionId = "1";
        Session session = this.mockSession;
        // Simulation de la méthode getById du service pour renvoyer la session factice
        when(sessionService.getById(anyLong())).thenReturn(session);

        // WHEN
        ResponseEntity<?> response = sessionController.save(sessionId);

        // THEN
        // Vérification que le code de statut HTTP est OK et que la méthode delete du service a été appelée une fois
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService, times(1)).delete(Long.valueOf(sessionId));
    }

    // Test de la méthode delete() lorsqu'aucune session n'est trouvée pour suppression
    @Test
    void deleteNotFoundTest() {
        // GIVEN
        String sessionId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.save(sessionId);

        // THEN
        // Vérification que le code de statut HTTP est NOT_FOUND
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Test de la méthode delete() lorsqu'un identifiant de session invalide est fourni
    @Test
    void deleteBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";

        // WHEN
        ResponseEntity<?> response = sessionController.save(invalidSessionId);

        // THEN
        // Vérification que le code de statut HTTP est BAD_REQUEST
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // Test de la méthode participate() lorsqu'un utilisateur participe à une session avec succès
    @Test
    void participateSuccessTest() {
        // GIVEN
        String sessionId = "1";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.participate(sessionId, userId);

        // THEN
        // Vérification que le code de statut HTTP est OK et que la méthode participate du service a été appelée une fois
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService, times(1)).participate(Long.valueOf(sessionId), Long.valueOf(userId));
    }

    // Test de la méthode participate() lorsqu'un identifiant de session invalide est fourni
    @Test
    void participateBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.participate(invalidSessionId, userId);

        // THEN
        // Vérification que le code de statut HTTP est BAD_REQUEST
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // Test de la méthode noLongerParticipate() lorsqu'un utilisateur ne participe plus à une session avec succès
    @Test
    void noLongerParticipateSuccessTest() {
        // GIVEN
        String sessionId = "1";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.noLongerParticipate(sessionId, userId);

        // THEN
        // Vérification que le code de statut HTTP est OK et que la méthode noLongerParticipate du service a été appelée une fois
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService, times(1)).noLongerParticipate(Long.valueOf(sessionId), Long.valueOf(userId));
    }

    // Test de la méthode noLongerParticipate() lorsqu'un identifiant de session invalide est fourni
    @Test
    void noLongerParticipateBadRequestTest() {
        // GIVEN
        String invalidSessionId = "invalidId";
        String userId = "1";

        // WHEN
        ResponseEntity<?> response = sessionController.noLongerParticipate(invalidSessionId, userId);

        // THEN
        // Vérification que le code de statut HTTP est BAD_REQUEST
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

}
