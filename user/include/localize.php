<?php
include 'constants.php';

// function localize($phrase) {
// 	static $translations = NULL;
// 	if (is_null($translations)) {
// 		$lang_file = INCLUDE_PATH . 'lang' . LANGUAGE . '.txt';
// 		if (!file_exists($lang_file)) {
// 			$lang_file = INCLUDE_PATH . 'lang' . 'en-us.txt';
// 		}
// 		$lang_file_content = file_get_contents($lang_file);
// 		$translations = json_decode($lang_file_content, true);
// 	}
// 	return $translations[$phrase];
// }

function localize($phrase, $lang) {
	$lang_file = INCLUDE_PATH . '/lang/' . $lang . '.txt';
	if (!file_exists($lang_file)) {
		$lang_file = INCLUDE_PATH . '/lang/' . 'en.txt';
	}
	$lang_file_content = file_get_contents($lang_file);
	$translations = json_decode($lang_file_content, true);

	return $translations[$phrase];
}

?>