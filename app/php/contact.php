<?php

if(isset($_POST['message'])){

	$name = htmlspecialchars(trim($_POST['name']));
	$email = htmlspecialchars(trim($_POST['email']));
	$message = htmlspecialchars($_POST['message']);
    
	
	$to      = 'saviv@saviv.site, ' . $email;
  $subject = 'Message from: ' . $name . "\r\n" .
  'Email: '. $email . "\r\n" . 'Site: grid2.saviv.site';

	$headers = 'From: '. $email . "\r\n" .
    'Reply-To: '. $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

	$status = mail($to, $subject, $message, $headers);

	if($status == TRUE){	
		$res['sendstatus'] = 'done';
	
		//Edit your message here
		$res['message'] = 'Form Submission Successful';
    }
	else{
		$res['message'] = 'Failed to send mail. Please mail me to igorsa33@yandex.ru';
	}
	
	
	echo json_encode($res);
}
?>