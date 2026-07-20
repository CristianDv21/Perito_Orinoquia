<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Cliente extends Model
{
    //
    use HasFactory;

    // 1. Le decimos a Laravel cuál es la llave primaria personalizada
    protected $primaryKey = 'id_cliente';

    // 2. Definimos qué campos se pueden llenar masivamente (seguridad)
    protected $fillable = [
        'nombre_completo',
        'celular',
        'correo',
    ];

    // 3. La relación que definí en Draw.io -> (1 a Muchos)
    // Un cliente tiene muchos vehículos
    public function vehiculos()
    {
        // Esto conectará con el modelo Vehiculo cuando lo creemos
        return $this->hasMany(Vehiculo::class, 'id_cliente', 'id_cliente');
    }
}
