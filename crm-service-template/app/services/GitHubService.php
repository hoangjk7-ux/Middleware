<?php

class GitHubService {

    private $token;
    private $org = "crm-platform";

    public function __construct() {
        $this->token = getenv('GITHUB_TOKEN') ?: '';
    }

    public function createRepo($name) {
        $url = "https://api.github.com/orgs/{$this->org}/repos";

        $data = json_encode([
            "name" => $name,
            "private" => true
        ]);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: token {$this->token}",
            "User-Agent: PHP"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_exec($ch);
    }
}