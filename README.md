# Onion Service クローラーと検索エンジン

## 概要

このプロジェクトは、Torネットワーク上のOnionサービスのURLを収集するウェブクローラーと、その収集データを検索するための検索エンジンを含みます。収集されたデータはMySQLデータベースに保存され、ウェブインターフェースから検索できるようになります。

## 必要なソフトウェア

- Node.js
- MySQL
- Tor

## インストール手順

1. リポジトリをクローンします:

    ```bash
    git clone https://github.com/username/repository.git
    cd repository
    ```

2. 依存関係をインストールします:

    ```bash
    npm install
    ```

3. MySQLの設定:

    - データベースとテーブルを作成します:

      ```sql
      CREATE DATABASE psan_db;

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

4. Torの設定:

    - `torrc` を更新して `SocksPort 9050` を追加します。

5. クロールスクリプトを実行します:

    ```bash
    node crawler.js
    ```

6. サーバーを起動します:

    ```bash
    node server.js
    ```

7. ブラウザで `http://localhost:3000` にアクセスして、検索エンジンを使用します。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳しくは [LICENSE](LICENSE) ファイルを参照してください。
