"use client"

import Link from "next/link"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"

export default function AppHeader() {
  const { isSignedIn } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          AI Website Builder
        </Link>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-black px-4 py-2 text-white">
                Sign In
              </button>
            </SignInButton>
          ) : null}

          {isSignedIn ? (
            <>
            <Link
              href="/dashboard"
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-900"
            >
              Dashboard
            </Link>
            <UserButton />
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
