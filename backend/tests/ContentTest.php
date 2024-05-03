<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ContentTest extends TestCase
{
   
    public function testLogin()
    {
        $this->assertTrue(true);
        $this->get("api/login", []);
        $this->seeStatusCode(200);
     }
    
    public function testGetContent()
    {
        $this->assertTrue(true);
        $this->get("api/get-contents", []);
        $this->seeStatusCode(200);
           $this->seeJsonStructure(
            ['data' =>
                [
                    'title',
                    'description',
                    'created_at',
                    'updated_at'
                ]
            ]    
        );
    }

    public function testContentBulkUpload()
    {
        $this->json('POST', 'api/content-bulk-upload', ['csv_file' => 'C:/Users/badal/Downloads/contents.csv','zip_file' => 'C:/Users/badal/Downloads/Group 30.zip'],[]);
        $this->seeStatusCode(200);
        $this->seeJson([
            'created' => true,
        ]);
    }
    
}
