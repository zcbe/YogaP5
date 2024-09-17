package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class) // Utilisation de l'extension Mockito avec JUnit 5
class UserServiceTest {

    // Crée un Mock de l'UserRepository pour simuler son comportement
    @Mock
    private UserRepository userRepository;

    // Injecte le Mock du UserRepository dans UserService
    @InjectMocks
    private UserService userService;

    @Test
    void deleteTest() {
        // GIVEN : Préparation des données
        Long userId = 1L; // Un ID d'utilisateur à supprimer (le "L" précise qu'il s'agit d'un Long)

        // WHEN : Appel de la méthode delete de userService avec l'ID donné
        userService.delete(userId);

        // THEN : Vérification que la méthode deleteById du userRepository a été appelée une seule fois avec l'ID donné
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    void findOneByExistingIdTest() {
        // GIVEN : Préparation des données
        Long userId = 1L; // Un ID d'utilisateur existant
        // Création d'un utilisateur factice (mock) avec l'ID donné
        User mockUser = new User(userId, "test@mail.com", "lastName", "firstName", "password", false, LocalDateTime.now(), LocalDateTime.now());
        // Configuration du mock userRepository pour qu'il renvoie cet utilisateur lorsqu'on appelle findById avec l'ID donné
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        // WHEN : Appel de la méthode findById de userService
        User result = userService.findById(userId);

        // THEN : Vérification que le résultat est bien l'utilisateur factice (mockUser)
        assertThat(result).isEqualTo(mockUser);
        // Vérification que la méthode findById du userRepository a été appelée une fois avec l'ID donné
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void findOneByNonExistingIdTest() {
        // GIVEN : Préparation des données
        Long userId = 1L; // Un ID d'utilisateur non-existant
        // Configuration du mock userRepository pour qu'il renvoie un Optional.empty() (aucun utilisateur trouvé)
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // WHEN : Appel de la méthode findById de userService
        User result = userService.findById(userId);

        // THEN : Vérification que le résultat est null car l'utilisateur n'existe pas
        assertThat(result).isNull();
        // Vérification que la méthode findById du userRepository a été appelée une fois avec l'ID donné
        verify(userRepository, times(1)).findById(userId);
    }

}
