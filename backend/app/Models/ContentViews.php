<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ContentViews extends Model
{
     protected $table = 'content_views';
     protected $guarded = array();

     public function getProfileImagePathAttribute($value)
        {
            return get_profile_path($value);
        }
 
}