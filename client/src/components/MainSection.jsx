import { ArrowRight, CalendarIcon, ClockIcon, GamepadIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const MainSection = () => {
    const navigate = useNavigate()
  return (

    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("../public/BG3.png")] bg-cover bg-center h-screen'>
        <img src='../GameName.png' alt="" className="w-36 h-36  mt-20"/>
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-120'>Kingdom Of Secrets Game</h1>
        <div className='flex items-center gap-4 text-gray-300'>
            <span>Challenge | Adventure | Domination</span>
            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/> 2025 | 2026
            </div>
            <div className='flex items-center gap-1'>
                <GamepadIcon className='w-4.5 h-4.5'/> Online
            </div>
        </div>
        <p className="max-w-md text-gray-300">In a world torn by chaos and ancient magic, Two powerful factions vie for control over a shattered realm. Players must choose their allegiance and dive into perilous dungeons, uncovering hidden secrets and gathering rare treasures. Engage in massive faction wars to conquer cities and dominate the world, forging your legacy in a land where only the strongest survive.</p>
        <button onClick={()=>navigate('/gamedetails')} className='group flex items-center gap-1 px-6 py-3 text-sm bg-blue-500 hover:bg-blue-600 transition rounded-full font-medium cursor-pointer'>
            Download
            <ArrowRight className=" group-hover:translate-x-1 transition-transformw-5 h-5"/>
        </button>
    </div>
  )
}

export default MainSection
