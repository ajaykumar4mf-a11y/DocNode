import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, setToken } = useContext(AppContext)

  const [state, setState] = useState('sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const formEl = event.target

    try {
      setLoading(true)
      if (state === 'login') {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          setToken(data.token)
          if (window.PasswordCredential && navigator.credentials && navigator.credentials.store) {
            try {
              const cred = new window.PasswordCredential({
                id: email,
                password: password,
                name: email
              })
              navigator.credentials.store(cred).catch(() => { })
            } catch {
              // fallback if credential store fails
            }
          }
          toast.success('Signed in successfully')
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const cleanPhone = String(phone || '').replace(/\D/g, '')
        if (cleanPhone.length !== 10) {
          toast.error('Phone number must be exactly 10 digits')
          return
        }
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, phone: cleanPhone, email, password })
        if (data.success) {
          setToken(data.token)
          if (window.PasswordCredential && navigator.credentials && navigator.credentials.store) {
            try {
              const cred = new window.PasswordCredential({
                id: email,
                password: password,
                name: name || email
              })
              navigator.credentials.store(cred).catch(() => { })
            } catch {
              // fallback if credential store fails
            }
          }
          toast.success('Account created successfully')
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative min-h-[82vh] flex items-center justify-center py-10 px-4 overflow-hidden'>
      {/* Ambient background glow elements */}
      <div className='absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10' />
      <div className='absolute -bottom-10 right-1/4 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10' />

      <form
        id='patient-login-form'
        name='login'
        method='post'
        action='#'
        autoComplete='on'
        onSubmit={onSubmitHandler}
        className='w-full max-w-md bg-white/95 backdrop-blur-md border border-blue-100/90 rounded-3xl p-6 sm:p-9 shadow-xl shadow-blue-500/5 flex flex-col gap-5 transition-all duration-300 relative z-10'
      >
        {/* Header with blue medical shield icon */}
        <div className='text-center flex flex-col items-center'>
          <div className='w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 mb-3 transition-transform hover:scale-105'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
            {state === 'sign Up' ? 'Create Patient Account' : 'Welcome to DocNode'}
          </h1>
        </div>

        {/* Inputs Group */}
        <div className='flex flex-col gap-3.5 text-xs font-medium text-slate-700'>
          {/* Full Name Input (Sign Up Only) */}
          {state === 'sign Up' && (
            <div className='flex flex-col gap-1'>
              <label htmlFor='name' className='text-xs font-semibold text-slate-700'>
                Full Name
              </label>
              <div className='group flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200'>
                <svg className='w-4 h-4 text-slate-400 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
                <input
                  id='name'
                  name='name'
                  autoComplete='name'
                  className='w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 text-xs font-normal'
                  type='text'
                  placeholder='Enter your full name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Phone Number Input (Sign Up Only) */}
          {state === 'sign Up' && (
            <div className='flex flex-col gap-1'>
              <div className='flex justify-between items-center'>
                <label htmlFor='phone' className='text-xs font-semibold text-slate-700'>
                  Phone Number
                </label>
                {phone && (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors ${
                    phone.length === 10
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-blue-600 bg-blue-50'
                  }`}>
                    {phone.length === 10 ? '✓ Valid 10-digit number' : `${phone.length}/10 digits`}
                  </span>
                )}
              </div>
              <div className='group flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200'>
                <svg className='w-4 h-4 text-slate-400 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
                <input
                  id='phone'
                  name='phone'
                  autoComplete='tel'
                  className='w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 text-xs font-normal'
                  type='tel'
                  maxLength={10}
                  placeholder='10-digit mobile number'
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address Input */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='text-xs font-semibold text-slate-700'>
              Email Address
            </label>
            <div className='group flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200'>
              <svg className='w-4 h-4 text-slate-400 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
              <input
                id='email'
                name='username'
                autoComplete='username'
                className='w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 text-xs font-normal'
                type='email'
                placeholder='name@DocNode.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className='flex flex-col gap-1'>
            <div className='flex justify-between items-center'>
              <label htmlFor='password' className='text-xs font-semibold text-slate-700'>
                Password
              </label>
              {state !== 'sign Up' && (
                <button
                  type='button'
                  onClick={() => navigate('/forgot-password')}
                  className='text-[11px] font-semibold text-primary hover:text-blue-700 hover:underline cursor-pointer transition-colors'
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className='group flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200'>
              <svg className='w-4 h-4 text-slate-400 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
              </svg>
              <input
                id='password'
                name='password'
                autoComplete={state === 'login' ? 'current-password' : 'new-password'}
                className='w-full bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 text-xs font-normal'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='text-slate-400 hover:text-primary focus:outline-none ml-2 cursor-pointer p-0.5 transition-colors'
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.046 10.046 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243m4.242 4.242L9.88 9.88"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3l18 18"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button with blue gradient and loading state */}
        <button
          disabled={loading}
          className='w-full bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 active:scale-[0.99] transition-all duration-200 cursor-pointer text-xs sm:text-sm mt-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed'
          type='submit'
        >
          {loading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              <span>{state === 'sign Up' ? 'Creating Account...' : 'Signing In...'}</span>
            </>
          ) : (
            <span>{state === 'sign Up' ? 'Create Patient Account' : 'Sign In to Portal'}</span>
          )}
        </button>

        {/* Bottom Switcher */}
        <div className='text-center pt-2 border-t border-slate-100 text-xs text-slate-500'>
          {state === 'sign Up' ? (
            <p>
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => setState('login')}
                className='text-primary font-bold hover:text-blue-700 hover:underline cursor-pointer ml-1'
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => setState('sign Up')}
                className='text-primary font-bold hover:text-blue-700 hover:underline cursor-pointer ml-1'
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Reassuring Security Note */}
        <div className='flex items-center justify-center gap-1.5 text-[11px] text-slate-400 -mt-2'>
          <svg className='w-3.5 h-3.5 text-blue-500/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
          </svg>
          <span>End-to-end encrypted & secure patient portal</span>
        </div>
      </form>
    </div>
  )
}

export default Login
