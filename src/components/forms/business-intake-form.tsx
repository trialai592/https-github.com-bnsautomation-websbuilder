"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function BusinessIntakeForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [city, setCity] = useState("")
  const [email, setEmail] = useState("")
  const [tone, setTone] = useState("professional")
  const [services, setServices] = useState([""])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name,
        industry,
        city,
        email,
        tone,
        services: services
          .filter((s) => s.trim().length > 0)
          .map((s) => ({ name: s }))
      }

      const createBusinessRes = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      const businessData = await createBusinessRes.json()

      if (!createBusinessRes.ok) {
        throw new Error(businessData.error || "Failed to create business")
      }

      const generateSiteRes = await fetch("/api/generate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          businessId: businessData.id
        })
      })

      const siteData = await generateSiteRes.json()

      if (!generateSiteRes.ok) {
        throw new Error(siteData.error || "Failed to generate site")
      }

      router.push(`/dashboard/businesses/${businessData.id}`)
    } catch (error) {
      console.error(error)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input
        className="w-full rounded border p-2"
        placeholder="Business Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        className="w-full rounded border p-2"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="luxury">Luxury</option>
        <option value="modern">Modern</option>
      </select>

      {services.map((service, i) => (
        <input
          key={i}
          className="w-full rounded border p-2"
          placeholder={`Service ${i + 1}`}
          value={service}
          onChange={(e) => {
            const updated = [...services]
            updated[i] = e.target.value
            setServices(updated)
          }}
        />
      ))}

      <button
        type="button"
        className="rounded border px-3 py-2"
        onClick={() => setServices([...services, ""])}
      >
        Add Service
      </button>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Create Business and Generate Site"}
        </button>
      </div>
    </form>
  )
}
