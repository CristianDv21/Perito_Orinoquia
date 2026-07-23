<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- Importante para emitir tokens

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // <--- Trait habilitado

    /**
     * Atributos asignables de forma masiva.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rol', // <--- Permitimos que se guarde el rol
    ];

    /**
     * Atributos ocultos en las respuestas JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts automáticos de tipos de datos.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Hashea automáticamente la clave al asignarla
        ];
    }
}
