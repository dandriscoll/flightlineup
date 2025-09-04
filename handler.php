<?php
// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: application/json');

$directory = __DIR__ . '/json_store/';

// Simple rate limiting
function isRateLimited() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rate_file = sys_get_temp_dir() . '/flight_' . md5($ip);
    
    if (file_exists($rate_file)) {
        $last_time = (int)file_get_contents($rate_file);
        if (time() - $last_time < 2) { // 2 second cooldown
            return true;
        }
    }
    
    file_put_contents($rate_file, time());
    return false;
}

if (isRateLimited()) {
    http_response_code(429);
    echo json_encode(["error" => "Please wait before making another request"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    
    // Basic validation
    if (empty($input) || strlen($input) > 10000) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input size"]);
        exit;
    }
    
    $data = json_decode($input, true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }
    
    // Generate secure filename
    $random_number = random_int(10000000, 99999999);
    $name = isset($data['name']) && is_string($data['name']) ? $data['name'] : '';
    
    if ($name) {
        $clean_name = preg_replace('/[^a-zA-Z0-9]/', '', $name);
        $clean_name = substr($clean_name, 0, 15);
        $basename = $clean_name . "-" . $random_number;
    } else {
        $basename = (string)$random_number;
    }
    
    // Save file
    if (!is_dir($directory)) {
        mkdir($directory, 0750, true);
    }
    
    $filepath = $directory . $basename . '.json';
    if (file_put_contents($filepath, json_encode($data)) === false) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save"]);
        exit;
    }
    
    echo json_encode(["filename" => $basename]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $file = $_GET['file'] ?? '';
    
    // Basic validation
    if (!preg_match('/^[a-zA-Z0-9\-]{1,24}$/', $file)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid filename"]);
        exit;
    }
    
    // Find file (handles both formats: "name-12345678" and "12345678")
    $filepath = $directory . $file . '.json';
    
    if (!file_exists($filepath)) {
        http_response_code(404);
        echo json_encode(["error" => "File not found"]);
        exit;
    }
    
    $content = file_get_contents($filepath);
    if ($content === false) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to read file"]);
        exit;
    }
    
    echo $content;
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>
