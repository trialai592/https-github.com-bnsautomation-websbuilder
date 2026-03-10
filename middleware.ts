import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "yourapp.com"

function getHostname(req: NextRequest) {
  const host = req.headers.get("host") || ""
  return host.split(":")[0].toLowerCase()
}

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl
  const hostname = getHostname(req)

  if (isProtectedRoute(req)) {
    await auth.protect()
    return NextResponse.next()
  }

  const isAppDomain =
    hostname === APP_DOMAIN ||
    hostname === `www.${APP_DOMAIN}` ||
    hostname.endsWith(`.${APP_DOMAIN}`)

  const isDashboard =
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/api")

  if (isDashboard) {
    return NextResponse.next()
  }

  if (hostname.endsWith(`.${APP_DOMAIN}`) && hostname !== APP_DOMAIN) {
    const subdomain = hostname.replace(`.${APP_DOMAIN}`, "")
    const rewriteUrl = url.clone()
    rewriteUrl.pathname = `/tenant/${subdomain}${url.pathname}`
    return NextResponse.rewrite(rewriteUrl)
  }

  if (!isAppDomain) {
    const rewriteUrl = url.clone()
    rewriteUrl.pathname = `/domain/${hostname}${url.pathname}`
    return NextResponse.rewrite(rewriteUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|png|gif|svg|ico|woff2?|ttf)).*)",
    "/(api|trpc)(.*)"
  ]
}
