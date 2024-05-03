<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
     protected $table = 'contents';
     protected $guarded = array();
 
     public function drmSettings() {
        return $this->hasOne('ContentDrmSettings', 'content_id','content_id');
    }

    public function trending(){
        return $this->hasOne('Log','content_id');
    }
    
      public function getEncryptedContentIdAttribute($value)
        {
        return custom_encryption('encrypt',$value);
        }
           public function getMainContentImageAttribute($value)
        {
            return get_content_files_path($value);
        }
}
