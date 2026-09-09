<?php
requireAuth();
$goals = dbFetchAll('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC', [currentUserId()]);
function goalForm(array $goal = []): void { ?>
<form method="post" action="/action/goals/save">
 <?= csrfField() ?>
 <input type="hidden" name="id" value="<?= (int)($goal['id'] ?? 0) ?>">
 <label>Goal <input name="title" required maxlength="255" value="<?= e($goal['title'] ?? '') ?>" placeholder="Complete 12 workouts"></label>
 <label>Target <input name="target_value" type="number" required min="0.01" max="99999999" step="0.01" value="<?= e((string)($goal['target_value'] ?? '')) ?>"></label>
 <label>Current progress <input name="current_value" type="number" required min="0" max="99999999" step="0.01" value="<?= e((string)($goal['current_value'] ?? 0)) ?>"></label>
 <label>Unit <input name="unit" maxlength="50" value="<?= e($goal['unit'] ?? '') ?>" placeholder="workouts, kg, miles…"></label>
 <button class="btn btn-primary" type="submit">Save goal</button>
</form>
<?php }
renderPage('Goals', function() use ($goals) { ?>
<h1>Goals</h1>
<p>Choose your target and update your progress here. These values are tracked manually.</p>
<details class="card" <?= !$goals ? 'open' : '' ?>><summary>Add a goal</summary><?php goalForm(); ?></details>
<?php foreach ($goals as $goal): $progress = min(100, max(0, (float)$goal['target_value'] > 0 ? (float)$goal['current_value'] / (float)$goal['target_value'] * 100 : 0)); ?>
<section class="card">
 <h2><?= e($goal['title']) ?></h2>
 <progress max="100" value="<?= $progress ?>" aria-label="Goal progress"><?= round($progress) ?>%</progress>
 <p><?= e((string)$goal['current_value']) ?> / <?= e((string)$goal['target_value']) ?> <?= e($goal['unit'] ?? '') ?><?= $progress >= 100 ? ' — Goal reached!' : '' ?></p>
 <details><summary>Edit goal or progress</summary><?php goalForm($goal); ?></details>
 <form method="post" action="/action/goals/delete" onsubmit="return confirm('Delete this goal?')">
  <?= csrfField() ?><input type="hidden" name="id" value="<?= (int)$goal['id'] ?>"><button type="submit" class="btn">Delete goal</button>
 </form>
</section>
<?php endforeach; });
