<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            // Llave primaria. Usamos 'id_cliente' tal como se definió en Draw.io
            $table->id('id_cliente'); 
        
            // Atributos
            $table->string('nombre_completo');
            $table->string('celular');
        
            // El correo es ideal que sea único para no registrar al mismo cliente dos veces
            $table->string('correo')->unique(); 
        
            // Esto crea automáticamente las columnas 'created_at' y 'updated_at'
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
