<?php

namespace App\Controllers;

class CustomerController
{
    public function index()
    {
        requireAuth();

        $pdo = db();
        $stmt = $pdo->query("SELECT * FROM customers ORDER BY created_at DESC");
        $customers = $stmt->fetchAll();

        successResponse($customers);
    }

    public function show($id)
    {
        requireAuth();

        $pdo = db();
        $stmt = $pdo->prepare("SELECT * FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        $customer = $stmt->fetch();

        if (!$customer) {
            errorResponse('Customer not found', 404);
        }

        successResponse($customer);
    }

    public function store()
    {
        requireAuth();

        $data = request();

        if (empty($data['name']) || empty($data['email'])) {
            errorResponse('Name and email are required', 400);
        }

        if (!validateEmail($data['email'])) {
            errorResponse('Invalid email format', 400);
        }

        $pdo = db();

        // Check if email exists
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            errorResponse('Customer with this email already exists', 409);
        }

        // Insert customer
        $stmt = $pdo->prepare("
            INSERT INTO customers (name, email, phone, address_street, address_city, address_state, address_zip_code, address_country, company, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            sanitizeInput($data['name']),
            sanitizeInput($data['email']),
            sanitizeInput($data['phone'] ?? ''),
            sanitizeInput($data['address']['street'] ?? ''),
            sanitizeInput($data['address']['city'] ?? ''),
            sanitizeInput($data['address']['state'] ?? ''),
            sanitizeInput($data['address']['zipCode'] ?? ''),
            sanitizeInput($data['address']['country'] ?? ''),
            sanitizeInput($data['company'] ?? ''),
            sanitizeInput($data['notes'] ?? '')
        ]);

        $customerId = $pdo->lastInsertId();

        successResponse([
            'id' => $customerId,
            'name' => $data['name'],
            'email' => $data['email']
        ], 'Customer created successfully');
    }

    public function update($id)
    {
        requireAuth();

        $data = request();

        $pdo = db();

        // Check if customer exists
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            errorResponse('Customer not found', 404);
        }

        // Update customer
        $stmt = $pdo->prepare("
            UPDATE customers SET
                name = ?,
                email = ?,
                phone = ?,
                address_street = ?,
                address_city = ?,
                address_state = ?,
                address_zip_code = ?,
                address_country = ?,
                company = ?,
                notes = ?,
                updated_at = NOW()
            WHERE id = ?
        ");

        $stmt->execute([
            sanitizeInput($data['name'] ?? ''),
            sanitizeInput($data['email'] ?? ''),
            sanitizeInput($data['phone'] ?? ''),
            sanitizeInput($data['address']['street'] ?? ''),
            sanitizeInput($data['address']['city'] ?? ''),
            sanitizeInput($data['address']['state'] ?? ''),
            sanitizeInput($data['address']['zipCode'] ?? ''),
            sanitizeInput($data['address']['country'] ?? ''),
            sanitizeInput($data['company'] ?? ''),
            sanitizeInput($data['notes'] ?? ''),
            $id
        ]);

        successResponse(['id' => $id], 'Customer updated successfully');
    }

    public function delete($id)
    {
        requireAuth();

        $pdo = db();

        // Check if customer exists
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            errorResponse('Customer not found', 404);
        }

        // Delete customer
        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = ?");
        $stmt->execute([$id]);

        successResponse(['id' => $id], 'Customer deleted successfully');
    }
}