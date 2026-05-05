<?php

/**
 * Autoloader for PHP Backend
 * Simple PSR-4 autoloader implementation
 */

spl_autoload_register(function ($class) {
    // PSR-4 autoloading
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Load helper functions
require_once __DIR__ . '/helpers.php';