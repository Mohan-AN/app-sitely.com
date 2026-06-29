import { apiFetch } from '#/lib/api'

export interface RecordPaymentInput {
  websiteId: string
  billingId: string
  amount: string
  paymentDate: string
  paymentMode: string
  transactionRef?: string | null
  invoiceFile?: File | null
  remarks?: string | null
}

export interface PaymentRecord {
  paymentId: string
  websiteId: string
  amount: string
  paymentDate: string
  paymentMode: string
  periodFrom: string | null
  periodTo: string | null
  notes: string | null
  createdAt: string
  recordedBy: string
}

async function toBase64(file: File): Promise<{ base64: string; name: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve({
        base64: result.split(',')[1] ?? result,
        name: file.name,
        contentType: file.type,
      })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function recordPayment(input: RecordPaymentInput) {
  const body: Record<string, unknown> = {
    amount: input.amount,
    paymentDate: input.paymentDate,
    paymentMode: input.paymentMode,
  }

  if (input.transactionRef) body.transactionReference = input.transactionRef
  if (input.remarks) body.remarks = input.remarks

  if (input.invoiceFile) {
    const { base64, name, contentType } = await toBase64(input.invoiceFile)
    body.invoiceFileBase64 = base64
    body.invoiceFileName = name
    body.invoiceContentType = contentType
  }

  return apiFetch<PaymentRecord>(
    `/websites/${input.websiteId}/billing/${input.billingId}/payment`,
    { method: 'POST', body: JSON.stringify(body) },
  )
}

export async function attachBillingInvoice(websiteId: string, billingId: string, file: File) {
  const { base64, name, contentType } = await toBase64(file)
  return apiFetch<{ invoice_file_url: string; invoice_file_name: string }>(
    `/websites/${websiteId}/billing/${billingId}/invoice`,
    {
      method: 'PATCH',
      body: JSON.stringify({ invoiceFileBase64: base64, invoiceFileName: name, invoiceContentType: contentType }),
    },
  )
}

export function listPayments(websiteId: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiFetch<{ items: PaymentRecord[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
    `/websites/${websiteId}/payments?${params.toString()}`,
  )
}
