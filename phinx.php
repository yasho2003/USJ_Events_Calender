<?php

$root = dirname(__FILE__);

// Load .env manually since Phinx doesn't do it automatically
$dotenv = Dotenv\Dotenv::createImmutable($root);
$dotenv->load();

return [
    'paths' => [
        'migrations' => ['%%PHINX_CONFIG_DIR%%/database/migrations'],
        'seeds' => ['%%PHINX_CONFIG_DIR%%/database/seeds']
    ],
    'environments' => [
        'default_migration_table' => 'phinxlog',
        'default_database' => 'dev',
        'dev' => [
            'adapter' => 'mysql',
            'host' => $_ENV['DB_HOST'],
            'name' => $_ENV['DB_NAME'],
            'user' => $_ENV['DB_USER'],
            'pass' => $_ENV['DB_PASS'],
            'port' => 3306,
        ]
    ]
];