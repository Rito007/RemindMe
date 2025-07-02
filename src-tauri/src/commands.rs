use chrono::{DateTime,Local};
use crate::AppData;
use crate::reminder::Reminder;
use std::sync::Arc;
use crate::db::Db;

#[tauri::command]
pub fn insert_reminds(appdata : tauri::State::<AppData>, message : String, date: DateTime<Local>, title:String) {
    
    Reminder::new(&appdata.db, &message, date, &title).expect("Error creating a remind");
}

#[tauri::command]
pub fn get_reminds(appdata : tauri::State::<AppData>)->Vec<Reminder> {
    Reminder::get_reminds(&appdata.db).expect("Error getting the reminds!")
}