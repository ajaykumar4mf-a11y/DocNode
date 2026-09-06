import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='py-6 md:px-4'>
      {/* Page Header */}
      <div className='text-center mb-12'>
        <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
          ABOUT <span className='text-primary'>US</span>
        </h1>
        <p className='text-slate-500 text-sm mt-2 max-w-md mx-auto'>
          Connecting patients with trusted medical professionals for a seamless healthcare experience.
        </p>
      </div>

      {/* Main Content Section */}
      <div className='flex flex-col md:flex-row items-center gap-12 mb-20'>
        {/* Image Frame */}
        <div className='w-full md:w-5/12 flex-shrink-0'>
          <div className='relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50 group'>
            <img
              className='w-full h-auto max-h-[680px] object-contain transition-transform duration-500 group-hover:scale-[1.02]'
              src={assets.about_image}
              alt="About DocNode Healthcare"
            />
          </div>
        </div>

        {/* Story & Vision */}
        <div className='w-full md:w-7/12 flex flex-col gap-5 text-sm text-slate-600 leading-relaxed'>
          <p className='text-base text-slate-700 font-medium leading-relaxed'>
            Welcome to DocNode, your trusted partner in managing healthcare needs conveniently and efficiently. We understand the challenges individuals face when scheduling doctor appointments and managing their health records.
          </p>
          <p>
            DocNode is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating reliable advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, DocNode supports you every step of the way.
          </p>

          <div className='bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-2'>
            <h3 className='text-slate-900 text-base font-bold mb-2'>Our Vision</h3>
            <p className='text-slate-600 text-sm leading-relaxed'>
              Our vision at DocNode is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access quality medical care when you need it most.
            </p>
          </div>
        </div>
      </div>

      {/* Key Highlights Bar */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 py-8 px-6 bg-indigo-50/50 border border-indigo-100/60 rounded-3xl mb-20 text-center'>
        <div>
          <p className='text-2xl sm:text-3xl font-extrabold text-primary'>100+</p>
          <p className='text-xs font-semibold text-slate-600 mt-1'>Verified Doctors</p>
        </div>
        <div>
          <p className='text-2xl sm:text-3xl font-extrabold text-primary'>15+</p>
          <p className='text-xs font-semibold text-slate-600 mt-1'>Medical Specialties</p>
        </div>
        <div>
          <p className='text-2xl sm:text-3xl font-extrabold text-primary'>50k+</p>
          <p className='text-xs font-semibold text-slate-600 mt-1'>Happy Patients</p>
        </div>
        <div>
          <p className='text-2xl sm:text-3xl font-extrabold text-primary'>99.8%</p>
          <p className='text-xs font-semibold text-slate-600 mt-1'>Satisfaction Rate</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-center mb-10'>
        <h2 className='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight'>
          WHY <span className='text-primary'>CHOOSE US</span>
        </h2>
        <p className='text-slate-500 text-xs sm:text-sm mt-1'>
          Built around patient comfort, accessibility, and trust.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-16'>
        <div className='bg-white rounded-2xl border border-slate-100 p-8 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer'>
          <div className='w-10 h-10 rounded-xl bg-indigo-50 text-primary font-bold flex items-center justify-center text-sm mb-1 group-hover:bg-primary group-hover:text-white transition-colors'>
            01
          </div>
          <h3 className='text-slate-900 font-bold text-base tracking-wide group-hover:text-primary transition-colors'>
            EFFICIENCY
          </h3>
          <p className='text-slate-500 text-sm leading-relaxed'>
            Streamlined appointment scheduling that fits seamlessly into your busy lifestyle.
          </p>
        </div>

        <div className='bg-white rounded-2xl border border-slate-100 p-8 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer'>
          <div className='w-10 h-10 rounded-xl bg-indigo-50 text-primary font-bold flex items-center justify-center text-sm mb-1 group-hover:bg-primary group-hover:text-white transition-colors'>
            02
          </div>
          <h3 className='text-slate-900 font-bold text-base tracking-wide group-hover:text-primary transition-colors'>
            CONVENIENCE
          </h3>
          <p className='text-slate-500 text-sm leading-relaxed'>
            Direct access to a network of trusted healthcare professionals in your area.
          </p>
        </div>

        <div className='bg-white rounded-2xl border border-slate-100 p-8 flex flex-col gap-3 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer'>
          <div className='w-10 h-10 rounded-xl bg-indigo-50 text-primary font-bold flex items-center justify-center text-sm mb-1 group-hover:bg-primary group-hover:text-white transition-colors'>
            03
          </div>
          <h3 className='text-slate-900 font-bold text-base tracking-wide group-hover:text-primary transition-colors'>
            PERSONALIZATION
          </h3>
          <p className='text-slate-500 text-sm leading-relaxed'>
            Tailored recommendations and reminders to help you stay on top of your health.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
