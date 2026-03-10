"use client"

import { useMemo, useState } from "react"

type Props = {
  businessId: string
  subdomain: string
  customDomain: string
  appDomain: string
}

export default function DomainSettingsForm({
  businessId,
  subdomain,
  customDomain,
  appDomain
}: Props) {
  const [domain, setDomain] = useState(customDomain)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const subdomainUrl = useMemo(() => {
    if (!subdomain) return ""
    return `${subdomain}.${appDomain}`
  }, [appDomain, subdomain])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const res = await fetch(`/api/businesses/${businessId}/domains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          domain
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update domain")
      }

      setMessage("Domain saved. Now add the required DNS record at your registrar.")
    } catch (error) {
      console.error(error)
      setMessage("Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-700">Default subdomain:</p>
          <p className="mt-1 font-semibold text-gray-900">
            {subdomainUrl}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Custom Domain
          </label>
          <input
            className="w-full rounded-lg border p-3"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Connect Domain"}
        </button>
      </form>

      <div className="rounded-xl border p-4 text-sm text-gray-700">
        <p className="font-medium">DNS instructions</p>
        <p className="mt-2">
          After saving the domain, add the DNS records shown by your platform.
        </p>
        <p className="mt-2">
          For many setups this will be either an A record for the apex domain or a CNAME for a subdomain, depending on what Vercel tells you for that domain.
        </p>
      </div>

      {message ? <p className="text-sm text-gray-700">{message}</p> : null}
    </div>
  )
}
