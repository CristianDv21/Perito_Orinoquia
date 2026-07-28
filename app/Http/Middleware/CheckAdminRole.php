<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        // Si el usuario no está autenticado o su rol NO es 'admin', lo bloqueamos
        if (!$request->user() || $request->user()->rol !== 'admin') {
            return response()->json([
                'error' => 'Acceso denegado. Exclusivo para administradores.'
            ], 403);
        }

        return $next($request);
    }
}
