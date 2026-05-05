<?php

/**
 * Web Routes
 * Define web routes here (if needed)
 */

// Home page
$app->get('/', function() {
    echo "<h1>CRM Service PHP Backend</h1>";
    echo "<p>API endpoints available at /api/*</p>";
    echo "<p>Health check: <a href='/api/health'>/api/health</a></p>";
});