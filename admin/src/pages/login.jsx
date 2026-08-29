import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext.jsx' 
import axios from 'axios'   
import { toast } from 'react-toastify'

const Login = () => {

    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {setAToken, backendUrl} = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try{
            if(state === 'Admin'){

                const {data} = await axios.post(backendUrl + '/api/admin/login', {email, password})

                if(data.success){
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                    toast.success('Login Successful')
                }else{
                    toast.error(data.message)
                }
            }else{
                
            }
        }
        catch(error){
            toast.error(error.message)
            console.log(error)  
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center p-4'>
            <div className='flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-200 rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-primary'>{state}</span> Login
                </p>
                <div className='w-full'>
                    <p className='font-medium text-zinc-700'>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        className='border border-zinc-300 rounded w-full p-2.5 mt-1 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-sm' 
                        type="email" 
                        placeholder='Enter email' 
                        required 
                    />
                </div>
                <div className='w-full'>
                    <p className='font-medium text-zinc-700'>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        className='border border-zinc-300 rounded w-full p-2.5 mt-1 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-sm' 
                        type="password" 
                        placeholder='Enter password' 
                        required 
                    />
                </div>
                <button type='submit' className='bg-primary text-white w-full py-2.5 rounded-md text-base font-medium cursor-pointer hover:bg-primary/90 transition-colors shadow-sm'>
                    Login
                </button>
                {
                    state === 'Admin' 
                        ? <p className='text-xs text-zinc-500'>Doctor Login? <span className='text-primary underline cursor-pointer font-medium' onClick={() => setState('Doctor')}>Click here</span></p>
                        : <p className='text-xs text-zinc-500'>Admin Login? <span className='text-primary underline cursor-pointer font-medium' onClick={() => setState('Admin')}>Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login