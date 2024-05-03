<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        // Define allowed origin(s) or use '*' to allow any origin
        $allowedOrigins = ['https://payments.ecitizen.go.ke/'];

        $origin = $request->headers->get('Origin');

        if (in_array($origin, $allowedOrigins)) {
            // Allow the specified origin(s)
            $response = $next($request);
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        }

        return $next($request);
    }
}
