import sqlite3


with sqlite3.connect("test.db") as con:
    cur = con.cursor()

    print(cur.execute("SELECT * FROM USERS ").fetchall())
