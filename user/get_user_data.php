<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$merchant_id = $content['user-id'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];


$url = $baseUrl . '/api/v2/users/' . $merchant_id; 
$merchant = callAPI("GET", $admin_token['access_token'], $url, false);  

$allCustomFields = [];

foreach($merchant['CustomFields'] as $cf) { 
    
    if (($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) ||  ($cf['Name'] == 'company_status' || $cf['Name'] == 'Verified' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix)  || ($cf['Name'] == 'following_items' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) || ($cf['Name'] == 'user_seller_location' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix))
     {
        

     }else {
        $allCustomFields[] = array('id' =>  $cf['Code'], 'name' => $cf['Name'], 'value' => $cf['Values'][0]);
     }
}

echo json_encode(['result' =>  $allCustomFields]);

?>
