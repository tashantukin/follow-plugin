<?php
include 'callAPI.php';
include 'admin_token.php';
$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$timezone = $content['timezone'];
$timezone_name = timezone_name_from_abbr("", $timezone * 60, false);
date_default_timezone_set($timezone_name);

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();


$userId = $content['userId'];
$title = $content['title'];
$contents = $content['content'];
$subject = $content['subject'];
$urls = $content['pageURL'];
$description = $content['description'];
$templateId = $content['template-id'];


$type =$content['type'];
$cc = is_array($content['cc']) ? implode(",",$content['cc']) : $content['cc'] ;
$bcc = is_array($content['bcc']) ? implode(",",$content['bcc']) : $content['bcc'] ;
//*save template contents inside a custom table -- Name: Templates
$template_details = array('title' => $title, 'contents' => $contents, 'subject' => $subject, 'description' => $description, 'category' => $type, 'cc'=> $cc, 'bcc'=> $bcc);
echo json_encode(['contents' => $template_details ]);

$url =  $baseUrl . '/api/v2/plugins/'. getPackageID() .'/custom-tables/Templates/rows/' . $templateId;
echo json_encode(['contents' => $url ]);
$result =  callAPI("PUT",$admin_token['access_token'], $url, $template_details);

echo json_encode(['contents' => $result ]);