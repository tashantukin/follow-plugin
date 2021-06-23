<?php
include 'admin_token.php';

$admin_token = getAdminToken();

echo json_encode(['token' => $admin_token]);

?>