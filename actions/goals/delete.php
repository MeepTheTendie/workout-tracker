<?php
requireAuth();
requireCsrf();
$id = filter_var($_POST['id'] ?? 0, FILTER_VALIDATE_INT);
if (!$id || !ownsResource('goals', $id)) { http_response_code(404); exit('Goal not found'); }
dbDelete('goals', 'id = ? AND user_id = ?', [$id, currentUserId()]);
redirect('/goals', 'Goal deleted.');
