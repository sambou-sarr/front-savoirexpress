<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->string('matieres')->nullable()->after('photo_url');
            $table->integer('tarif_horaire')->nullable()->after('matieres');
            $table->text('bio')->nullable()->after('tarif_horaire');
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['matieres', 'tarif_horaire', 'bio']);
        });
    }
};