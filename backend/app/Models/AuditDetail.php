<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class AuditDetail extends Model
{
     protected $table = 'audit_detail';
     protected $guarded = array();
       
      public function getCreatedOnAttribute($value)
        {
            return get_datetime_format($value);
        }
}
