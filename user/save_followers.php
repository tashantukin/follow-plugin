<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$followers_list = $content['followers-id'];
$customfield_id = $content['custom-id'];
$user_id = $content['user-id'];
$merchant_id = $content['merchant-id'];
$following_list = $content['following-id'];
$user_type = $content['user-type'];
$following_group_list = $content['following-group-list'];

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
        if ($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
               $followers_code = $cf['Code'];
        }

        //save to users

        if ($cf['Name'] == 'following_users' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
            $following_code = $cf['Code'];
         }


         if ($cf['Name'] == 'following_group' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
            $following_group = $cf['Code'];
         }

      
    }

        $data = [
            'CustomFields' => [
                [
                    'Code' => $followers_code,
                    'Values' => is_array($followers_list) ? [implode(",", $followers_list)] : [$followers_list] ,
                ],
            ],
        ];
        echo json_encode(['date' => $data]);


    $url = $baseUrl . '/api/v2/users/' . $merchant_id ;
    echo json_encode(['url' => $url]);
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
    echo json_encode(['result' => $result]);


    if ($user_type == 'company'){  // save to following_group
        $data = [
            'CustomFields' => [
                [
                    'Code' => $following_group,
                    'Values' => is_array($following_group_list) ? [implode(",", $following_group_list)] : [$following_group_list] ,
                ],
            ],
        ];
        echo json_encode(['companylist' => $data]);

        $url = $baseUrl . '/api/v2/users/' . $user_id ;
        echo json_encode(['url' => $url]);
        $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
        echo json_encode(['result' => $result]);
        
    }else {
        //save to users following list
        $data = [
            'CustomFields' => [
                [
                    'Code' => $following_code,
                    'Values' => is_array($following_list) ? [implode(",", $following_list)] : [$following_list] ,
                ],
            ],
        ];
        echo json_encode(['followinglist' => $data]);

        $url = $baseUrl . '/api/v2/users/' . $user_id ;
        echo json_encode(['url' => $url]);
        $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
        echo json_encode(['result' => $result]);
    }
    

//}


?>

