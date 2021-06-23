<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$status = $content['status'];
$user_id = $content['user-id'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id

// https://{{your-marketplace}}.arcadier.io/api/v2/users/{{userID}}
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);
$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

    foreach ($packageCustomFields as $cf) {
        if ($cf['Name'] == 'company_status' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
               $status_code = $cf['Code'];
        }
      
    }
    $data = [
        'CustomFields' => [
            [
                'Code' => $status_code,
                'Values' => [$status]
            ],
        ],
    ];
    echo json_encode(['data' => $data]);


    $url = $baseUrl . '/api/v2/users/' . $user_id;
    echo json_encode(['url' => $url]);
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
    echo json_encode(['result' => $result]);

//}


?>

