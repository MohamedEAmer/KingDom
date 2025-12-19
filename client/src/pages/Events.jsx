import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyEvents } from '../../public/assets' // adjust path if needed

const Events = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-24 px-6 md:px-16 lg:px-32 py-12">
      <h1 className="text-2xl font-bold mb-8 text-white">Game Events & News</h1>
      
      <div className="space-y-10">
        {dummyEvents.map((event, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row justify-between items-center gap-6 bg-black/60 p-6 rounded-xl border border-gray-500/30 shadow-md"
          >
            {/* Text Column */}
            <div className="flex-1 text-left">
              <h2 className="text-xl font-semibold text-white mb-2">{event.name}</h2>
              <p className="text-gray-300 text-sm">{event.description}</p>
              <button 
                onClick={() => navigate(`/events/${event.id}`)} 
                className='mt-4 group flex items-center gap-2 text-gray-300 cursor-pointer'
              >
                View More
                <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' /> 
              </button>
            </div>
            

            {/* Image Column */}
            <div className="w-full md:w-64 h-40 shrink-0">
              <img
                src={event.image} // Adjust path if needed
                alt={event.name}
                className="w-full object-cover rounded-lg"
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Events
