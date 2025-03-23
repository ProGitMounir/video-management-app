# Application de Gestion de Vidéos

Une application web pour gérer des vidéos avec des fonctionnalités complètes telles que l'ajout, l'affichage, la modification, la suppression et la réorganisation des vidéos. L'application garantit que toutes les vidéos téléchargées respectent des critères spécifiques (rapport d'aspect, durée) et offre une interface conviviale pour une gestion optimale.

## Fonctionnalités

- **Ajout de vidéos** : Téléchargez des vidéos en respectant les critères de durée (2 à 15 secondes) et de rapport d'aspect (9:16).
- **Affichage des vidéos** : Consultez la liste des vidéos avec leurs détails (nom, durée, rapport d'aspect).
- **Modification des vidéos** : Renommez les vidéos existantes.
- **Suppression des vidéos** : Supprimez les vidéos qui ne sont plus nécessaires.
- **Réorganisation des vidéos** : Changez l'ordre des vidéos selon vos préférences. **(Pas encore disponible)**

## Technologies Utilisées

- **Frontend** : Angular
- **Backend** : Laravel
- **Base de données** : MySQL
- **Autres outils** :
  - FFmpeg pour l'analyse des vidéos (durée, rapport d'aspect).
  - Bootstrap pour le style de l'interface utilisateur.

## Images et Video
  ### Images de lapplication et la bd
  ![test1](https://github.com/user-attachments/assets/e1a26da9-98b6-4e69-bde4-a31815b58972)
  
  ![test2](https://github.com/user-attachments/assets/13aa2352-8df7-4bfe-83e8-c56dc9dc4a88)
  
  ![test3](https://github.com/user-attachments/assets/6141d1b8-0dc3-4806-b99b-da4287d1c15e)
  
  ![test4](https://github.com/user-attachments/assets/31dc6bb9-062f-4230-9554-0c117d8b705e)

  ### Video





## Installation

### Prérequis

- Node.js (pour Angular)
- PHP (pour Laravel)
- Composer (pour les dépendances PHP)
- MySQL

### Étapes d'installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo.git
   cd votre-repo

2. **Installer les dépendances du backend** :
   ```bash
    cd backend
    composer install

3. **Configurer la base de données** :
  - Créez une base de données MySQL.
  - Configurez les informations de connexion dans le fichier .env de Laravel.

4. **Exécuter les migrations** :
    ```bash
    php artisan migrate

5. **Installer les dépendances du frontend** :
    ```bash
    cd ../frontend
    npm install

6. **Démarrer les serveurs** :
  - Backend (Laravel) :
    ```bash  
    cd ../backend
    php artisan serve

  - Frontend (Angular) :
    ```bash 
    cd ../frontend
    ng serve

7. **Configurer PHP pour les fichiers volumineux** :
  Par défaut, PHP a des limites strictes sur la taille des fichiers téléchargés. Pour permettre le téléchargement de fichiers vidéo jusqu'à 100 Mo, modifiez les paramètres suivants dans votre fichier php.ini :
    ```ini
    upload_max_filesize = 100M
    post_max_size = 100M
    max_execution_time = 300
    max_input_time = 300
  Redémarrez votre serveur web (Apache, Nginx, etc.) après avoir appliqué ces modifications.
    
#### 👤 MOUNIR IYA AMINE📧 Contact : pro.mailmounir@gmail.com || mounir.iyaamine@etud.iga.ac.ma
