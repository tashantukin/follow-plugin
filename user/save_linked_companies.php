<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$company_id = $content['items-id'];
$status = $content['status'];
$company_location =  $content['company-location'];
$company_name =  $content['company-name'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
$userToken = $_COOKIE["webapitoken"];

$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
error_log($result);
$userId = $result['ID'];
$userEmail = $result['Email'];

$now = new DateTime();

$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

    foreach ($packageCustomFields as $cf) {
        if ($cf['Name'] == 'linked_companies' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
               $link_code = $cf['Code'];
        }

        //status

       if ($cf['Name'] == 'linked_status' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
               $link_status_code = $cf['Code'];
        }
    }


        $data = [
            'CustomFields' => [
                [
                    'Code' => $link_code,
                    'Values' => [ json_encode(['CompanyID' => $company_id, 'CompanyLocation' => $company_location, 'CompanyName' => $company_name, 'UserID' =>  $userId, 'UserEmail'=> $userEmail,  'DateRequested' => $now->getTimestamp()])],
                ],

                [
                    'Code' => $link_status_code,
                    'Values' => [$status]

                ],



            ],
        ];
        echo json_encode(['date' => $data]);


    $url = $baseUrl . '/api/v2/users/' . $userId;
    echo json_encode(['url' => $url]);
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
    echo json_encode(['result' => $result]);

//}


?>

