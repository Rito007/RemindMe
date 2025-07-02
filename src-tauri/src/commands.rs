use chrono::{DateTime,Local};
use tauri::ipc::IpcResponse;
use crate::{reminder, AppData};
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

#[tauri::command]
pub fn delete_remind(appdata : tauri::State::<AppData>,  id : i32) -> Result<u32, Err>
{
    match Reminder::delete(&Reminder::get_remind_byid(id, &appdata.db)?, &appdata.db)
    {
        Ok(value)=> Ok(value),
        Err(e)=>Err(e),
    }

}