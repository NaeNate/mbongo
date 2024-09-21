import { useAuth0 } from "@auth0/auth0-react"
import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData, useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import { turso } from "../lib/turso"

export const loader: LoaderFunction = async ({ params }) => {
  const eventResult = await turso.execute({
    sql: `SELECT * FROM events WHERE events.id = ?`,
    args: [params.id],
  })

  const usersResult = await turso.execute({
    sql: `SELECT users.* FROM users JOIN user_events ON users.id = user_events.user_id WHERE user_events.event_id = ?`,
    args: [params.id],
  })

  return { event: eventResult.rows[0], users: usersResult.rows }
}

export const action: ActionFunction = async ({ request }) => {
  const { email, eventId } = Object.fromEntries(await request.formData()) as {
    [k: string]: string
  }

  const user = await turso.execute({
    sql: "SELECT * FROM users WHERE users.email = ?",
    args: [email],
  })

  if (user.rows.length) {
    await turso.execute({
      sql: "INSERT INTO invites (user_id, event_id) VALUES (?, ?)",
      args: [user.rows[0].id, eventId],
    })
  }

  return null
}

export default function Id() {
  const { event, users } = useLoaderData<typeof loader>()
  const { isLoading, user } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoading) return

    if (!user || !users.some((item) => item.email === user.email)) {
      navigate("/")
    }
  }, [isLoading, user])

  return (
    <>
      {user && (
        <>
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <p className="mt-2 text-lg">{event.description}</p>

          <p className="text-xl font-semibold">Attendees</p>

          {users.map((user) => (
            <p key={user.id}>{user.name}</p>
          ))}

          <p className="text-xl font-semibold">Invite Attendees</p>

          <Form method="post" className="flex gap-2">
            <input name="email" placeholder="Email" className="input" />
            <input type="hidden" name="eventId" value={event.id} />

            <button className="button">Submit</button>
          </Form>
        </>
      )}
    </>
  )
}
