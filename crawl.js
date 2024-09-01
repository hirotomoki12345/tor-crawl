const axios = require('axios');
const mysql = require('mysql2');
const TorRequest = require('tor-request');
const cheerio = require('cheerio');
const randomstring = require('randomstring');

// MySQL接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'psan',
    password: 'kokugakuin-0', // psanユーザーのパスワード
    database: 'psan_db'
});

// Torプロキシの設定
const torProxyUrl = '127.0.0.1:9050'; // TorプロキシのURL
TorRequest.setTorAddress(torProxyUrl);

const maxUrls = 10000000000000000000000000; // クローリングするURLの数

// ランダムなURL生成
function generateRandomOnionUrl() {
    return 'http://' + randomstring.generate({
        length: 56,
        charset: 'abcdefghijklmnopqrstuvwxyz234567'
    }) + '.onion';
}

// タイトルから単語を抽出する関数
function extractKeywords(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z\s]/g, '') // 特殊文字を除去
        .split(/\s+/) // スペースで分割
        .filter(word => word.length > 2) // 単語の長さが2文字以上のものだけを抽出
        .join(' '); // スペースで結合
}

// URLチェック関数
async function checkUrl(url) {
    const start = Date.now(); // リクエスト開始時間

    try {
        const response = await axios.get(url, {
            proxy: {
                host: '127.0.0.1',
                port: 9050,
                protocol: 'socks5'
            },
            timeout: 30000 // タイムアウトを30秒に設定
        });

        const duration = Date.now() - start; // アクセスにかかった時間

        if (response.status === 200) {
            console.log(`Accessible URL: ${url} - Time: ${duration}ms`);

            // cheerioでページのタイトルを取得
            const $ = cheerio.load(response.data);
            const title = $('title').text();
            const keywords = extractKeywords(title);

            // データベースに保存
            const query = `
                INSERT INTO accessible_urls (url, access_time_ms, timestamp, title, keywords) 
                VALUES (?, ?, NOW(), ?, ?)
                ON DUPLICATE KEY UPDATE access_time_ms = VALUES(access_time_ms), timestamp = VALUES(timestamp), title = VALUES(title), keywords = VALUES(keywords)
            `;
            connection.execute(query, [url, duration, title, keywords], (err, results) => {
                if (err) {
                    console.error('Error inserting data:', err);
                }
            });
        }
    } catch (error) {
        console.log(`Failed to access URL: ${url}`);
        // アクセスできなかったURLは保存しません
    }
}

// クロール関数
async function crawl() {
    let count = 0;

    while (true) {
        if (count >= maxUrls) break;

        const url = generateRandomOnionUrl();
        await checkUrl(url);
        count++;
    }
}

crawl().then(() => {
    console.log('Crawling finished.');
    connection.end(); // データベース接続を終了
}).catch(err => {
    console.error('Error during crawling:', err);
    connection.end(); // データベース接続を終了
});
