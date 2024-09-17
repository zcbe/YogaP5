package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class) // Intégration de Mockito avec JUnit 5
class SessionsServiceTest {

	@Mock
	private SessionRepository sessionRepository;

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private SessionService sessionService;

    private List<Session> mockSessions;

    @BeforeEach
    public void setup() {
        // Création d'objets factices pour les tests : sessions, enseignants, utilisateurs

        List<User> mockUsers = new ArrayList<>();
        mockUsers.add(new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now()));
        mockUsers.add(new User(2L, "user2@mail.com", "Test", "TEST", "password", true, LocalDateTime.now(), LocalDateTime.now()));

        List<Teacher> mockTeachers = new ArrayList<>();
        mockTeachers.add(new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now()));
        mockTeachers.add(new Teacher(2L, "Tata", "TATA", LocalDateTime.now(), LocalDateTime.now()));

        // Initialisation des sessions factices avec des utilisateurs et des enseignants
    	this.mockSessions = new ArrayList<>();
		this.mockSessions.add(new Session(1L, "Session 1", new Date(), "description 1", mockTeachers.get(0), mockUsers, LocalDateTime.now(), LocalDateTime.now()));
		this.mockSessions.add(new Session(2L, "Session 2", new Date(), "description 2", mockTeachers.get(1), mockUsers, LocalDateTime.now(), LocalDateTime.now()));
    }

	@Test
	void createTest() {
		// GIVEN : Une session factice à tester
		Session session = this.mockSessions.get(0);

		// WHEN : Simulation de l'enregistrement de la session dans le dépôt
		when(sessionRepository.save(session)).thenReturn(session);
		Session result = sessionService.create(session);

		// THEN : Vérification que la session a été enregistrée correctement
		assertThat(result).isEqualTo(session);
		verify(sessionRepository, times(1)).save(session);
	}

	@Test
	void deleteTest() {
		// GIVEN : Un ID de session à supprimer
		Long sessionId = 1L;

		// WHEN : Appel à la méthode delete
		sessionService.delete(sessionId);

		// THEN : Vérification que la méthode deleteById a bien été appelée une fois
		verify(sessionRepository, times(1)).deleteById(sessionId);
	}

	@Test
	void findAllTest() {
		// GIVEN : Simulation du retour de toutes les sessions du dépôt
		when(sessionRepository.findAll()).thenReturn(this.mockSessions);

		// WHEN : Appel à la méthode findAll
		List<Session> result = sessionService.findAll();

		// THEN : Vérification que toutes les sessions retournées correspondent aux sessions simulées
		assertThat(result).isEqualTo(this.mockSessions);
		verify(sessionRepository, times(1)).findAll();
	}

	@Test
	void getByIdExistingSessionTest() {
		// GIVEN : Un ID de session existante
		Long sessionId = 1L;
		Session mockSession = this.mockSessions.get(0);
		when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

		// WHEN : Appel à la méthode getById
		Session result = sessionService.getById(sessionId);

		// THEN : Vérification que la session retournée est correcte
		assertThat(result).isEqualTo(mockSession);
		verify(sessionRepository, times(1)).findById(sessionId);
	}

	@Test
	void getByIdNonExistingSessionTest() {
		// GIVEN : Un ID de session inexistante
		Long sessionId = 1L;
		when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

		// WHEN : Appel à la méthode getById
        Session result = sessionService.getById(sessionId);

        // THEN : Vérification que la session retournée est null (car non trouvée)
        assertThat(result).isNull();
        verify(sessionRepository, times(1)).findById(sessionId);
	}

	@Test
	void updateTest() {
		// GIVEN : Une session existante et une nouvelle description
		Long sessionId = 1L;
		String newDescription = "New description";
		Session mockedSession = this.mockSessions.get(0);
		Session mockedUpdatedSession = mockedSession.setDescription(newDescription);
	    when(sessionRepository.save(mockedUpdatedSession)).thenReturn(mockedUpdatedSession);

		// WHEN : Appel à la méthode update
		Session result = sessionService.update(sessionId, mockedUpdatedSession);

		// THEN : Vérification que la session a été mise à jour avec la nouvelle description
		assertThat(result).isEqualTo(mockedUpdatedSession);
		assertThat(result.getId()).isEqualTo(sessionId);
		assertThat(result.getDescription()).isEqualTo(newDescription);
	    verify(sessionRepository, times(1)).save(mockedUpdatedSession);
	}

	@Test
    void participateSuccessTest() {
        // GIVEN : Une session et un utilisateur non encore inscrit
        Long sessionId = 1L;
        Long userId = 3L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = new User(userId, "test@mail.com", "firstName", "LastName", "password", false, LocalDateTime.now(), LocalDateTime.now());

        // Simulation des méthodes findById pour récupérer la session et l'utilisateur
        when(sessionRepository.findById(any(Long.class))).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(mockUser));
	    when(sessionRepository.save(mockSession)).thenReturn(mockSession);

        // WHEN : Appel à la méthode participate
        sessionService.participate(sessionId, userId);

        // THEN : Vérification que l'utilisateur a été ajouté à la session
        assertThat(mockSession.getUsers()).contains(mockUser);
        verify(sessionRepository, times(1)).save(mockSession);
    }

	@Test
    void participateSessionNotFoundTest() {
        // GIVEN : Une session inexistante
        Long sessionId = 1L;
        Long userId = 2L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // WHEN / THEN : Vérification que l'exception NotFoundException est levée
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }

	@Test
    void participateUserNotFoundTest() {
        // GIVEN : Un utilisateur inexistant
        Long sessionId = 1L;
        Long userId = 2L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN / THEN : Vérification que l'exception NotFoundException est levée
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }

	@Test
    void participateAlreadyParticipatingTest() {
        // GIVEN : Un utilisateur déjà inscrit à la session
        Long sessionId = 1L;
        Long userId = 2L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = this.mockSessions.get(0).getUsers().get(1);
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN / THEN : Vérification que l'exception BadRequestException est levée
        assertThatThrownBy(() -> sessionService.participate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository, times(0)).save(any());
    }

	@Test
    void noLongerParticipateSuccessTest() {
        // GIVEN : Un utilisateur qui participe et qui se désinscrit
        Long sessionId = 1L;
        Long userId = 2L;
        Session mockSession = this.mockSessions.get(0);
        User mockUser = this.mockSessions.get(0).getUsers().get(1);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN : Appel à la méthode noLongerParticipate
        sessionService.noLongerParticipate(sessionId, userId);

        // THEN : Vérification que l'utilisateur a été supprimé de la session
        assertThat(mockSession.getUsers()).doesNotContain(mockUser);
        verify(sessionRepository, times(1)).save(mockSession);
    }

	@Test
    void noLongerParticipateSessionNotFoundTest() {
        // GIVEN : Une session inexistante
        Long sessionId = 1L;
        Long userId = 2L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        // WHEN / THEN : Vérification que l'exception NotFoundException est levée
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository, times(0)).save(any());
    }

	@Test
    void noLongerParticipateNotParticipatingTest() {
        // GIVEN : Un utilisateur qui n'est pas inscrit à la session
        Long sessionId = 1L;
        Long userId = 3L;
        Session mockSession = this.mockSessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(mockSession));

        // WHEN / THEN : Vérification que l'exception BadRequestException est levée
        assertThatThrownBy(() -> sessionService.noLongerParticipate(sessionId, userId))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository, times(0)).save(any());
    }
}
