import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { EyeOff, Lock, Mail } from 'lucide-react'
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
  accessToken: string
  refreshToken: string
  user: { userId: string; name: string; email: string; role: string; isActive: boolean }
}

type AuthView = 'login' | 'recovery' | 'reset'

function mapApiErrors(
  apiErr: ApiError,
  fieldKeys: string[],
): { fields: Record<string, string>; form?: string } {
  if (apiErr.errors?.length) {
    const fields: Record<string, string> = {}
    for (const msg of apiErr.errors) {
      const lower = msg.toLowerCase()
      const matched = fieldKeys.find((k) => lower.includes(k))
      if (matched) fields[matched] = (fields[matched] ? fields[matched] + ' · ' : '') + msg
      else fields[fieldKeys[fieldKeys.length - 1]] = (fields[fieldKeys[fieldKeys.length - 1]] ? fields[fieldKeys[fieldKeys.length - 1]] + ' · ' : '') + msg
    }
    return { fields }
  }
  return { fields: {}, form: apiErr.message ?? 'Something went wrong. Please try again.' }
}

function FieldError({ msg }: { msg: string | undefined }) {
  if (!msg) return null
  return <p className="text-center text-[13px] font-semibold text-red-500">{msg}</p>
}

function LoginScreen() {
  const navigate = useNavigate()
  const { redirect: redirectTo } = Route.useSearch()
  const [view, setView] = useState<AuthView>('login')

  // Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    mutationFn: () =>
      apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken)
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
    <div className="mx-auto w-full max-w-[740px] animate-in fade-in duration-500">
      <div className="rounded-[16px] border border-[#dce3ef] bg-white px-14 py-16 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:px-16">

        {/* Logo */}
        <div className="mb-14 flex items-center justify-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[#4f2df5] text-3xl font-black text-white shadow-[0_8px_20px_rgba(79,45,245,0.2)] ring-4 ring-[#ede9fe]">S</div>
          <h2 className="text-[34px] font-extrabold tracking-normal text-[#0b1020]">Sitely</h2>
        </div>

        {/* ── LOGIN ── */}
        {view === 'login' && (
          <>
            <div className="mb-12 text-center">
              <h1 className="mb-6 text-[44px] font-extrabold leading-tight tracking-normal text-[#0b1020]">Welcome back</h1>
              <p className="mx-auto max-w-[470px] text-[24px] font-medium leading-snug text-[#53637f]">Sign in to access your websites and manage everything in one place.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate() }} className="flex flex-col gap-8" noValidate>
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-[18px] font-bold text-[#0f172a]">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-6 top-1/2 size-6 -translate-y-1/2 text-[#53637f]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setLoginFieldErrors((f) => ({ ...f, email: undefined! })); setLoginFormError(undefined) }}
                    className={`h-[72px] rounded-lg pl-20 text-[22px] font-medium text-[#172554] ${loginFieldErrors.email ? 'border-red-400' : ''}`}
                    placeholder="you@example.com"
                    required
                    autoComplete="username"
                  />
                </div>
                <FieldError msg={loginFieldErrors.email} />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="password" className="text-[18px] font-bold text-[#0f172a]">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-6 top-1/2 size-6 -translate-y-1/2 text-[#53637f]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginFieldErrors((f) => ({ ...f, password: undefined! })); setLoginFormError(undefined) }}
                    className={`h-[72px] rounded-lg pl-20 pr-14 text-[22px] font-medium text-[#172554] ${loginFieldErrors.password ? 'border-red-400' : ''}`}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute bottom-0 right-6 top-0 m-auto text-[#53637f] transition hover:text-[#0f172a]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    <EyeOff className="size-6" />
                  </button>
                </div>
                <FieldError msg={loginFieldErrors.password} />
                <FieldError msg={loginFormError} />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-4 text-[18px] font-semibold text-[#0f172a]">
                  <span className="size-8 rounded-md border border-[#dce3ef] bg-white" />
                  Remember me
                </label>
                <button type="button" onClick={goToRecovery} className="text-[18px] font-bold text-[#4f2df5] transition hover:text-[#3f22d8]">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" disabled={loginMutation.isPending} className="mt-2 h-[72px] rounded-lg text-[24px] font-bold">
                {loginMutation.isPending ? 'Signing in...' : 'Sign in to Sitely'}
              </Button>
            </form>
          </>
        )}

        {/* ── RECOVERY ── */}
        {view === 'recovery' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-normal text-[#102015]">Reset password</h1>
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
                  className={`h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 font-semibold text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${recoveryEmailError ? 'border-red-400' : ''}`}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
                <FieldError msg={recoveryEmailError} />
                <FieldError msg={recoveryFormError} />
              </div>

              <Button type="submit" disabled={forgotPasswordMutation.isPending} className="h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]">
                {forgotPasswordMutation.isPending ? 'Sending...' : 'Send reset code'}
              </Button>
              <button type="button" className="py-2 text-[13px] font-bold text-[#64748B] transition hover:text-[#102015]" onClick={goToLogin}>
                Back to login
              </button>
            </form>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {view === 'reset' && (
          <>
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-normal text-[#102015]">Enter reset code</h1>
              <p className="text-[15px] font-medium text-[#64748B]">
                We sent a 4-digit code to <span className="font-bold text-[#102015]">{recoveryEmail}</span>
              </p>
            </div>

            {resetSuccess ? (
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-[#c7ddb5] bg-[#ddead1]/40 px-4 py-5 text-center">
                  <p className="text-[15px] font-bold text-[#658354]">Password updated</p>
                  <p className="mt-1 text-[13px] font-medium text-[#64748B]">You can now sign in with your new password.</p>
                </div>
                <Button className="h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]" onClick={goToLogin}>
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
                    className={`h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 text-center text-xl font-bold tracking-[0.4em] text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${resetFieldErrors.otp ? 'border-red-400' : ''}`}
                    placeholder="····"
                    required
                    autoComplete="one-time-code"
                  />
                  <FieldError msg={resetFieldErrors.otp} />
                  <FieldError msg={resetFormError} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="new-password" className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">New password</label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setResetFieldErrors((f) => ({ ...f, password: undefined! })); setResetFormError(undefined) }}
                      className={`h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 pr-10 font-semibold text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${resetFieldErrors.password ? 'border-red-400' : ''}`}
                      placeholder="Enter new password"
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute bottom-0 right-3 top-0 m-auto text-[#64748B] transition hover:text-[#102015]" aria-label={showNewPassword ? 'Hide password' : 'Show password'}>
                      {showNewPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </div>
                  <FieldError msg={resetFieldErrors.password} />
                </div>

                <Button type="submit" disabled={resetPasswordMutation.isPending} className="h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]">
                  {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset password'}
                </Button>

                <div className="flex items-center justify-center gap-1 text-[13px] font-medium text-[#64748B]">
                  <span>Didn't receive a code?</span>
                  <button type="button" onClick={goToRecovery} className="font-bold text-[#658354] transition hover:text-[#4b6043]">
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
