import { useAuth0 } from "@auth0/auth0-react"
import { Link } from "@remix-run/react"
import { useState } from "react"

export default function Controls() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const [drop, setDrop] = useState(false)

  return (
    <div className="ml-auto h-12">
      {isAuthenticated ? (
        <>
          <button
            onClick={() => setDrop(!drop)}
            className="size-12 rounded-full bg-primary"
          />

          {drop && (
            <div className="absolute right-0 m-2 flex w-48 flex-col rounded border p-2 shadow">
              {/* <Link to="/profile" className="rounded p-1 hover:bg-[#fce9e6]">
                Profile
              </Link> */}

              <Link to="/settings" className="rounded p-1 hover:bg-[#fce9e6]">
                Settings
              </Link>

              <button
                onClick={() => logout()}
                className="rounded p-1 text-left hover:bg-[#fce9e6]"
              >
                Sign Out
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => loginWithRedirect()}
            className="rounded-full bg-primary px-3 py-2 text-lg text-white"
          >
            Log in
          </button>
        </>
      )}
    </div>
  )
}
