use rusqlite::{Connection, Params, Result, Row};
use std::path::PathBuf;
use std::env;
use std::sync::Mutex;

pub struct Db {
    conn: Mutex<Connection>,
}

impl Db {
    pub fn new() -> Result<Self> {
         let appdata = std::env::var("APPDATA").expect("APPDATA environment variable not set");
        let mut path = PathBuf::from(appdata);
        path.push("RemindMe");  // substitui pelo nome da tua app
        std::fs::create_dir_all(&path).expect("Failed to create app directory");
        path.push("remind.db");
        let conn = Connection::open(path.clone()).expect("Error opening connection");
        conn.execute(
            "CREATE TABLE IF NOT EXISTS Reminder(
	    Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Title TEXT NOT NULL,
	    Message TEXT NOT NULL,
	    Time TEXT NOT NULL)",
            [],
        )
        .expect("Error creating database!");
        println!("All ok!");
        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    pub fn execute<P>(&self, sql: &str, params: P) -> Result<i64>
    where
        P: Params,
    {
        self.conn.lock().unwrap().execute(sql, params)?;
        Ok(self.conn.lock().unwrap().last_insert_rowid())
    }

    pub fn get_rows<T, P, F>(&self, sql: &str, params: P, mut mapper: F) -> Result<Vec<T>>
    where
        P: Params,
        F: FnMut(&Row) -> Result<T>,
    {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(sql)?;
        let mapped = stmt.query_map(params, |row| mapper(row))?;

        let mut results = Vec::new();
        for item in mapped {
            results.push(item?);
        }

        Ok(results)
    }
}
