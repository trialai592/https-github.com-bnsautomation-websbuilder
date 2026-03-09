type ServiceItem = {
  name?: string
  description?: string
}

type ServicesSectionProps = {
  data: {
    title?: string
    items?: ServiceItem[]
  }
}

export default function ServicesSection({ data }: ServicesSectionProps) {
  const items = data.items ?? []

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900">
          {data.title ?? "Our Services"}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                {item.name ?? "Service"}
              </h3>
              <p className="mt-3 text-gray-600">
                {item.description ?? "High-quality service tailored to your needs."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
