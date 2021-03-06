<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\RefreshDatabase;

use App\User;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function testHome()
    {
        $response = $this->get('/');
        $response->assertViewIs('home');
        $response->assertStatus(200);
    }

    public function testHelp()
    {
        $response = $this->get('/help');
        $response->assertViewIs('help');
        $response->assertStatus(200);
    }

    public function testPrivacyPolicy()
    {
        $response = $this->get('/privacy-policy');
        $response->assertViewIs('privacy-policy');
        $response->assertStatus(200);
    }

    public function testContact()
    {
        $response = $this->get('/contact');
        $response->assertViewIs('contact.index');
        $response->assertStatus(200);

        // confirm
        $response = $this->post('/contact', [
            'name' => 'Example',
            'mail' => 'test@example.com',
            'inquiry' => 'Example',
        ]);
        $response->assertViewIs('contact.confirm');
        $response->assertStatus(200);
    }
}
