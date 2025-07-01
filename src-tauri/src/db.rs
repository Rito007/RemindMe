use rusqlite::{Row, Connection, Params, Result};


pub struct Db{
    conn: Connection,
}

impl Db {
    pub fn new() -> Result<Self>
    {   
        let mut location = std::env::home_dir()
        .expect("Erro ao obter o diretório atual");
        location.push("remind.db");
        let conn = Connection::open(location.clone()).expect("Error opening connection");
        conn.execute("CREATE TABLE IF NOT EXISTS Reminder(
	    Id INTEGER PRIMARY KEY AUTOINCREMENT,
	    Message TEXT NOT NULL,
	    Time TEXT NOT NULL)", [])?;
        Ok(Self{conn})
    }

     pub fn execute<P>(&self,sql:&str, params: P) -> Result<i64>
     where P : Params {
        self.conn.execute(
            sql,
            params,
        )?;
        Ok(self.conn.last_insert_rowid())
    }
  
    pub fn get_rows<T, P, F>(&self, sql: &str, params: P, mut mapper: F) -> Result<Vec<T>>
    where
        P: Params,
        F: FnMut(&Row) -> Result<T>,
    {
        let mut stmt = self.conn.prepare(sql)?;
        let mapped = stmt.query_map(params, |row| mapper(row))?;

        let mut results = Vec::new();
        for item in mapped {
            results.push(item?);
        }

        Ok(results)
    }
}