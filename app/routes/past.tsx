import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"

export default function Past() {
  const { user } = useAuth0()
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (user) {
      fetch("api/past", { method: "POST", body: user.email })
        .then((res) => res.json())
        .then((events) => setEvents(events))
    }
  }, [user])

  console.log(events)

  return (
    <>
      <h1 className="mb-2 text-4xl font-bold">Past Events</h1>

      <div className="space-y-2">
        {events.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </div>
    </>
  )
}

const Event = ({ event }) => {
  return (
    <div className="rounded border-2 border-primary p-2">
      <Link to={"/" + event.id} className="inline-block">
        <p className="text-2xl">{event.name}</p>
      </Link>

      <p>
        {event.date.replaceAll("-", "/")} - {event.time}
      </p>

      <p>{event.description}</p>
    </div>
  )
}
