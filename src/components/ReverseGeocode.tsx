import React, { useEffect, useState } from 'react';

// Define a type for the address object returned by the API
interface Address {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
}

const ReverseGeocode: React.FC = () => {
  const [location, setLocation] = useState<Address | null>(null);
  const latitude = 41.8781;
  const longitude = -87.6298;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              // Add user-agent for Nominatim compliance
              'User-Agent': 'YourAppName/1.0 (your@email.com)',
            },
          }
        );
        const data = await response.json();
        setLocation(data.address);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Reverse Geocoding Result</h2>
      {location ? (
        <div>
          <p><strong>City:</strong> {location.city || location.town || location.village || 'N/A'}</p>
          <p><strong>State:</strong> {location.state || 'N/A'}</p>
          <p><strong>Country:</strong> {location.country || 'N/A'}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default ReverseGeocode;
