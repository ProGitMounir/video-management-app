import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Video {
  id: number;
  video_name: string;
  video_url: string;
  video_duration: number;
  video_aspect_ratio: string;
  order_position: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-video-list',
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class VideoListComponent {
  videos: Video[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  private apiUrl = 'http://localhost:8000/api/videos'; // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVideos(); // Charger les vidéos au démarrage du composant
  }

  // Méthode pour charger les vidéos depuis l'API
  loadVideos(): void {
    this.http.get<{ success: boolean; videos: Video[] }>(this.apiUrl).subscribe({
        next: (response) => {
            if (response.success) {
                this.videos = response.videos; // Mettre à jour la liste des vidéos
            } else {
                this.errorMessage = 'Erreur lors de la récupération des vidéos.';
            }
            this.isLoading = false; // Désactiver l'indicateur de chargement
        },
        error: (error) => {
            this.errorMessage = 'Une erreur est survenue lors de la récupération des vidéos.';
            this.isLoading = false; // Désactiver l'indicateur de chargement
            console.error('Erreur API :', error);
        }
    });
  }

  // Méthode pour sélectionner une vidéo
  selectVideo(video: Video): void {
    console.log('Vidéo sélectionnée :', video);
  }

  // Méthode pour modifier une vidéo
  editVideo(video: Video): void {
    console.log('Modifier la vidéo :', video);
    // Ici, vous pouvez ouvrir un formulaire de modification
  }

  // Méthode pour supprimer une vidéo
  deleteVideo(video: Video): void {
    console.log('Supprimer la vidéo :', video);
    // Ici, vous pouvez implémenter la logique de suppression
    this.videos = this.videos.filter(v => v.id !== video.id);
  }
}
