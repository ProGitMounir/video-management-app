import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-telecharger-video',
  imports: [CommonModule, FormsModule ],
  templateUrl: './telecharger-video.component.html',
  styleUrl: './telecharger-video.component.css'
})
export class TelechargerVideoComponent {
  videoFile: File | null = null; // Fichier vidéo sélectionné
  videoName: string = ''; // Nom de la vidéo
  isLoading: boolean = false; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur
  successMessage: string | null = null; // Message de succès

  constructor(private http: HttpClient) {}

  // Méthode pour gérer la sélection du fichier vidéo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
    }
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (!this.videoFile || !this.videoName) {
      this.errorMessage = 'Veuillez sélectionner un fichier vidéo et saisir un nom.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('video', this.videoFile);
    formData.append('video_name', this.videoName);

    // Envoyer la requête POST à l'API
    this.http.post('http://localhost:8000/api/videos', formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Vidéo téléchargée avec succès !';
          this.resetForm();
        } else {
          // Afficher le message d'erreur renvoyé par le backend
          this.errorMessage = response.message || 'Erreur lors du téléchargement de la vidéo.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Afficher le message d'erreur renvoyé par le backend
        this.errorMessage = error.error.message || 'Une erreur est survenue lors du téléchargement de la vidéo.';
      }
    });
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.videoFile = null;
    this.videoName = '';
  }
}
