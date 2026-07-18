import os
import re
import sqlite3
from datetime import timedelta
from pathlib import Path

from flask import Flask, request, session, jsonify, redirect, send_from_directory, abort
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'users.db'

app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

USERNAME_PATTERN = re.compile(r'^[A-Za-z0-9_.-]{3,50}$')


def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            '''
        )
        conn.commit()


def get_db_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def normalize_username(username: str) -> str:
    return username.strip().lower()


def is_valid_username(username: str) -> bool:
    return bool(USERNAME_PATTERN.fullmatch(username))


def is_valid_password(password: str) -> bool:
    return isinstance(password, str) and len(password) >= 8


def find_user(username: str):
    normalized = normalize_username(username)
    with get_db_connection() as conn:
        cursor = conn.execute('SELECT * FROM users WHERE username = ?', (normalized,))
        return cursor.fetchone()


def create_user(username: str, password: str) -> bool:
    normalized = normalize_username(username)
    password_hash = generate_password_hash(password)
    try:
        with get_db_connection() as conn:
            conn.execute(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                (normalized, password_hash),
            )
        return True
    except sqlite3.IntegrityError:
        return False


def verify_user(username: str, password: str) -> bool:
    user = find_user(username)
    return bool(user and check_password_hash(user['password_hash'], password))


def get_request_payload():
    payload = request.get_json(silent=True)
    if not payload:
        payload = request.form
    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', ''))
    return username, password


@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/login.html')
def login_page():
    return send_from_directory(BASE_DIR, 'login.html')


@app.route('/register.html')
def register_page():
    return send_from_directory(BASE_DIR, 'register.html')


@app.route('/dashboard.html')
def dashboard_page():
    if 'username' not in session:
        return redirect('/login.html')
    return send_from_directory(BASE_DIR, 'dashboard.html')


@app.route('/rechner.html')
def rechner_page():
    if 'username' not in session:
        return redirect('/login.html')
    return send_from_directory(BASE_DIR, 'rechner.html')


@app.route('/rechner-simple.html')
def rechner_simple_page():
    if 'username' not in session:
        return redirect('/login.html')
    return send_from_directory(BASE_DIR, 'rechner-simple.html')


@app.route('/style/<path:path>')
def serve_style(path):
    return send_from_directory(BASE_DIR / 'style', path)


@app.route('/script/<path:path>')
def serve_script(path):
    return send_from_directory(BASE_DIR / 'script', path)


@app.route('/pictures/<path:path>')
def serve_picture(path):
    return send_from_directory(BASE_DIR / 'pictures', path)


@app.route('/favicon.png')
def serve_favicon():
    return send_from_directory(BASE_DIR, 'favicon.png')


@app.route('/api/session', methods=['GET'])
def api_session():
    username = session.get('username')
    return jsonify({
        'authenticated': bool(username),
        'username': username,
    })


@app.route('/api/register', methods=['POST'])
def api_register():
    username, password = get_request_payload()

    if not is_valid_username(username) or not is_valid_password(password):
        return jsonify(success=False, message='Ungültiger Benutzername oder Passwort.'), 400

    if find_user(username) is not None:
        return jsonify(success=False, message='Der Benutzername ist bereits vergeben.'), 409

    if not create_user(username, password):
        return jsonify(success=False, message='Der Benutzername ist bereits vergeben.'), 409

    session.clear()
    session['username'] = normalize_username(username)
    session.permanent = True
    return jsonify(success=True, message='Registrierung erfolgreich.')


@app.route('/api/login', methods=['POST'])
def api_login():
    username, password = get_request_payload()

    if not is_valid_username(username) or not is_valid_password(password):
        return jsonify(success=False, message='Benutzername oder Passwort ungültig.'), 400

    if not verify_user(username, password):
        return jsonify(success=False, message='Login fehlgeschlagen. Bitte prüfen Sie Benutzername und Passwort.'), 401

    session.clear()
    session['username'] = normalize_username(username)
    session.permanent = True
    return jsonify(success=True, message='Login erfolgreich.')


@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify(success=True, message='Abmeldung erfolgreich.')


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login.html')


@app.route('/<path:path>')
def catch_all(path):
    if path.startswith('api/'):
        abort(404)

    if path.endswith('.html'):
        target = BASE_DIR / path
        if target.exists() and target.is_file():
            return send_from_directory(BASE_DIR, path)
    abort(404)


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
