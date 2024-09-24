import { ActionFunction } from "@remix-run/node"
import { turso } from "../lib/turso"

export const action: ActionFunction = async ({ request }) => {
  const email = await request.text()

  const user = await turso.execute({
    sql: "SELECT * FROM users WHERE users.email = ?",
    args: [email],
  })

  const events = await turso.execute({
    sql: "SELECT * FROM events JOIN user_events ON events.id = user_events.event_id WHERE user_events.user_id = ? AND date(date) >= date('now') ORDER BY date ASC, time ASC",
    args: [user.rows[0].id],
  })

  const invites = await turso.execute({
    sql: "SELECT * FROM events JOIN invites ON events.id = invites.event_id WHERE invites.user_id = ? AND date(date) >= date('now') ORDER BY date ASC, time ASC",
    args: [user.rows[0].id],
  })

  return { events: events.rows, invites: invites.rows }
}
