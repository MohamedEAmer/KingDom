import React from 'react'
import { useEffect , useState} from 'react';
import { useParams } from 'react-router-dom';
import { dummyEvents } from '../../public/assets';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState('');
  
  const getEvent = async () => {
    const foundEvent = dummyEvents.find(event => event.id ===Number(id)); // the id in the mongo can be '0' not number
    setEvent(foundEvent);
  };

  useEffect(() => {
      getEvent();
  }, [id]);

  const [selectedPart, setSelectedPart] = useState(null);
  useEffect(() => {
    if (event?.info?.details?.length > 0) {
      setSelectedPart(event.info.details[0]);
    }
  }, [event]);



  return event ? (
    <div className="my-24 w-full px-4 py-12 flex flex-col items-center text-white">
      {/* Main Image */}
      <img
        src={`../${event.image}`}
        alt={event.name}
        className="w-full my-8 max-w-3xl rounded-xl shadow-lg object-cover"
      />

      {/* Event Name */}
      <h2 className="my-8 text-4xl font-bold text-center text-blue-400">
        {event.name}
      </h2>

      {/* Description */}
      <p className="my-4 max-w-2xl text-center text-gray-200 text-lg">
        {event.description}
      </p>

      {/* Image Gallery */}
      {selectedPart && (
        <>
          <img
            src={`../${selectedPart.img}`}
            alt="Selected Preview"
            className="w-full max-w-xl my-8 border border-gray-600 rounded-xl shadow-xl object-cover mb-6"
          />
          <p className="my-4 max-w-2xl text-center text-gray-400 text-lg">
            {selectedPart.text.ar}
          </p>
          <p className="my-4 max-w-2xl text-center text-gray-400 text-lg">
            {selectedPart.text.en}
          </p>
        </>
      )}
      <div className="mt-10 w-full flex flex-wrap justify-center gap-4 px-4">
        {event.info?.details?.map((entry, idx) => (
          <img
            key={idx}
            src={`../${entry.img}`}
            alt={`event-img-${idx}`}
            onClick={() => setSelectedPart(entry)}
            className={`w-40 h-24 object-cover rounded-md shadow-md transition duration-300 cursor-pointer ${
              selectedPart?.img === entry.img ? 'ring-4 ring-green-400 scale-105' : 'hover:scale-105'
            }`}
          />
        ))}
      </div>
    </div>
  ) : (
    <div>
      Loading ... !
    </div>
  )
}

export default EventDetails
