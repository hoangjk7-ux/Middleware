<?php

namespace App\Controllers;

class AuthController
{
    public function register()
    {
        $data = request();

        // Validate input
        if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
            errorResponse('Username, email, and password are required', 400);
        }

        if (!validateEmail($data['email'])) {
            errorResponse('Invalid email format', 400);
        }

        // Check if user exists
        $pdo = db();
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$data['email'], $data['username']]);

        if ($stmt->fetch()) {
            errorResponse('User already exists', 409);
        }

        // Create user
        $hashedPassword = hashPassword($data['password']);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            sanitizeInput($data['username']),
            sanitizeInput($data['email']),
            $hashedPassword,
            $data['role'] ?? 'user'
        ]);

        $userId = $pdo->lastInsertId();

        // Generate JWT
        $token = generateJWT([
            'user_id' => $userId,
            'username' => $data['username'],
            'email' => $data['email'],
            'role' => $data['role'] ?? 'user'
        ]);

        successResponse([
            'user' => [
                'id' => $userId,
                'username' => $data['username'],
                'email' => $data['email'],
                'role' => $data['role'] ?? 'user'
            ],
            'token' => $token
        ], 'User registered successfully');
    }

    public function login()
    {
        $data = request();

        if (empty($data['email']) || empty($data['password'])) {
            errorResponse('Email and password are required', 400);
        }

        // Find user
        $pdo = db();
        $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if (!$user || !verifyPassword($data['password'], $user['password'])) {
            errorResponse('Invalid credentials', 401);
        }

        // Generate JWT
        $token = generateJWT([
            'user_id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role']
        ]);

        successResponse([
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ],
            'token' => $token
        ], 'Login successful');
    }
}