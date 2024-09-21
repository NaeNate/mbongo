import { useAuth0 } from "@auth0/auth0-react"
import { ActionFunction, redirect } from "@remix-run/node"
import { Form, useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import { turso } from "../lib/turso"

export const action: ActionFunction = async ({ request }) => {
  const { name, description, date, time, email } = Object.fromEntries(
    await request.formData(),
  ) as { [k: string]: string }

  const event = await turso.execute({
    sql: "INSERT INTO events (name, description, date, time) VALUES (?, ?, ?, ?)",
    args: [name, description, date, time],
  })

  const user = await turso.execute({
    sql: "SELECT * FROM users WHERE users.email = ?",
    args: [email],
  })

  await turso.execute({
    sql: `INSERT INTO user_events (user_id, event_id) VALUES (?, ?)`,
    args: [user.rows[0].id, event.lastInsertRowid],
  })

  return redirect("/" + event.lastInsertRowid)
}

export default function New() {
  const { isLoading, user } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) navigate("/")
  }, [isLoading, user])

  return (
    <>
      <h1 className="text-6xl font-bold">New</h1>

      <Form method="post" className="mx-auto flex max-w-[35rem] flex-col gap-1">
        <label htmlFor="name" className="text-xl">
          Name
        </label>
        <input id="name" name="name" required className="input" />

        <label htmlFor="description" className="text-xl">
          Description
        </label>
        <textarea id="description" name="description" className="input h-48" />

        <label htmlFor="date" className="text-xl">
          Date
        </label>
        <input type="date" id="date" name="date" className="input" />

        <label htmlFor="time" className="text-xl">
          Time
        </label>
        <input type="time" id="time" name="time" className="input" />

        <input type="hidden" name="email" value={user ? user.email : ""} />

        <button className="button mt-2">Submit</button>
      </Form>
    </>
  )
}
