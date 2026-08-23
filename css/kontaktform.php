<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Anfrage.']);
    exit;
}

// Honeypot Bot-Schutz
if (!empty($_POST['website_hp'])) {
    echo json_encode(['status' => 'success', 'message' => 'Vielen Dank für deine Anfrage!']);
    exit;
}

// Daten bereinigen
$name    = filter_var(trim($_POST['name'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = filter_var(trim($_POST['phone'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
$service = filter_var(trim($_POST['service'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
$date    = filter_var(trim($_POST['date'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
$time    = filter_var(trim($_POST['time'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_var(trim($_POST['message'] ?? ''), FILTER_SANITIZE_SPECIAL_CHARS);
$privacy = isset($_POST['privacy']);

if (!$name || !$email || !$phone || !$service || !$date || !$time || !$privacy) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Bitte fülle alle Pflichtfelder aus.']);
    exit;
}

$formattedDate = date('d.m.Y', strtotime($date));

// E-Mail-Empfänger
$to = "info@mellis-haarstudio.de"; 
$subject = "Neue Terminanfrage: " . $name;

// Clean formatierte E-Mail Nachricht
$body  = "Neue Terminanfrage über die Website:\n";
$body .= "--------------------------------------------------\n\n";
$body .= "KUNDE:\n";
$body .= "• Name: " . $name . "\n";
$body .= "• E-Mail: " . $email . "\n";
$body .= "• Telefon: " . $phone . "\n\n";
$body .= "TERMINWUNSCH:\n";
$body .= "• Leistung: " . $service . "\n";
$body .= "• Datum: " . $formattedDate . "\n";
$body .= "• Zeitfenster: " . $time . "\n\n";
$body .= "ANMERKUNGEN:\n";
$body .= ($message ? $message : "Keine Anmerkungen hinterlassen.") . "\n\n";
$body .= "--------------------------------------------------\n";
$body .= "Gesendet über das Kontaktformular auf mellis-haarstudio.de";

$headers = [
    'From' => 'Mellis Haarstudio Website <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

if (mail($to, $subject, $body, $headers)) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'Vielen Dank! Deine Terminanfrage ist eingegangen. Wir melden uns in Kürze zur Bestätigung.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Fehler beim Senden. Bitte versuche es erneut oder rufen uns direkt an.'
    ]);
}