<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name',30);
            $table->string('middle_name',30);
            $table->string('last_name',30);
            $table->string('email');
            $table->tinyInteger('verified_email')->default(0);
            $table->string('forgot_password_token');
            $table->string('two_fa_id');
            $table->tinyInteger('two_fa_verified')->default(0);
            $table->string('mobile',15);
            $table->string('password',50);
            $table->enum('user_type',['reader','librarian','publisher','admin']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
