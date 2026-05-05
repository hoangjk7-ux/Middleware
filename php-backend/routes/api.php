<?php

/**
 * API Routes
 * Define all API endpoints here
 */

// Authentication routes
$app->post('/auth/register', 'AuthController@register');
$app->post('/auth/login', 'AuthController@login');

// User routes (protected)
$app->get('/users', 'UserController@index');
$app->get('/users/{id}', 'UserController@show');
$app->put('/users/{id}', 'UserController@update');
$app->delete('/users/{id}', 'UserController@delete');

// Customer routes (protected)
$app->get('/customers', 'CustomerController@index');
$app->get('/customers/{id}', 'CustomerController@show');
$app->post('/customers', 'CustomerController@store');
$app->put('/customers/{id}', 'CustomerController@update');
$app->delete('/customers/{id}', 'CustomerController@delete');

// Lead routes (protected)
$app->get('/leads', 'LeadController@index');
$app->get('/leads/{id}', 'LeadController@show');
$app->post('/leads', 'LeadController@store');
$app->put('/leads/{id}', 'LeadController@update');
$app->delete('/leads/{id}', 'LeadController@delete');
$app->patch('/leads/{id}/assign/{userId}', 'LeadController@assign');
$app->patch('/leads/{id}/convert/{customerId}', 'LeadController@convert');

// Interaction routes (protected)
$app->get('/interactions', 'InteractionController@index');
$app->get('/interactions/customer/{customerId}', 'InteractionController@getByCustomer');
$app->post('/interactions', 'InteractionController@store');
$app->put('/interactions/{id}', 'InteractionController@update');
$app->delete('/interactions/{id}', 'InteractionController@delete');

// Sync routes (protected)
$app->get('/sync/status', 'SyncController@status');
$app->post('/sync/mongo-to-supabase', 'SyncController@mongoToSupabase');
$app->post('/sync/supabase-to-mongo', 'SyncController@supabaseToMongo');
$app->post('/sync/{collection}/mongo-to-supabase', 'SyncController@syncCollection');

// Health check
$app->get('/health', function() {
    response([
        'status' => 'OK',
        'message' => 'PHP Backend is running',
        'timestamp' => date('c'),
        'version' => '1.0.0'
    ]);
});

// Database status
$app->get('/db-status', function() {
    try {
        $pdo = db();
        $stmt = $pdo->query("SELECT 1");
        response([
            'status' => 'OK',
            'database' => 'connected',
            'message' => 'Database connection successful'
        ]);
    } catch (Exception $e) {
        response([
            'status' => 'ERROR',
            'database' => 'disconnected',
            'message' => $e->getMessage()
        ], 500);
    }
});