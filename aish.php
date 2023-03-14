<?php
include "download.php";

/* 
  Code modified from: https://davidwalsh.name/php-cache-function
*/
// Gets the contents of a file if it exists, otherwise grabs and caches */
function get_content($file, $url, $hours = 24) {
  //vars
  // $current_time = time(); $expire_time = $hours * 60 * 60; $file_time = filemtime($file);
  //decisions, decisions

  // if(file_exists($file) && ($current_time - $expire_time < $file_time)) {
  if(file_exists($file)) {
    //echo 'returning from cached file';
    return file_get_contents($file);
  }
  else {
    $content = get_url($url);
    $content.= '<!-- cached:  '.time().'-->';
    $feed_url = "tmp/".$file;
    file_put_contents($feed_url,$content);
    return $content;
  }
}

/* gets content from a URL via curl */
function get_url($url) {
  $ch = curl_init();
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1); 
  curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,5);
  $content = curl_exec($ch);
  curl_close($ch);
  return $content;
}

/* Retrieve feeds */
$xml_feed_list = array(
  "https://journals.sagepub.com/action/showFeed?ui=0&mi=ehikzz&ai=2b4&jc=jbtb&type=etoc&feed=rss",
  "https://journals.sagepub.com/action/showFeed?ui=0&mi=ehikzz&ai=2b4&jc=jtwa&type=etoc&feed=rss",
  "https://journals.sagepub.com/action/showFeed?ui=0&mi=ehikzz&ai=2b4&jc=wcxa&type=etoc&feed=rss",
  "https://www.tandfonline.com/action/showFeed?type=etoc&feed=rss&jc=htcq20",
  "https://www.tandfonline.com/action/showFeed?type=etoc&feed=rss&jc=hrhr20",
  "https://www.tandfonline.com/action/showFeed?type=etoc&feed=rss&jc=rrsq20",
  "https://rss.sciencedirect.com/publication/science/87554615",
  "https://journals.sagepub.com/action/showFeed?ui=0&mi=ehikzz&ai=2b4&jc=nmsa&type=etoc&feed=rss"
);

$i = 1;
foreach( $xml_feed_list as $feed_url ) {
  $fu = "journal-".( (string) ($i) ).".xml";

  // If Computers & Composition
  if ($feed_url == "https://rss.sciencedirect.com/publication/science/87554615") {
    $xmlFile = downloadFile($feed_url);
    file_put_contents('./tmp/' . $fu, $xmlFile);
    $i++;
  }
  else
  {
    $FEED_XML = get_content($fu, $feed_url, 3);
    $i++;
  }
  
}
?>
