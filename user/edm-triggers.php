<?php
require_once '../sdk/ApiSdk.php';
require_once 'include/localize.php';
require_once '../admin/admin_token.php';

include 'callAPI.php';


$contentBodyJson = file_get_contents('php://input');
$content = json_decode($contentBodyJson, true);

error_log('content1' . $contentBodyJson);
error_log('content ' . $content);

$marketplace = $_COOKIE["marketplace"];
$protocol = $_COOKIE["protocol"];

$baseUrl = getMarketplaceBaseUrl();
$admin_token = getAdminToken();
$customFieldPrefix = getCustomFieldPrefix();

$url = $baseUrl . '/api/v2/users/';
$result = callAPI("GET", $admin_token['access_token'], $url, false);
$admin_id = $result['ID'];


if (isset($content['Action']) && !empty($content['Action'])) {
	$action = $content['Action'];
	$data = $content['Data'];
	$languages = ['en', 'vi'];
	if ($action == 'edm.stock-low-notification') {
		$item = $data['Meta']['Item']['ID'];
		$sdk = new ApiSdk();
		$itemInfo = $sdk->getItemInfo($item);

		error_log(json_encode($itemInfo));

		$items_div ='';
		$item_name = $itemInfo['Name'];
		$item_currency = $itemInfo['CurrencyCode'];
		$item_price = number_format((float)$itemInfo['Price'],2);
		$item_sku = $itemInfo['SKU']; 
		$item_seller_displayname = $itemInfo['MerchantDetail']['DisplayName'];
		$item_image = $itemInfo['Media'][0]['MediaUrl'];

		$items_div .= "<tr><td style=\"vertical-align: top; width:20%; max-width:120px; min-width:33px;\"><img style=\"width:100%; max-width:120px;\" src=" . $item_image . "/></td><td style=\"vertical-align: top; padding-left:5px;\"><div style=\"line-height: 25px;\"><p style=\"margin-top:0px; color:#000; line-height:22px;\">" .  $item_name . "</p>";   

		foreach ($itemInfo['Variants'] as $variant) {

		$items_div .=  "<p>" . $variant['GroupName'] . ': ' . $variant['Name'] . "</p>";

		}

		$items_div .= "</td> <td style=\"width:25%; max-width: 150px; text-align: right; vertical-align: top; padding-top: 20px; font-size: 22px; color: #000; font-weight: bold;\">" .  $item_currency. ' ' . $item_price . "</td></tr><tr><td>&nbsp;</td>";


		$url = $baseUrl . '/api/v2/marketplaces/';
		$mp_details = callAPI("GET", null, $url, false);

		$mp_name = $mp_details['Name'];
		$mp_logo = $mp_details['LogoUrl'];
		//$mplink =   substr($mplogo, 0, strpos($mplogo, "/images"));
		$mp_url = $mp_details['DefaultDomain'];


		$item_link = $protocol . '://' . $mp_url . '/user/item/detail/' . str_replace(' ', '-', $item_name) . '/' . $item;
		error_log($item_link);

		//query to custom tables Templates
		//get your templates ID or name
		$tempoId = getPackageID();


		//if ($type == 'create') {
			$new_item_templates = array(array('Name' => 'title', "Operator" => "in",'Value' => 'Item low stock'));
			$url =  $baseUrl . '/api/v2/plugins/'. $tempoId .'/custom-tables/Templates';
			$templateDetails =  callAPI("POST", $admin_token['access_token'], $url, $new_item_templates);
			// error_log(json_encode($templateDetails));
			$content = $templateDetails['Records'][0]['contents'];

			foreach($itemInfo['CustomFields'] as $cf) {
				if ($cf['Name'] == 'item_followers' && substr($cf['Code'], 0, strlen($customFieldPrefix)) == $customFieldPrefix) {  
					$followers_list = explode(",",$cf['Values'][0]); 
					error_log($cf['Values'][0]);
					error_log($followers_list);
					
		
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
								'SellerName' => $itemInfo['MerchantDetail']['FirstName'],
								'SellerDisplayName' => $itemInfo['MerchantDetail']['DisplayName'],
								'ImageUrl' => $item_image,
								'ItemName' => $item_name,
								'CurrencyCode' => $item_currency,
								'ItemPrice' => $item_price,
								'ItemLink' => $item_link,
								'ItemDetails' => $items_div
							);
			
			
							$pattern = '{{ %s }}';
			
							foreach ($token as $key => $val) {
								$varMap[sprintf($pattern, $key)] = $val;
							}
							
							$emailContent = strtr($content, $varMap);
								
							//send the EDM
							
								$subject =  $templateDetails['Records'][0]['subject'];
								$data = [
									'From' => $itemInfo['MerchantDetail']['Email'],
									'To' => $follower_email,
									'Subject' => $subject,
									'Body' =>  $emailContent
			
								];
							//error_log($data);
							$url =  $baseUrl . '/api/v2/admins/' . $admin_id .'/emails';
							$sendEDM = callAPI("POST", $admin_token['access_token'], $url, $data);
							echo json_encode(['result' => $sendEDM]);
							error_log(json_encode($sendEDM));
			
							
			
						}
				  
					}
				}
			}





























		// $language = $userInfo['LanguageCode'];
		// if (!in_array($language, $languages)) {$language = 'en';}
		// $html = file_get_contents('edm-content/' . $language . "/account-suspended.html");
		// $html = str_replace('{{user}}', $userInfo['DisplayName'], $html);

		// $sdk->sendEmail($userInfo['Email'], $html, 'Suspended');

	}

	// } else if ($action == 'edm.order-shipped') {
	// 	$order = $data['Meta']['Order']['ID'];
	// 	$buyer = $data['Meta']['Order']['ConsumerDetail']['ID'];
	// 	$sdk = new ApiSdk();

	// 	$orderInfo = $sdk->getOrderInfo($order, $buyer);
	// 	error_log(json_encode($orderInfo));
	// 	$userInfo = $orderInfo['ConsumerDetail'];
	// 	$language = $userInfo['LanguageCode'];
	// 	if (!in_array($language, $languages)) {$language = 'en';}

	// 	$currencyCode = $orderInfo['CurrencyCode'];
	// 	$html = file_get_contents('edm-content/' . $language . "/order-delivered.html");
	// 	$html = str_replace('{{user}}', $userInfo['FirstName'], $html);
	// 	$cartHtml = '';
	// 	$details = $orderInfo['CartItemDetails'];
	// 	foreach ($details as $cart) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-details.html");
	// 		$chtml = str_replace('{{Quantity}}', $cart['Quantity'], $chtml);
	// 		$chtml = str_replace('{{ItemName}}', $cart['ItemDetail']['Name'], $chtml);

	// 		$cartHtml .= $chtml;
	// 	}

	// 	$html = str_replace('{{OrderDetails}}', $cartHtml, $html);

	// 	$summaryHtml = '';
	// 	$subTotal = $orderInfo['Total'];
	// 	if ($subTotal != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('SubTotal', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($subTotal, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}
	// 	$tax = $orderInfo['Tax'];
	// 	if ($tax != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('Tax', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($tax, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}
	// 	$discount = $orderInfo['DiscountAmount'];
	// 	if ($discount != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('DiscountAmount', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($discount, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}
	// 	$total = $orderInfo['GrandTotal'];
	// 	if ($total != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('Total', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($total, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}

	// 	$html = str_replace('{{OrderSummary}}', $summaryHtml, $html);
	// 	$sdk->sendEmail($userInfo['Email'], $html, 'Items are on the way');
	// } else if ($action == 'edm.new-order') {

	// } else if ($action == 'edm.received-order') {
	// 	$invoiceNo = $data['Meta']['Transaction']['InvoiceNo'];
	// 	$sdk = new ApiSdk();

	// 	$transaction = $sdk->getTransactionInfo($invoiceNo);
	// 	error_log(json_encode($transaction));
	// 	$currencyCode = $transaction['CurrencyCode'];
	// 	$invoiceNo = $transaction['InvoiceNo'];

	// 	$first = true;
	// 	foreach ($transaction['Orders'] as $key => $orderInfo) {
	// 		if ($first == true) {
	// 			$userInfo = $orderInfo['ConsumerDetail'];
	// 			$language = $userInfo['LanguageCode'];
	// 			if (!in_array($language, $languages)) {$language = 'en';}

	// 			$html = file_get_contents('edm-content/' . $language . "/order-received.html");
	// 			$html = str_replace('{{user}}', $userInfo['FirstName'], $html);

	// 			$cartHtml = '';
	// 			$subTotal = 0;
	// 			$tax = 0;
	// 			$discount = 0;
	// 			$total = 0;
	// 			$first = false;
	// 		}

	// 		$subTotal += $orderInfo['Total'];
	// 		$tax += $orderInfo['Tax'];
	// 		$discount += $orderInfo['DiscountAmount'];
	// 		$total += $orderInfo['GrandTotal'];
	// 		$details = $orderInfo['CartItemDetails'];
	// 		foreach ($details as $cart) {
	// 			$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-details.html");
	// 			$chtml = str_replace('{{Quantity}}', $cart['Quantity'], $chtml);
	// 			$chtml = str_replace('{{ItemName}}', $cart['ItemDetail']['Name'], $chtml);

	// 			$cartHtml .= $chtml;
	// 		}
	// 	}

	// 	$summaryHtml = '';
	// 	if ($subTotal > 0) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('SubTotal', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($subTotal, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}

	// 	if ($tax != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('Tax', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($tax, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}

	// 	if ($discount != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('DiscountAmount', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($discount, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}

	// 	if ($total != null) {
	// 		$chtml = file_get_contents('edm-content/' . $language . "/order-delivered-summary.html");
	// 		$chtml = str_replace('{{Description}}', localize('Total', $language), $chtml);
	// 		$chtml = str_replace('{{Amount}}', $currencyCode . ' ' . number_format($total, 2), $chtml);

	// 		$summaryHtml .= $chtml;
	// 	}

	// 	$html = str_replace('{{InvoiceNo}}', $invoiceNo, $html);
	// 	$html = str_replace('{{OrderDetails}}', $cartHtml, $html);
	// 	$html = str_replace('{{OrderSummary}}', $summaryHtml, $html);
	// 	$sdk->sendEmail($userInfo['Email'], $html, 'Order confirmation');
	// }
}

?>