import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Booking } from '../types';

export const generateTicketPDF = async (booking: Booking): Promise<void> => {
  // Create a temporary div for the ticket content
  const ticketElement = document.createElement('div');
  ticketElement.style.position = 'absolute';
  ticketElement.style.left = '-9999px';
  ticketElement.style.width = '800px';
  ticketElement.style.padding = '40px';
  ticketElement.style.backgroundColor = 'white';
  ticketElement.style.fontFamily = 'Arial, sans-serif';

  ticketElement.innerHTML = `
    <div style="border: 3px solid #1e40af; border-radius: 12px; padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px;">
        <h1 style="color: #1e40af; font-size: 32px; margin: 0; font-weight: bold;">🚂 RailBook</h1>
        <h2 style="color: #374151; font-size: 24px; margin: 10px 0 0 0;">Railway Ticket</h2>
      </div>

      <!-- PNR and Status -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">PNR Number</p>
          <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1e40af; font-family: monospace;">${booking.pnr_number}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Status</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: ${booking.status === 'CONFIRMED' ? '#059669' : '#dc2626'};">
            ${booking.status}
          </p>
        </div>
      </div>

      <!-- Train Details -->
      <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 20px;">${booking.train?.train_name || 'Train'}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">From</p>
            <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">${booking.train?.source_station?.station_name}</p>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">${booking.train?.departure_time || '08:00'}</p>
          </div>
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">To</p>
            <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">${booking.train?.destination_station?.station_name}</p>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">${booking.train?.arrival_time || '20:30'}</p>
          </div>
        </div>
        <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Travel Date</p>
            <p style="margin: 5px 0 0 0; font-weight: bold;">${new Date(booking.travel_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Class</p>
            <p style="margin: 5px 0 0 0; font-weight: bold;">${booking.booking_class || 'Sleeper'}</p>
          </div>
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Duration</p>
            <p style="margin: 5px 0 0 0; font-weight: bold;">${booking.train?.duration || '12h 30m'}</p>
          </div>
        </div>
      </div>

      <!-- Passenger Details -->
      <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Passenger Details</h3>
        ${booking.passengers?.map((passenger, index) => `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <div>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${passenger.passenger_name}</p>
              <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">${passenger.age} years, ${passenger.gender}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold; color: #1e40af;">
                ${booking.status === 'CONFIRMED' ? `Seat ${passenger.seat_number}` : 'Waiting List'}
              </p>
            </div>
          </div>
        `).join('') || ''}
      </div>

      <!-- Booking Details -->
      <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Booking Date</p>
            <p style="margin: 5px 0 0 0; font-weight: bold;">${new Date(booking.booking_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Amount</p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #059669; font-size: 18px;">₹${booking.total_amount?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          This is a computer-generated ticket. Please carry a valid ID proof during travel.
        </p>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
          For support, contact: support@railbook.com | 1800-123-4567
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(ticketElement);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
    
    // Save the PDF
    pdf.save(`RailBook_Ticket_${booking.pnr_number}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(ticketElement);
  }
};

export const generateTicketImage = async (booking: Booking): Promise<void> => {
  // Create a temporary div for the ticket content (similar to PDF but optimized for image)
  const ticketElement = document.createElement('div');
  ticketElement.style.position = 'absolute';
  ticketElement.style.left = '-9999px';
  ticketElement.style.width = '600px';
  ticketElement.style.padding = '30px';
  ticketElement.style.backgroundColor = 'white';
  ticketElement.style.fontFamily = 'Arial, sans-serif';

  ticketElement.innerHTML = `
    <div style="border: 3px solid #1e40af; border-radius: 12px; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1e40af; font-size: 28px; margin: 0;">🚂 RailBook Ticket</h1>
        <p style="color: #374151; font-size: 18px; margin: 5px 0;">PNR: ${booking.pnr_number}</p>
      </div>
      
      <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af;">${booking.train?.train_name}</h3>
        <p style="margin: 0; font-size: 14px;">
          ${booking.train?.source_station?.station_name} → ${booking.train?.destination_station?.station_name}
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">
          Date: ${new Date(booking.travel_date).toLocaleDateString()} | Status: ${booking.status}
        </p>
      </div>
      
      <div style="background: white; border-radius: 8px; padding: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af;">Passengers:</h4>
        ${booking.passengers?.map(passenger => `
          <p style="margin: 5px 0; font-size: 14px;">
            ${passenger.passenger_name} (${passenger.age}y) - ${booking.status === 'CONFIRMED' ? `Seat ${passenger.seat_number}` : 'WL'}
          </p>
        `).join('') || ''}
      </div>
    </div>
  `;

  document.body.appendChild(ticketElement);

  try {
    const canvas = await html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // Create download link for image
    const link = document.createElement('a');
    link.download = `RailBook_Ticket_${booking.pnr_number}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    document.body.removeChild(ticketElement);
  }
};