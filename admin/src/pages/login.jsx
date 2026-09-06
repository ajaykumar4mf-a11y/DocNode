import { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext.jsx'

const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        const formEl = event.target

        try {
            setLoading(true)
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })

                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                    toast.success('Signed in successfully')
                } else {
                    toast.error(data.message)
                }
            }
            else {
                const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    toast.success('Signed in successfully')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='relative w-full max-w-md mx-auto my-auto'>
            {/* Subtle background glow */}
            <div className='absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10' />

            {/* Logo and Intro */}
            <div className='text-center mb-6'>
                <img
                    className='h-10 w-auto mx-auto object-contain'
                    src={assets.admin_logo}
                    alt="DocNode Admin Logo"
                />
                <p className='text-xs text-slate-500 mt-2 font-normal'>
                    Hospital administration & clinical staff portal
                </p>
            </div>

            <form
                id="admin-login-form"
                name="login"
                method="post"
                action="#"
                autoComplete="on"
                onSubmit={onSubmitHandler}
                className='bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/5 p-6 sm:p-8 space-y-5 relative z-10 transition-all duration-300'
            >
                <div className='space-y-4'>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="admin-email" className='block text-xs font-semibold text-slate-700 mb-1.5'>
                            Email Address
                        </label>
                        <div className='group flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200'>
                            <svg className='w-4 h-4 text-slate-400 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                            </svg>
                            <input
                                id="admin-email"
                                name="username"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                autoComplete='username'
                                className='w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-normal'
                                type="email"
                                placeholder={state === 'Admin' ? 'admin@docnode.com' : 'doctor@docnode.com'}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="admin-password" className='block text-xs font-semibold text-slate-700 mb-1.5'>
                            Password
                        </label>
                        <div className='group flex items-center border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/60 focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 transition-all duration-200'>
                            <svg className='w-4 h-4 text-slate-400 group-focus-within:text-primary mr-2.5 shrink-0 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                            </svg>
                            <input
                                id="admin-password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                autoComplete='current-password'
                                className='w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-normal'
                                type={showPassword ? "text" : "password"}
                                placeholder='••••••••'
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

                {/* Submit Button */}
                <button
                    type='submit'
                    disabled={loading}
                    className='w-full bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:opacity-95 text-white py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2'
                >
                    {loading ? (
                        <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <span>Sign In as {state === 'Admin' ? 'Administrator' : 'Doctor'}</span>
                    )}
                </button>

                {/* Bottom Alternate Switcher */}
                <div className='text-center pt-2 border-t border-slate-100 text-xs text-slate-500'>
                    {state === 'Admin' ? (
                        <p>
                            Need doctor account access?{' '}
                            <button
                                type='button'
                                onClick={() => setState('Doctor')}
                                className='text-primary font-bold hover:text-blue-700 hover:underline cursor-pointer ml-1'
                            >
                                Doctor sign in
                            </button>
                        </p>
                    ) : (
                        <p>
                            Hospital administrator?{' '}
                            <button
                                type='button'
                                onClick={() => setState('Admin')}
                                className='text-primary font-bold hover:text-blue-700 hover:underline cursor-pointer ml-1'
                            >
                                Admin sign in
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Login