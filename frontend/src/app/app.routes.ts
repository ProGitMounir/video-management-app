import { Routes } from '@angular/router';
import { VideoListComponent } from './video-list/video-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
    },
    {
        path: 'accueil',
        component: VideoListComponent
    }
];
