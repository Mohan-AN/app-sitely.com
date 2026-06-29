export type ImportType = 'websites' | 'paymentHistory' | 'rateHistory'

export const IMPORT_TYPE_META: Record<ImportType, { label: string; description: string }> = {
  websites: {
    label: 'Websites',
    description: 'Import website records with client info, domain, hosting and billing details.',
  },
  paymentHistory: {
    label: 'Payment History',
    description: 'Import historical billing payment records linked to existing websites.',
  },
  rateHistory: {
    label: 'Rate History',
    description: 'Import maintenance rate change history linked to existing websites.',
  },
}

export interface ColumnDef {
  key: string      // snake_case — matches keys in backend errors[].row
  label: string
  required: boolean
  type: 'text' | 'date' | 'number' | 'url' | 'email' | 'enum'
  enumValues?: string[]
  width: number
}

export const IMPORT_COLUMNS: Record<ImportType, ColumnDef[]> = {
  websites: [
    { key: 'client_name',          label: 'Client Name',       required: true,  type: 'text',   width: 140 },
    { key: 'project_name',         label: 'Project Name',      required: true,  type: 'text',   width: 140 },
    { key: 'site_type',            label: 'Site Type',         required: true,  type: 'enum',   enumValues: ['static', 'wordpress'],                                           width: 100 },
    { key: 'platform',             label: 'Platform',          required: true,  type: 'enum',   enumValues: ['netlify', 'wpx'],                                                width: 90  },
    { key: 'company',              label: 'Company',           required: false, type: 'text',   width: 130 },
    { key: 'phone',                label: 'Phone',             required: false, type: 'text',   width: 110 },
    { key: 'email',                label: 'Email',             required: false, type: 'email',  width: 160 },
    { key: 'city',                 label: 'City',              required: false, type: 'text',   width: 90  },
    { key: 'url',                  label: 'URL',               required: false, type: 'url',    width: 180 },
    { key: 'website_status',       label: 'Website Status',    required: false, type: 'enum',   enumValues: ['In Progress', 'Live', 'On Hold', 'Completed', 'Discontinued'],   width: 130 },
    { key: 'maintenance_status',   label: 'Maint. Status',     required: false, type: 'enum',   enumValues: ['Not Started', 'Active', 'Paused', 'Overdue', 'Cancelled'],        width: 120 },
    { key: 'start_date',           label: 'Start Date',        required: false, type: 'date',   width: 110 },
    { key: 'completed_date',       label: 'Completed Date',    required: false, type: 'date',   width: 125 },
    { key: 'hosted_date',          label: 'Hosted Date',       required: false, type: 'date',   width: 110 },
    { key: 'build_type',           label: 'Build Type',        required: false, type: 'text',   width: 115 },
    { key: 'build_cost',           label: 'Build Cost',        required: false, type: 'number', width: 100 },
    { key: 'hosting_provider',     label: 'Hosting Provider',  required: false, type: 'text',   width: 130 },
    { key: 'hosting_cost',         label: 'Hosting Cost',      required: false, type: 'number', width: 100 },
    { key: 'hosting_renewal_date', label: 'Hosting Renewal',   required: false, type: 'date',   width: 130 },
    { key: 'domain_name',          label: 'Domain Name',       required: false, type: 'text',   width: 140 },
    { key: 'domain_handled_by',    label: 'Domain By',         required: false, type: 'enum',   enumValues: ['our_side', 'client_side'],                                        width: 115 },
    { key: 'domain_provider',      label: 'Domain Provider',   required: false, type: 'text',   width: 130 },
    { key: 'domain_renewal_date',  label: 'Domain Renewal',    required: false, type: 'date',   width: 125 },
    { key: 'domain_cost',          label: 'Domain Cost',       required: false, type: 'number', width: 100 },
    { key: 'maintenance_amount',   label: 'Maint. Amount',     required: false, type: 'number', width: 115 },
    { key: 'billing_cycle',        label: 'Billing Cycle',     required: false, type: 'enum',   enumValues: ['monthly', 'yearly'],                                             width: 110 },
    { key: 'remarks',              label: 'Remarks',           required: false, type: 'text',   width: 160 },
  ],
  paymentHistory: [
    { key: 'project_name',          label: 'Project Name',   required: true,  type: 'text',   width: 150 },
    { key: 'period_label',          label: 'Period Label',   required: true,  type: 'text',   width: 130 },
    { key: 'period_start',          label: 'Period Start',   required: true,  type: 'date',   width: 110 },
    { key: 'period_end',            label: 'Period End',     required: true,  type: 'date',   width: 110 },
    { key: 'amount',                label: 'Amount',         required: true,  type: 'number', width: 90  },
    { key: 'due_date',              label: 'Due Date',       required: true,  type: 'date',   width: 110 },
    { key: 'status',                label: 'Status',         required: true,  type: 'enum',   enumValues: ['pending', 'invoiced', 'paid', 'overdue'], width: 100 },
    { key: 'invoice_sent_date',     label: 'Invoice Sent',   required: false, type: 'date',   width: 115 },
    { key: 'payment_received_date', label: 'Payment Date',   required: false, type: 'date',   width: 115 },
    { key: 'days_delayed',          label: 'Days Delayed',   required: false, type: 'number', width: 110 },
    { key: 'payment_mode',          label: 'Payment Mode',   required: false, type: 'text',   width: 115 },
    { key: 'transaction_reference', label: 'Txn Ref',        required: false, type: 'text',   width: 130 },
    { key: 'invoice_file_url',      label: 'Invoice URL',    required: false, type: 'url',    width: 160 },
    { key: 'invoice_file_name',     label: 'Invoice File',   required: false, type: 'text',   width: 130 },
    { key: 'remarks',               label: 'Remarks',        required: false, type: 'text',   width: 160 },
  ],
  rateHistory: [
    { key: 'project_name',   label: 'Project Name',   required: true,  type: 'text',   width: 170 },
    { key: 'old_rate',       label: 'Old Rate',       required: true,  type: 'number', width: 110 },
    { key: 'new_rate',       label: 'New Rate',       required: true,  type: 'number', width: 110 },
    { key: 'effective_date', label: 'Effective Date', required: true,  type: 'date',   width: 130 },
    { key: 'remarks',        label: 'Remarks',        required: false, type: 'text',   width: 220 },
  ],
}

