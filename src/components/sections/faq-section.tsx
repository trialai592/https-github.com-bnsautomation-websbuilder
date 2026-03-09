type FAQItem = {
  question?: string
  answer?: string
}

type FAQSectionProps = {
  data: {
    title?: string
    items?: FAQItem[]
  }
}

export default function FAQSection({ data }: FAQSectionProps) {
  const items = data.items ?? []

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900">
          {data.title ?? "Frequently Asked Questions"}
        </h2>

        <div className="mt-8 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-2xl border p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.question ?? "Question"}
              </h3>
              <p className="mt-2 text-gray-600">
                {item.answer ?? "Answer goes here."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
