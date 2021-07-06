<?php
include 'callAPI.php';
include 'admin_token.php';


function getContent($templateID) {
    $baseUrl = getMarketplaceBaseUrl();
    $admin_token = getAdminToken();
    $customFieldPrefix = getCustomFieldPrefix();
 
    //$url = $baseUrl . '/api/v2/plugins/'.$packageId.'/custom-tables/Templates/'.$pageID; 

    $templates = array(array('Name' => 'Id', "Operator" => "in",'Value' => $templateID));
    $url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Templates';
    $templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $templates);
    
    return $templateDetails;
}

// function getPreview($page){
//     $baseUrl = getMarketplaceBaseUrl();
//     $admin_token = getAdminToken();
//     $customFieldPrefix = getCustomFieldPrefix();
//     $url = $baseUrl . '/api/v2/marketplaces/'; 
//     $marketplaceInfo = callAPI("GET", $admin_token['access_token'], $url, false);
  
//     foreach ($marketplaceInfo['CustomFields'] as $cf) {
//         if ($cf['Name'] == $page && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
//             $pageContent = $cf['Values'][0];
//         }
//         if ($pageContent == ''){
//             $pageContent =  'No preview Available';
//         }
//     }
//     return $pageContent;
// }

?>

