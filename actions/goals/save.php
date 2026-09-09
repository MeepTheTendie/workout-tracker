<?php
requireAuth();
requireCsrf();
$id = filter_var($_POST['id'] ?? 0, FILTER_VALIDATE_INT);
$title = stringParam($_POST['title'] ?? '');
$unit = stringParam($_POST['unit'] ?? '');
$target = filter_var($_POST['target_value'] ?? '', FILTER_VALIDATE_FLOAT);
$current = filter_var($_POST['current_value'] ?? 0, FILTER_VALIDATE_FLOAT);
if ($id === false || $id < 0 || $title === '' || strlen($title) > 255 || strlen($unit) > 50 || $target === false || !is_finite($target) || $target <= 0 || $target > 99999999 || $current === false || !is_finite($current) || $current < 0 || $current > 99999999) {
    redirect('/goals', 'Enter a title, a positive target and non-negative progress.', 'error');
}
if ($id && !ownsResource('goals', $id)) { http_response_code(404); exit('Goal not found'); }
$now = (int)(microtime(true) * 1000);
$data = ['title'=>$title, 'unit'=>$unit, 'target_value'=>$target, 'current_value'=>$current, 'updated_at'=>$now];
if ($id) dbUpdate('goals', $data, 'id = ? AND user_id = ?', [$id, currentUserId()]);
else dbInsert('goals', $data + ['user_id'=>currentUserId(), 'created_at'=>$now]);
redirect('/goals', 'Goal saved.');
