<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$user_id = $content['user-guid'];
$first_name= $content['first-name'];;
$last_name = $content['last-name'];;
$contact_number = $content['contact-number'];;
$email = $content['email'];;

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id

  $data = 
    [ 
        "Email" => $email,
        "FirstName" => $first_name,
        "LastName" => $last_name,
        "PhoneNumber" => $contact_number
   ];
    
  
    $url = $baseUrl . '/api/v2/users/' . $user_id ;
    echo json_encode(['url' => $url]);
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
    echo json_encode(['result' => $result]);

//}


?>

