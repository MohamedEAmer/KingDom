import { PlayCircleIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {dummyGamePics} from '../../public/assets'

const AboutGameSection = () => {
    const navigate = useNavigate()
    const [currentPic , setCurrentPic] = useState(dummyGamePics[0])
    return (
        <div className='bg-black/60 border border-gray-600 rounded-2xl px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
          <p className='text-gray-300 font-medium text-2xl max-w-[960px] mx-auto'>
            Game News & Events
          </p>
      
          <div className='relative mt-6 flex justify-center cursor-pointer'>
            <img onClick={()=>{navigate('/events');
            scrollTo(0, 0);}}
              src={`../${currentPic.image}`}
              alt="News preview"
              className="w-full max-w-[960px]  object-contain rounded-xl shadow-md"
            />
          </div>
          <h2 className="my-8 text-4xl font-bold text-center text-blue-400">
            {currentPic.title}
          </h2>
      
          <div
            className="grid gap-4 md:gap-6 mt-8 max-w-5xl mx-auto px-2 sm:px-0
            [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]"
          >
            {dummyGamePics.map((Pic, index) => (
              <div
                key={index}
                className="relative group hover:-translate-y-1 transition duration-300 cursor-pointer rounded-lg overflow-hidden"
                onClick={() => setCurrentPic(Pic)}
              >
                <img
                  src={Pic.image}
                  alt="trailer"
                  className="w-full h-full object-cover brightness-75"
                />
              </div>
            ))}
          </div>
        </div>
      );
      
}

export default AboutGameSection
