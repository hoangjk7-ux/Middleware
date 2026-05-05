<?php

/**
 * PHP Backend - CRM Service
 * Entry point for the PHP backend application
 */

// Autoloader (you can use Composer)
require_once __DIR__ . '/bootstrap/autoload.php';

// Load configuration
require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';

// Initialize application
$app = new App();

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Route the request
$app->run();

class App {
    private $routes = [];

    public function __construct() {
        $this->loadRoutes();
    }

    private function loadRoutes() {
        // Load API routes
        require_once __DIR__ . '/routes/api.php';

        // Load web routes
        require_once __DIR__ . '/routes/web.php';
    }

    public function get($path, $handler) {
        $this->routes['GET'][$path] = $handler;
    }

    public function post($path, $handler) {
        $this->routes['POST'][$path] = $handler;
    }

    public function put($path, $handler) {
        $this->routes['PUT'][$path] = $handler;
    }

    public function delete($path, $handler) {
        $this->routes['DELETE'][$path] = $handler;
    }

    public function run() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Remove base path if needed
        $basePath = '/api'; // Adjust based on your setup
        if (strpos($path, $basePath) === 0) {
            $path = substr($path, strlen($basePath));
        }

        if (isset($this->routes[$method][$path])) {
            $handler = $this->routes[$method][$path];
            if (is_callable($handler)) {
                $handler();
            } elseif (is_string($handler)) {
                // Controller@method format
                list($controller, $method) = explode('@', $handler);
                $controllerClass = "App\\Controllers\\{$controller}";
                $controllerInstance = new $controllerClass();
                $controllerInstance->$method();
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Route not found']);
        }
    }
}

// Helper functions
function response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function request() {
    return json_decode(file_get_contents('php://input'), true);
}

function getBearerToken() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}