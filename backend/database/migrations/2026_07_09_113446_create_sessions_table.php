<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eleve_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('repetiteur_id')->constrained('users')->onDelete('cascade');
            $table->string('matiere');
            $table->dateTime('date_session');
            $table->integer('duree_heures')->default(1);
            $table->decimal('montant', 10, 2);
            $table->string('statut')->default('en_attente'); // en_attente, accepte, refuse, termine
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sessions');
    }
};