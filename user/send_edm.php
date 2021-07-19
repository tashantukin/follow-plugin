<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$itemId = $content['itemguid'];
$type = $content['type'];

$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://';

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id
$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];

$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];

$url = $baseUrl . '/api/v2/items/' . $itemId;
$item_details = callAPI("GET", null, $url, false);
$items_div ='';
$item_name = $item_details['Name'];
$item_currency = $item_details['CurrencyCode'];
$item_price = number_format((float)$item_details['Price'],2);
$item_sku = $item_details['SKU']; 
$item_seller_displayname = $item_details['MerchantDetail']['DisplayName'];
$item_image = $item_details['Media'][0]['MediaUrl'];

$items_div .= "<tr><td style=\"vertical-align: top; width:20%; max-width:120px; min-width:33px;\"><img style=\"width:100%; max-width:120px;\" src=" . $item_image . "/></td><td style=\"vertical-align: top; padding-left:5px;\"><div style=\"line-height: 25px;\"><p style=\"margin-top:0px; color:#000; line-height:22px;\">" .  $item_name . "</p>";   

foreach ($item_details['Variants'] as $variant) {

$items_div .=  "<p>" . $variant['GroupName'] . ': ' . $variant['Name'] . "</p>";

}

$items_div .= "</td> <td style=\"width:25%; max-width: 150px; text-align: right; vertical-align: top; padding-top: 20px; font-size: 22px; color: #000; font-weight: bold;\">" .  $item_currency. ' ' . $item_price . "</td></tr><tr><td>&nbsp;</td>";



$url = $baseUrl . '/api/v2/marketplaces/';
$mp_details = callAPI("GET", null, $url, false);

$mp_name = $mp_details['Name'];
$mp_logo = $mp_details['LogoUrl'];
$mp_url = $mp_details['DefaultDomain'];


$url = $baseUrl . '/api/v2/users/' . $userId;
$merchant_details = callAPI("GET", null, $url, false);

$item_link = $protocol . $mp_url . '/user/item/detail/' . str_replace(' ', '-', $item_name) . '/' . $itemId;

//query to custom tables Templates
//get your templates ID or name
$tempoId = getPackageID();


if ($type == 'create') {
    $new_item_templates = array(array('Name' => 'title', "Operator" => "in",'Value' => 'New Item / Listing'));
    $url =  $baseUrl . '/api/v2/plugins/'. $tempoId .'/custom-tables/Templates';
    $templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $new_item_templates);
    $content = $templateDetails['Records'][0]['contents'];

}else {
    $update_item_templates = array(array('Name' => 'title', "Operator" => "in",'Value' => 'Item Update'));
    $url =  $baseUrl . '/api/v2/plugins/'. $tempoId .'/custom-tables/Templates';
    $templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $update_item_templates);
    // error_log(json_encode($templateDetails));
    $content = $templateDetails['Records'][0]['contents'];

}


foreach($merchant_details['CustomFields'] as $cf) {
    if ($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {  
        $followers_list = explode(",",$cf['Values'][0]); 

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
                    'ConsumerFirstName' => $follower_name,
                    'SellerName' => $merchant_details['DisplayName'],
                    'SellerDisplayName' => $merchant_details['DisplayName'],
                    'ImageUrl' => $item_image,
                    'ItemName' => $item_name,
                    'CurrencyCode' => $item_currency,
                    'ItemPrice' => $item_price,
                    'ItemLink' => $item_link,
                    'itemDetails' => $items_div
                );


                $pattern = '{{ %s }}';

                foreach ($token as $key => $val) {
                    $varMap[sprintf($pattern, $key)] = $val;
                }
                
                $emailContent = strtr($content, $varMap);
                    
                //send the EDM
                
                    $subject =  $templateDetails['Records'][0]['subject'];
                    $data = [
                        'From' => $merchant_details['Email'],
                        'To' => $follower_email,
                        'Subject' => $subject,
                        'Body' =>  $emailContent

                    ];
                $url =  $baseUrl . '/api/v2/admins/' . $admin_id .'/emails';
                $sendEDM = callAPI("POST", $admin_token['access_token'], $url, $data);
                

            }
      
        }
    }
}