// Sample row for the downloaded CSV template (snake_case headers match backend expectation)
const SAMPLE_ROWS: Record<ImportType, Record<string, string>> = {
  websites: {
    client_name: 'John Doe', company: 'Acme Corp', phone: '9876543210',
    email: 'john@example.com', city: 'Mumbai', project_name: 'My Website',
    url: 'https://mywebsite.com', site_type: 'static', platform: 'netlify',
    website_status: 'In Progress', maintenance_status: 'Not Started',
    start_date: '2024-01-01', completed_date: '2024-03-01', hosted_date: '2024-03-15',
    build_type: 'React Static', build_cost: '25000', hosting_provider: 'Netlify',
    hosting_cost: '3000', hosting_renewal_date: '2025-03-15',
    domain_name: 'mywebsite.com', domain_handled_by: 'our_side', domain_provider: 'GoDaddy',
    domain_renewal_date: '2025-12-31', domain_cost: '1200', maintenance_amount: '5000',
    billing_cycle: 'monthly', remarks: 'Migrated from old server',
  },
  paymentHistory: {
    project_name: 'My Website', period_label: 'January 2024',
    period_start: '2024-01-01', period_end: '2024-01-31', amount: '5000',
    due_date: '2024-01-15', status: 'paid', invoice_sent_date: '2024-01-10',
    payment_received_date: '2024-01-14', days_delayed: '0', payment_mode: 'UPI',
    transaction_reference: 'TXN123456', invoice_file_url: '', invoice_file_name: 'Invoice-Jan.pdf', remarks: '',
  },
  rateHistory: {
    project_name: 'My Website', old_rate: '5000', new_rate: '6000',
    effective_date: '2024-06-01', remarks: 'Annual rate increase',
  },
}

// ─── Template download ────────────────────────────────────────────────────────

export function downloadTemplate(type: ImportType): void {
  const cols   = IMPORT_COLUMNS[type]
  const sample = SAMPLE_ROWS[type]
  const headers = cols.map((c) => c.key).join(',')
  const row     = cols.map((c) => {
    const v = sample[c.key] ?? ''
    return v.includes(',') ? `"${v}"` : v
  }).join(',')
  const csv  = `${headers}\n${row}`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${type}_import_template.csv`
  a.click()
  URL.revokeObjectURL(url)
}
