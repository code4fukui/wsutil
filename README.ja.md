# wsutil

Denoでウェブサーバーを構築するためのユーティリティライブラリです。API処理、静的ファイルの提供、アクセス制御などの機能を備えています。

## 機能

-   **シンプルなAPIエンドポイント**: JSONおよびCBORデータを処理するAPIサーバーをすばやく作成できます。
-   **静的ファイルの提供**: `static`ディレクトリから静的ファイルを提供します。Rangeリクエストや、事前圧縮されたGzipファイルにも対応しています。
-   **IPベースのアクセス制御**: `.conf`ファイルを使用して、ファイルやディレクトリへのアクセスを制限します。
-   **自動ログ記録**: `log/`ディレクトリが存在する場合、日別のリクエストログを自動的に作成します。
-   **コンテンツネゴシエーション**: クライアントの`Accept`ヘッダーに基づいて、JSONまたはCBORで自動的に応答します。
-   **Denoの互換性**: 最新のDeno 2.x（`Deno.serve`）と、従来のDeno 1.xの両方で動作します。

## 使用方法（Deno 2.x）

新規プロジェクトでは、このアプローチを推奨します。

1.  `server.js`ファイルを作成します。

    ```javascript
    import { fetchWeb } from "https://code4fukui.github.io/wsutil/fetchWeb.js";

    export default fetchWeb(async (param, req, path, conninfo) => {
      return { response: "OK", path, param, remoteAddr: conninfo.remoteAddr };
    });
    ```

2.  サーバーを起動します。

    ```sh
    deno serve -A --port 8000 --host "[::]" server.js
    ```

3.  静的ファイル用のディレクトリを作成します。

    ```bash
    mkdir static
    cat > static/index.html << EOF
    test
    EOF
    ```

4.  サーバーの動作を確認します。
    -   APIエンドポイント: [http://localhost:8000/api/](http://localhost:8000/api/)
    -   静的ファイル: [http://localhost:8000/](http://localhost:8000/)

## 使用方法（Deno 1.x）

古いバージョンのDenoとの互換性を保つための方法です。

1.  `server.js`ファイルを作成します。

    ```javascript
    import { serveWeb } from "https://code4fukui.github.io/wsutil/serveWeb.js";

    serveWeb(async (param, req, path, conninfo) => {
      return { response: "OK", path, param, remoteAddr: conninfo.remoteAddr };
    });
    ```

2.  サーバーを起動します。

    ```sh
    deno run -A server.js 8000
    ```

3.  静的ファイル用のディレクトリを作成します。

    ```bash
    mkdir static
    cat > static/index.html << EOF
    test
    EOF
    ```

4.  サーバーの動作を確認します。
    -   APIエンドポイント: [http://localhost:8000/api/](http://localhost:8000/api/)
    -   静的ファイル: [http://localhost:8000/](http://localhost:8000/)

## IPフィルタリング

`wsutil`で提供する任意のディレクトリに`.conf`ファイルを作成することで、アクセスを制御できます。ルールは、そのディレクトリおよびすべてのサブディレクトリに適用されます。

**基本的なアクセス制御**

特定のIPからのアクセスのみを許可し、それ以外のすべてのトラフィックを拒否します。

```
allow '127.0.0.1'; # allow localhost
deny all;          # deny everyone else
```

**読み取り専用アクセス**

すべてのユーザーにファイルの読み取りを許可しますが、書き込み（例: POST、PUT）は特定のIPにのみ許可します。

```
read all;          # allow read access for everyone
allow '127.0.0.1'; # allow read and write from localhost
deny all;          # deny write access for everyone else
```

**書き込み専用アクセス**

すべてのユーザーに書き込みを許可しますが、読み取りは特定のIPにのみ許可します（あまり一般的ではありません）。

```
write all;         # allow write access for everyone
allow '127.0.0.1'; # allow read and write from localhost
deny all;          # deny read access for everyone else
```

## ライセンス

MIT
