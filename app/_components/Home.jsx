import FlightSlider from '@/components/FlightSlider';
import Slider from '@/components/slider';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';


export default function Home() {
  const { data: session, status } = useSession();

    const getUserData = async (email) => {
    try {
      const response = await fetch(`/api/get-data?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      getUserData(session.user.email);
    }
  }, [status, session]);

  const bookTicket = async (ticketData) => {
    const response = await fetch('/api/book-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    const result = await response.json();
    return result;
  };

  const travelOptions = {
    Flight: ['From', 'To', 'Date', 'Time', 'Passengers'],
    Train: ['From', 'To', 'Date', 'Time', 'Class'],
    Bus: ['From', 'To', 'Date', 'Time', 'Seats'],
    Hotel: ['Location', 'Check-in', 'Check-out', 'Guests'],
  };

  const sellOptions = {
    'Travel Ticket': ['From', 'To', 'Date', 'Time', 'Ticket Price'],
    'Movie Ticket': ['Location', 'Movie Name', 'Show Date', 'Show Time', 'Ticket Price'],
    'Show Ticket': ['Location', 'Show Name', 'Show Date', 'Show Time', 'Ticket Price'],
  };

  const [currentOpenTravelOption, setCurrentOpenTravelOption] = useState(null);
  const [currentOpenSellOption, setCurrentOpenSellOption] = useState(null);

  const renderFormFields = (fields) =>
    fields.map((field, index) => (
      <input
        key={index}
        placeholder={field}
        className="p-2 border border-gray-300 rounded mb-2"
      />
    ));

  return (
    <div className="w-full">
      <section id="hero" className="text-center py-16 bg-gray-100">
        <h1 className="text-4xl font-bold">Book Your Next Experience</h1>
        <p className="mt-4">Travel, Movies, and Live Shows — All in One Place</p>
      </section>

      <section id="travel" className="py-16 bg-blue-50 align-center flex flex-row">
        <Slider />
        <h2 className="text-3xl font-bold text-center mb-8">Travel Booking</h2>
        <h3 className="text-3xl font-bold text-center mb-8"></h3>
        <div className="flex justify-center flex-wrap space-x-4">
            <button className="bg-blue-700 text-white px-6 py-3 rounded mb-4">Book Now</button>
        </div>
      
      </section>

      <section id="sell" className="py-16 bg-blue-50">
        <h2 className="text-3xl font-bold text-center mb-8">Sell Tickets</h2>
        <div className="flex justify-center flex-wrap space-x-4">
          {Object.keys(sellOptions).map((option) => (
            <button
              key={option}
              onClick={() => setCurrentOpenSellOption(currentOpenSellOption === option ? null : option)}
              className="bg-blue-700 text-white px-6 py-3 rounded mb-4"
            >
              {option}
            </button>
          ))}
        </div>
        {currentOpenSellOption && (
          <div className="bg-white p-6 rounded shadow-md mt-6">
            {renderFormFields(sellOptions[currentOpenSellOption])}
            <button className="bg-blue-700 text-white px-6 py-2 rounded mt-4">
              Sell {currentOpenSellOption}
            </button>
          </div>
        )}
      </section>

      <footer className="bg-blue-700 text-white py-8">
        <p className="text-center">METAVOYAGE &copy; 2024. All Rights Reserved.</p>
        <ul className="flex justify-center space-x-6 mt-4">
          <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          <li><a href="#" className="hover:underline">Terms of Service</a></li>
          <li><a href="#" className="hover:underline">Contact Us</a></li>
        </ul>
      </footer>
    </div>
  );
}
