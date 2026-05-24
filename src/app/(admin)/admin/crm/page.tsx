import { getContacts } from "@/modules/crm/actions/contact-actions"
import { CrmClientPage } from "./client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CRM - Contactos",
}

export default async function AdminCrmPage() {
  const result = await getContacts()
  return <CrmClientPage initialData={result} />
}
