<?php

namespace App\Controllers;

class LeadController
{
    public function index()
    {
        requireAuth();

        $pdo = db();
        $stmt = $pdo->query("
            SELECT l.*, u.username as assigned_username, u.email as assigned_email
            FROM leads l
            LEFT JOIN users u ON l.assigned_to = u.id
            ORDER BY l.created_at DESC
        ");
        $leads = $stmt->fetchAll();

        successResponse($leads);
    }

    public function show($id)
    {
        requireAuth();

        $pdo = db();
        $stmt = $pdo->prepare("
            SELECT l.*, u.username as assigned_username, u.email as assigned_email
            FROM leads l
            LEFT JOIN users u ON l.assigned_to = u.id
            WHERE l.id = ?
        ");
        $stmt->execute([$id]);
        $lead = $stmt->fetch();

        if (!$lead) {
            errorResponse('Lead not found', 404);
        }

        successResponse($lead);
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
        $stmt = $pdo->prepare("SELECT id FROM leads WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            errorResponse('Lead with this email already exists', 409);
        }

        // Insert lead
        $stmt = $pdo->prepare("
            INSERT INTO leads (name, email, phone, company, position, source, status, notes, assigned_to)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            sanitizeInput($data['name']),
            sanitizeInput($data['email']),
            sanitizeInput($data['phone'] ?? ''),
            sanitizeInput($data['company'] ?? ''),
            sanitizeInput($data['position'] ?? ''),
            sanitizeInput($data['source'] ?? 'other'),
            sanitizeInput($data['status'] ?? 'new'),
            sanitizeInput($data['notes'] ?? ''),
            $data['assignedTo'] ?? null
        ]);

        $leadId = $pdo->lastInsertId();

        successResponse([
            'id' => $leadId,
            'name' => $data['name'],
            'email' => $data['email']
        ], 'Lead created successfully');
    }

    public function update($id)
    {
        requireAuth();

        $data = request();

        $pdo = db();

        // Check if lead exists
        $stmt = $pdo->prepare("SELECT id FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            errorResponse('Lead not found', 404);
        }

        // Update lead
        $stmt = $pdo->prepare("
            UPDATE leads SET
                name = ?,
                email = ?,
                phone = ?,
                company = ?,
                position = ?,
                source = ?,
                status = ?,
                notes = ?,
                assigned_to = ?,
                updated_at = NOW()
            WHERE id = ?
        ");

        $stmt->execute([
            sanitizeInput($data['name'] ?? ''),
            sanitizeInput($data['email'] ?? ''),
            sanitizeInput($data['phone'] ?? ''),
            sanitizeInput($data['company'] ?? ''),
            sanitizeInput($data['position'] ?? ''),
            sanitizeInput($data['source'] ?? 'other'),
            sanitizeInput($data['status'] ?? 'new'),
            sanitizeInput($data['notes'] ?? ''),
            $data['assignedTo'] ?? null,
            $id
        ]);

        successResponse(['id' => $id], 'Lead updated successfully');
    }

    public function assign($id, $userId)
    {
        requireAuth();

        $pdo = db();

        // Check if lead exists
        $stmt = $pdo->prepare("SELECT id FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            errorResponse('Lead not found', 404);
        }

        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        if (!$stmt->fetch()) {
            errorResponse('User not found', 404);
        }

        // Assign lead
        $stmt = $pdo->prepare("UPDATE leads SET assigned_to = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$userId, $id]);

        successResponse(['id' => $id, 'assigned_to' => $userId], 'Lead assigned successfully');
    }

    public function convert($id, $customerId)
    {
        requireAuth();

        $pdo = db();

        // Check if lead exists
        $stmt = $pdo->prepare("SELECT id FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            errorResponse('Lead not found', 404);
        }

        // Check if customer exists
        $stmt = $pdo->prepare("SELECT id FROM customers WHERE id = ?");
        $stmt->execute([$customerId]);
        if (!$stmt->fetch()) {
            errorResponse('Customer not found', 404);
        }

        // Convert lead to customer
        $stmt = $pdo->prepare("UPDATE leads SET status = 'converted', updated_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);

        successResponse(['id' => $id, 'customer_id' => $customerId], 'Lead converted successfully');
    }

    public function delete($id)
    {
        requireAuth();

        $pdo = db();

        // Check if lead exists
        $stmt = $pdo->prepare("SELECT id FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            errorResponse('Lead not found', 404);
        }

        // Delete lead
        $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
        $stmt->execute([$id]);

        successResponse(['id' => $id], 'Lead deleted successfully');
    }
}