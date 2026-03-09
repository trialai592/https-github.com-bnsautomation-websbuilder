"use client"

import { useState } from "react"

type LeadStatus = "new" | "contacted" | "qualified" | "closed"

export default function LeadStatusSelect({
  leadId,
  initialStatus
}: {
  leadId: string
  initialStatus: LeadStatus
}) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(nextStatus: LeadStatus) {
    setStatus(nextStatus)
    setSaving(true)

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update lead status")
      }
    } catch (error) {
      console.error(error)
      alert("Failed to update lead status.")
      setStatus(initialStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <select
      className="rounded-lg border px-3 py-2 text-sm"
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as LeadStatus)}
    >
      <option value="new">new</option>
      <option value="contacted">contacted</option>
      <option value="qualified">qualified</option>
      <option value="closed">closed</option>
    </select>
  )
}
