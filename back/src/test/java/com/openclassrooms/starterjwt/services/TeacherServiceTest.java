package com.openclassrooms.starterjwt.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class) // Utilisation de l'extension Mockito avec JUnit 5
class TeacherServiceTest {

    // Création d'un Mock pour simuler le TeacherRepository
    @Mock
    private TeacherRepository teacherRepository;

    // Injection du Mock du TeacherRepository dans TeacherService
    @InjectMocks
    private TeacherService teacherService;

    @Test
    void findAllTest() {
        // GIVEN : Préparation des données de test
        // Création d'une liste factice (mock) de professeurs
        List<Teacher> mockTeachers = List.of(
                new Teacher(1L, "Toto", "TOTO", LocalDateTime.now(), LocalDateTime.now()),
                new Teacher(2L, "Tata", "TATA", LocalDateTime.now(), LocalDateTime.now())
        );
        // Configuration du mock teacherRepository pour renvoyer cette liste factice lorsqu'on appelle findAll
        when(teacherRepository.findAll()).thenReturn(mockTeachers);

        // WHEN : Appel de la méthode findAll de teacherService
        List<Teacher> result = teacherService.findAll();

        // THEN : Vérification que le résultat est bien la liste de professeurs factices (mockTeachers)
        assertThat(result).isEqualTo(mockTeachers);
        // Vérification que la méthode findAll du teacherRepository a été appelée une fois
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    void findOneByExistingIdTest() {
        // GIVEN : Préparation des données de test
        Long teacherId = 1L; // ID d'un professeur existant
        // Création d'un professeur factice (mock) avec l'ID donné
        Teacher mockTeacher = new Teacher(teacherId, "lastName", "firstName", LocalDateTime.now(), LocalDateTime.now());
        // Configuration du mock teacherRepository pour renvoyer cet enseignant lorsqu'on appelle findById avec l'ID donné
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(mockTeacher));

        // WHEN : Appel de la méthode findById de teacherService
        Teacher result = teacherService.findById(teacherId);

        // THEN : Vérification que le résultat est bien le professeur factice (mockTeacher)
        assertThat(result).isEqualTo(mockTeacher);
        // Vérification que la méthode findById du teacherRepository a été appelée une fois avec l'ID donné
        verify(teacherRepository, times(1)).findById(teacherId);
    }

    @Test
    void findOneByNonExistingIdTest() {
        // GIVEN : Préparation des données de test
        Long teacherId = 1L; // ID d'un professeur inexistant
        // Configuration du mock teacherRepository pour renvoyer Optional.empty() lorsqu'on appelle findById avec cet ID
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        // WHEN : Appel de la méthode findById de teacherService
        Teacher result = teacherService.findById(teacherId);

        // THEN : Vérification que le résultat est null car aucun professeur n'a été trouvé avec cet ID
        assertThat(result).isNull();
        // Vérification que la méthode findById du teacherRepository a été appelée une fois avec l'ID donné
        verify(teacherRepository, times(1)).findById(teacherId);
    }
}
