<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Support\Facades\Log;
class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

      protected $table = 'users';
      protected $guarded = array();
      
        public function getEncryptedUserIdAttribute($value)
        {
            return custom_encryption('encrypt',$value);
        }
        
      public function getProfileImageAttribute($value)
        {
            Log::Info('get_profile_path');
            return get_profile_path($value);
        }
    
    public function getUserDetail(){
        return $this->hasOne('App\Models\UserDetail','user_id');
    }
    public function passwordSecurity()
    {
        return $this->hasOne('App\Models\PasswordSecurity');
    }
}
