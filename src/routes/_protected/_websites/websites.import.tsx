import { createFileRoute } from '@tanstack/react-router'
import { ImportPage } from '#/components/websites/import-page'

export const Route = createFileRoute('/_protected/_websites/websites/import')({
  component: ImportPage,
})
