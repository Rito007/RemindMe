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
    time: DateTime<chrono::Local>,
    title: String

}

impl Reminder{
    pub fn new(db : &Db, message : &str, time: DateTime<chrono::Local>, title: &str) -> Result<Self>
    {
        let  id = db.execute("INSERT INTO Reminder (Message, Time, Title) Values(?, ?, ?)", params![message, time.to_rfc3339(), title])? as i32;


        Ok(Reminder {
            id,
            message: message.to_string(),
            time,
            title: title.to_string(),
        })
    }
    pub fn get_reminds(db : &Db) -> Result<Vec<Reminder>>
    {
        db.get_rows("SELECT * FROM Reminder", [], |row|
        {
            let time_str = row.get::<_,String>(3)?;
            Ok(Reminder{
                id:row.get::<_,i32>(0)?, 
                message:row.get::<_,String>(2)?, 
                time: DateTime::parse_from_rfc3339(&time_str).unwrap().with_timezone(&Local),
                title:row.get::<_,String>(1)?, 
            })
        })
    }

    pub fn delete(&self, db: &Db)
    {   
        db.execute("DELETE FROM Reminder WHERE id=?", params![self.id]).expect("Error deleting remind");
        println!("Remind removed successfully");
    }
}
