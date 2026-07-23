<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * HU-01: Registro de nuevos usuarios (Técnicos/Admins)
     */
    public function register(Request $request)
    {
        // 1. Validamos que los datos vengan completos y correctos
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'rol' => 'required|in:admin,tecnico'
        ]);

        // 2. Creamos el usuario en PostgreSQL
        // Nota: No usamos Hash::make($request->password) porque el 'cast' => 'hashed'
        // que dejamos en el modelo User.php ya lo encripta automáticamente.
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, 
            'rol' => $request->rol,
        ]);

        // 3. Devolvemos la respuesta de éxito
        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user
        ], 201);
    }

    /**
     * HU-02: Inicio de sesión
     */
    public function login(Request $request)
    {
        // 1. Validamos los campos
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 2. Intentamos autenticar con las credenciales dadas
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Escenario 2: Credenciales incorrectas
            return response()->json([
                'message' => 'Correo o contraseña incorrectos'
            ], 401);
        }

        // 3. Escenario 1: Inicio de sesión exitoso. 
        // Buscamos al usuario y le generamos su token JWT (Sanctum)
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 200);
    }

    /**
     * HU-05: Cerrar sesión
     */
    public function logout(Request $request)
    {
        // El middleware se encargará de saber quién es el usuario que hace la petición.
        // Aquí simplemente borramos el token actual con el que ingresó.
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ], 200);
    }
}
