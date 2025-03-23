import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

export interface Video {
  id: number;
  video_name: string;
  video_url: string;
  video_duration: number;
  video_aspect_ratio: string;
  order_position: number;
  created_at: string;
  updated_at: string;
  editing?: boolean; // Ajout d'une propriété pour gérer l'état d'édition
}

@Component({
  selector: 'app-video-list',
  imports: [CommonModule, FormsModule ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class VideoListComponent {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>; // Référence au lecteur vidéo

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

  editVideo(video: Video): void {
    video.editing = true; // Activer le mode édition
  }

  cancelEdit(video: Video): void {
    video.editing = false; // Désactiver le mode édition
  }

  saveVideo(video: Video): void {
    this.http.put(`${this.apiUrl}/${video.id}`, { video_name: video.video_name }).subscribe({
      next: (response: any) => {
        if (response.success) {
          video.editing = false; // Désactiver le mode édition après la mise à jour
        } else {
          this.errorMessage = 'Erreur lors de la mise à jour de la vidéo.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour de la vidéo.';
        console.error('Erreur API :', error);
      }
    });
  }

  // Méthode pour afficher l'URL de la vidéo dans la console
  logVideoUrl(video: Video): void {
    console.log('URL de la vidéo :', video.video_url);
  }

  // Méthode pour basculer entre la lecture et la pause de la vidéo
  toggleVideoPlayback(videoElement: HTMLVideoElement): void {
    if (videoElement.paused) {
        videoElement.play().catch((error) => {
            console.warn('La lecture automatique a été bloquée :', error);
        });
    } else {
        videoElement.pause(); // Mettre en pause la vidéo
    }
  }

  // Méthode pour supprimer une vidéo
  deleteVideo(video: Video): void {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?');
    if (!confirmDelete) {
      return; // Annuler la suppression si l'utilisateur clique sur "Non"
    }
  
    this.http.delete(`${this.apiUrl}/${video.id}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Supprimer la vidéo de la liste affichée
          this.videos = this.videos.filter(v => v.id !== video.id);
          console.log('Vidéo supprimée avec succès.');
        } else {
          this.errorMessage = 'Erreur lors de la suppression de la vidéo.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Une erreur est survenue lors de la suppression de la vidéo.';
        console.error('Erreur API :', error);
      }
    });
  }

  scrollLeft(): void {
    const container = document.querySelector('.video-scroll-container') as HTMLElement;
    container.scrollBy({ left: -225, behavior: 'smooth' }); // Défilement de la largeur d'une vidéo
  }

  scrollRight(): void {
      const container = document.querySelector('.video-scroll-container') as HTMLElement;
      container.scrollBy({ left: 225, behavior: 'smooth' }); // Défilement de la largeur d'une vidéo
  }
}
