import { useAuth0 } from "@auth0/auth0-react"
import { ActionFunction } from "@remix-run/node"
import { Form, useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import { turso } from "../lib/turso"

export const action: ActionFunction = async ({ request }) => {
  const { name, email } = Object.fromEntries(await request.formData()) as {
    [k: string]: string
  }

  console.log(name, email)

  await turso.execute({
    sql: "UPDATE users SET name = ? WHERE email = ?",
    args: [name, email],
  })

  return null
}

export default function Settings() {
  const { isLoading, user } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) navigate("/")
  }, [isLoading, user])

  return (
    <>
      <h1 className="text-6xl font-bold">Settings</h1>

      <Form method="post" className="mx-auto flex max-w-[35rem] flex-col gap-1">
        <label htmlFor="name" className="text-xl">
          Name
        </label>
        <input id="name" name="name" required className="input" />

        <input type="hidden" name="email" value={user ? user.email : ""} />

        <button className="button mt-2">Save</button>
      </Form>
    </>
  )
}
