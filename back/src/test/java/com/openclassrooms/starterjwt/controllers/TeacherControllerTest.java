package com.openclassrooms.starterjwt.controllers;

// Importation des classes nécessaires pour les tests, la manipulation du temps, et la gestion des données
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Importation des classes spécifiques au projet
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

// Annotation pour utiliser Mockito avec JUnit 5
@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TeacherControllerTest {

    // Création des objets simulés (mocks) pour TeacherService et TeacherMapper
    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    // Injection des mocks dans l'instance du contrôleur
    @InjectMocks
    private TeacherController teacherController;

    // Instance d'enseignant pour les tests
    private Teacher mockTeacher;

    // Méthode exécutée avant chaque test pour préparer l'environnement de test
    @BeforeEach
    public void setup() {    
        // Création d'un enseignant factice pour les tests
        this.mockTeacher = new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now());
    }

    // Test de la méthode findById() lorsqu'un enseignant est trouvé avec succès
    @Test
    void findByIdSuccessTest() {
        // GIVEN
        String teacherId = "1";
        Teacher teacher = this.mockTeacher;
        // Simulation de la méthode findById du service pour renvoyer l'enseignant factice
        when(teacherService.findById(anyLong())).thenReturn(teacher);

        // WHEN
        ResponseEntity<?> response = teacherController.findById(teacherId);

        // THEN
        // Vérification que le code de statut HTTP est OK et que le corps de la réponse est correct
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.teacherMapper.toDto(teacher));
    }

    // Test de la méthode findById() lorsqu'aucun enseignant n'est trouvé
    @Test
    void findByIdNotFoundTest() {
        // GIVEN
        String teacherId = "1";
        // Simulation de la méthode findById du service pour renvoyer null
        when(teacherService.findById(anyLong())).thenReturn(null);

        // WHEN
        ResponseEntity<?> response = teacherController.findById(teacherId);

        // THEN
        // Vérification que le code de statut HTTP est NOT_FOUND
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Test de la méthode findById() lorsqu'un identifiant d'enseignant invalide est fourni
    @Test
    void findByIdBadRequestTest() {
        // GIVEN
        String invalidTeacherId = "invalidId";

        // WHEN
        ResponseEntity<?> response = teacherController.findById(invalidTeacherId);

        // THEN
        // Vérification que le code de statut HTTP est BAD_REQUEST
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // Test de la méthode findAll() lorsqu'une liste d'enseignants est récupérée avec succès
    @Test
    void findAllSuccessTest() {
        // GIVEN
        List<Teacher> teachers = List.of(this.mockTeacher);
        // Simulation de la méthode findAll du service pour renvoyer une liste d'enseignants
        when(teacherService.findAll()).thenReturn(teachers);

        // WHEN
        ResponseEntity<?> response = teacherController.findAll();

        // THEN
        // Vérification que le code de statut HTTP est OK et que le corps de la réponse est correct
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(this.teacherMapper.toDto(teachers));
    }
}
