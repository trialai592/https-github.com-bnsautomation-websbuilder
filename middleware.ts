import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/private(.*)"
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  const hostHeader = req.headers.get("host") ?? ""
  const hostname = hostHeader.split(":")[0].toLowerCase()
  const pathname = req.nextUrl.pathname

  const appHosts = new Set(
    [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.VERCEL_URL
    ]
      .filter(Boolean)
      .map((value) => value!.replace(/^https?:\/\//, "").split(":")[0].toLowerCase())
  )

  appHosts.add("localhost")
  appHosts.add("127.0.0.1")

  const isAppHost = appHosts.has(hostname)

  if (!isAppHost && pathname === "/") {
    return NextResponse.rewrite(new URL("/site", req.url))
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
}
