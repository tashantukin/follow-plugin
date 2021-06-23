<?php

include 'callAPI.php';
include 'admin_token.php';

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];

//get the custom field code

$url = $baseUrl . '/api/v2/packages/'. getPackageID() .'/custom-field-definitions';
$customfieldsInfo = callAPI("GET", null, $url, false);

$customfield_code = '';

foreach($customfieldsInfo as $cf) {
    if($cf['Name'] == 'company_status') {
        $customfield_code = $cf['Code'];

    }
}

$url = $baseUrl . '/api/v2/admins/' . $admin_id .'/custom-field-values?referenceTable=Users&pageSize=1000'; 
$company_users = array(array('Code' => $customfield_code, "Operator" => "equal", 'Value' => 'true'));
$search_company_users =  callAPI("POST", $admin_token['access_token'], $url, $company_users);
error_log(json_encode(['users' => $search_company_users]));
echo json_encode($search_company_users);
?>