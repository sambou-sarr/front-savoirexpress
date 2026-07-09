<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repetiteurs', function (Blueprint $table) {
            $table->id();

            $table->string('prenom');
            $table->string('nom');
            $table->date('date_naissance')->nullable();

            $table->string('email')->unique();
            $table->string('telephone');

            $table->string('region');

            $table->text('motivations');

            $table->string('cv_url')->nullable();

            $table->string('statut')->default('en_attente'); 
            // en_attente | confirme | refuse

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repetiteurs');
    }
};