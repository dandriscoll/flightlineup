<?php
$directory = __DIR__ . '/json_store/';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read and decode the JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $name = '';
    if (isset($data['name']) && is_string($data['name'])) {
        $name = $data['name'];
    }
    
    if (strlen($input) > 10000) {
        http_response_code(413);
        echo json_encode(["error" => "Input exceeds maximum length"]);
    }

    // Generate an 8-digit random number (between 10000000 and 99999999)
    $random_number = rand(10000000, 99999999);

    // Sanitize the name: Keep alphanumeric, replace spaces with dashes, limit to 20 chars
    $sanitized_name = preg_replace('/[^a-zA-Z0-9 ]/', '', $data['name']); // Remove non-alphanumeric
    $sanitized_name = substr(str_replace(' ', '-', $sanitized_name), 0, 20); // Replace spaces, limit length

    // Construct the new filename
    $basename = $random_number;
    if (strlen($name) > 0) {
        $basename = $sanitized_name . "-" . $random_number;
    }
    $filename = $basename . ".json";
    $filepath = $directory . $filename;

    // Ensure directory exists
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    // Save JSON to file
    if (!file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT))) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save file"]);
        exit;
    }

    // Return the new filename
    echo json_encode(["filename" => $basename]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['file'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing 'file' parameter"]);
        exit;
    }

    $file_param = $_GET['file'];

    // Extract the last 8 digits from the filename
    if (!preg_match('/(\d{8})$/', $file_param, $matches)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid filename format"]);
        exit;
    }

    $random_number = $matches[1];

    // Find a matching file in the directory
    $matching_files = glob($directory . "*-" . $random_number . ".json");

    if (empty($matching_files)) {
        sleep(1);
        http_response_code(404);
        echo json_encode(["error" => "File not found"]);
        exit;
    }

    // Read and return the JSON file
    $filepath = $matching_files[0];
    header('Content-Type: application/json');
    echo file_get_contents($filepath);
    exit;
}

// If request method is not allowed
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>
