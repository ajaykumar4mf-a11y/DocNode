import { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
  const navigate = useNavigate()
  const { userData, setUserData, token, backendUrl, getProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

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
        toast.success(data.message)
        await getProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  if (!token) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4'>
        <p className='text-xl font-semibold text-slate-800'>You need to log in to view your profile</p>
        <button
          onClick={() => navigate('/login')}
          className='bg-primary text-white font-medium px-8 py-2.5 rounded-full hover:bg-primary/90 transition-all cursor-pointer'
        >
          Go to Login
        </button>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='max-w-2xl my-6'>
      {/* Profile Card Container */}
      <div className='bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/60 flex flex-col gap-6'>

        {/* User Top Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100'>
          {isEdit ? (
            <label htmlFor="image" className='relative cursor-pointer group'>
              <img
                className='w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border-2 border-slate-100 shadow-md group-hover:opacity-75 transition-all'
                src={image ? URL.createObjectURL(image) : (userData.image && userData.image !== '/public/default-avatar.jpg' ? userData.image : assets.profile_pic)}
                alt="Profile Avatar"
              />
              <div className='absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                <img className='w-8 invert' src={assets.upload_icon} alt="Upload icon" />
              </div>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
            </label>
          ) : (
            <img
              className='w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover object-top border-2 border-slate-100 shadow-md flex-shrink-0'
              src={userData.image && userData.image !== '/public/default-avatar.jpg' ? userData.image : assets.profile_pic}
              alt="Profile Avatar"
            />
          )}

          <div className='flex-1 w-full'>
            {isEdit ? (
              <input
                className='bg-slate-50 border border-slate-200 text-2xl sm:text-3xl font-bold text-slate-900 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-primary'
                type="text"
                value={userData.name || ''}
                onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
                {userData.name}
              </h1>
            )}
            <p className='text-slate-500 text-sm font-medium mt-1'>{userData.email}</p>
          </div>
        </div>

        {/* Contact Information Section */}
        <div>
          <h2 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-4'>
            CONTACT INFORMATION
          </h2>
          <div className='bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-100 grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4 text-sm text-slate-700 items-center'>
            <p className='font-semibold text-slate-800'>Email:</p>
            <p className='text-primary font-medium'>{userData.email}</p>

            <p className='font-semibold text-slate-800'>Phone:</p>
            {isEdit ? (
              <input
                className='bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-primary'
                type="text"
                value={userData.phone || ''}
                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p className='font-medium text-slate-700'>{userData.phone}</p>
            )}

            <p className='font-semibold text-slate-800 self-start sm:self-center'>Address:</p>
            {isEdit ? (
              <div className='flex flex-col gap-2'>
                <input
                  className='bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-primary'
                  type="text"
                  placeholder='Address Line 1'
                  value={userData.address?.line1 || ''}
                  onChange={e => setUserData(prev => ({
                    ...prev,
                    address: { ...(prev.address || {}), line1: e.target.value }
                  }))}
                />
                <input
                  className='bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-primary'
                  type="text"
                  placeholder='Address Line 2'
                  value={userData.address?.line2 || ''}
                  onChange={e => setUserData(prev => ({
                    ...prev,
                    address: { ...(prev.address || {}), line2: e.target.value }
                  }))}
                />
              </div>
            ) : (
              <p className='text-slate-700 leading-relaxed'>
                {userData.address?.line1 ? `${userData.address.line1}, ` : ''}{userData.address?.line2 || ''}
              </p>
            )}
          </div>
        </div>

        {/* Basic Information Section */}
        <div>
          <h2 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-4'>
            BASIC INFORMATION
          </h2>
          <div className='bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-100 grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4 text-sm text-slate-700 items-center'>
            <p className='font-semibold text-slate-800'>Gender:</p>
            {isEdit ? (
              <select
                className='bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-primary w-fit'
                value={userData.gender || 'Not Selected'}
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className='font-medium text-slate-700'>{userData.gender}</p>
            )}

            <p className='font-semibold text-slate-800'>Date of Birth:</p>
            {isEdit ? (
              <input
                className='bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-primary w-fit'
                type="date"
                value={userData.dob || ''}
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
              />
            ) : (
              <p className='font-medium text-slate-700'>{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Actions Button */}
        <div className='pt-2'>
          {isEdit ? (
            <button
              className='bg-primary hover:bg-primary/90 text-white font-semibold px-9 py-3 rounded-full shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95'
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : (
            <button
              className='border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-9 py-3 rounded-full shadow-sm transition-all duration-200 cursor-pointer active:scale-95'
              onClick={() => setIsEdit(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default MyProfile
