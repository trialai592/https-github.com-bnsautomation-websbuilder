import ContactForm from "@/components/forms/contact-form"

type ContactCTASectionProps = {
  data: {
    title?: string
    description?: string
    buttonText?: string
    businessId?: string
    sourcePage?: string
    serviceOptions?: string[]
  }
}

export default function ContactCTASection({ data }: ContactCTASectionProps) {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-3xl font-bold">
            {data.title ?? "Ready to get started?"}
          </h2>
          <p className="mt-4 max-w-xl text-gray-300">
            {data.description ??
              "Contact us today to get fast, reliable help from a trusted local team."}
          </p>
        </div>

        <div>
          <ContactForm
            businessId={data.businessId ?? ""}
            sourcePage={data.sourcePage ?? "/"}
            serviceOptions={data.serviceOptions ?? []}
          />
        </div>
      </div>
    </section>
  )
}
