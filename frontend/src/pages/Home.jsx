import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import HowItWorks from '../components/HowItWorks'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div className='pb-6'>
      <Header />
      <SpecialityMenu />
      <HowItWorks />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home
