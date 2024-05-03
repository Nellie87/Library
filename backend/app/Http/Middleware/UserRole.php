<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Support\Facades\Log;

class UserRole {

     protected $auth;
       public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $userType) {
           if(strpos($userType,'#') !==false){
               $user_roles = explode('#', $userType);
           }else{
               $user_roles = array($userType);
           }
                 $user = $this->auth->user(); 
           // Log::Info(print_r($user_roles,true));
         if (!in_array($user->user_type, $user_roles)) {
//             Log::Info('invalid user');
             return api_response(401, 'This route is not authorized');
        } else {
//            Log::Info('valid user');
            return $next($request);
        }
    }

}
