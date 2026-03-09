type HeroSectionProps = {
  data: {
    headline?: string
    subheadline?: string
    primaryCta?: string
    secondaryCta?: string
  }
}

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
            Local service business
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            {data.headline ?? "Professional service for your home or business"}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            {data.subheadline ??
              "Trusted local experts delivering quality work and dependable support."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-lg bg-black px-5 py-3 text-white">
              {data.primaryCta ?? "Get Started"}
            </button>
            <button className="rounded-lg border border-gray-300 px-5 py-3 text-gray-900">
              {data.secondaryCta ?? "Learn More"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
