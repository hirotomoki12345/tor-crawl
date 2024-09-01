# Onion Service クローラーと検索エンジン

## 概要

このプロジェクトは、Torネットワーク上のOnionサービスのURLを収集し、そのデータをMySQLデータベースに保存するウェブクローラーと、保存されたデータを検索するための検索エンジンを含みます。

## 必要なソフトウェア

- Node.js
- MySQL
- Tor

## インストール手順

### 1. MySQLのインストール

#### **Linux（Ubuntu/Debianの場合）**

1. **パッケージリストを更新**

    ```bash
    sudo apt-get update
    ```

2. **MySQLをインストール**

    ```bash
    sudo apt-get install mysql-server
    ```

3. **MySQLのセキュリティ設定**

    ```bash
    sudo mysql_secure_installation
    ```

    - プロンプトが表示されたら、パスワード設定やセキュリティオプションを設定します。

#### **macOS**

1. **Homebrewを使用してMySQLをインストール**

    ```bash
    brew install mysql
    ```

2. **MySQLを起動**

    ```bash
    brew services start mysql
    ```

3. **セキュリティ設定**

    初回起動時にセキュリティ設定を行います。

    ```bash
    mysql_secure_installation
    ```

#### **Windows**

1. **MySQL Installerをダウンロード**

    [MySQL公式サイト](https://dev.mysql.com/downloads/installer/) からMySQL Installerをダウンロードしてインストールします。

2. **インストールウィザードに従う**

    - インストール中に、MySQLサーバー、MySQL Workbench、その他のツールを選択します。
    - 初期設定でrootパスワードを設定します。

### 2. データベースとユーザーの作成

1. **MySQLにログイン**

    ```bash
    mysql -u root -p
    ```

2. **データベースの作成**

    ```sql
    CREATE DATABASE psan_db;
    ```

3. **ユーザーの作成**

    ```sql
    CREATE USER 'psan'@'localhost' IDENTIFIED BY 'psan_password';
    ```

4. **ユーザーに権限を付与**

    ```sql
    GRANT ALL PRIVILEGES ON psan_db.* TO 'psan'@'localhost';
    ```

5. **権限の適用**

    ```sql
    FLUSH PRIVILEGES;
    ```

6. **テーブルの作成**

    ```sql
    USE psan_db;

    CREATE TABLE accessible_urls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        access_time_ms INT NOT NULL,
        timestamp DATETIME NOT NULL,
        title VARCHAR(255),
        keywords TEXT
    );
    ```

### 3. Torの設定

1. **Torをインストール**

    **Linux**

    ```bash
    sudo apt-get install tor
    ```

    **macOS**

    ```bash
    brew install tor
    ```

    **Windows**

    Torの公式サイトからインストーラーをダウンロードしてインストールします: [Tor Project](https://www.torproject.org/)

2. **Torの設定ファイルを編集**

    `torrc` ファイルを編集して、SocksPortを設定します。

    **Linux/macOS**: `/etc/tor/torrc`

    **Windows**: `C:\Users\<username>\AppData\Roaming\tor\torrc`

    ```text
    SocksPort 9050
    ```

3. **Torを再起動**

    **Linux/macOS**

    ```bash
    sudo systemctl restart tor
    ```

    **Windows**

    Torブラウザを再起動します。

### 4. Node.jsプロジェクトの設定

1. **プロジェクトをクローン**

    ```bash
    git clone https://github.com/username/repository.git
    cd repository
    ```

2. **依存関係をインストール**

    ```bash
    npm install
    ```

### 5. スクリプトの実行

以下のスクリプトファイルをプロジェクト内で設定し、実行します。詳細なコードはリポジトリ内のファイルを参照してください。

- **`crawler.js`**: OnionサービスのURLをランダムに生成し、MySQLに保存します。
- **`server.js`**: 検索エンジンのサーバーサイドスクリプトです。
- **`public/index.html`**: 検索インターフェースのHTMLです。

### 6. 動作確認

1. **`crawler.js` を実行**

    ```bash
    node crawler.js
    ```

    このスクリプトがOnionサービスのURLを収集し、MySQLデータベースに保存します。

2. **`server.js` を実行**

    ```bash
    node server.js
    ```

    サーバーが起動し、ブラウザで `http://localhost:3000` にアクセスして検索エンジンのインターフェースを使用できます。

3. **検索**

    ブラウザで `http://localhost:3000` にアクセスし、検索ボックスにキーワードを入力して検索を行います。検索結果が表示されます。

## 注意事項

- Torネットワークに接続するには、Torが正しくインストールされている必要があります。
- MySQLとNode.jsの設定が正しいことを確認してください。
- プロジェクトのセキュリティに関する設定は、実際の使用に合わせて適宜調整してください。

## 貢献

バグ報告や機能の追加提案がある場合は、[GitHubのイシュートラッカー](https://github.com/username/repository/issues) を利用してください。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細は [LICENSE](LICENSE) を参照してください。
