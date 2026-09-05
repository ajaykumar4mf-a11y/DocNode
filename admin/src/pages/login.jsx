import { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext.jsx' 
import { assets } from '../assets/assets'
import axios from 'axios'   
import { toast } from 'react-toastify'

const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { setAToken, backendUrl } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

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
            } else {
                toast.info('Doctor portal authentication will be enabled soon.')
            }
        } catch (error) {
            toast.error(error.message)
            console.error(error)  
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full max-w-md mx-auto my-auto'>
            {/* Logo and Intro */}
            <div className='text-center mb-8'>
                <img 
                    className='h-9 w-auto mx-auto object-contain' 
                    src={assets.admin_logo} 
                    alt="DocNode Admin Logo" 
                />
                <p className='text-xs text-slate-500 mt-2'>
                    Hospital administration & clinical staff portal
                </p>
            </div>

            <form 
                onSubmit={onSubmitHandler} 
                className='bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6'
            >
                {/* Role Switcher Tabs */}
                <div className='flex p-1 bg-slate-100 rounded-xl'>
                    <button
                        type='button'
                        onClick={() => setState('Admin')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            state === 'Admin'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Administrator
                    </button>
                    <button
                        type='button'
                        onClick={() => setState('Doctor')}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            state === 'Doctor'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Doctor Portal
                    </button>
                </div>

                <div className='space-y-4'>
                    <div>
                        <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                            Email Address
                        </label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                            type="email" 
                            placeholder='admin@docnode.com' 
                            required 
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                            Password
                        </label>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                            type="password" 
                            placeholder='••••••••' 
                            required 
                        />
                    </div>
                </div>

                <button 
                    type='submit' 
                    disabled={loading}
                    className='w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2'
                >
                    {loading ? (
                        <>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <span>Sign In to {state}</span>
                    )}
                </button>

                <div className='text-center pt-2'>
                    {state === 'Admin' ? (
                        <p className='text-xs text-slate-500'>
                            Need doctor account access?{' '}
                            <button 
                                type='button'
                                onClick={() => setState('Doctor')}
                                className='text-primary font-semibold hover:underline cursor-pointer'
                            >
                                Doctor sign in
                            </button>
                        </p>
                    ) : (
                        <p className='text-xs text-slate-500'>
                            Hospital administrator?{' '}
                            <button 
                                type='button'
                                onClick={() => setState('Admin')}
                                className='text-primary font-semibold hover:underline cursor-pointer'
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