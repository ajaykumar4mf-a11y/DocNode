import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const DoctorsList = () => {
    const { doctors, aToken, getAllDoctors, changeAvailability, currency } = useContext(AdminContext)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSpeciality, setSelectedSpeciality] = useState('All')
    const navigate = useNavigate()

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    const specialities = ['All', ...new Set((doctors || []).map(doc => doc.speciality).filter(Boolean))]

    const filteredDoctors = (doctors || []).filter(doc => {
        const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              doc.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSpeciality = selectedSpeciality === 'All' || doc.speciality === selectedSpeciality
        return matchesSearch && matchesSpeciality
    })

    return (
        <div className='space-y-6'>
            {/* Header & Filter Controls */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80'>
                <div>
                    <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>Medical Staff Roster</h1>
                    <p className='text-sm text-slate-500 mt-0.5'>
                        Manage doctor profiles, availability statuses, and consultation fees ({doctors?.length || 0} total)
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                    {/* Search input */}
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search by name or specialty...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full sm:w-64 pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 placeholder:text-slate-400 shadow-xs'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer'
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Specialty Filter Dropdown */}
                    {specialities.length > 2 && (
                        <select
                            value={selectedSpeciality}
                            onChange={(e) => setSelectedSpeciality(e.target.value)}
                            className='px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700 cursor-pointer shadow-xs'
                        >
                            {specialities.map((spec, i) => (
                                <option key={i} value={spec}>
                                    {spec === 'All' ? 'All Specialties' : spec}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Add Doctor Quick Action */}
                    <button
                        onClick={() => navigate('/add-doctor')}
                        className='inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer active:scale-95'
                    >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                        </svg>
                        <span>Add Doctor</span>
                    </button>
                </div>
            </div>

            {/* Doctors Cards Grid */}
            {filteredDoctors && filteredDoctors.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {filteredDoctors.map((item, index) => {
                        const isAvailable = item.available !== false
                        return (
                            <div
                                key={item._id || index}
                                className='bg-white border border-slate-200/80 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group'
                            >
                                {/* Top Image Area */}
                                <div>
                                    <div className='w-full h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center'>
                                        <img
                                            className='w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-500'
                                            src={item.image || assets.upload_area}
                                            alt={item.name}
                                            onError={(e) => { e.currentTarget.src = assets.upload_area }}
                                        />
                                        
                                        {/* Fee Badge */}
                                        <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-xs border border-white/60'>
                                            {currency || '$'}{item.fees}
                                        </div>

                                        {/* Speciality Badge */}
                                        <div className='absolute bottom-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-md'>
                                            {item.speciality}
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className='p-4 space-y-2'>
                                        <h3 className='text-slate-900 font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-1' title={item.name}>
                                            {item.name}
                                        </h3>

                                        <div className='flex items-center gap-2 text-xs text-slate-500'>
                                            <span className='bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium truncate max-w-[130px]'>
                                                {item.degree || 'Medical Staff'}
                                            </span>
                                            <span>•</span>
                                            <span className='truncate'>{item.experience || '1 Year Exp'}</span>
                                        </div>

                                        {item.about && (
                                            <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1'>
                                                {item.about}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Availability Toggle Bar */}
                                <div className='px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        <span className={`text-xs font-medium ${isAvailable ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                                            {isAvailable ? 'Available for Booking' : 'Currently Unavailable'}
                                        </span>
                                    </div>

                                    {/* Custom Toggle Switch */}
                                    <button
                                        type='button'
                                        role='switch'
                                        aria-checked={isAvailable}
                                        onClick={() => changeAvailability(item._id)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                            isAvailable ? 'bg-primary' : 'bg-slate-300'
                                        }`}
                                    >
                                        <span
                                            aria-hidden='true'
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                isAvailable ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className='bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3'>
                    <div className='w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center'>
                        <img className='w-7 h-7' src={assets.doctor_icon} alt="Doctor" />
                    </div>
                    <h3 className='text-base font-bold text-slate-800'>No doctors found</h3>
                    <p className='text-xs text-slate-500 max-w-sm'>
                        {searchTerm || selectedSpeciality !== 'All'
                            ? 'No doctor matches your filter criteria. Try clearing search filters.'
                            : 'No doctors are registered in the system yet. You can add doctors using the button below.'}
                    </p>
                    {searchTerm || selectedSpeciality !== 'All' ? (
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedSpeciality('All') }}
                            className='mt-2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer'
                        >
                            Reset Filters
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/add-doctor')}
                            className='mt-2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer'
                        >
                            Register Doctor
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default DoctorsList