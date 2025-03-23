import { Routes } from '@angular/router';
import { VideoListComponent } from './video-list/video-list.component';
import { AccueilComponent } from './accueil/accueil.component';
import { TelechargerVideoComponent } from './telecharger-video/telecharger-video.component';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'accueil',
        pathMatch: 'full'
    },
    {
        path: 'accueil',
        component: AccueilComponent
    },
    {
        path: 'list-videos',
        component: VideoListComponent
    },
    {
        path: 'upload',
        component: TelechargerVideoComponent
    },
];
