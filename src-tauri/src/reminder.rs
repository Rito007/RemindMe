use std::ops::Rem;

use chrono::{DateTime, Local, Utc};
use serde::{Serialize, Deserialize};
use crate::db::Db;
use rusqlite::Result;
use rusqlite::{params, Row};

#[derive(Debug, Serialize, Deserialize)]
pub struct Reminder{
    id: i32,
    message : String,
    time: DateTime<chrono::Local>

}

impl Reminder{
    pub fn new(db : &Db, message : &str, time: DateTime<chrono::Local>) -> Result<Self>
    {
        let  id = db.execute("INSERT INTO Reminder (Message, Time) Values(?, ?)", params![message, time.to_rfc3339()])? as i32;


        Ok(Reminder {
            id,
            message: message.to_string(),
            time,
        })
    }
    pub fn get_reminds(db : &Db) -> Result<Vec<Reminder>>
    {
        db.get_rows("SELECT * FROM Reminder", [], |row|
        {
            let time_str = row.get::<_,String>(2)?;
            Ok(Reminder{
                id:row.get::<_,i32>(0)?, 
                message:row.get::<_,String>(1)?, 
                time: DateTime::parse_from_rfc3339(&time_str).unwrap().with_timezone(&Local),
            })
        })
    }

    pub fn delete(&self, db: &Db)
    {   
        db.execute("DELETE FROM Reminder WHERE id=?", params![self.id]).expect("Error deleting remind");
        println!("Remind removed successfully");
    }
}
