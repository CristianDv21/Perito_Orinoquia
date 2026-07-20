<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    // Método para LISTAR todos los clientes
    public function index()
    {
        // Eloquent hace la magia: trae todos los clientes ordenados por el más reciente
        $clientes = Cliente::orderBy('id_cliente', 'desc')->get();
        
        // Retornamos los datos en formato JSON (que es lo que entiende el frontend)
        return response()->json($clientes, 200);
    }

    // Método para CREAR un nuevo cliente
    public function store(Request $request)
    {
        // 1. Validamos que el frontend envíe los datos correctamente
        $request->validate([
            'nombre_completo' => 'required|string|max:255',
            'celular'         => 'required|string|max:20',
            'correo'          => 'required|email|unique:clientes,correo',
        ]);

        // 2. Creamos el cliente en la base de datos
        $cliente = Cliente::create($request->all());

        // 3. Le respondemos al frontend con un mensaje de éxito y los datos creados
        return response()->json([
            'mensaje' => '¡Cliente creado con éxito!',
            'cliente' => $cliente
        ], 201); // 201 significa "Creado"
    }
}
