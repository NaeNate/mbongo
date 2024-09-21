import { createClient } from "@libsql/client"

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

turso.batch([
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, date TEXT, time TEXT)",
  "CREATE TABLE IF NOT EXISTS user_events (user_id INTEGER NOT NULL, event_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(event_id) REFERENCES events(id), PRIMARY KEY(user_id, event_id))",
  "CREATE TABLE IF NOT EXISTS invites (user_id INTEGER NOT NULL, event_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(event_id) REFERENCES events(id), PRIMARY KEY(user_id, event_id))",
])
