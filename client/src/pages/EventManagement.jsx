import React, { useEffect, useState,useContext , useRef } from 'react';
import { Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import {useNavigate } from 'react-router-dom';
import { dummyEvents } from '../../public/assets'; // Adjust path if needed
import { UserContext } from '../context/userContext'

const EventManagement = () => {
  const [events, setEvents] = useState(dummyEvents);
  const [openIndex, setOpenIndex] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [details, setDetails] = useState([]);
  const dialogRef = useRef(null);

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token || currentUser.role !== "Owner"){
      showToast("You Can Not Reach This Page", "warning");
      navigate('/')
    }
  }, [])

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  const handleToggle = (index) => {
    setOpenIndex(prev => prev === index ? null : index);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };
  
  const handleDeleteDetail = (eventIndex, detailIndex) => {
    const confirmed = window.confirm("Are you sure you want to delete this event detail?");
    if (!confirmed) return;
  
    setEvents(prevEvents => {
      const newEvents = [...prevEvents];
      const newDetails = [...newEvents[eventIndex].info.details];
      newDetails.splice(detailIndex, 1);
      newEvents[eventIndex].info.details = newDetails;
      return newEvents;
    });
  };


  const addDetail = () => {
    setDetails([...details, { img: null, text: '' }]);
  };

  const removeDetail = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const handleDetailImageChange = (index, file) => {
    const newDetails = [...details];
    newDetails[index].img = file;
    setDetails(newDetails);
  };

  const handleDetailTextChange = (index, text) => {
    const newDetails = [...details];
    newDetails[index].text = text;
    setDetails(newDetails);
  };

  const handleSubmit = () => {
    const event = {
      id: Date.now(), // or use uuid()
      image: mainImage,
      name,
      description,
      info: {
        details: details.map(d => ({
          img: d.img,
          text: d.text
        }))
      }
    };
    console.log("Created Event:", event);
    // Save it to state or backend...
    closeModal();
  };


  return (
    <div className="p-6 border border-gray-600 rounded-xl max-w-3xl mx-auto mt-20">
      <h1 className="text-2xl text-white font-bold mb-6">Manage Game Events</h1>

      {/* Add Event Button */}
      <button
        className="mb-6 px-4 py-2 flex items-center gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        onClick={() => openDialog()}
      >
        <Plus size={18} />
        Add New Event
      </button>

      {/* Event List */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="bg-black/70 border border-gray-600 rounded-xl shadow-md p-4 text-white"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleToggle(index)}
            >
              <h2 className="text-lg font-semibold">{event.name}</h2>
              {openIndex === index ? <ChevronUp /> : <ChevronDown />}
            </div>

            {/* Collapsible Info */}
            {openIndex === index && (
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>ID:</strong> {event.id}</p>
                <p><strong>Event Main Image:</strong> {event.image}</p>
                <img
                  src={`../../public/${event.image}`}
                  alt={event.name}
                  className="w-full max-w-xs h-32 object-cover rounded-md border border-gray-700 hover:scale-150 transition-all duration-300"
                />
                {/* Event Details Section */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-300 font-medium">Event Details:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.info.details.map((detail, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-600"
                      >
                        <img
                          src={`../../public/${detail.img}`}
                          alt={`Detail ${i + 1}`}
                          className="w-16 h-16 object-cover rounded-md border border-gray-700 hover:scale-300 transition-all duration-300"
                        />
                        <p className="text-sm text-gray-300">{detail.text}</p>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteDetail(index, i)}
                          className="flex items-center gap-2 mt-4 text-sm text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex items-center gap-2 mt-4 text-sm text-red-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                  Delete Event
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new event dialog */}
      <dialog ref={dialogRef} className="rounded-lg overflow-hidden">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-xl shadow-xl border border-gray-700 relative z-50">
            <h2 className="text-xl font-bold mb-4 text-center">Create New Event</h2>

            {/* Event Name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Event Name"
              type="text"
              className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Event Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              rows={3}
              className="w-full p-2 mb-3 border border-gray-600 bg-gray-800 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            {/* Main Image Upload */}
            <label className="block text-sm font-medium text-gray-300 mb-1">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="w-full p-2 mb-4 border border-gray-600 bg-gray-800 rounded file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded hover:file:bg-blue-700"
            />

            {/* Dynamic Info Details */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Event Info Details</h3>
              {details.map((detail, index) => (
                <div key={index} className="mb-3 border border-gray-700 p-3 rounded-lg bg-gray-800">
                  <label className="block text-sm text-gray-400 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleDetailImageChange(index, e.target.files[0])}
                    className="w-full mb-2 file:bg-gray-600 file:text-white file:px-3 file:py-1 file:rounded hover:file:bg-gray-500"
                  />

                  <label className="block text-sm text-gray-400 mb-1">Text</label>
                  <input
                    type="text"
                    value={detail.text}
                    onChange={(e) => handleDetailTextChange(index, e.target.value)}
                    placeholder="Detail text"
                    className="w-full p-2 border border-gray-600 bg-gray-700 rounded placeholder-gray-400"
                  />

                  <button
                    onClick={() => removeDetail(index)}
                    className="mt-2 text-sm text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={addDetail}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
              >
                + Add Detail
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </dialog>


    </div>
  );
};

export default EventManagement;
