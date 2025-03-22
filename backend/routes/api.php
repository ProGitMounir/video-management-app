<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('videos')->group(function () {
    Route::get('/', [VideoController::class, 'index']);
    Route::post('/', [VideoController::class, 'store']);
    Route::put('/{video}', [VideoController::class, 'update']);
    Route::delete('/{video}', [VideoController::class, 'destroy']);
    Route::patch('/reorder', [VideoController::class, 'reorder']);
});


