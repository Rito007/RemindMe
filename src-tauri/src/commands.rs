use crate::db::Db;
use crate::reminder::Reminder;
use crate::AppData;
use chrono::{Local, NaiveDateTime, TimeZone};

#[tauri::command]
pub fn insert_reminds(
    appdata: tauri::State<AppData>,
    message: String,
    date: String,
    title: String,
) -> Result<i32, String> {
    match Reminder::new(
        &appdata.db,
        &message,
        Local
            .from_local_datetime(
                &NaiveDateTime::parse_from_str(&date, "%d/%m/%Y %H:%M")
                    .map_err(|e| format!("Error analysing date: {}", e))?,
            )
            .single()
            .ok_or("Invalid Date")?,
        &title,
    )
    .expect("Error creating reminder")
    .get_id()
    {
        Ok(value) => Ok(value),
        Err(_) => Err("Erro ao obter ID".to_string()),
    }
}

#[tauri::command]
pub fn update_reminds(
    appdata: tauri::State<AppData>,
    message: String,
    date: String,
    title: String,
    id: i32,
) -> Result<i32, String> {
    match Reminder::update(
        &appdata.db,
        &message,
        Local
            .from_local_datetime(
                &NaiveDateTime::parse_from_str(&date, "%d/%m/%Y %H:%M")
                    .map_err(|e| format!("Error analysing date: {}", e))?,
            )
            .single()
            .ok_or("Invalid Date")?,
        &title,
        id,
    ) {
        Ok(value) => Ok(value),
        Err(e) => Err(format!("Error updating: {}", e).to_string()),
    }
}

#[tauri::command]
pub fn get_reminds(appdata: tauri::State<AppData>) -> Vec<Reminder> {
    Reminder::get_reminds(&appdata.db).expect("Error getting the reminds!")
}

#[tauri::command]
pub fn delete_remind(appdata: tauri::State<AppData>, id: i32) -> Result<u32, String> {
    let reminder = match Reminder::get_remind_byid(id, &appdata.db) {
        Ok(value) => value,
        Err(e) => {
            return Err(format!("Error finding reminder width id {}: {}", id, e));
        }
    };

    match Reminder::delete(&reminder, &appdata.db) {
        Ok(value) => Ok(value),
        Err(e) => Err(format!("Error deleting Reminder: {}", e)),
    }
}
