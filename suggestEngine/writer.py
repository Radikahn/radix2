import sqlite3

class WriteSuggestion:
    def __init__(self):
        self.conn = sqlite3.connect("suggestEngine.db")
        self.cursor = self.conn.cursor()
        # Create table if it doesn't exist
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS suggestions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                url TEXT NOT NULL,
                image TEXT NOT NULL
            )
        """)
        self.conn.commit()
    
    def insert_suggestion(self, mod):
        self.cursor.execute(
            "INSERT INTO suggestions (name, url, image) VALUES (?, ?, ?)", 
            (mod.name, mod.url, mod.image)
        )
        self.conn.commit()
    
    def get_all_suggestions(self):
        self.cursor.execute("SELECT id, name, url, image FROM suggestions")
        results = self.cursor.fetchall()
        return [
            {
                "id": row[0],
                "name": row[1],
                "url": row[2],
                "image": row[3]
            }
            for row in results
        ]