<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use stdClass;
class Controller extends BaseController
{
    public function __construct()
    {
        //header("Access-Control-Allow-Origin: *");
    }
    protected function respondWithToken($token, $data)
    {
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() *60,
            "data" => $data
        ], 200);
    }
    protected function apiResponse($code = '', $message = '', $informationData = array())
    {

       return api_response($code, $message, $informationData);
    }
}
