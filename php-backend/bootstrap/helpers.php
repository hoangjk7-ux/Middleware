<?php

/**
 * Helper Functions for PHP Backend
 */

// Database connection
function db() {
    static $pdo = null;
    if ($pdo === null) {
        $config = require __DIR__ . '/../config/database.php';
        try {
            $pdo = new PDO(
                "mysql:host={$config['host']};dbname={$config['database']}",
                $config['username'],
                $config['password']
            );
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    return $pdo;
}

// JWT functions
function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $header_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

    $payload_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));

    $signature = hash_hmac('sha256', $header_encoded . "." . $payload_encoded, JWT_SECRET, true);
    $signature_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $header_encoded . "." . $payload_encoded . "." . $signature_encoded;
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }

    $header = $parts[0];
    $payload = $parts[1];
    $signature = $parts[2];

    $expected_signature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET, true);
    $expected_signature_encoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expected_signature));

    return hash_equals($signature, $expected_signature_encoded);
}

function getJWTData($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    return $payload;
}

// Password functions
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Validation helpers
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

// Response helpers
function successResponse($data = null, $message = 'Success') {
    response([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
}

function errorResponse($message = 'Error', $status = 400) {
    response([
        'success' => false,
        'message' => $message
    ], $status);
}

// Authentication middleware
function requireAuth() {
    $token = getBearerToken();
    if (!$token || !verifyJWT($token)) {
        errorResponse('Unauthorized', 401);
    }
    return getJWTData($token);
}

// Get current user from token
function getCurrentUser() {
    $token = getBearerToken();
    if ($token && verifyJWT($token)) {
        return getJWTData($token);
    }
    return null;
}