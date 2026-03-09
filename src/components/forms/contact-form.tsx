"use client"

import { useState } from "react"

type ContactFormProps = {
  businessId: string
  sourcePage?: string
  serviceOptions?: string[]
}

export default function ContactForm({
  businessId,
  sourcePage = "/",
  serviceOptions = []
}: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceInterest, setServiceInterest] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage("")

    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          businessId,
          name,
          email,
          phone,
          message,
          serviceInterest,
          sourcePage
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit lead")
      }

      setName("")
      setEmail("")
      setPhone("")
      setServiceInterest("")
      setMessage("")
      setSuccessMessage("Thanks — your request was sent successfully.")
    } catch (error) {
      console.error(error)
      alert("Something went wrong submitting the form.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
        <input
          className="w-full rounded-lg border p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          className="w-full rounded-lg border p-3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
        <input
          className="w-full rounded-lg border p-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {serviceOptions.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Service Needed
          </label>
          <select
            className="w-full rounded-lg border p-3"
            value={serviceInterest}
            onChange={(e) => setServiceInterest(e.target.value)}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
        <textarea
          className="min-h-[120px] w-full rounded-lg border p-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Request Service"}
      </button>

      {successMessage ? (
        <p className="text-sm text-green-600">{successMessage}</p>
      ) : null}
    </form>
  )
}
