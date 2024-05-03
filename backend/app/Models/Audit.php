<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
     protected $table = 'audit';
     protected $guarded = array();
       
      public function getCreatedOnAttribute($value)
        {
            return get_datetime_format($value);
        }
}
