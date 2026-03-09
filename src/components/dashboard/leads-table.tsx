import LeadStatusBadge from "@/components/dashboard/lead-status-badge"
import LeadStatusSelect from "@/components/dashboard/lead-status-select"

type Lead = {
  id: string
  name: string
  email: string | null
  phone: string | null
  serviceInterest: string | null
  message: string | null
  status: "new" | "contacted" | "qualified" | "closed"
  createdAt: Date
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <p className="text-sm text-gray-600">No leads yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Message</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Update</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="px-4 py-4 align-top text-sm text-gray-900">{lead.name}</td>
              <td className="px-4 py-4 align-top text-sm text-gray-700">
                <div>{lead.email ?? "No email"}</div>
                <div>{lead.phone ?? "No phone"}</div>
              </td>
              <td className="px-4 py-4 align-top text-sm text-gray-700">
                {lead.serviceInterest ?? "—"}
              </td>
              <td className="max-w-xs px-4 py-4 align-top text-sm text-gray-700">
                {lead.message ?? "—"}
              </td>
              <td className="px-4 py-4 align-top text-sm text-gray-700">
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-4 align-top text-sm text-gray-700">
                <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
              </td>
              <td className="px-4 py-4 align-top text-sm text-gray-700">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
