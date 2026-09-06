import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorProfile = () => {
    const { dToken, profileData, getProfileData, updateProfile } = useContext(DoctorContext)
    const { currency } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form state for editable fields
    const [formData, setFormData] = useState({
        fees: '',
        about: '',
        available: true,
        address: {
            line1: '',
            line2: ''
        }
    })

    // Parse address safely
    const parseAddress = (addr) => {
        if (!addr) return { line1: '', line2: '' }
        if (typeof addr === 'string') {
            try {
                return JSON.parse(addr)
            } catch {
                return { line1: addr, line2: '' }
            }
        }
        return {
            line1: addr.line1 || '',
            line2: addr.line2 || ''
        }
    }

    // Sync form data when profileData updates
    useEffect(() => {
        if (profileData) {
            setFormData({
                fees: profileData.fees !== undefined ? profileData.fees : '',
                about: profileData.about || '',
                available: profileData.available !== undefined ? Boolean(profileData.available) : true,
                address: parseAddress(profileData.address)
            })
        }
    }, [profileData])

    // Fetch profile data on mount or token change
    useEffect(() => {
        if (dToken && getProfileData) {
            getProfileData()
        }
    }, [dToken])

    const handleCancel = () => {
        if (profileData) {
            setFormData({
                fees: profileData.fees !== undefined ? profileData.fees : '',
                about: profileData.about || '',
                available: profileData.available !== undefined ? Boolean(profileData.available) : true,
                address: parseAddress(profileData.address)
            })
        }
        setIsEdit(false)
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const payload = {
                fees: Number(formData.fees),
                about: formData.about,
                available: Boolean(formData.available),
                address: formData.address
            }
            const success = await updateProfile(payload)
            if (success) {
                setIsEdit(false)
            }
        } finally {
            setSaving(false)
        }
    }

    const handleAvailabilityToggle = async () => {
        const nextState = !formData.available
        setFormData(prev => ({ ...prev, available: nextState }))
        if (!isEdit) {
            await updateProfile({ available: nextState })
        }
    }

    if (!profileData) {
        return (
            <div className='min-h-[55vh] flex flex-col items-center justify-center gap-3 text-slate-500'>
                <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                <p className='text-sm font-medium'>Loading profile details...</p>
            </div>
        )
    }

    return (
        <div className='profile-container w-full max-w-4xl mx-auto'>
            <div className='bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden'>
                {/* Modern Restyled Top Banner */}
                <div className='h-36 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 relative overflow-hidden'>
                    {/* Subtle dot-grid texture & ambient lighting */}
                    <div className='absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]'></div>
                    <div className='absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none'></div>
                    <div className='absolute -bottom-12 -left-12 w-64 h-64 bg-sky-300/15 rounded-full blur-2xl pointer-events-none'></div>
                    <div className='absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none'></div>
                </div>

                <div className='px-6 sm:px-8 pb-8'>
                    {/* Profile Avatar & Top Action Bar */}
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6 gap-4'>
                        {/* Avatar with z-20 ensuring it is crisp, elevated, and never covered */}
                        <div className='relative z-20 w-32 h-32 sm:w-36 sm:h-36 border-4 border-white rounded-full shadow-lg overflow-hidden bg-white flex-shrink-0 ring-1 ring-slate-200/50'>
                            <img
                                src={profileData.image || assets.upload_area}
                                alt={profileData.name}
                                className='w-full h-full object-cover object-top'
                                onError={(e) => {
                                    e.currentTarget.src = assets.upload_area
                                }}
                            />
                        </div>

                        {/* Top Actions: Availability Switch & Edit/Save Buttons */}
                        <div className='flex items-center gap-3 self-end sm:self-auto mb-1'>
                            <div className='flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-xs'>
                                <label className='relative inline-flex items-center cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={formData.available}
                                        onChange={handleAvailabilityToggle}
                                        className='sr-only peer'
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                <span className={`text-xs font-semibold ${formData.available ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {formData.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            {!isEdit ? (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className='inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors cursor-pointer shadow-xs'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                                    </svg>
                                    Edit Profile
                                </button>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className='px-3.5 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className='inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-xs cursor-pointer disabled:opacity-50'
                                    >
                                        {saving ? (
                                            <>
                                                <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Doctor Identity Header */}
                    <div className='mb-6'>
                        <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
                            {profileData.name || 'Doctor'}
                        </h1>
                        <div className='flex flex-wrap items-center gap-2 mt-2'>
                            <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20'>
                                {profileData.speciality || 'General physician'}
                            </span>
                            {profileData.degree && (
                                <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700'>
                                    {profileData.degree}
                                </span>
                            )}
                            {profileData.experience && (
                                <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700'>
                                    {profileData.experience} Experience
                                </span>
                            )}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className='mb-6 pb-6 border-b border-slate-100'>
                        <p className='text-slate-400 uppercase text-[11px] font-bold tracking-wider mb-2'>
                            About Practitioner
                        </p>
                        {isEdit ? (
                            <textarea
                                value={formData.about}
                                onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                                rows={4}
                                placeholder='Write a brief biography about your clinical background, specialties, and experience...'
                                className='w-full text-sm text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors'
                            />
                        ) : (
                            <p className='text-slate-600 text-sm leading-relaxed max-w-3xl'>
                                {formData.about || profileData.about || 'No biographical introduction added yet. Click "Edit Profile" to add your introduction and practice background.'}
                            </p>
                        )}
                    </div>

                    {/* Contact & Clinic Information Cards Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm'>
                        {/* Contact & Fees Card */}
                        <div className='bg-slate-50 rounded-xl p-5 border border-slate-200/60 space-y-3.5'>
                            <p className='text-slate-500 uppercase text-[10px] font-bold tracking-wider'>
                                Contact & Charges
                            </p>
                            <div className='space-y-3'>
                                <div className='flex items-center gap-3'>
                                    <svg className='w-4 h-4 text-slate-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                    <span className='text-slate-800 font-medium select-all'>{profileData.email}</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <svg className='w-4 h-4 text-slate-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                    {isEdit ? (
                                        <div className='flex items-center gap-2 flex-1'>
                                            <span className='text-slate-500 font-semibold'>{currency || '$'}</span>
                                            <input
                                                type='number'
                                                min='0'
                                                value={formData.fees}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                                                placeholder='50'
                                                className='w-28 px-2.5 py-1 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary'
                                            />
                                            <span className='text-xs text-slate-400'>/ consultation</span>
                                        </div>
                                    ) : (
                                        <span className='text-slate-800 font-medium'>
                                            {currency || '$'}{formData.fees !== '' ? formData.fees : (profileData.fees || 0)} <span className='text-slate-400 text-xs font-normal'>/ consultation</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Clinic Location Card */}
                        <div className='bg-slate-50 rounded-xl p-5 border border-slate-200/60 space-y-3.5'>
                            <p className='text-slate-500 uppercase text-[10px] font-bold tracking-wider'>
                                Clinic Location
                            </p>
                            {isEdit ? (
                                <div className='space-y-2'>
                                    <input
                                        type='text'
                                        value={formData.address.line1}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            address: { ...prev.address, line1: e.target.value }
                                        }))}
                                        placeholder='Address Line 1 (Street/Building)'
                                        className='w-full text-xs text-slate-900 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary'
                                    />
                                    <input
                                        type='text'
                                        value={formData.address.line2}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            address: { ...prev.address, line2: e.target.value }
                                        }))}
                                        placeholder='Address Line 2 (City/Postal Code)'
                                        className='w-full text-xs text-slate-900 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary'
                                    />
                                </div>
                            ) : (
                                <div className='flex items-start gap-3'>
                                    <svg className='w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                    </svg>
                                    <div className='text-slate-800 font-medium leading-snug'>
                                        {formData.address.line1 || formData.address.line2 ? (
                                            <>
                                                {formData.address.line1 && <p>{formData.address.line1}</p>}
                                                {formData.address.line2 && <p className='text-slate-500 font-normal text-xs mt-0.5'>{formData.address.line2}</p>}
                                            </>
                                        ) : (
                                            <span className='text-slate-400 italic font-normal'>No address specified</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile