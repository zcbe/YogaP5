// Définition du package dans lequel se trouve la classe
package com.openclassrooms.starterjwt.security;

// Importations des assertions pour les tests (AssertJ)
import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collection;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.security.core.GrantedAuthority;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

// Utilisation de l'extension Mockito pour les tests unitaires avec des mocks
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserDetailsImplTest {

    // Création d'un mock pour la classe UserDetailsImpl
    @Mock
    private UserDetailsImpl userDetails;

    // Méthode exécutée avant chaque test pour initialiser l'objet UserDetailsImpl
    @BeforeEach
    void setUp() {
        // Construction d'un objet UserDetailsImpl avec des valeurs simulées
        userDetails = UserDetailsImpl.builder()
                .id(1L) // Identifiant de l'utilisateur
                .username("user1@mail.com") // Nom d'utilisateur
                .firstName("User") // Prénom
                .lastName("USER") // Nom de famille
                .admin(false) // Indique si l'utilisateur est un administrateur
                .password("password") // Mot de passe
                .build();
    }

    // Test pour vérifier que la méthode getAuthorities renvoie une collection d'autorités vides
    @Test
    void testGetAuthorities() {
        // WHEN : Appel de la méthode getAuthorities
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // THEN : Vérification que la collection n'est pas nulle et est vide
        assertThat(authorities).isNotNull().isEmpty();
    }

    // Test pour vérifier que le compte n'est pas expiré
    @Test
    void testIsAccountNonExpired() {
        // THEN : Le compte doit être marqué comme non expiré
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    // Test pour vérifier que le compte n'est pas verrouillé
    @Test
    void testIsAccountNonLocked() {
        // THEN : Le compte doit être marqué comme non verrouillé
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    // Test pour vérifier que les informations d'authentification ne sont pas expirées
    @Test
    void testIsCredentialsNonExpired() {
        // THEN : Les informations d'authentification doivent être non expirées
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    // Test pour vérifier que le compte est activé
    @Test
    void testIsEnabled() {
        // THEN : Le compte doit être activé
        assertThat(userDetails.isEnabled()).isTrue();
    }

    // Test pour vérifier que l'objet est égal à lui-même (réflexivité)
    @Test
    void testEquals_SameObject() {
        // GIVEN : Même instance de UserDetailsImpl
        UserDetailsImpl sameUserDetails = userDetails;

        // THEN : L'objet doit être égal à lui-même
        assertThat(userDetails.equals(sameUserDetails)).isTrue();
    }

    // Test pour vérifier que l'objet n'est pas égal à un objet d'une classe différente
    @Test
    void testEquals_DifferentClass() {
        // GIVEN : Un objet d'une classe différente
        Object differentObject = new Object();

        // THEN : L'égalité doit retourner false
        assertThat(userDetails.equals(differentObject)).isFalse();
    }

    // Test pour vérifier que deux UserDetailsImpl avec des IDs différents ne sont pas égaux
    @Test
    void testEquals_DifferentId() {
        // GIVEN : Un autre UserDetailsImpl avec un ID différent
        UserDetailsImpl differentUserDetails = UserDetailsImpl.builder().id(2L).build();

        // THEN : L'égalité doit retourner false
        assertThat(userDetails.equals(differentUserDetails)).isFalse();
    }

    // Test pour vérifier que deux UserDetailsImpl avec le même ID sont égaux
    @Test
    void testEquals_SameId() {
        // GIVEN : Un autre UserDetailsImpl avec le même ID
        UserDetailsImpl sameIdUserDetails = UserDetailsImpl.builder().id(1L).build();

        // THEN : L'égalité doit retourner true
        assertThat(userDetails.equals(sameIdUserDetails)).isTrue();
    }
}
