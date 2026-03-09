type FooterSectionProps = {
  data: {
    businessName?: string
    city?: string
    email?: string
  }
}

export default function FooterSection({ data }: FooterSectionProps) {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="font-semibold text-gray-900">
          {data.businessName ?? "Business Name"}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {data.city ?? "Your City"}
        </p>
        <p className="text-sm text-gray-600">{data.email ?? "contact@example.com"}</p>
      </div>
    </footer>
  )
}
