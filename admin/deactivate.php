<?php
require_once '../sdk/ApiSdk.php';
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
	exit;
}

$sdk = new ApiSdk();
$eventTriggers = $sdk->getEventTriggers();
$marketplaceUrl = $sdk->getMarketplaceBaseUrl();
$packageId = $sdk->getPackageID();
$eventTriggerUrl = $marketplaceUrl . '/user/plugins/' . $packageId . '/edm-triggers.php';
$found = false;
if ($eventTriggers != null) {
	foreach ($eventTriggers as $e) {
		if (isset($e['Uri']) && !empty($e['Uri']) && $e['Uri'] == $eventTriggerUrl) {
			$found = true;
			$sdk->removeEventTrigger($e['Id']);
			break;
		}
	}
}

?>