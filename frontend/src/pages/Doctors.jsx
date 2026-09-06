import { useContext, useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol } = useContext(AppContext)

  const [filterDoc, setFilterDoc] = useState([])
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recommended')
  const [specialityDropdownOpen, setSpecialityDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const specialityDropdownRef = useRef(null)
  const sortDropdownRef = useRef(null)

  const specialitiesList = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'fee-low', label: 'Fee: Low to High' },
    { value: 'fee-high', label: 'Fee: High to Low' },
    { value: 'experience', label: 'Experience: Most' }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specialityDropdownRef.current && !specialityDropdownRef.current.contains(event.target)) {
        setSpecialityDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyFilterAndSort = () => {
    let list = doctors || []

    if (speciality) {
      list = list.filter(doc => doc.speciality?.toLowerCase() === speciality.toLowerCase())
    }

    if (onlyAvailable) {
      list = list.filter(doc => doc.available !== false)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(doc =>
        doc.name?.toLowerCase().includes(q) ||
        doc.speciality?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'fee-low') {
      list = [...list].sort((a, b) => Number(a.fees) - Number(b.fees))
    } else if (sortBy === 'fee-high') {
      list = [...list].sort((a, b) => Number(b.fees) - Number(a.fees))
    } else if (sortBy === 'experience') {
      list = [...list].sort((a, b) => (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0))
    } else {
      // Default recommended: available doctors first
      list = [...list].sort((a, b) => (b.available !== false ? 1 : 0) - (a.available !== false ? 1 : 0))
    }

    setFilterDoc(list)
  }

  useEffect(() => {
    applyFilterAndSort()
  }, [doctors, speciality, onlyAvailable, searchQuery, sortBy])

  const totalAvailableCount = useMemo(() => {
    return (doctors || []).filter(d => d.available !== false).length
  }, [doctors])

  const handleSelectSpeciality = (selected) => {
    setSpecialityDropdownOpen(false)
    if (!selected || selected === 'all') {
      navigate('/doctors')
    } else {
      navigate(`/doctors/${selected}`)
    }
  }

  return (
    <div className='py-4'>
      {/* Top Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
            {speciality ? `${speciality} Specialists` : 'All Medical Specialists'}
          </h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            Showing {filterDoc.length} verified {filterDoc.length === 1 ? 'specialist' : 'specialists'}
          </p>
        </div>

        {/* Available Only Quick Pill Toggle */}
        <div
          role='switch'
          aria-checked={onlyAvailable}
          tabIndex={0}
          onClick={() => setOnlyAvailable(prev => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOnlyAvailable(prev => !prev)
            }
          }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs select-none ${onlyAvailable
              ? 'bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/15'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
        >
          <div className='flex items-center gap-2'>
            <span className={`w-2 h-2 rounded-full ${onlyAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`}></span>
            <span className='text-xs font-semibold'>Available Only</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${onlyAvailable ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
              {totalAvailableCount}
            </span>
          </div>

          {/* Toggle Switch */}
          <div
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${onlyAvailable ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${onlyAvailable ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
          </div>
        </div>
      </div>

      {/* Modern Horizontal Filter Bar */}
      <div className='bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3'>

        {/* Search Input */}
        <div className='relative flex-1'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search doctor by name or specialty...'
            className='w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10'
          />
          <svg
            className='w-4 h-4 text-slate-400 absolute left-3 top-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer'
            >
              ✕
            </button>
          )}
        </div>

        {/* Speciality Dropdown Menu */}
        <div className='relative' ref={specialityDropdownRef}>
          <button
            type='button'
            onClick={() => {
              setSpecialityDropdownOpen(prev => !prev)
              setSortDropdownOpen(false)
            }}
            className={`w-full md:w-auto min-w-[210px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
              speciality
                ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className='flex items-center gap-2 truncate'>
              <span className={speciality ? 'text-slate-300 font-normal' : 'text-slate-400 font-normal'}>Speciality:</span>
              <span className='truncate'>{speciality || 'All Specialities'}</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                specialityDropdownOpen ? 'rotate-180' : ''
              } ${speciality ? 'text-white' : 'text-slate-400'}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
            </svg>
          </button>

          {/* Speciality Dropdown Options Panel */}
          {specialityDropdownOpen && (
            <div className='absolute left-0 mt-2 w-full md:w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-1'>
              <div className='px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100'>
                Select Medical Speciality
              </div>

              <button
                type='button'
                onClick={() => handleSelectSpeciality('all')}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                  !speciality ? 'font-bold text-slate-950 bg-slate-100/70' : 'text-slate-700'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <span>All Specialities</span>
                  <span className='text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500'>
                    {doctors.length}
                  </span>
                </div>
                {!speciality && (
                  <span className='text-[11px] px-2 py-0.5 rounded-full bg-slate-950 text-white font-medium'>
                    Active
                  </span>
                )}
              </button>

              {specialitiesList.map((spec, i) => {
                const count = doctors.filter(d => d.speciality?.toLowerCase() === spec.toLowerCase()).length
                const isSelected = speciality?.toLowerCase() === spec.toLowerCase()
                return (
                  <button
                    key={i}
                    type='button'
                    onClick={() => handleSelectSpeciality(spec)}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'font-bold text-slate-950 bg-slate-100/70' : 'text-slate-700'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span>{spec}</span>
                      <span className='text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500'>
                        {count}
                      </span>
                    </div>
                    {isSelected && (
                      <span className='text-[11px] px-2 py-0.5 rounded-full bg-slate-950 text-white font-medium'>
                        Active
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Sort Dropdown Menu */}
        <div className='relative' ref={sortDropdownRef}>
          <button
            type='button'
            onClick={() => {
              setSortDropdownOpen(prev => !prev)
              setSpecialityDropdownOpen(false)
            }}
            className={`w-full md:w-auto min-w-[210px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
              sortBy !== 'recommended'
                ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className='flex items-center gap-2 truncate'>
              <span className={sortBy !== 'recommended' ? 'text-slate-300 font-normal' : 'text-slate-400 font-normal'}>Sort:</span>
              <span className='truncate'>{sortOptions.find(o => o.value === sortBy)?.label || 'Recommended'}</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                sortDropdownOpen ? 'rotate-180' : ''
              } ${sortBy !== 'recommended' ? 'text-white' : 'text-slate-400'}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
            </svg>
          </button>

          {/* Sort Dropdown Options Panel */}
          {sortDropdownOpen && (
            <div className='absolute right-0 mt-2 w-full md:w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-1'>
              <div className='px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100'>
                Select Sort Criteria
              </div>

              {sortOptions.map((opt, i) => {
                const isSelected = sortBy === opt.value
                return (
                  <button
                    key={i}
                    type='button'
                    onClick={() => {
                      setSortBy(opt.value)
                      setSortDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'font-bold text-slate-950 bg-slate-100/70' : 'text-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className='text-[11px] px-2 py-0.5 rounded-full bg-slate-950 text-white font-medium'>
                        Active
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Active Filters Pills (if any) */}
      {(speciality || onlyAvailable || searchQuery || sortBy !== 'recommended') && (
        <div className='flex items-center gap-2 flex-wrap mb-6 text-xs'>
          <span className='text-slate-400 font-medium'>Active filters:</span>

          {speciality && (
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white font-medium'>
              <span>{speciality}</span>
              <button
                type='button'
                onClick={() => navigate('/doctors')}
                className='text-slate-400 hover:text-white cursor-pointer ml-1'
                title='Remove speciality filter'
              >
                ✕
              </button>
            </span>
          )}

          {onlyAvailable && (
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white font-medium'>
              <span>Available Only</span>
              <button
                type='button'
                onClick={() => setOnlyAvailable(false)}
                className='text-slate-400 hover:text-white cursor-pointer ml-1'
                title='Remove availability filter'
              >
                ✕
              </button>
            </span>
          )}

          {sortBy !== 'recommended' && (
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white font-medium'>
              <span>{sortOptions.find(o => o.value === sortBy)?.label || sortBy}</span>
              <button
                type='button'
                onClick={() => setSortBy('recommended')}
                className='text-slate-400 hover:text-white cursor-pointer ml-1'
                title='Reset sort to Recommended'
              >
                ✕
              </button>
            </span>
          )}

          {searchQuery && (
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 font-medium'>
              <span>"{searchQuery}"</span>
              <button
                type='button'
                onClick={() => setSearchQuery('')}
                className='text-slate-500 hover:text-slate-800 cursor-pointer ml-1'
                title='Clear search'
              >
                ✕
              </button>
            </span>
          )}

          <button
            type='button'
            onClick={() => {
              navigate('/doctors')
              setOnlyAvailable(false)
              setSearchQuery('')
              setSortBy('recommended')
            }}
            className='text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer ml-2'
          >
            Clear all
          </button>
        </div>
      )}

      {/* Doctors Grid */}
      {filterDoc.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filterDoc.map((item, index) => {
            const isAvailable = item.available !== false
            return (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${item._id}`)
                  scrollTo(0, 0)
                }}
                className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 flex flex-col group ${isAvailable
                    ? 'bg-white border-slate-200/80 shadow-sm hover:border-slate-400 hover:shadow-xl hover:-translate-y-1.5'
                    : 'bg-slate-100/80 border-slate-200/90 shadow-none hover:bg-slate-100/95'
                  }`}
              >
                {/* Doctor Image */}
                <div className={`w-full h-56 overflow-hidden relative ${isAvailable ? 'bg-indigo-50/40' : 'bg-slate-200/80'}`}>
                  <img
                    className={`w-full h-full object-cover object-top transition-transform duration-500 ${isAvailable ? 'group-hover:scale-105' : 'filter grayscale-[30%] opacity-80'
                      }`}
                    src={item.image}
                    alt={item.name}
                  />

                  {/* Top Right Fee Pill */}
                  <span className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs border ${isAvailable ? 'bg-white/95 text-slate-800 border-white/60' : 'bg-slate-100/90 text-slate-600 border-slate-300/60'
                    }`}>
                    {currencySymbol || '$'}{item.fees}
                  </span>

                  {/* Top Left Availability Pill */}
                  <div className='absolute top-3 left-3'>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${isAvailable
                          ? 'bg-white/95 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-900/90 text-white border-slate-700'
                        }`}
                    >
                      <span className='relative flex h-2 w-2'>
                        {isAvailable && (
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      </span>
                      <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className={`p-5 flex-1 flex flex-col justify-between ${!isAvailable ? 'bg-slate-100/50' : ''}`}>
                  <div>
                    <p className='text-xs font-semibold text-primary uppercase tracking-wide mb-1'>
                      {item.speciality}
                    </p>
                    <h3 className={`text-base font-bold transition-colors line-clamp-1 ${isAvailable ? 'text-slate-900 group-hover:text-primary' : 'text-slate-700'}`}>
                      {item.name}
                    </h3>
                    <p className='text-slate-500 text-xs font-medium mt-0.5'>
                      {item.degree || 'Certified Specialist'}
                    </p>
                  </div>

                  <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium'>
                    <span className='text-slate-400'>{item.experience || '4+ Yrs'}</span>
                    <span className={isAvailable ? 'text-slate-900 font-semibold group-hover:translate-x-0.5 transition-transform' : 'bg-slate-200/80 text-slate-600 font-medium px-2 py-0.5 rounded-md text-[11px]'}>
                      {isAvailable ? 'Book Visit →' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-xs'>
          <div className='w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center'>
            <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <h3 className='text-base font-bold text-slate-800'>No specialists match your criteria</h3>
          <button
            type='button'
            onClick={() => {
              navigate('/doctors')
              setOnlyAvailable(false)
              setSearchQuery('')
            }}
            className='px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer mt-2'
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default Doctors
