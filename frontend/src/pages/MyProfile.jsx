import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
  const navigate = useNavigate()
  const { userData, setUserData, token, backendUrl, getProfileData, slotDateFormat } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [backupUserData, setBackupUserData] = useState(null)

  const handleStartEdit = () => {
    // Keep a snapshot so the user can cancel without persisting dirty edits
    setBackupUserData(JSON.parse(JSON.stringify(userData)))
    setIsEdit(true)
  }

  const handleCancelEdit = () => {
    if (backupUserData) {
      setUserData(backupUserData)
    }
    setImage(false)
    setIsEdit(false)
  }

  const updateUserProfileData = async () => {
    // Quick validation for required backend fields
    if (!userData.name?.trim()) {
      toast.error('Please enter your name')
      return
    }
    const cleanPhone = String(userData.phone || '').replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', cleanPhone)
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }))
      formData.append('gender', userData.gender && userData.gender !== 'Not Selected' ? userData.gender : 'Not Selected')
      formData.append('dob', userData.dob || 'Not Selected')

      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: {
          token: token,
          Authorization: token
        }
      })

      if (data.success) {
        toast.success(data.message || 'Profile updated successfully')
        await getProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className='min-h-[55vh] flex flex-col items-center justify-center gap-4 text-center px-4'>
        <div className='w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
          <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
          </svg>
        </div>
        <p className='text-xl font-semibold text-slate-800'>Log in to view your profile</p>
        <p className='text-sm text-slate-500 max-w-sm'>
          Access your appointment history, manage your contact details, and view your healthcare records.
        </p>
        <button
          onClick={() => navigate('/login')}
          className='bg-primary text-white font-medium px-7 py-2.5 rounded-full hover:bg-primary/90 transition-all cursor-pointer shadow-sm hover:shadow'
        >
          Go to Login
        </button>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className='min-h-[55vh] flex flex-col items-center justify-center gap-3'>
        <div className='w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin'></div>
        <p className='text-xs font-medium text-slate-400'>Loading profile details...</p>
      </div>
    )
  }

  const avatarSrc = image
    ? URL.createObjectURL(image)
    : userData.image && userData.image !== '/public/default-avatar.jpg'
      ? userData.image
      : assets.profile_pic

  return (
    <div className='max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-4'>
      {/* Page Header Bar */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>Patient Profile</h1>
          <p className='text-sm text-slate-500 mt-1'>
            Manage your personal identity, contact details, and account preferences.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {isEdit ? (
            <>
              <button
                type='button'
                onClick={handleCancelEdit}
                disabled={loading}
                className='px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={updateUserProfileData}
                disabled={loading}
                className='px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 hover:shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-60 flex items-center gap-2'
              >
                {loading ? (
                  <>
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type='button'
              onClick={handleStartEdit}
              className='px-6 py-2.5 rounded-full border border-primary text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95 flex items-center gap-2'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
              </svg>
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* Left Column: Profile Card */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center text-center'>

            {/* Avatar with edit overlay */}
            <div className='relative mb-4'>
              {isEdit ? (
                <label htmlFor='profile-image-upload' className='relative block cursor-pointer group'>
                  <img
                    className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-primary/20 group-hover:brightness-90 transition-all'
                    src={avatarSrc}
                    alt='Profile Avatar'
                  />
                  <div className='absolute inset-0 rounded-full bg-slate-900/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity'>
                    <svg className='w-6 h-6 mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    <span className='text-[10px] font-medium tracking-wide uppercase'>Upload</span>
                  </div>
                  <input
                    id='profile-image-upload'
                    type='file'
                    accept='image/*'
                    onChange={(e) => setImage(e.target.files[0])}
                    className='hidden'
                  />
                </label>
              ) : (
                <div className='relative'>
                  <img
                    className='w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-slate-100'
                    src={avatarSrc}
                    alt='Profile Avatar'
                  />
                </div>
              )}
            </div>

            {isEdit ? (
              <div className='w-full mb-2'>
                <label className='block text-xs font-semibold text-slate-500 mb-1 text-left'>Full Name</label>
                <input
                  type='text'
                  value={userData.name || ''}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className='w-full text-center text-base font-semibold text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
                  placeholder='Your full name'
                />
              </div>
            ) : (
              <h2 className='text-xl font-bold text-slate-900 tracking-tight'>
                {userData.name}
              </h2>
            )}

            <p className='text-sm text-slate-500 font-medium break-all mt-0.5'>{userData.email}</p>

            <div className='mt-4 pt-4 border-t border-slate-100 w-full flex flex-col gap-2.5 text-left text-xs'>
              <div className='flex items-center justify-between text-slate-500'>
                <span>Account Role</span>
                <span className='font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md'>Patient</span>
              </div>
              <div className='flex items-center justify-between text-slate-500'>
                <span>Patient ID</span>
                <span className='font-mono font-medium text-slate-700'>
                  {userData._id ? `#${userData._id.slice(-6).toUpperCase()}` : '---'}
                </span>
              </div>
              <div className='flex items-center justify-between text-slate-500'>
                <span>Status</span>
                <span className='inline-flex items-center gap-1.5 font-medium text-emerald-600'>
                  <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                  Verified
                </span>
              </div>
            </div>

            {/* Quick Link to Appointments */}
            <div className='mt-6 w-full'>
              <button
                type='button'
                onClick={() => navigate('/my-appointment')}
                className='w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer'
              >
                <svg className='w-4 h-4 text-slate-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                </svg>
                <span>View My Appointments</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Sections */}
        <div className='lg:col-span-2 flex flex-col gap-6'>

          {/* Section 1: Personal Details */}
          <div className='bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6'>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-5'>
              <div className='flex items-center gap-2.5'>
                <div className='w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
                <div>
                  <h3 className='text-sm font-bold text-slate-900 uppercase tracking-wide'>Personal Information</h3>
                  <p className='text-xs text-slate-400'>Basic demographic details</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              {/* Gender */}
              <div>
                <label className='block text-xs font-semibold text-slate-500 mb-1.5'>Gender</label>
                {isEdit ? (
                  <select
                    value={userData.gender || 'Not Selected'}
                    onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    className='w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
                  >
                    <option value="Not Selected">Not Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className='px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-800'>
                    {userData.gender || 'Not specified'}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className='block text-xs font-semibold text-slate-500 mb-1.5'>Date of Birth</label>
                {isEdit ? (
                  <input
                    type='date'
                    value={userData.dob || ''}
                    onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                    className='w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
                  />
                ) : (
                  <div className='px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-800 flex items-center justify-between'>
                    <span>{slotDateFormat(userData.dob) || 'Not specified'}</span>
                    <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className='bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6'>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-5'>
              <div className='flex items-center gap-2.5'>
                <div className='w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
                <div>
                  <h3 className='text-sm font-bold text-slate-900 uppercase tracking-wide'>Contact Information</h3>
                  <p className='text-xs text-slate-400'>Reachability and physical address</p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              {/* Email (Read-Only) */}
              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <label className='block text-xs font-semibold text-slate-500'>Email Address</label>
                  <span className='text-[11px] text-slate-400'>Primary Login</span>
                </div>
                <div className='px-3.5 py-2.5 bg-slate-50/80 rounded-xl border border-slate-100 text-sm font-medium text-slate-700 flex items-center justify-between'>
                  <span className='truncate'>{userData.email}</span>
                  <svg className='w-4 h-4 text-emerald-500 shrink-0 ml-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className='block text-xs font-semibold text-slate-500 mb-1.5'>Phone Number</label>
                {isEdit ? (
                  <div>
                    <input
                      type='tel'
                      maxLength={10}
                      value={userData.phone || ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setUserData(prev => ({ ...prev, phone: digits }))
                      }}
                      placeholder='10-digit mobile number'
                      className='w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
                    />
                    <p className={`text-[11px] mt-1 ${String(userData.phone || '').replace(/\D/g, '').length === 10 ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      {String(userData.phone || '').replace(/\D/g, '').length === 10 ? '✓ 10-digit number entered' : `Must be exactly 10 digits (${String(userData.phone || '').replace(/\D/g, '').length}/10)`}
                    </p>
                  </div>
                ) : (
                  <div className='px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-800 flex items-center justify-between'>
                    <span>{userData.phone || 'Not provided'}</span>
                    <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className='sm:col-span-2'>
                <label className='block text-xs font-semibold text-slate-500 mb-1.5'>Residential Address</label>
                {isEdit ? (
                  <div className='flex flex-col gap-2.5'>
                    <input
                      type='text'
                      placeholder='Street Address Line 1'
                      value={userData.address?.line1 || ''}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        address: { ...(prev.address || {}), line1: e.target.value }
                      }))}
                      className='w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
                    />
                    <input
                      type='text'
                      placeholder='Apartment, Suite, Unit, etc. (Line 2)'
                      value={userData.address?.line2 || ''}
                      onChange={(e) => setUserData(prev => ({
                        ...prev,
                        address: { ...(prev.address || {}), line2: e.target.value }
                      }))}
                      className='w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15'
                    />
                  </div>
                ) : (
                  <div className='px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-800 flex items-start gap-2.5'>
                    <svg className='w-4 h-4 text-slate-400 mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    <div>
                      {userData.address?.line1 || userData.address?.line2 ? (
                        <p className='font-medium leading-relaxed'>
                          {userData.address.line1}
                          {userData.address.line1 && userData.address.line2 ? ', ' : ''}
                          {userData.address.line2}
                        </p>
                      ) : (
                        <p className='text-slate-400 font-normal'>No address provided yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy & Security Note */}
          <div className='rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 flex items-center gap-3 text-xs text-slate-500'>
            <svg className='w-5 h-5 text-slate-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
            </svg>
            <p>
              Your personal and health profile data is securely stored and only accessible by you and authorized healthcare providers during your consultations.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default MyProfile
