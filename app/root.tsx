import { Auth0Provider } from "@auth0/auth0-react"
import { MetaFunction } from "@remix-run/node"
import { Link, Links, Meta, Outlet, Scripts } from "@remix-run/react"
import Controls from "./Controls"
import "./styles/base.css"

export const meta: MetaFunction = () => [{ title: "Mbongo" }]

export default function App() {
  return (
    <Auth0Provider
      domain="mbongo.us.auth0.com"
      clientId="NMJkCiLD0QSzZ80GGRctTi3uhrBdrPpR"
      authorizationParams={{
        redirect_uri: typeof window === "object" && location.origin,
      }}
      cacheLocation="localstorage"
    >
      <html>
        <head>
          <Meta />
          <Links />
        </head>

        <body>
          <nav className="flex items-center gap-4 p-4">
            <Link to="/" className="gradient text-2xl font-semibold">
              Mbongo
            </Link>

            <Link to="/new" className="text-2xl">
              New Event
            </Link>

            <Controls />
          </nav>

          <main className="mx-auto my-8 w-4/5">
            <Outlet />
          </main>

          <Scripts />
        </body>
      </html>
    </Auth0Provider>
  )
}
