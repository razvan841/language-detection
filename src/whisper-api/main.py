PORT=5000


if __name__ == "__main__":
    from sys import path as sys_path
    from os import path
    src_path = path.join(path.dirname(__file__), "..")
    sys_path.append(src_path)

    from waitress import serve
    from web_server import app

    print("running on port {}, http://127.0.0.1:{}".format(PORT, PORT))
    serve(app, host="0.0.0.0", port=PORT)