import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Rajesh Sharma',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Rajesh Sharma has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '100ft Road, Indiranagar',
            line2: 'Bengaluru, Karnataka'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Emily Larson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Christopher Lee',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Christopher Lee specializes in modern skin treatments, aesthetic medicine, and clinical dermatology with personalized care plans.',
        fees: 30,
        address: {
            line1: '5th Avenue, Suite 400',
            line2: 'New York, NY'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Sophia Reynolds',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Sophia Reynolds provides empathetic and expert pediatric care, ensuring children grow healthy and strong.',
        fees: 40,
        address: {
            line1: 'Harley Street Medical',
            line2: 'London, UK'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Jennifer Garcia specializes in brain health, nerve disorders, and comprehensive neurological evaluations.',
        fees: 50,
        address: {
            line1: 'Beacon Street Care',
            line2: 'Boston, MA'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Victoria Sterling',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Victoria Sterling focuses on advanced neurological therapies, cognitive wellbeing, and patient rehabilitation.',
        fees: 50,
        address: {
            line1: 'Collins Street Plaza',
            line2: 'Melbourne, Australia'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Ananya Iyer',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Ananya Iyer is dedicated to holistic primary care and lifestyle health management.',
        fees: 50,
        address: {
            line1: 'Anna Salai, T. Nagar',
            line2: 'Chennai, Tamil Nadu'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Vikramaditya Verma',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Vikramaditya Verma offers comprehensive reproductive health services and compassionate care.',
        fees: 60,
        address: {
            line1: 'Connaught Place, Block C',
            line2: 'New Delhi'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Andrew Williams',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Andrew Williams provides advanced skin health therapies, acne management, and cosmetic dermatology.',
        fees: 30,
        address: {
            line1: 'Michigan Avenue Health',
            line2: 'Chicago, IL'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Jeffrey King is passionate about child wellness, vaccinations, and developmental care.',
        fees: 40,
        address: {
            line1: 'Rodeo Drive Plaza',
            line2: 'Los Angeles, CA'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Patrick Harris',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Patrick Harris leads neurology research and clinical care for complex nerve conditions.',
        fees: 50,
        address: {
            line1: 'Oxford Street Medical',
            line2: 'London, UK'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Gabriel Mercer',
        image: doc12,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Gabriel Mercer provides specialized care for digestive health, liver conditions, and nutrition.',
        fees: 50,
        address: {
            line1: 'Fifth Avenue Care',
            line2: 'New York, NY'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Siddharth Mukherjee',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Siddharth Mukherjee emphasizes patient-centered preventative health and routine wellness care.',
        fees: 50,
        address: {
            line1: 'Park Street, Chowringhee',
            line2: 'Kolkata, West Bengal'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Kavita Reddy',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Kavita Reddy delivers personalized gynecological and obstetric health guidance.',
        fees: 60,
        address: {
            line1: 'Banjara Hills Road No. 12',
            line2: 'Hyderabad, Telangana'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Arjun Malhotra',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Arjun Malhotra provides comprehensive skin diagnostics and modern therapeutic care.',
        fees: 30,
        address: {
            line1: 'Sector 17-C, City Center',
            line2: 'Chandigarh'
        }
    },
]