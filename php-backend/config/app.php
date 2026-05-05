<?php

/**
 * Application Configuration
 */

return [
    'name' => 'CRM Service PHP Backend',
    'version' => '1.0.0',
    'debug' => getenv('APP_DEBUG') ?: false,
    'timezone' => 'Asia/Ho_Chi_Minh',

    // JWT Secret - Change this in production
    'jwt_secret' => getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production',

    // CORS settings
    'cors' => [
        'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001'],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    ],
];