import React, { useMemo,useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { fromZonedTime } from 'date-fns-tz';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BookingModalCalendarView.css'


const localizer = momentLocalizer(moment);
const timeZone = 'Africa/Johannesburg';


function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}


function CalendarView({ bookings }) {


  const [selectedBooking, setSelectedBooking] = useState(null)
  const events = useMemo(() => {
    return bookings.map((booking) => {
      try {
        const time24 = convertTo24Hour(booking.time_slot);
        const isoString = `${booking.date}T${time24}:00`;

        const localDateTime = new Date(isoString);
        const start = fromZonedTime(localDateTime, timeZone);
        const end = new Date(start.getTime() + 30 * 60000); // Add 30 min

        return {
          title: `${booking.client_name} - ${booking.service_type}`,
          start,
          end,
          allDay:false,
          resource:booking
        };
      } catch (error) {
        console.error('Error processing booking:', booking, error);
        return null;
      }
    }).filter(Boolean);
  }, [bookings]);

  return (
    <div className="calendar-container" style={{ height: '600px', padding: '1rem' }}>
      <h2>Appointments Calendar (South African Time)</h2>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['month', 'week', 'day']}
        step={30}
        timeslots={2}
        defaultDate={events.length ? events[0].start : new Date()}
        style={{ height: 500 }}
        onSelectEvent={(event)=>{setSelectedBooking(event.resource)}}
      />
    {selectedBooking && (
  <div className="booking-modal">
    <div className="booking-modal-content">
      <h3>Booking Details</h3>
      <p><strong>Name:</strong> {selectedBooking.client_name}</p>
      <p><strong>Email:</strong> {selectedBooking.client_email}</p>
      <p><strong>Phone:</strong> {selectedBooking.client_phone}</p>
      <p><strong>Service:</strong> {selectedBooking.service_type}</p>
      <p><strong>Date:</strong> {selectedBooking.date}</p>
      <p><strong>Time:</strong> {selectedBooking.time_slot}</p>
      <p><strong>Status:</strong> {selectedBooking.isConfirmed ? 'Confirmed' : 'Pending'}</p>

      <button onClick={() => setSelectedBooking(null)}>Close</button>
    </div>
  </div>
)}      
    </div>
  );
}

export default CalendarView;
