import React, { useState,useEffect,useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'
import { useToast } from "../context/ToastContext";
import axios from "axios";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()

  useEffect(()=>{
    if(!token){
      showToast("You need to login", "warning");
      navigate('/')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      showToast("Please fill in all fields", "error");
      return;
    }
    showToast("The Support System is not working yet", "warning");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    return;
    setLoading(true);
    try {
      // Example POST request (adjust endpoint as needed)
      const response = await axios.post("http://localhost:3000/support/ticket", {
        name,
        email,
        subject,
        message,
      });
      showToast(response.data.message || "Ticket sent successfully!", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send ticket", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
          Support / Submit a Ticket
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dull transition"
            }`}
          >
            {loading ? "Sending..." : "Send Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
