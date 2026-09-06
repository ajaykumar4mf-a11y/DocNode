const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Find Your Specialist',
      desc: 'Filter licensed doctors by speciality, experience, consultation fee, and real-time availability.',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
        </svg>
      )
    },
    {
      step: '02',
      title: 'Select a Live Slot',
      desc: 'Pick a convenient date and time from the doctor’s open schedule with instant confirmation.',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
        </svg>
      )
    },
    {
      step: '03',
      title: 'Receive Quality Care',
      desc: 'Visit your doctor, receive professional medical guidance, and manage your appointment history online.',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.8' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
        </svg>
      )
    }
  ]

  return (
    <section className='py-12 sm:py-16 my-4 border-y border-slate-100 bg-slate-50/50 -mx-4 sm:-mx-[10%] px-6 sm:px-[10%]'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-col items-center text-center mb-10'>
          <span className='px-3.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wide uppercase mb-3'>
            How It Works
          </span>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight'>
            Seamless Healthcare in 3 Simple Steps
          </h2>
          <p className='text-sm sm:text-base text-slate-500 max-w-lg mt-2'>
            We designed our appointment experience to be transparent, quick, and stress-free.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
          {steps.map((item, idx) => (
            <div
              key={idx}
              className='relative bg-white rounded-2xl p-7 border border-slate-200/70 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group'
            >
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <div className='w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300'>
                    {item.icon}
                  </div>
                  <span className='text-2xl font-bold text-slate-200 font-mono'>
                    {item.step}
                  </span>
                </div>
                <h3 className='text-lg font-bold text-slate-900 mb-2'>
                  {item.title}
                </h3>
                <p className='text-sm text-slate-500 leading-relaxed'>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
