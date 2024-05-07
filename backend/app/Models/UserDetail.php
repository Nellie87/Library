<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
class UserDetail extends Model
{
     protected $table = 'user_detail';
     protected $guarded = array();
        
    
        public function getUser()
        {
            return $this->belongsTo('App\Models\User','id');
        }
        
        

}