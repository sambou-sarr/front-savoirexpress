<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('demande_repetiteurs', function (Blueprint $table) {
            $table->id();                           // ID automatique
            $table->string('prenom');               // Prénom
            $table->string('nom');                  // Nom
            $table->date('date_naissance')->nullable(); // Date naissance (optionnel)
            $table->string('email')->unique();      // Email unique
            $table->string('telephone')->nullable(); // Téléphone
            $table->string('region');               // Région du Sénégal
            $table->text('motivations');            // Pourquoi devenir répétiteur
            $table->string('cv_url')->nullable();   // Lien CV (optionnel)
            $table->timestamps();                   // created_at + updated_at auto
        });
    }

    public function down(): void {
        Schema::dropIfExists('demande_repetiteurs');
    }
};