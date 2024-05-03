<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Support\Facades\Log;
class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {   
        if($this->auth && $this->auth->user()){
        $user_type= $this->auth->user()->user_type;
        $get_api_end_point= get_permission();
        $get_api_end_point_all= get_permission_all();
        $pathname = str_replace("/wapi/","", $request->getPathInfo());
        
        if($pathname != "" && $user_type != 'admin'){
            $browser_route = $pathname;
            if(in_array($pathname,$get_api_end_point_all)){
                if(!in_array($pathname,$get_api_end_point)){
                    return api_response(401, 'Unauthorized request!');
                }

            }
           
        }
        }

        if ($this->auth->guard($guard)->guest()) {
              return api_response(401, 'Unauthorized');
        }else{
            
        }

        return $next($request);
    }
}
