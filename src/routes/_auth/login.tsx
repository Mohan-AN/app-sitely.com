import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ApiError, apiFetch } from '#/lib/api'

export const Route = createFileRoute('/_auth/login')({
  validateSearch: (search) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginScreen,
})

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: { user_id: string; name: string; email: string; role: string; is_active: boolean }
}

type AuthView = 'login' | 'recovery' | 'reset'

function mapApiErrors(
  apiErr: ApiError,
  fieldKeys: string[],
): { fields: Record<string, string>; form?: string } {
  // Backend sends field_errors as { fieldName: "message" } — use directly
  if (Object.keys(apiErr.fieldErrors).length > 0) {
    return { fields: apiErr.fieldErrors }
  }
  // Fallback: errors array — match by keyword
  if (apiErr.errors?.length) {
    const fields: Record<string, string> = {}
    for (const msg of apiErr.errors) {
      const lower = msg.toLowerCase()
      const matched = fieldKeys.find((k) => lower.includes(k))
      if (matched) fields[matched] = (fields[matched] ? fields[matched] + ' · ' : '') + msg
      else fields[fieldKeys[fieldKeys.length - 1]] = msg
    }
    return { fields }
  }
  return { fields: {}, form: apiErr.message ?? 'Something went wrong. Please try again.' }
}

function FieldError({ msg, center }: { msg: string | undefined; center?: boolean }) {
  if (!msg) return null
  return <p className={`text-[12px] font-semibold text-red-500${center ? ' text-center' : ''}`}>{msg}</p>
}

