<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$itemId = $content['itemguid'];
$type = $content['type'];
$timezone = $content['timezone'];  

$timezone_name = timezone_name_from_abbr("", $timezone*60, false);
date_default_timezone_set($timezone_name);
$timestamp = date("d/m/Y H:i"); 


$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://';

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];
$username = $result['FirstName'];

$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];


$url = $baseUrl . '/api/v2/marketplaces/';
$mp_details = callAPI("GET", null, $url, false);

$mp_name = $mp_details['Name'];
$mp_logo = $mp_details['LogoUrl'];
//$mplink =   substr($mplogo, 0, strpos($mplogo, "/images"));
$mp_url = $mp_details['DefaultDomain'];


$url = $baseUrl . '/api/v2/users/' . $userId;
$buyer_details = callAPI("GET", $admin_token['access_token'], $url, false);

// $item_link = $protocol . $mp_url . '/user/item/detail/' . str_replace(' ', '-', $item_name) . '/' . $itemId;

//query to custom tables Templates
//get your templates ID or name
$tempoId = getPackageID();

//if ($type == 'create') {
    $new_item_templates = array(array('Name' => 'title', "Operator" => "in",'Value' => 'Buyer logged in'));
    $url =  $baseUrl . '/api/v2/plugins/'. $tempoId .'/custom-tables/Templates';
    $templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $new_item_templates);
    // error_log(json_encode($templateDetails));
    $content = $templateDetails['Records'][0]['contents'];

//}else {
//     $update_item_templates = array(array('Name' => 'title', "Operator" => "in",'Value' => 'Item Update'));
//     $url =  $baseUrl . '/api/v2/plugins/'. $tempoId .'/custom-tables/Templates';
//     $templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $update_item_templates);
//     // error_log(json_encode($templateDetails));
//     $content = $templateDetails['Records'][0]['contents'];

// }


// DD/MM/YYYY HH:MM 
foreach($buyer_details['CustomFields'] as $cf) {
    if ($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {  
        $followers_list = explode(",",$cf['Values'][0]); 
        error_log($cf['Values'][0]);
        error_log($followers_list);
        

        // $followers = [];
        foreach($followers_list as $follower_id) {
           // get each item details  
           $url = $baseUrl . '/api/v2/users/' . $follower_id; 
           $result = callAPI("GET", null, $url, false);
            if($result['ID']) {

                $follower_email = $result['Email'];
                $follower_name = $result['DisplayName'];

                $token = array(
                    'Logo'  => $mp_logo,
                    'MarketplaceUrl' => $mp_url,
                    'MarketName' => $mp_name,
                    'ConsumerFirstName' => $username,
                    'SellerName' => $follower_name,
                    'SellerDisplayName' => $follower_name,
                    'Timestamp' =>  $timestamp
                    
                );


                $pattern = '{{ %s }}';

                foreach ($token as $key => $val) {
                    $varMap[sprintf($pattern, $key)] = $val;
                }
                
                $emailContent = strtr($content, $varMap);
                    
                //send the EDM
                
                    $subject =  $templateDetails['Records'][0]['subject'];
                    $data = [
                        'From' => $mp_details['Owner']['Email'],
                        'To' => $follower_email,
                        'Subject' => $subject,
                        'Body' =>  $emailContent

                    ];
                //error_log($data);
                $url =  $baseUrl . '/api/v2/admins/' . $admin_id .'/emails';
                $sendEDM = callAPI("POST", $admin_token['access_token'], $url, $data);
                echo json_encode(['result' => $sendEDM]);
                error_log(json_encode($sendEDM));

                //send direct message

                // //get channel ID
                // $url =  $baseUrl . '/api/v2/users/' . $userId . '/channels?recipientId=' . $follower_id;
                // error_log('url ' . $url);
                // // $chat_channel = callAPI("POST", $admin_token['access_token'], $url, {});
                // $chat_channel = callAPI("POST", $admin_token['access_token'], $url, false);
                // error_log('chat ' .json_encode($chat_channel));    

                // $data = json_encode(['Message' => $emailContent]);
                
        
                // $url =  $baseUrl . '/api/v2/users/' . $userId . '/channels/' . $chat_channel['ChannelID'];
                // $sendMessage = callAPI("POST", $admin_token['access_token'], $url, $data);
                // echo json_encode(['result' => $sendMessage]);
                // error_log(json_encode($sendMessage));

            }
      
        }
    }
}

