"use client"

import { useState } from "react"

type EmailTemplateEditorProps = {
  templateId: string
  initialSubject: string
  initialBody: string
}

export default function EmailTemplateEditor({
  templateId,
  initialSubject,
  initialBody
}: EmailTemplateEditorProps) {
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSavedMessage("")

    try {
      const res = await fetch(`/api/email-templates/${templateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject,
          body
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save email template")
      }

      setSavedMessage("Template saved successfully.")
    } catch (error) {
      console.error(error)
      alert("Failed to save email template.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          className="w-full rounded-lg border p-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Body
        </label>
        <textarea
          className="min-h-[260px] w-full rounded-lg border p-3 font-mono text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-medium">Available placeholders:</p>
        <p className="mt-2">
          {"{{leadName}}"}, {"{{businessName}}"}, {"{{city}}"}, {"{{serviceInterest}}"}, {"{{message}}"}
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Template"}
      </button>

      {savedMessage ? <p className="text-sm text-green-600">{savedMessage}</p> : null}
    </form>
  )
}
