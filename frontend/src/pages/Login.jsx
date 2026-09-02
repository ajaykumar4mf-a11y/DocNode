import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const [state, setState] = useState('sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'login') {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          setToken(data.token)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, phone, email, password })
        if (data.success) {
          setToken(data.token)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } 
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[75vh] flex items-center justify-center py-10 px-4'>
      <div className='w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-100/80 flex flex-col gap-5 transition-all duration-300'>

        {/* Tab Selector */}
        <div className='w-full bg-slate-100/80 p-1 rounded-2xl flex text-xs font-semibold'>
          <button
            type='button'
            onClick={() => setState('sign Up')}
            className={`flex-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${state === 'sign Up'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Create Account
          </button>
          <button
            type='button'
            onClick={() => setState('login')}
            className={`flex-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${state === 'login'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Log In
          </button>
        </div>

        {/* Form Title & Subtitle */}
        <div className='text-left'>
          <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
            {state === 'sign Up' ? 'Get Started with DocNode' : 'Welcome Back'}
          </h1>
          <p className='text-slate-500 text-xs mt-1 leading-relaxed'>
            {state === 'sign Up'
              ? 'Create your free account to book instant doctor appointments.'
              : 'Log in to manage your healthcare appointments and profile.'}
          </p>
        </div>

        {/* Inputs */}
        <div className='flex flex-col gap-4 text-xs font-semibold text-slate-700'>
          {/* Full Name Input (Sign Up Only) */}
          {state === 'sign Up' && (
            <div className='flex flex-col gap-1.5'>
              <label className='uppercase tracking-wider text-[11px] text-slate-500'>
                Full Name
              </label>
              <div className='flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 bg-slate-50/50 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200'>
                <span className='text-slate-400 mr-2 text-sm'>👤</span>
                <input
                  className='w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-sm font-normal'
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
            <div className='flex flex-col gap-1.5'>
              <label className='uppercase tracking-wider text-[11px] text-slate-500'>
                Phone Number
              </label>
              <div className='flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 bg-slate-50/50 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200'>
                <span className='text-slate-400 mr-2 text-sm'>📱</span>
                <input
                  className='w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-sm font-normal'
                  type='tel'
                  placeholder='Enter your phone number'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address Input */}
          <div className='flex flex-col gap-1.5'>
            <label className='uppercase tracking-wider text-[11px] text-slate-500'>
              Email Address
            </label>
            <div className='flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 bg-slate-50/50 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200'>
              <span className='text-slate-400 mr-2 text-sm'>✉️</span>
              <input
                className='w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-sm font-normal'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className='flex flex-col gap-1.5'>
            <div className='flex justify-between items-center'>
              <label className='uppercase tracking-wider text-[11px] text-slate-500'>
                Password
              </label>
              {state !== 'sign Up' && (
                <button
                  type='button'
                  className='text-[11px] font-semibold text-primary hover:underline cursor-pointer'
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className='flex items-center border border-slate-200 rounded-2xl px-3.5 py-3 bg-slate-50/50 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200'>
              <span className='text-slate-400 mr-2 text-sm'>🔒</span>
              <input
                className='w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 text-sm font-normal'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='text-slate-400 hover:text-slate-600 focus:outline-none ml-2 cursor-pointer p-1 transition-colors'
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.046 10.046 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243m4.242 4.242L9.88 9.88"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className='w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200 cursor-pointer text-sm mt-2'
          type='submit'
        >
          {state === 'sign Up' ? 'Create Account' : 'Log In'}
        </button>

        {/* Bottom Toggle Note */}
        <div className='text-center pt-3 border-t border-slate-100 text-xs text-slate-500'>
          {state === 'sign Up' ? (
            <p>
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => setState('login')}
                className='text-primary font-bold hover:underline cursor-pointer ml-0.5'
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => setState('sign Up')}
                className='text-primary font-bold hover:underline cursor-pointer ml-0.5'
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

      </div>
    </form>
  )
}

export default Login
