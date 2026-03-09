type TestimonialItem = {
  name?: string
  quote?: string
}

type TestimonialsSectionProps = {
  data: {
    title?: string
    items?: TestimonialItem[]
  }
}

export default function TestimonialsSection({
  data
}: TestimonialsSectionProps) {
  const items = data.items ?? []

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900">
          {data.title ?? "What Customers Say"}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-gray-700">“{item.quote ?? "Great service."}”</p>
              <p className="mt-4 font-semibold text-gray-900">
                {item.name ?? "Happy Customer"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
