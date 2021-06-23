<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$userId = $content['userguid'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// $userToken = $_COOKIE["webapitoken"];
// $url = $baseUrl . '/api/v2/users/'; 
// $result = callAPI("GET", $userToken, $url, false);
// $userId = $result['ID'];
$start_date = null;
$end_date = null;

$url = $baseUrl . '/api/v2/users/' . $userId; 
$merchant = callAPI("GET", $admin_token['access_token'], $url, false);  

foreach($merchant['CustomFields'] as $cf) 
{ 
    
if ($cf['Name'] == 'company_status' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
    $status = $cf['Values'][0];
     
 }

}
echo json_encode(['status' => $status ]);
?>
