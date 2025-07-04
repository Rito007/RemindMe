use std::error::Error;
use std::ops::Rem;

use crate::commands::get_reminds;
use crate::db::Db;
use crate::AppData;
use chrono::{DateTime, FixedOffset, Local, Utc};
use rusqlite::Result;
use rusqlite::{params, Row};
use serde::{Deserialize, Serialize};
use tauri::ipc::IpcResponse;

#[derive(Debug, Serialize, Deserialize)]
pub enum RemindTime {
    HumanReadable(String),
    LocalTime(DateTime<chrono::Local>),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Reminder {
    id: i32,
    message: String,
    time: RemindTime,
    title: String,
}

impl Reminder {
    pub fn new(db: &Db, message: &str, time: DateTime<chrono::Local>, title: &str) -> Result<Self> {
        let id = db.execute(
            "INSERT INTO Reminder (Message, Time, Title) Values(?, ?, ?)",
            params![message, time.to_rfc3339(), title],
        )? as i32;
        Ok(Reminder {
            id,
            message: message.to_string(),
            time: RemindTime::LocalTime(time),
            title: title.to_string(),
        })
    }

    pub fn update(
        db: &Db,
        message: &str,
        time: DateTime<chrono::Local>,
        title: &str,
        id: i32,
    ) -> Result<i32> {
        let alter_lines = db.execute(
            "UPDATE Reminder SET Message=?, Time=?, Title=? where Id=?",
            params![message, time.to_rfc3339(), title, id],
        )? as i32;
        Ok((alter_lines))
    }
    pub fn human_readable_time(time: &str) -> Result<String> {
        Ok(chrono::DateTime::parse_from_rfc3339(time)
            .expect("Error parsing string of time.")
            .format("%d/%m/%Y %H:%M")
            .to_string())
    }
    pub fn get_id(&self) -> Result<i32> {
        Ok(self.id)
    }

    pub fn get_remind_byid(id: i32, db: &Db) -> Result<Reminder, rusqlite::Error> {
        let reminds = Reminder::get_reminds(&db)?;
        reminds
            .into_iter()
            .find(|rem| rem.id == id)
            .ok_or_else(|| rusqlite::Error::QueryReturnedNoRows)
    }
    pub fn get_reminds(db: &Db) -> Result<Vec<Reminder>> {
        db.get_rows("SELECT * FROM Reminder", [], |row| {
            let time_str = row.get::<_, String>(3)?;
            Ok(Reminder {
                id: row.get::<_, i32>(0)?,
                message: row.get::<_, String>(2)?,
                time: RemindTime::HumanReadable(Reminder::human_readable_time(&time_str)?),
                title: row.get::<_, String>(1)?,
            })
        })
    }

    pub fn delete(&self, db: &Db) -> Result<u32> {
        match db.execute("DELETE FROM Reminder WHERE id=?", params![self.id]) {
            Ok(value) => {
                println!("Remind removed successfully value: {}", self.id);
                Ok(self.id as u32)
            }
            Err(e) => Err(e),
        }
    }
}
