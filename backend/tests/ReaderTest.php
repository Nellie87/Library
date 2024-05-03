<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;
use Tymon\JWTAuth\JWTAuth;

class ReaderTest extends TestCase
{
    public function testLogin()
    {
        $this->assertTrue(true);

        $response = $this->post("http://localhost:8000/api/login", [
            "email" => "email@email.com",
            "password" => 123456
        ]);
        $response
            ->seeStatusCode(200)
            ->seeJsonStructure(
                [
                  "code",
                  "message",
                  "data"
                ]
            );
    }
    // public function testmyaccount()
    // {
    //     // $token = JWTAuth::fromUser($user);
    //     $this->assertTrue(true);
    //     $this->get("api/my-account/3", []);
    //     $this->seeStatusCode(200);
    // }
}
