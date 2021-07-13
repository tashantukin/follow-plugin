<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$items_list = $content['items-id'];
$customfield_id = $content['custom-id'];
$user_id = $content['user-id'];
$item_guid = $content['item-guid'];
$followers_list =  $content['item-followers']; 
$merchant_guid = $content['merchant-guid'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

$userToken = $_COOKIE["webapitoken"];
$url = $baseUrl . '/api/v2/users/'; 
$result = callAPI("GET", $userToken, $url, false);
$userId = $result['ID'];


// Query to get marketplace ids

// https://{{your-marketplace}}.arcadier.io/api/v2/users/{{userID}}
$url = $baseUrl . '/api/v2/marketplaces/';
$marketplaceInfo = callAPI("GET", null, $url, false);
$url = $baseUrl . '/api/developer-packages/custom-fields?packageId=' . getPackageID();
$packageCustomFields = callAPI("GET", null, $url, false);

    foreach ($packageCustomFields as $cf) {
        if ($cf['Name'] == 'following_items' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
               $followers_code = $cf['Code'];
        }

        if ($cf['Name'] == 'item_followers' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
            $item_followers_code = $cf['Code'];
     }
      
    }

        $data = [
            'CustomFields' => [
                [
                    'Code' => $followers_code,
                    'Values' => is_array($items_list) ? [implode(",", $items_list)] : [$items_list] ,
                ],
            ],
        ];
        echo json_encode(['items' => $data]);


    $url = $baseUrl . '/api/v2/users/' . $userId;
    echo json_encode(['url' => $url]);
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
 //   echo json_encode(['result' => $result]);


    $data = [
        'CustomFields' => [
            [
                'Code' => $item_followers_code,
                'Values' => is_array($followers_list) ? [implode(",", $followers_list)] : [$followers_list] ,
            ],
        ],
    ];
    echo json_encode(['items' => $data]);


    $url = $baseUrl . '/api/v2/merchants/' . $merchant_guid . '/items/' . $item_guid;
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);


   // $url = $baseUrl . '/api/v2/items/' . $item_guid;
    //echo json_encode(['url' => $url]);
   // $result = callAPI("POST", $admin_token['access_token'], $url, $data);
    echo json_encode(['result items' => $result]);




//}


?>

