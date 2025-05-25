<?php


use Phinx\Seed\AbstractSeed;

class UserSeeder extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * https://book.cakephp.org/phinx/0/en/seeding.html
     */
    public function run()
    {
        $data = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => password_hash('secret123', PASSWORD_DEFAULT),
            ],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => password_hash('test123', PASSWORD_DEFAULT),
            ]
        ];

        $this->table('users')->insert($data)->saveData();
    }
}