function LoginScreen() {
  const navigate = useNavigate()
  const { redirect: redirectTo } = Route.useSearch()
  const [view, setView] = useState<AuthView>('login')

  // Login
  const [showPassword, setShowPassword] = useState(false)
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({})
  const [loginFormError, setLoginFormError] = useState<string | undefined>()

  // Recovery
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryEmailError, setRecoveryEmailError] = useState<string | undefined>()
  const [recoveryFormError, setRecoveryFormError] = useState<string | undefined>()

  // Reset
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetFieldErrors, setResetFieldErrors] = useState<Record<string, string>>({})
  const [resetFormError, setResetFormError] = useState<string | undefined>()
  const [resetSuccess, setResetSuccess] = useState(false)

  // ── Login mutation ──────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: ({ email: e, password: p }: { email: string; password: string }) =>
      apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: e, password: p }),
      }),
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
      navigate({ to: redirectTo ?? '/' })
    },
    onError: (err: Error) => {
      const { fields, form } = mapApiErrors(err as ApiError, ['email', 'password'])
      setLoginFieldErrors(fields)
      setLoginFormError(form)
    },
  })

  // ── Forgot-password mutation ────────────────────────────────
  const forgotPasswordMutation = useMutation({
    mutationFn: () =>
      apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: recoveryEmail }),
      }),
    onSuccess: () => {
      setOtp('')
      setNewPassword('')
      setResetFieldErrors({})
      setResetFormError(undefined)
      setResetSuccess(false)
      setView('reset')
    },
    onError: (err: Error) => {
      const apiErr = err as ApiError
      if (apiErr.errors?.length) {
        setRecoveryEmailError(apiErr.errors.find((m) => m.toLowerCase().includes('email')) ?? apiErr.errors[0])
      } else {
        setRecoveryFormError(apiErr.message ?? 'Something went wrong. Please try again.')
      }
    },
  })

  // ── Reset-password mutation ─────────────────────────────────
  const resetPasswordMutation = useMutation({
    mutationFn: () =>
      apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email: recoveryEmail, otp, newPassword }),
      }),
    onSuccess: () => {
      setResetSuccess(true)
    },
    onError: (err: Error) => {
      const { fields, form } = mapApiErrors(err as ApiError, ['otp', 'password'])
      setResetFieldErrors(fields)
      setResetFormError(form)
    },
  })

  // ── Navigation helpers ──────────────────────────────────────
  function goToRecovery() {
    setRecoveryEmail('')
    setRecoveryEmailError(undefined)
    setRecoveryFormError(undefined)
    forgotPasswordMutation.reset()
    setView('recovery')
  }

  function goToLogin() {
    setView('login')
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-[460px] animate-in fade-in duration-500">
      <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-10 shadow-[0_8px_30px_rgba(17,20,26,.06)] sm:p-12">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-[14px] bg-[#4F5DF5] text-xl font-bold text-white shadow-sm">S</div>
          <h2 className="text-[15px] font-extrabold tracking-normal text-[#11141A]">Sitely</h2>
        </div>

        {/* ── LOGIN ── */}
        {view === 'login' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-normal text-[#11141A]">Welcome back</h1>
              <p className="text-[15px] font-medium text-[#64748B]">Sign in to continue to your workspace</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              loginMutation.mutate({
                email: ((fd.get('email') as string) ?? '').trim(),
                password: (fd.get('password') as string) ?? '',
              })
            }} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Email address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue=""
                  onChange={() => { setLoginFieldErrors((f) => ({ ...f, email: undefined! })); setLoginFormError(undefined) }}
                  className={`h-12 w-full rounded-xl border-[#E5E7EB] bg-white px-4 font-semibold text-[#11141A] transition-all focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${loginFieldErrors.email ? 'border-red-400' : ''}`}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
                <FieldError msg={loginFieldErrors.email} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    defaultValue=""
                    onChange={() => { setLoginFieldErrors((f) => ({ ...f, password: undefined! })); setLoginFormError(undefined) }}
                    className={`h-12 w-full rounded-xl border-[#E5E7EB] bg-white px-4 pr-10 font-semibold text-[#11141A] transition-all focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${loginFieldErrors.password ? 'border-red-400' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute bottom-0 right-3 top-0 m-auto text-[#64748B] transition hover:text-[#11141A]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                  </button>
                </div>
                <FieldError msg={loginFieldErrors.password} />
                <FieldError msg={loginFormError} center />
              </div>

              <div className="flex items-center justify-end">
                <button type="button" onClick={goToRecovery} className="text-[13px] font-bold text-[#4F5DF5] transition hover:text-[#3F4DE0]">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" disabled={loginMutation.isPending} className="h-12 rounded-xl bg-[#4F5DF5] text-[15px] font-bold text-white shadow-sm hover:bg-[#3F4DE0]">
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </>
        )}

        {/* ── RECOVERY ── */}
        {view === 'recovery' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-normal text-[#11141A]">Reset password</h1>
              <p className="text-[15px] font-medium text-[#64748B]">Enter your email and we'll send you a reset code.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); forgotPasswordMutation.mutate() }} className="flex flex-col gap-6" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="recovery-email" className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Email address</label>
                <Input
                  id="recovery-email"
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => { setRecoveryEmail(e.target.value); setRecoveryEmailError(undefined); setRecoveryFormError(undefined) }}
                  className={`h-12 w-full rounded-xl border-[#E5E7EB] bg-white px-4 font-semibold text-[#11141A] transition-all focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${recoveryEmailError ? 'border-red-400' : ''}`}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
                <FieldError msg={recoveryEmailError} />
                <FieldError msg={recoveryFormError} center />
              </div>

              <Button type="submit" disabled={forgotPasswordMutation.isPending} className="h-12 rounded-xl bg-[#4F5DF5] text-[15px] font-bold text-white shadow-sm hover:bg-[#3F4DE0]">
                {forgotPasswordMutation.isPending ? 'Sending...' : 'Send reset code'}
              </Button>
              <button type="button" className="py-2 text-[13px] font-bold text-[#64748B] transition hover:text-[#11141A]" onClick={goToLogin}>
                Back to login
              </button>
            </form>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {view === 'reset' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-normal text-[#11141A]">Enter reset code</h1>
              <p className="text-[15px] font-medium text-[#64748B]">
                We sent a 4-digit code to <span className="font-bold text-[#11141A]">{recoveryEmail}</span>
              </p>
            </div>

            {resetSuccess ? (
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-[#E5E7EB] bg-[#ddead1]/40 px-4 py-5 text-center">
                  <p className="text-[15px] font-bold text-[#4F5DF5]">Password updated</p>
                  <p className="mt-1 text-[13px] font-medium text-[#64748B]">You can now sign in with your new password.</p>
                </div>
                <Button className="h-12 rounded-xl bg-[#4F5DF5] text-[15px] font-bold text-white shadow-sm hover:bg-[#3F4DE0]" onClick={goToLogin}>
                  Back to login
                </Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); resetPasswordMutation.mutate() }} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="otp" className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">Reset code</label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 4)); setResetFieldErrors((f) => ({ ...f, otp: undefined! })); setResetFormError(undefined) }}
                    className={`h-12 w-full rounded-xl border-[#E5E7EB] bg-white px-4 text-center text-xl font-bold tracking-[0.4em] text-[#11141A] transition-all focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${resetFieldErrors.otp ? 'border-red-400' : ''}`}
                    placeholder="····"
                    required
                    autoComplete="one-time-code"
                  />
                  <FieldError msg={resetFieldErrors.otp} />
                  <FieldError msg={resetFormError} center />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="new-password" className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">New password</label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setResetFieldErrors((f) => ({ ...f, password: undefined! })); setResetFormError(undefined) }}
                      className={`h-12 w-full rounded-xl border-[#E5E7EB] bg-white px-4 pr-10 font-semibold text-[#11141A] transition-all focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${resetFieldErrors.password ? 'border-red-400' : ''}`}
                      placeholder="Enter new password"
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute bottom-0 right-3 top-0 m-auto text-[#64748B] transition hover:text-[#11141A]" aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
                      {showNewPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                  <FieldError msg={resetFieldErrors.password} />
                </div>

                <Button type="submit" disabled={resetPasswordMutation.isPending} className="h-12 rounded-xl bg-[#4F5DF5] text-[15px] font-bold text-white shadow-sm hover:bg-[#3F4DE0]">
                  {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset password'}
                </Button>

                <div className="flex items-center justify-center gap-1 text-[13px] font-medium text-[#64748B]">
                  <span>Didn't receive a code?</span>
                  <button type="button" onClick={goToRecovery} className="font-bold text-[#4F5DF5] transition hover:text-[#3F4DE0]">
                    Resend
                  </button>
                </div>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  )
}
