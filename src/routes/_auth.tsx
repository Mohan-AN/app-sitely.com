import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { CalendarClock, Globe2, Users, type LucideIcon } from 'lucide-react'
import { ACCESS_TOKEN_KEY } from '#/lib/api'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && localStorage.getItem(ACCESS_TOKEN_KEY)) {
      throw redirect({ to: '/', search: { page: 1, limit: 10, showFilters: false } })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white text-[#102015]">
      <div className="relative hidden w-[45%] overflow-hidden border-r border-[#c7ddb5] bg-[#f2f6ee] lg:flex lg:flex-col">
        <div className="absolute right-[-10%] top-[-20%] h-[50%] w-[80%] rounded-full border border-[#658354]/20" />
        <div className="absolute right-[-20%] top-[-10%] h-[60%] w-[90%] rounded-full border border-[#658354]/10" />

        <div className="relative z-10 flex h-full flex-col p-12 xl:p-16">
          <div className="mb-20 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#658354] bg-white text-lg font-black text-[#658354] shadow-sm">S</div>
            <span className="text-2xl font-extrabold tracking-normal text-[#102015]">Sitely</span>
          </div>

          <div className="mb-12 max-w-[420px]">
            <h1 className="mb-4 text-[38px] font-bold leading-[1.1] tracking-normal text-[#102015]">Manage every website with clarity</h1>
            <p className="text-[17px] font-medium leading-relaxed text-[#64748B]">Track clients, projects, renewals, maintenance, and handovers from one calm workspace.</p>
          </div>

          <div className="relative z-10 flex max-w-[420px] flex-col gap-8">
            <AuthFeature icon={Globe2} title="Website operations" description="Follow each project from build to live status and renewal." />
            <AuthFeature icon={Users} title="Client workspace" description="Keep client records and linked websites organized." />
            <AuthFeature icon={CalendarClock} title="Renewal tracking" description="Spot overdue work, active maintenance, and upcoming due dates." />
          </div>

          <div className="absolute bottom-[-20%] left-[-10%] z-0 h-[40%] w-[60%] rounded-full bg-[#ddead1] opacity-60 blur-3xl" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col bg-white">
<div className="relative z-10 flex flex-1 items-center justify-center p-6 sm:p-12">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function AuthFeature({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#c7ddb5] bg-[#ddead1] text-[#658354]">
        <Icon className="size-6" />
      </div>
      <div className="flex flex-col pt-1">
        <h3 className="mb-1 text-[16px] font-bold text-[#658354]">{title}</h3>
        <p className="text-[13px] font-medium leading-relaxed text-[#64748B]">{description}</p>
      </div>
    </div>
  )
}
