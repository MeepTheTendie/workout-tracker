<?php
/**
 * Login Action
 */

requireCsrf();
if (!checkRateLimit('login', 10, 900)) { http_response_code(429); header('Retry-After: 900'); exit('Too many login attempts. Please try again later.'); }

$password = stringParam($_POST['password'] ?? '');

if (empty($password)) {
    redirect('/login', 'Password is required', 'error');
}

if (attemptLogin($password)) {
    $redirect = $_SESSION['redirect_after_login'] ?? '/dashboard';
    unset($_SESSION['redirect_after_login']);
    redirect($redirect, 'Welcome back!');
}

redirect('/login', 'Invalid password', 'error');
