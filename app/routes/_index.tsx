import { useAuth0 } from "@auth0/auth0-react"
import { ActionFunction, redirect } from "@remix-run/node"
import { Form, Link } from "@remix-run/react"
import { useEffect, useState } from "react"
import { turso } from "../lib/turso"

export const action: ActionFunction = async ({ request }) => {
  const { action, userId, eventId } = Object.fromEntries(
    await request.formData(),
  ) as {
    [k: string]: string
  }

  await turso.execute({
    sql: "DELETE FROM invites WHERE user_id = ? AND event_id = ?",
    args: [userId, eventId],
  })

  if (action === "accept") {
    await turso.execute({
      sql: "INSERT INTO user_events (user_id, event_id) VALUES (?, ?)",
      args: [userId, eventId],
    })
  }

  return redirect("/")
}

export default function Index() {
  const { user } = useAuth0()
  const [items, setItems] = useState({ events: [], invites: [] })

  useEffect(() => {
    if (user) {
      fetch("events", { method: "POST", body: user.email })
        .then((res) => res.json())
        .then((items) => setItems(items))
    }
  }, [user])

  return (
    <>
      <h1 className="gradient text-6xl font-bold">Mbongo</h1>

      <p className="mb-2 mt-6 text-3xl font-semibold">Events</p>
      <div className="space-y-2">
        {items.events.map((event) => (
          <Event key={event.id} event={event} type="event" />
        ))}
      </div>

      <p className="mb-2 mt-6 text-3xl font-semibold">Invites</p>
      <div className="space-y-2">
        {items.invites.map((invite) => (
          <Event key={invite.id} event={invite} type="invite" />
        ))}
      </div>
    </>
  )
}

const Event = ({ event, type }) => {
  return (
    <div className="rounded border-2 border-primary p-2">
      {type === "event" ? (
        <Link to={"/" + event.id} className="inline-block">
          <p className="text-2xl">{event.name}</p>
        </Link>
      ) : (
        <p className="text-2xl">{event.name}</p>
      )}

      <p>
        {event.date.replaceAll("-", "/")} - {event.time}
      </p>

      <p>{event.description}</p>

      {type === "invite" && (
        <Form method="post" className="flex justify-center gap-2">
          <input type="hidden" name="userId" value={event.user_id} />
          <input type="hidden" name="eventId" value={event.event_id} />

          <button
            name="action"
            value="accept"
            className="button w-full max-w-40 bg-green-500"
          >
            Accept
          </button>

          <button
            name="action"
            value="decline"
            className="button w-full max-w-40 bg-red-500"
          >
            Decline
          </button>
        </Form>
      )}
    </div>
  )
}
