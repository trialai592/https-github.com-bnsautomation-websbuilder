import BusinessIntakeForm from "@/components/forms/business-intake-form"

export default function NewBusinessPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a Business</h1>
          <p className="mt-2 text-gray-600">
            Enter the business details to generate the website and dashboard.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <BusinessIntakeForm />
        </div>
      </div>
    </main>
  )
}
