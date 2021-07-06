<?php

$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);
$page_id = $content['pageId'];
error_log('page id ' . $page_id);
$userId = $content['userId'];
$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

$file_pointer = realpath('templates/' . $page_id);

unlink($file_pointer);
