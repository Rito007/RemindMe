use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use crate::db::Db;
use rusqlite::Result;
use rusqlite::{params};

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
}