# RemindMe

## About

RemindMe is a desktop application built with Tauri and React to manage personal reminders with notifications. It provides a simple, always-on-top window for adding, editing, and deleting reminders, and notifies users at scheduled times.

## Features

- Add, edit, and delete reminders
- Persistent storage of reminders locally
- Desktop notifications for upcoming reminders
- UI with a clean and minimal design
- Tray icon with interaction support

## Installation

Make sure you have the prerequisites:

- Node.js (recommend using bun)
- Rust toolchain (for Tauri backend)
- Tauri CLI (`cargo install tauri-cli`)

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/remindme.git
cd remindme
bun install
```

To run in development mode:

```bash
bun tauri run dev
```

To build the application:

```bash
bun run build
cargo tauri build
```

## Configuration

The app configuration is in `src-tauri/tauri.conf.json`. It configures window properties in this particular case.

## Usage

- Launch the app.
- Add reminders by entering text and selecting the date/time.
- Reminders trigger desktop notifications at the scheduled time.
- Edit or delete reminders as needed.
- Notifications can be dismissed or interacted with.

## License

The project uses the [MIT License](LICENSE), allowing anyone to use and modify the code, but not to redistribute the compiled application without permission.

---

Feel free to customize or ask if you want it with more sections or examples!
