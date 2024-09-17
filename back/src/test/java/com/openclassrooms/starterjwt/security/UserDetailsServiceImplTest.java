// Définition du package dans lequel se trouve la classe
package com.openclassrooms.starterjwt.security;

// Importations des bibliothèques nécessaires pour les assertions et les mocks
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

// Utilisation de Mockito pour simuler des objets dans les tests unitaires
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserDetailsServiceImplTest {

    // Simulation du UserRepository, qui est utilisé pour accéder aux utilisateurs dans la base de données
    @Mock
    private UserRepository userRepository;

    // Injection de l'implémentation du service UserDetailsServiceImpl, dans laquelle le mock sera injecté
    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    // Test pour vérifier le chargement d'un utilisateur par son nom d'utilisateur (email ici)
    @Test
    void loadUserByUsernameTest() {

        // GIVEN : Préparation d'un utilisateur simulé avec des données fictives
        User user = new User(1L, "user1@mail.com", "User", "USER", "password", false, LocalDateTime.now(), LocalDateTime.now());

        // Simulation du comportement du UserRepository : quand on cherche un utilisateur par email, il renvoie cet utilisateur
        when(userRepository.findByEmail("user1@mail.com")).thenReturn(java.util.Optional.of(user));

        // WHEN : Appel du service pour charger l'utilisateur via son email
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername("user1@mail.com");

        // THEN : Vérification que les détails de l'utilisateur chargé correspondent aux données de l'utilisateur simulé
        assertThat(userDetails.getUsername()).isEqualTo(user.getEmail());
        assertThat(userDetails.getFirstName()).isEqualTo(user.getFirstName());
        assertThat(userDetails.getLastName()).isEqualTo(user.getLastName());
        assertThat(userDetails.getPassword()).isEqualTo(user.getPassword());

    }

    // Test pour vérifier le comportement lorsque l'utilisateur n'est pas trouvé
    @Test
    void loadUserByUsernameUserNotFoundTest() {
        // GIVEN : Simulation du cas où le UserRepository ne trouve pas l'utilisateur par son email (retourne un Optional vide)
        when(userRepository.findByEmail("user1@mail.com")).thenReturn(java.util.Optional.empty());

        // WHEN / THEN : Vérification qu'une exception UsernameNotFoundException est lancée et que le message d'erreur est correct
        assertThatThrownBy(() -> userDetailsServiceImpl.loadUserByUsername("user1@mail.com"))
        .isInstanceOf(UsernameNotFoundException.class)
        .hasMessage("User Not Found with email: user1@mail.com");
    }

}
