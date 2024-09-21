// Importation des modules et services nécessaires au composant
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';  // Utilisé pour afficher des notifications utilisateur (snack bars)
import { Router } from '@angular/router';  // Permet la navigation entre les pages
import { User } from '../../interfaces/user.interface';  // Modèle d'interface représentant un utilisateur
import { SessionService } from '../../services/session.service';  // Service pour gérer les informations de session
import { UserService } from '../../services/user.service';  // Service pour interagir avec l'API utilisateur

// Définition du composant Angular avec un sélecteur, un template HTML, et une feuille de style
@Component({
  selector: 'app-me',  // Sélecteur HTML personnalisé pour ce composant
  templateUrl: './me.component.html',  // Chemin vers le fichier de template HTML
  styleUrls: ['./me.component.scss']  // Chemin vers le fichier de style SCSS
})
export class MeComponent implements OnInit {

  // Propriété publique pour stocker les informations utilisateur récupérées
  public user: User | undefined;  // Cette variable sera définie une fois les données de l'utilisateur récupérées

  // Le constructeur injecte les services nécessaires au fonctionnement du composant
  constructor(
    private router: Router,  // Permet de naviguer vers d'autres pages
    private sessionService: SessionService,  // Gère les informations de session (ex: utilisateur connecté)
    private matSnackBar: MatSnackBar,  // Affiche des notifications (snack bars)
    private userService: UserService  // Service pour récupérer ou supprimer les données utilisateur
  ) {}

  // Méthode qui s'exécute automatiquement à l'initialisation du composant
  public ngOnInit(): void {
    // Appel au service utilisateur pour récupérer les informations de l'utilisateur connecté
    this.userService
      .getById(this.sessionService.sessionInformation!.id.toString())  // Utilise l'ID de l'utilisateur stocké dans sessionService
      .subscribe((user: User) => this.user = user);  // Lors de la réception des données, elles sont assignées à la propriété user
  }

  // Méthode pour revenir à la page précédente
  public back(): void {
    window.history.back();  // Utilise l'API native du navigateur pour revenir en arrière dans l'historique
  }

  // Méthode pour supprimer le compte utilisateur
  public delete(): void {
    // Appel au service utilisateur pour supprimer le compte via l'ID de session
    this.userService
      .delete(this.sessionService.sessionInformation!.id.toString())  // Utilise l'ID de l'utilisateur pour la suppression
      .subscribe((_) => {  // Une fois la suppression réussie
        // Affiche une notification de succès (snack bar) à l'utilisateur
        this.matSnackBar.open("Your account has been deleted !", 'Close', { duration: 3000 });  // Le message disparaît après 3 secondes
        this.sessionService.logOut();  // Déconnexion de l'utilisateur après suppression
        this.router.navigate(['/']);  // Redirige l'utilisateur vers la page d'accueil
      });
  }

}
