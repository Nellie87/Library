<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
     protected $table = 'transactions';
     protected $guarded = array();
    protected $primaryKey = "transaction_id";
}
