# wsutil

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A utility library for creating web servers with Deno, featuring API handling, static file serving, and access control.

## Features

-   **Simple API Endpoints**: Quickly create API servers that handle JSON and CBOR data.
-   **Static File Serving**: Serves static files from a `static` directory, with support for range requests and pre-compressed Gzip files.
-   **IP-Based Access Control**: Restrict access to files and directories using `.conf` files.
-   **Automatic Logging**: Creates daily request logs in a `log/` directory if it exists.
-   **Content Negotiation**: Automatically responds with JSON or CBOR based on the client's `Accept` header.
-   **Deno Compatibility**: Works with both modern Deno 2.x (`Deno.serve`) and legacy Deno 1.x.

## Usage (Deno 2.x)

This is the recommended approach for new projects.

1.  Create a `server.js` file:

    ```javascript
    import { fetchWeb } from "https://code4fukui.github.io/wsutil/fetchWeb.js";

    export default fetchWeb(async (param, req, path, conninfo) => {
      return { response: "OK", path, param, remoteAddr: conninfo.remoteAddr };
    });
    ```

2.  Run the server:

    ```sh
    deno serve -A --port 8000 --host "[::]" server.js
    ```

3.  Create a directory for static files:

    ```bash
    mkdir static
    cat > static/index.html << EOF
    test
    EOF
    ```

4.  Test the server:
    -   API endpoint: [http://localhost:8000/api/](http://localhost:8000/api/)
    -   Static file: [http://localhost:8000/](http://localhost:8000/)

## Usage (Deno 1.x)

For compatibility with older Deno versions.

1.  Create a `server.js` file:

    ```javascript
    import { serveWeb } from "https://code4fukui.github.io/wsutil/serveWeb.js";

    serveWeb(async (param, req, path, conninfo) => {
      return { response: "OK", path, param, remoteAddr: conninfo.remoteAddr };
    });
    ```

2.  Run the server:

    ```sh
    deno run -A server.js 8000
    ```

3.  Create a directory for static files:

    ```bash
    mkdir static
    cat > static/index.html << EOF
    test
    EOF
    ```

4.  Test the server:
    -   API endpoint: [http://localhost:8000/api/](http://localhost:8000/api/)
    -   Static file: [http://localhost:8000/](http://localhost:8000/)

## IP Filtering

Control access by creating a `.conf` file in any directory served by `wsutil`. The rules apply to that directory and all subdirectories.

**Basic Access Control**

Deny all traffic except from a specific IP.

```
allow '127.0.0.1'; # allow localhost
deny all;          # deny everyone else
```

**Read-Only Access**

Allow everyone to read files, but only allow a specific IP to write (e.g., POST, PUT).

```
read all;          # allow read access for everyone
allow '127.0.0.1'; # allow read and write from localhost
deny all;          # deny write access for everyone else
```

**Write-Only Access**

Allow everyone to write, but only allow a specific IP to read. (Less common).

```
write all;         # allow write access for everyone
allow '127.0.0.1'; # allow read and write from localhost
deny all;          # deny read access for everyone else
```

## License

MIT