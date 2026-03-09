"use client"

import { useState } from "react"
import { SiteConfig } from "@/types/site-config"

type SiteEditorFormProps = {
  siteId: string
  initialSiteConfig: SiteConfig
}

export default function SiteEditorForm({
  siteId,
  initialSiteConfig
}: SiteEditorFormProps) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig)
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  function updateSectionData(
    sectionId: string,
    updater: (data: Record<string, unknown>) => Record<string, unknown>
  ) {
    setSiteConfig((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        home: {
          ...prev.pages.home,
          sections: prev.pages.home.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  data: updater(section.data)
                }
              : section
          )
        }
      }
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSavedMessage("")

    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          siteConfig
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save site config")
      }

      setSavedMessage("Website content saved successfully.")
    } catch (error) {
      console.error(error)
      alert("Failed to save website content.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">SEO</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              SEO Title
            </label>
            <input
              className="w-full rounded-lg border p-3"
              value={siteConfig.seo.title}
              onChange={(e) =>
                setSiteConfig((prev) => ({
                  ...prev,
                  seo: {
                    ...prev.seo,
                    title: e.target.value
                  }
                }))
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              SEO Description
            </label>
            <textarea
              className="min-h-[100px] w-full rounded-lg border p-3"
              value={siteConfig.seo.description}
              onChange={(e) =>
                setSiteConfig((prev) => ({
                  ...prev,
                  seo: {
                    ...prev.seo,
                    description: e.target.value
                  }
                }))
              }
            />
          </div>
        </div>
      </div>

      {siteConfig.pages.home.sections.map((section) => (
        <div key={section.id} className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold capitalize text-gray-900">
            {section.type}
          </h2>

          {section.type === "hero" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Headline"
                value={(section.data.headline as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    headline: e.target.value
                  }))
                }
              />

              <textarea
                className="min-h-[100px] w-full rounded-lg border p-3"
                placeholder="Subheadline"
                value={(section.data.subheadline as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    subheadline: e.target.value
                  }))
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Primary CTA"
                value={(section.data.primaryCta as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    primaryCta: e.target.value
                  }))
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Secondary CTA"
                value={(section.data.secondaryCta as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    secondaryCta: e.target.value
                  }))
                }
              />
            </div>
          )}

          {section.type === "services" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Section Title"
                value={(section.data.title as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    title: e.target.value
                  }))
                }
              />

              {Array.isArray(section.data.items) &&
                section.data.items.map((item, index) => {
                  const service = item as { name?: string; description?: string }

                  return (
                    <div key={index} className="rounded-xl border p-4">
                      <input
                        className="mb-3 w-full rounded-lg border p-3"
                        placeholder="Service Name"
                        value={service.name ?? ""}
                        onChange={(e) =>
                          updateSectionData(section.id, (data) => {
                            const items = Array.isArray(data.items) ? [...data.items] : []
                            const current = (items[index] as { name?: string; description?: string }) ?? {}
                            items[index] = {
                              ...current,
                              name: e.target.value
                            }
                            return { ...data, items }
                          })
                        }
                      />

                      <textarea
                        className="min-h-[90px] w-full rounded-lg border p-3"
                        placeholder="Service Description"
                        value={service.description ?? ""}
                        onChange={(e) =>
                          updateSectionData(section.id, (data) => {
                            const items = Array.isArray(data.items) ? [...data.items] : []
                            const current = (items[index] as { name?: string; description?: string }) ?? {}
                            items[index] = {
                              ...current,
                              description: e.target.value
                            }
                            return { ...data, items }
                          })
                        }
                      />
                    </div>
                  )
                })}
            </div>
          )}

          {section.type === "benefits" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Section Title"
                value={(section.data.title as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    title: e.target.value
                  }))
                }
              />

              {Array.isArray(section.data.items) &&
                section.data.items.map((item, index) => (
                  <input
                    key={index}
                    className="w-full rounded-lg border p-3"
                    placeholder={`Benefit ${index + 1}`}
                    value={(item as string) ?? ""}
                    onChange={(e) =>
                      updateSectionData(section.id, (data) => {
                        const items = Array.isArray(data.items) ? [...data.items] : []
                        items[index] = e.target.value
                        return { ...data, items }
                      })
                    }
                  />
                ))}
            </div>
          )}

          {section.type === "testimonials" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Section Title"
                value={(section.data.title as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    title: e.target.value
                  }))
                }
              />

              {Array.isArray(section.data.items) &&
                section.data.items.map((item, index) => {
                  const testimonial = item as { name?: string; quote?: string }

                  return (
                    <div key={index} className="rounded-xl border p-4">
                      <input
                        className="mb-3 w-full rounded-lg border p-3"
                        placeholder="Customer Name"
                        value={testimonial.name ?? ""}
                        onChange={(e) =>
                          updateSectionData(section.id, (data) => {
                            const items = Array.isArray(data.items) ? [...data.items] : []
                            const current = (items[index] as { name?: string; quote?: string }) ?? {}
                            items[index] = {
                              ...current,
                              name: e.target.value
                            }
                            return { ...data, items }
                          })
                        }
                      />

                      <textarea
                        className="min-h-[100px] w-full rounded-lg border p-3"
                        placeholder="Quote"
                        value={testimonial.quote ?? ""}
                        onChange={(e) =>
                          updateSectionData(section.id, (data) => {
                            const items = Array.isArray(data.items) ? [...data.items] : []
                            const current = (items[index] as { name?: string; quote?: string }) ?? {}
                            items[index] = {
                              ...current,
                              quote: e.target.value
                            }
                            return { ...data, items }
                          })
                        }
                      />
                    </div>
                  )
                })}
            </div>
          )}

          {section.type === "faq" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Section Title"
                value={(section.data.title as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    title: e.target.value
                  }))
                }
              />

              {Array.isArray(section.data.items) &&
                section.data.items.map((item, index) => {
                  const faq = item as { question?: string; answer?: string }

                  return (
                    <div key={index} className="rounded-xl border p-4">
                      <input
                        className="mb-3 w-full rounded-lg border p-3"
                        placeholder="Question"
                        value={faq.question ?? ""}
                        onChange={(e) =>
                          updateSectionData(section.id, (data) => {
                            const items = Array.isArray(data.items) ? [...data.items] : []
                            const current = (items[index] as { question?: string; answer?: string }) ?? {}
                            items[index] = {
                              ...current,
                              question: e.target.value
                            }
                            return { ...data, items }
                          })
                        }
                      />

                      <textarea
                        className="min-h-[100px] w-full rounded-lg border p-3"
                        placeholder="Answer"
                        value={faq.answer ?? ""}
                        onChange={(e) =>
                          updateSectionData(section.id, (data) => {
                            const items = Array.isArray(data.items) ? [...data.items] : []
                            const current = (items[index] as { question?: string; answer?: string }) ?? {}
                            items[index] = {
                              ...current,
                              answer: e.target.value
                            }
                            return { ...data, items }
                          })
                        }
                      />
                    </div>
                  )
                })}
            </div>
          )}

          {section.type === "contactCta" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Title"
                value={(section.data.title as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    title: e.target.value
                  }))
                }
              />

              <textarea
                className="min-h-[100px] w-full rounded-lg border p-3"
                placeholder="Description"
                value={(section.data.description as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    description: e.target.value
                  }))
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Button Text"
                value={(section.data.buttonText as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    buttonText: e.target.value
                  }))
                }
              />
            </div>
          )}

          {section.type === "footer" && (
            <div className="mt-4 space-y-4">
              <input
                className="w-full rounded-lg border p-3"
                placeholder="Business Name"
                value={(section.data.businessName as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    businessName: e.target.value
                  }))
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="City"
                value={(section.data.city as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    city: e.target.value
                  }))
                }
              />

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Email"
                value={(section.data.email as string) ?? ""}
                onChange={(e) =>
                  updateSectionData(section.id, (data) => ({
                    ...data,
                    email: e.target.value
                  }))
                }
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Website"}
        </button>

        {savedMessage ? (
          <p className="text-sm text-green-600">{savedMessage}</p>
        ) : null}
      </div>
    </form>
  )
}
