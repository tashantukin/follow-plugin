<?php
require_once '../admin/admin_token.php';

class ApiSdk {
	private $adminToken = '';
	private $baseUrl = '';
	public function __construct() {
		$this->baseUrl = $this->getMarketplaceBaseUrl();
	}

	function callAPI($method, $access_token, $url, $data = false) {
		$curl = curl_init();
		switch ($method) {
		case "POST":
			curl_setopt($curl, CURLOPT_POST, 1);
			if ($data) {
				$jsonDataEncoded = json_encode($data);
				curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonDataEncoded);
			}
			break;
		case "PUT":
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PUT');
			if ($data) {
				$jsonDataEncoded = json_encode($data);
				curl_setopt($curl, CURLOPT_POSTFIELDS, $jsonDataEncoded);
			}
			break;
		case "DELETE":
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'DELETE');
			break;
		default:
			if ($data) {
				$url = sprintf("%s?%s", $url, http_build_query($data));
			}
		}
		$headers = ['Content-Type: application/json'];
		if ($access_token != null && $access_token != '') {
			array_push($headers, sprintf('Authorization: Bearer %s', $access_token));
		}
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($curl);
		curl_close($curl);
		return json_decode($result, true);
	}

	function getMarketplaceBaseUrl() {
		$marketplace = $_COOKIE["marketplace"];
		$protocol = $_COOKIE["protocol"];

		$baseUrl = $protocol . '://' . $marketplace;
		return $baseUrl;
	}

	function getPackageID() {
		$requestUri = "$_SERVER[REQUEST_URI]";
		preg_match('/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/', $requestUri, $matches, 0);
		return $matches[0];
	}

	function getCustomFieldPrefix() {
		$requestUri = "$_SERVER[REQUEST_URI]";
		preg_match('/([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/', $requestUri, $matches, 0);
		$customFieldPrefix = str_replace('-', '', $matches[0]);
		return $customFieldPrefix;
	}

	function getUserInfo($id) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/users/' . $id;
		$userInfo = $this->callAPI("GET", $this->adminToken['access_token'], $url, null);
		return $userInfo;
	}


	function getItemInfo($id) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/items/' . $id;
		$itemInfo = $this->callAPI("GET", $this->adminToken['access_token'], $url, null);
		return $itemInfo;
	}

	function getOrderInfo($id, $buyerId) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/users/' . $buyerId . '/orders/' . $id;
		$orderInfo = $this->callAPI("GET", $this->adminToken['access_token'], $url, null);
		return $orderInfo;
	}

	function updateOrders($data) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		error_log(json_encode($data));
		$url = $this->baseUrl . '/api/v2/admins/' . $this->adminToken['UserId'] . '/orders/';
		$orderInfo = $this->callAPI("POST", $this->adminToken['access_token'], $url, $data);
		return $orderInfo;
	}

	function getTransactionInfo($id) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/admins/' . $this->adminToken['UserId'] . '/transactions/' . $id;
		$transactionInfo = $this->callAPI("GET", $this->adminToken['access_token'], $url, null);
		return $transactionInfo;
	}

	function getEventTriggers() {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/event-triggers/';
		$eventTriggers = $this->callAPI("GET", $this->adminToken['access_token'], $url, null);
		return $eventTriggers;
	}

	function addEventTrigger($uri, $eventId) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/event-triggers/';
		$data = [
			'Uri' => $uri,
			'Filters' => [
				$eventId,
			],
		];
		$eventResult = $this->callAPI("POST", $this->adminToken['access_token'], $url, $data);
		return $eventResult;
	}

	function removeEventTrigger($eventId) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/event-triggers/' . $eventId;
		$eventResult = $this->callAPI("DELETE", $this->adminToken['access_token'], $url, null);
		return $eventResult;
	}

	function disableEdms() {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$data = [
			"Settings" => [
				"email-configuration" => [
					"order-shipped" => [
						"enabled" => "False",
					],
					"account-suspended" => [
						"enabled" => "False",
					],
				],
			],
		];
		$url = $this->baseUrl . '/api/v2/marketplaces/';
		$eventTriggers = $this->callAPI("POST", $this->adminToken['access_token'], $url, $data);
		return $eventTriggers;
	}

	function sendEmail($to, $html, $subject) {
		if ($this->adminToken == null) {
			$this->adminToken = getAdminToken();
		}
		$url = $this->baseUrl . '/api/v2/admins/' . $this->adminToken['UserId'] . '/emails/';
		$data = [
			'From' => 'admin@arcadier.com',
			'To' => $to,
			'Body' => $html,
			'Subject' => $subject,
		];
		$emailResult = $this->callAPI("POST", $this->adminToken['access_token'], $url, $data);
		return $emailResult;
	}

	function getUserTax($pluginId, $userid) {
		$data = [
			[
				'Name' => 'UserID',
				'Value' => $userid,
			],
		];

		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/UserTax';
		$userTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $userTaxInfo;
	}

	function isUserTaxExisting($pluginId, $userid, $name) {
		$data = [
			[
				'Name' => 'UserID',
				'Value' => $userid,
			],
			[
				'Name' => 'Name',
				'Value' => $name,
			],
		];

		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/UserTax';
		$userTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $userTaxInfo;
	}

	function deleteUserTax($pluginId, $rowId) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/UserTax/rows/' . $rowId;
		$userTaxInfo = $this->callAPI("DELETE", null, $url, null);
		return $userTaxInfo;
	}

	function addUserTax($pluginId, $data) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/UserTax/rows/';
		$userTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $userTaxInfo;
	}

	function updateUserTax($pluginId, $rowId, $data) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/UserTax/rows/' . $rowId;
		$userTaxInfo = $this->callAPI("PUT", null, $url, $data);
		return $userTaxInfo;
	}

	function getItemTax($pluginId, $itemid) {
		$data = [
			[
				'Name' => 'ItemID',
				'Value' => $itemid,
			],
		];

		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/ItemTax';
		$itemTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $itemTaxInfo;
	}

	function deleteItemTax($pluginId, $rowId) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/ItemTax/rows/' . $rowId;
		$itemTaxInfo = $this->callAPI("DELETE", null, $url, null);
		return $itemTaxInfo;
	}

	function addItemTax($pluginId, $data) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/ItemTax/rows/';
		$itemTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $itemTaxInfo;
	}

	function updateItemTax($pluginId, $rowId, $data) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/ItemTax/rows/' . $rowId;
		$itemTaxInfo = $this->callAPI("PUT", null, $url, $data);
		return $itemTaxInfo;
	}

	function getCartTax($pluginId, $cartid) {
		$data = [
			[
				'Name' => 'CartItemID',
				'Value' => $cartid,
			],
		];

		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/CartItemTax';
		$cartTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $cartTaxInfo;
	}

	function getCartTaxes($pluginId, $cartids) {
		$data = [
			[
				'Name' => 'CartItemID',
				'Operator' => 'in',
				'Value' => $cartids,
			],
		];

		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/CartItemTax';
		$cartTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $cartTaxInfo;
	}

	function deleteCartTax($pluginId, $rowId) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/CartItemTax/rows/' . $rowId;
		$cartTaxInfo = $this->callAPI("DELETE", null, $url, null);
		return $cartTaxInfo;
	}

	function addCartTax($pluginId, $data) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/CartItemTax/rows/';
		$cartTaxInfo = $this->callAPI("POST", null, $url, $data);
		return $cartTaxInfo;
	}

	function updateCartTax($pluginId, $rowId, $data) {
		$url = $this->baseUrl . '/api/v2/plugins/' . $pluginId . '/custom-tables/CartItemTax/rows/' . $rowId;
		$cartTaxInfo = $this->callAPI("PUT", null, $url, $data);
		return $cartTaxInfo;
	}
}

?>