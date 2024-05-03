<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    protected $table = 'contents';
    protected $primaryKey = 'content_id';
    protected $fillable = [
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "two_fa_id",
        "mobile",
        "user_type"
    ];
}
