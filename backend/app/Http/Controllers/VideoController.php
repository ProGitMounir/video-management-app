<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Services\VideoService;

class VideoController extends Controller
{
    protected $videoService;

    public function __construct(VideoService $videoService)
    {
        $this->videoService = $videoService;
    }

    // Récupérer toutes les vidéos
    public function index()
    {
        $videos = Video::orderBy('order_position')->get();
        return response()->json($videos);
    }

    // Télécharger une nouvelle vidéo
    public function store(Request $request)
    {
        return $this->videoService->uploadVideo($request);
    }

    // Modifier le nom d'une vidéo
    public function update(Request $request, Video $video)
    {
        $request->validate([
            'video_name' => 'required|unique:videos,video_name,' . $video->id,
        ]);

        $video->update(['video_name' => $request->video_name]);
        return response()->json($video);
    }

    // Supprimer une vidéo
    public function destroy(Video $video)
    {
        if (Storage::exists($video->video_url)) {
            Storage::delete($video->video_url);
        }
        $video->delete();
        return response()->json(['message' => 'Vidéo supprimée']);
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
