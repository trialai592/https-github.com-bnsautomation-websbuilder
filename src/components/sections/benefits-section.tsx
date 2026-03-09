type BenefitsSectionProps = {
  data: {
    title?: string
    items?: string[]
  }
}

export default function BenefitsSection({ data }: BenefitsSectionProps) {
  const items = data.items ?? []

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900">
          {data.title ?? "Why Choose Us"}
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border p-6">
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
