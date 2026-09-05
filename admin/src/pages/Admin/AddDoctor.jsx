import { useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [loading, setLoading] = useState(false)

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error('Please select a doctor profile image')
            }

            setLoading(true)

            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {
                headers: {
                    Authorization: aToken,
                    atoken: aToken
                }
            })

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setFees('')
                setAbout('')
                setDegree('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-4xl mx-auto space-y-6'>
            {/* Header */}
            <div className='pb-4 border-b border-slate-200/80'>
                <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Register New Doctor</h1>
                <p className='text-sm text-slate-500 mt-0.5'>
                    Add a verified medical practitioner to the DocNode hospital roster.
                </p>
            </div>

            <form onSubmit={onSubmitHandler} className='bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8 space-y-8'>
                
                {/* Photo Upload Zone */}
                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3'>
                        Doctor Portrait <span className='text-rose-500'>*</span>
                    </label>
                    <div className='flex items-center gap-5'>
                        <label 
                            htmlFor="doc-img"
                            className='relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50 hover:bg-indigo-50/30 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group'
                        >
                            {docImg ? (
                                <img 
                                    className='w-full h-full object-cover' 
                                    src={URL.createObjectURL(docImg)} 
                                    alt="Selected preview" 
                                />
                            ) : (
                                <div className='flex flex-col items-center gap-1.5 p-2 text-center text-slate-400 group-hover:text-primary'>
                                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <span className='text-[11px] font-medium'>Upload</span>
                                </div>
                            )}
                        </label>
                        <input 
                            onChange={(e) => setDocImg(e.target.files[0])} 
                            type="file" 
                            id="doc-img" 
                            accept="image/*"
                            hidden 
                        />
                        <div className='text-xs text-slate-500 space-y-1'>
                            <p className='font-medium text-slate-700'>
                                {docImg ? docImg.name : 'Choose a clean, professional headshot'}
                            </p>
                            <p className='text-[11px] text-slate-400'>
                                Supported formats: JPEG, PNG, WEBP (Max 5MB)
                            </p>
                            {docImg && (
                                <button
                                    type='button'
                                    onClick={() => setDocImg(false)}
                                    className='text-[11px] text-rose-600 hover:underline cursor-pointer'
                                >
                                    Remove photo
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Fields Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Left Column: Account & Basic Info */}
                    <div className='space-y-4'>
                        <h2 className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Personal & Account Info</h2>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Full Name <span className='text-rose-500'>*</span>
                            </label>
                            <input 
                                onChange={(e) => setName(e.target.value)} 
                                value={name} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                                type="text" 
                                placeholder="Dr. Sarah Jenkins" 
                                required 
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Professional Email <span className='text-rose-500'>*</span>
                            </label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                                type="email" 
                                placeholder="doctor@hospital.org" 
                                required 
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Account Password <span className='text-rose-500'>*</span>
                            </label>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                                type="password" 
                                placeholder="Set secure password" 
                                required 
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Clinical Experience <span className='text-rose-500'>*</span>
                            </label>
                            <select 
                                onChange={(e) => setExperience(e.target.value)} 
                                value={experience} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 cursor-pointer'
                            >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="6 Years">6 Years</option>
                                <option value="7 Years">7 Years</option>
                                <option value="8 Years">8 Years</option>
                                <option value="9 Years">9 Years</option>
                                <option value="10+ Years">10+ Years</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column: Medical Practice & Credentials */}
                    <div className='space-y-4'>
                        <h2 className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Specialization & Practice</h2>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Medical Speciality <span className='text-rose-500'>*</span>
                            </label>
                            <select 
                                onChange={(e) => setSpeciality(e.target.value)} 
                                value={speciality} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 cursor-pointer'
                            >
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Degree / Education <span className='text-rose-500'>*</span>
                            </label>
                            <input 
                                onChange={(e) => setDegree(e.target.value)} 
                                value={degree} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                                type="text" 
                                placeholder="MBBS, MD - Internal Medicine" 
                                required 
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Consultation Fee ($) <span className='text-rose-500'>*</span>
                            </label>
                            <input 
                                onChange={(e) => setFees(e.target.value)} 
                                value={fees} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                                type="number" 
                                placeholder="50" 
                                min="1"
                                required 
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 mb-1.5'>
                                Clinic Address <span className='text-rose-500'>*</span>
                            </label>
                            <input 
                                onChange={(e) => setAddress1(e.target.value)} 
                                value={address1} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                                type="text" 
                                placeholder="Street Address Line 1" 
                                required 
                            />
                            <input 
                                onChange={(e) => setAddress2(e.target.value)} 
                                value={address2} 
                                className='w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400 mt-2' 
                                type="text" 
                                placeholder="Suite / Floor (Optional)" 
                            />
                        </div>
                    </div>
                </div>

                {/* About Doctor Textarea */}
                <div>
                    <label className='block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5'>
                        Biography & Experience Details <span className='text-rose-500'>*</span>
                    </label>
                    <textarea 
                        onChange={(e) => setAbout(e.target.value)} 
                        value={about} 
                        className='w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400' 
                        placeholder='Write a concise professional summary highlighting the doctor clinical interests, certifications, and hospital affiliations.' 
                        rows={4} 
                        required 
                    />
                </div>

                {/* Submit Action */}
                <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                    <button 
                        type='submit' 
                        disabled={loading}
                        className='inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95'
                    >
                        {loading ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                <span>Registering Doctor...</span>
                            </>
                        ) : (
                            <span>Add Doctor to Roster</span>
                        )}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default AddDoctor