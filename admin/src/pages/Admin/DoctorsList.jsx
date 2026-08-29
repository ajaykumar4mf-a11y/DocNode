import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const DoctorsList = () => {

    const { doctors, aToken, getAllDoctors, changeAvailability, currency } = useContext(AdminContext)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSpeciality, setSelectedSpeciality] = useState('All')

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    const specialities = ['All', ...new Set(doctors.map(doc => doc.speciality).filter(Boolean))]

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              doc.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSpeciality = selectedSpeciality === 'All' || doc.speciality === selectedSpeciality
        return matchesSearch && matchesSpeciality
    })

    return (
        <div className='space-y-6 max-h-[88vh] overflow-y-auto pr-1 pb-10'>
            
            {/* Header & Controls */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200'>
                <div>
                    <h1 className='text-xl font-bold text-zinc-800'>All Doctors</h1>
                    <p className='text-xs text-zinc-500 mt-0.5'>
                        Manage medical staff profiles, availability, and consultation rates ({doctors.length} total)
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
                            className='w-full sm:w-64 pl-3.5 pr-8 py-2 text-xs bg-white border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-zinc-700 placeholder:text-zinc-400'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className='absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600'
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Specialty Filter */}
                    {specialities.length > 2 && (
                        <select
                            value={selectedSpeciality}
                            onChange={(e) => setSelectedSpeciality(e.target.value)}
                            className='px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-zinc-700 cursor-pointer'
                        >
                            {specialities.map((spec, i) => (
                                <option key={i} value={spec}>
                                    {spec === 'All' ? 'All Specialties' : spec}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Doctors Grid - Equal Width & Height Cards */}
            {filteredDoctors && filteredDoctors.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
                    {filteredDoctors.map((item, index) => (
                        <div
                            key={item._id || index}
                            className='w-full bg-white border border-zinc-200 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between'
                        >
                            {/* Top Card Area: Image + Badges */}
                            <div>
                                <div className='w-full h-52 bg-indigo-50 group-hover:bg-primary relative overflow-hidden flex items-center justify-center flex-shrink-0 transition-all duration-500'>
                                    <img
                                        className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                                        src={item.image || assets.upload_area}
                                        alt={item.name}
                                        onError={(e) => { e.currentTarget.src = assets.upload_area }}
                                    />
                                    {/* Fee Pill */}
                                    <div className='absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-zinc-700 shadow-xs border border-zinc-100'>
                                        {currency || '$'}{item.fees}
                                    </div>
                                </div>

                                {/* Doctor Information */}
                                <div className='p-4'>
                                    <h3 className='text-zinc-900 font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1' title={item.name}>
                                        {item.name}
                                    </h3>
                                    <p className='text-primary text-xs font-medium mt-1 truncate'>
                                        {item.speciality}
                                    </p>

                                    <div className='mt-3 flex items-center gap-2 text-[11px] text-zinc-500'>
                                        <span className='bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-medium truncate max-w-[120px]'>
                                            {item.degree || 'Medical Staff'}
                                        </span>
                                        <span>•</span>
                                        <span className='truncate'>{item.experience || '1 Year Exp'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Card Area: Availability Toggle */}
                            <div className='px-4 py-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between'>
                                <label className='flex items-center gap-2 cursor-pointer select-none'>
                                    <input
                                        type='checkbox'
                                        checked={item.available !== false}
                                        onChange={() => changeAvailability(item._id)}
                                        className='w-4 h-4 rounded text-primary border-zinc-300 focus:ring-primary accent-primary cursor-pointer'
                                    />
                                    <span className={`text-xs font-medium ${item.available !== false ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                        {item.available !== false ? 'Available' : 'Unavailable'}
                                    </span>
                                </label>

                                <span className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='bg-white border border-zinc-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3'>
                    <div className='w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center'>
                        <img className='w-7 h-7' src={assets.doctor_icon} alt="Doctor Icon" />
                    </div>
                    <h3 className='text-base font-bold text-zinc-800'>No doctors found</h3>
                    <p className='text-xs text-zinc-500 max-w-sm'>
                        {searchTerm || selectedSpeciality !== 'All'
                            ? 'No doctor matches your filter criteria. Try clearing search filters.'
                            : 'No doctors are registered in the system yet. You can add doctors from the Add Doctor tab.'}
                    </p>
                    {(searchTerm || selectedSpeciality !== 'All') && (
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedSpeciality('All') }}
                            className='mt-2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer'
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            )}

        </div>
    )
}

export default DoctorsList