<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'video_name',
        'video_url',
        'video_duration',
        'video_aspect_ratio',
        'order_position',
    ];
}
