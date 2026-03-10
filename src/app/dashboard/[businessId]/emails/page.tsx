import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import EmailTemplateEditor from "@/components/dashboard/email-template-editor"

type EmailsPageProps = {
  params: Promise<{
    businessId: string
  }>
}

export default async function EmailsPage({ params }: EmailsPageProps) {
  const { businessId } = await params

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      emailTemplates: true
    }
  })

  if (!business) {
    notFound()
  }

  const leadTemplate = business.emailTemplates.find(
    (template: { templateType: string }) =>
      template.templateType === "lead_autoresponder"
  )

  if (!leadTemplate) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">{business.name} Email Templates</h1>
          <p className="mt-4 text-gray-600">No email template found yet.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {business.name} Email Templates
          </h1>
          <p className="mt-2 text-gray-600">
            Edit the default autoresponder email sent to new leads.
          </p>
        </div>

        <EmailTemplateEditor
          templateId={leadTemplate.id}
          initialSubject={leadTemplate.subject}
          initialBody={leadTemplate.body}
        />
      </div>
    </main>
  )
}
