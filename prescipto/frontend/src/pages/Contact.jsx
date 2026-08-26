import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='py-6 md:px-4'>
      {/* Page Header */}
      <div className='text-center mb-12'>
        <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>
          CONTACT <span className='text-primary'>US</span>
        </h1>
        <p className='text-slate-500 text-sm mt-2 max-w-md mx-auto'>
          Have questions or need assistance? Reach out to our team or explore career opportunities at DocNode.
        </p>
      </div>

      {/* Contact Section */}
      <div className='my-10 flex flex-col md:flex-row items-center justify-center gap-12 mb-20'>
        {/* Contact Image */}
        <div className='w-full md:w-5/12 flex-shrink-0'>
          <div className='relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 group'>
            <img 
              className='w-full h-[400px] md:h-[480px] object-cover transition-transform duration-500 group-hover:scale-105' 
              src={assets.contact_image} 
              alt="DocNode Headquarters Office" 
            />
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className='w-full md:w-6/12 flex flex-col gap-6 text-slate-600'>
          {/* Office Info Card */}
          <div className='bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col gap-4'>
            <h2 className='font-bold text-lg text-slate-900 tracking-wide'>OUR OFFICE</h2>
            <div className='text-sm text-slate-600 space-y-2 leading-relaxed'>
              <p className='font-medium text-slate-800'>DocNode Headquarters</p>
              <p>548 Market Street, Suite 300<br />San Francisco, CA 94104, USA</p>
            </div>
            
            <div className='text-sm text-slate-600 space-y-1.5 pt-2 border-t border-slate-200/60'>
              <p><span className='font-semibold text-slate-800'>Phone:</span> +1 (800) 555-0199</p>
              <p><span className='font-semibold text-slate-800'>Email:</span> <a href="mailto:contact@docnode.com" className='text-primary hover:underline font-medium'>contact@docnode.com</a></p>
            </div>
          </div>

          {/* Careers Card */}
          <div className='bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 shadow-sm'>
            <h2 className='font-bold text-lg text-slate-900 tracking-wide'>CAREERS AT DOCNODE</h2>
            <p className='text-sm text-slate-600 leading-relaxed'>
              We are constantly growing and looking for passionate healthcare and tech talent to join our mission. Learn more about our teams and current openings.
            </p>
            <button className='w-fit border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3.5 text-sm font-semibold rounded-full shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95 transition-all duration-300 cursor-pointer mt-1'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
