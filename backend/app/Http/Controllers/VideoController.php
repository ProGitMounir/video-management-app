<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\VideoService;
use Illuminate\Support\Facades\Validator;
use FFMpeg\FFMpeg;
use FFMpeg\Coordinate\TimeCode;


class VideoController extends Controller
{
    // Récupérer toutes les vidéos GET
    public function index()
    {
        try {
            // Récupérer toutes les vidéos triées par order_position
            $videos = Video::orderBy('order_position', 'asc')->get();

            // Formater les données pour le front-end
            $formattedVideos = $videos->map(function ($video) {
                return [
                    'id' => $video->id,
                    'video_name' => $video->video_name,
                    'video_url' => $video->video_url,
                    'video_duration' => $video->video_duration,
                    'video_aspect_ratio' => $video->video_aspect_ratio,
                    'order_position' => $video->order_position,
                    'created_at' => $video->created_at,
                    'updated_at' => $video->updated_at,
                ];
            });

            // Retourner les vidéos au format JSON
            return response()->json(['success' => true, 'videos' => $formattedVideos]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner un message d'erreur
            \Log::error('Erreur lors de la récupération des vidéos: ' . $e->getMessage());
            return response()->json(['error' => true, 'message' => 'Une erreur est survenue lors de la récupération des vidéos.'], 500);
        }
    }

    // Télécharger une vidéo CREATE
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'video' => 'required|file|mimetypes:video/mp4,video/quicktime|max:102400', // 100MB max
                'video_name' => 'required|string|max:255',
                'order_position' => 'nullable|integer',
                'video_duration' => 'nullable|integer', // Ajouté pour saisie manuelle
                'video_aspect_ratio' => 'nullable|string' // Ajouté pour saisie manuelle
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            if ($request->hasFile('video')) {
                $video = $request->file('video');

                // Analyser la vidéo avec FFmpeg
                $ffmpeg = FFMpeg::create();
                $videoFile = $ffmpeg->open($video->getPathname());

                // Extraire la durée de la vidéo
                $duration = $videoFile->getFormat()->get('duration');

                // Extraire le rapport d'aspect
                $stream = $videoFile->getStreams()->first();
                $width = $stream->get('width');
                $height = $stream->get('height');
                $aspectRatio = $this->calculateAspectRatio($width, $height);

                // Validation de la durée (2 à 15 secondes)
                if ($duration < 2 || $duration > 15) {
                    return response()->json(['error' => true, 'message' => 'La durée de la vidéo doit être comprise entre 2 et 15 secondes.'], 422);
                }

                // Validation du rapport d'aspect (9:16)
                if ($aspectRatio !== '9:16') {
                    return response()->json(['error' => true, 'message' => 'Le rapport d\'aspect de la vidéo doit être de 9:16.'], 422);
                }

                // Stocker le fichier
                $videoPath = $video->store('videos', 'public');
                $videoUrl = Storage::url($videoPath);

                // Créer l'enregistrement dans la base de données
                Video::create([
                    'video_name' => $request->video_name,
                    'video_url' => $videoUrl,
                    'video_duration' => $duration,
                    'video_aspect_ratio' => $aspectRatio,
                    'order_position' => $request->order_position ?? 0
                ]);

                return response()->json(['success' => true, 'message' => 'Vidéo téléchargée avec succès.']);
            }

            return response()->json(['error' => true, 'message' => 'Aucun fichier vidéo fourni.'], 422);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur lors du téléchargement de la vidéo: ' . $e->getMessage());

            // Rediriger avec un message d'erreur
            return response()->json(['error' => true, 'message' => 'Une erreur est survenue lors du téléchargement de la vidéo: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Calcule le rapport d'aspect à partir de la largeur et de la hauteur.
     */
    private function calculateAspectRatio($width, $height)
    {
        $gcd = function ($a, $b) use (&$gcd) {
            return $b ? $gcd($b, $a % $b) : $a;
        };

        $divisor = $gcd($width, $height);
        return ($width / $divisor) . ':' . ($height / $divisor);
    }
    

    // Modifier le nom de la vidéo UPDATE
    public function update(Request $request, $id)
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'video_name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Récupérer la vidéo à mettre à jour
            $video = Video::find($id);

            if (!$video) {
                return response()->json(['error' => true, 'message' => 'Vidéo non trouvée.'], 404);
            }

            // Mettre à jour le nom de la vidéo
            $video->video_name = $request->video_name;
            $video->save();

            return response()->json(['success' => true, 'message' => 'Nom de la vidéo mis à jour avec succès.']);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur lors de la mise à jour de la vidéo: ' . $e->getMessage());

            // Retourner un message d'erreur
            return response()->json(['error' => true, 'message' => 'Une erreur est survenue lors de la mise à jour de la vidéo.'], 500);
        }
    }

    // Supprimer une vidéo DELETE
    public function destroy($id)
    {
        try {
            // Récupérer la vidéo à supprimer
            $video = Video::find($id);

            if (!$video) {
                return response()->json(['error' => true, 'message' => 'Vidéo non trouvée.'], 404);
            }

            // Supprimer le fichier vidéo du stockage
            $videoPath = str_replace('/storage', 'public', $video->video_url);
            Storage::delete($videoPath);

            // Supprimer l'enregistrement de la base de données
            $video->delete();

            return response()->json(['success' => true, 'message' => 'Vidéo supprimée avec succès.']);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur lors de la suppression de la vidéo: ' . $e->getMessage());

            // Retourner un message d'erreur
            return response()->json(['error' => true, 'message' => 'Une erreur est survenue lors de la suppression de la vidéo.'], 500);
        }
    }

    // Réorganiser les vidéos
    public function reorder(Request $request)
    {
        $request->validate([
            'videos' => 'required|array',
            'videos.*.id' => 'required|exists:videos,id',
            'videos.*.order_position' => 'required|integer',
        ]);

        foreach ($request->videos as $videoData) {
            Video::where('id', $videoData['id'])->update(['order_position' => $videoData['order_position']]);
        }

        return response()->json(['message' => 'Ordre mis à jour']);
    }
}
