<?php

if (!isset($_GET['fileName'])) {
    $files = scandir('output');
    foreach($files as $file) {
        if ($file != "." && $file != "..") {
            $file = basename($file, '.json');
            ?>
            <a href="?fileName=<?= $file ?>"><?= $file ?></a><br>
            <?php
        }
    }
    exit;
}

$fileName = $_GET['fileName'];


$content = file_get_contents("output/$fileName.json");
$cars = json_decode($content);
?>

<ul>
    <?php foreach ($cars as $car): ?>
        <li>
            <a href="http://avito.ru<?= $car->url ?>">link</a>
            <?php if (isset($car->photo)): ?>
                <img src="<?= $car->photo ?>">
            <?php endif; ?>

            <?php if (isset($car->price)): ?>
                <span><?= $car->price ?></span>
            <?php endif; ?>
        </li>
    <?php endforeach; ?>
</ul>