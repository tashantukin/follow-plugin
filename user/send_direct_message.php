<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$message = $content['message'];
//$itemId = $content['itemguid'];
//$prodbundles = $content['prodbundles'];
$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://';
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];
$url =  $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];
$url = $baseUrl . '/api/v2/items/' . $itemId;
$item_details = callAPI("GET", null, $url, false);
$item_name = $item_details['Name'];
$item_currency = $item_details['CurrencyCode'];
$item_price = number_format((float)$item_details['Price'],2);
$item_sku = $item_details['SKU']; 
$item_seller_displayname = $item_details['MerchantDetail']['DisplayName'];
$item_image = $item_details['Media'][0]['MediaUrl'];
​
​
$url = $baseUrl . '/api/v2/marketplaces/';
$mp_details = callAPI("GET", null, $url, false);
​
$mp_name = $mp_details['Name'];
$mp_logo = $mp_details['LogoUrl'];
//$mplink =   substr($mplogo, 0, strpos($mplogo, "/images"));
$mp_url = $mp_details['DefaultDomain'];
​
​
$url = $baseUrl . '/api/v2/users/' . $userId;
$merchant_details = callAPI("GET", null, $url, false);
​
$item_link = $protocol . $mp_url . '/user/item/detail/' . $item_name. '/' . $itemId;
​
//query to custom tables Templates
//get your templates ID or name
$tempoId = 'ed0f2131-3ef2-4ef1-9fb8-e20224eb1887';
$templates = array(array('Name' => 'title', "Operator" => "in",'Value' => 'New Item Updates'));
    $url =  $baseUrl . '/api/v2/plugins/'. $tempoId .'/custom-tables/Templates';
    error_log(json_encode($url));
    
    $templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $templates);
    error_log(json_encode($templateDetails));
​
    $content = $templateDetails['Records'][0]['contents'];
​
    
​
foreach($merchant_details['CustomFields'] as $cf) {
    if ($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
        $followers_list = explode(",",$cf['Values'][0]); 
​
        // $followers = [];
        foreach($followers_list as $follower_id) {
           // get each item details  
           $url = $baseUrl . '/api/v2/users/' . $follower_id; 
           $result = callAPI("GET", null, $url, false);
           if($result['ID']) {
              
                //get channel ID
                $url =  $baseUrl . 'api/v2/users/' . $userId . '/channels?recipientId=' . $follower_id ;
                $chat_channel = callAPI("POST", $admin_token['access_token'], $url, {});
                error_log(json_encode($chat_channel));
​
                //send message
​
                $data = {
                    'Message'=> $message
                };
​
                $url =  $baseUrl . 'api/v2/users/' . $userId . '/channels/' . $chat_channel['ChannelID'];
                $sendMessage = callAPI("POST", $admin_token['access_token'], $url, $data);
                echo json_encode(['result' => $sendMessage]);
                error_log(json_encode($sendMessage));
            }
        }
      
    }
   
}