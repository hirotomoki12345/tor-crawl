const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3543;

// MySQL接続設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'psan',
    password: 'kokugakuin-0',
    database: 'psan_db'
});

// データベース接続
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});

// 静的ファイルの提供
app.use(express.static('public'));

// 検索エンドポイント
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.send([]);
    }

    const query = `
        SELECT url, access_time_ms, timestamp, title, keywords 
        FROM accessible_urls 
        WHERE url LIKE ? OR title LIKE ? OR keywords LIKE ? 
        ORDER BY timestamp DESC
    `;

    connection.execute(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Database error');
        }
        res.json(results);
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
