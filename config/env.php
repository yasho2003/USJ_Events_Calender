<?php
$root = dirname(__DIR__);
require $root . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable($root);
$dotenv->load();