import json
import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / "vita.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS test_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            test_type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            details TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )
    conn.commit()
    conn.close()

init_db()

def save_result(user_id, test_type, details):
    conn = get_connection()
    conn.execute(
        "INSERT INTO test_results (user_id, test_type, created_at, details) VALUES (?, ?, ?, ?)",
        (user_id, test_type, datetime.utcnow().isoformat(), json.dumps(details)),
    )
    conn.commit()
    conn.close()

def last_result_date(user_id, test_type):
    conn = get_connection()
    row = conn.execute(
        "SELECT created_at FROM test_results WHERE user_id = ? AND test_type = ? ORDER BY id DESC LIMIT 1",
        (user_id, test_type),
    ).fetchone()
    conn.close()
    return datetime.fromisoformat(row["created_at"]) if row else None

def get_history(user_id, test_type):
    conn = get_connection()
    rows = conn.execute(
        "SELECT created_at, details FROM test_results WHERE user_id = ? AND test_type = ? ORDER BY id",
        (user_id, test_type),
    ).fetchall()
    conn.close()
    return [{"created_at": r["created_at"], **json.loads(r["details"])} for r in rows]

def get_all_results(user_id):
    conn = get_connection()
    rows = conn.execute(
        "SELECT test_type, created_at FROM test_results WHERE user_id = ? ORDER BY id",
        (user_id,),
    ).fetchall()
    conn.close()
    return [(r["test_type"], datetime.fromisoformat(r["created_at"])) for r in rows]