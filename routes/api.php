<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// HU-02 y HU-04: Inicio de sesión (Público)
// El middleware 'throttle:5,15' bloquea la IP por 15 minutos si hay 5 intentos fallidos
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,15');

// Rutas Protegidas (Solo accesibles si el usuario envía un token válido)
Route::middleware('auth:sanctum')->group(function () {
    
    // HU-01: Registro de nuevos usuarios
    Route::post('/registro-usuarios', [AuthController::class, 'register']);
    
    // HU-05: Cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Ruta de prueba para ver los datos del usuario logueado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
