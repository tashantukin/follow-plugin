<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$followers_list = $content['followers-id'];
$customfield_id = $content['custom-id'];

$merchant_id = $content['merchant-id'];

$following_group_list = $content['following-group-list'];


$user_id = $content['user-id'];
$unfollowed_userId = $content['unfollowed-user'];
$following_list = $content['following-list'];
$user_type = $content['type'];
$action = $content['action'];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();
// Query to get marketplace id

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


    if ($cf['Name'] == 'following_items' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
        $item_following_code = $cf['Code'];
    }

    if ($cf['Name'] == 'item_followers' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
        $item_followers_code = $cf['Code'];

    }

}


//get the user's current followers list
 if ($user_type == 'items') {
    $url = $baseUrl . '/api/v2/items/' . $unfollowed_userId; 
    $item = callAPI("GET", $admin_token['access_token'], $url, false);  
    $merchant_id = $item['MerchantDetail']['ID'];
    
    foreach($item['CustomFields'] as $cf) { 
        if ($cf['Name'] == 'item_followers' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
            $followers = explode(',', $cf['Values'][0]);
            //follow back feature
            if ($action == 'follow') {
                $remaining_followers = array_push($followers,$user_id);
                    
            }else {
                $remaining_followers = array_filter($followers, function($e) use ($user_id) {
                    return ($e !== $user_id);
                });
                if (empty($remaining_followers)) {
                    $remaining_followers = "";
                }
                error_log(json_encode($remaining_followers));
            }
            
        }
    }


    $data = [
        'CustomFields' => [
            [
                'Code' => $item_followers_code,
                'Values' => is_array($remaining_followers) ? [implode(",", $remaining_followers)] : [$remaining_followers] ,
            ],
        ],
    ];
    echo json_encode(['items' => $data]);

    $url = $baseUrl . '/api/v2/merchants/' . $merchant_id . '/items/' . $unfollowed_userId;
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);


    //save item following list for user
    $data = [
        'CustomFields' => [
            [
                'Code' => $item_following_code,
                'Values' => is_array($following_list) ? [implode(",", $following_list)] : [$following_list] ,
            ],
        ],
    ];
    echo json_encode(['followinglist' => $data]);

    $url = $baseUrl . '/api/v2/users/' . $user_id ;
    echo json_encode(['url' => $url]);
    $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
    echo json_encode(['result' => $result]);


 }else {
        $url = $baseUrl . '/api/v2/users/' . $unfollowed_userId; 
        $user = callAPI("GET", $admin_token['access_token'], $url, false);  
        
        foreach($user['CustomFields'] as $cf) { 
            if ($cf['Name'] == 'followers_list' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {
                $followers = explode(',', $cf['Values'][0]);
                if ($action == 'follow') {
                    $remaining_followers = array_push($followers,$user_id);
                        
                }else {
                    $remaining_followers = array_filter($followers, function($e) use ($user_id) {
                        return ($e !== $user_id);
                    });
                    if (empty($remaining_followers)) {
                        $remaining_followers = "";
                    }
                    error_log(json_encode($remaining_followers));
                }
            }
        }
    
        

            $data = [
                'CustomFields' => [
                    [
                        'Code' => $followers_code,
                        'Values' => is_array($remaining_followers) ? [implode(",", $remaining_followers)] : [$remaining_followers] ,
                    ],
                ],
            ];
            echo json_encode(['date' => $data]);


        $url = $baseUrl . '/api/v2/users/' . $unfollowed_userId;
        echo json_encode(['url' => $url]);
        $result = callAPI("PUT", $admin_token['access_token'], $url, $data);
        echo json_encode(['result' => $result]);


        if ($user_type == 'group'){  // save to following_group
            $data = [
                'CustomFields' => [
                    [
                        'Code' => $following_group,
                        'Values' => is_array($following_list) ? [implode(",", $following_list)] : [$following_list] ,
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
            
    }
// }


?>

