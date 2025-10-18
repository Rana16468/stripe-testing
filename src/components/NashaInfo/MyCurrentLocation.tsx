import React, { useState } from 'react'
import { MapPin, Loader2, AlertCircle, Navigation, Globe, Clock, Copy, ExternalLink, Crosshair, Map } from 'lucide-react'

interface LocationData {
  latitude: string
  longitude: string
  accuracy: number
}

interface AddressData {
  display_name: string
  address: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    state?: string
    postcode?: string
    country?: string
  }
}

const MyCurrentLocation: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [address, setAddress] = useState<AddressData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const getCurrentLocation = (): void => {
    setError(null)
    setLocation(null)
    setAddress(null)
    setLoading(true)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords
        const locationData = {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          accuracy: position.coords.accuracy
        }
        setLocation(locationData)
        setLastUpdated(new Date())
        setLoading(false)
        
        // Fetch address data
        fetchAddressData(latitude, longitude)
      },
      (error: GeolocationPositionError) => {
        let errorMessage = 'Unable to retrieve location.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
          default:
            errorMessage = 'An unknown error occurred.'
            break
        }
        
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    )
  }

  const fetchAddressData = async (lat: number, lon: number): Promise<void> => {
    setLoadingAddress(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data')
      }
      
      const data = await response.json()
      setAddress(data)
    } catch (err) {
      console.error('Error fetching address:', err)
    } finally {
      setLoadingAddress(false)
    }
  }

  const copyToClipboard = async (text: string, type: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const openInMaps = (): void => {
    if (location) {
      window.open(`https://www.openstreetmap.org/?mlat=${location?.latitude}&mlon=${location?.longitude}&zoom=16`, '_blank')
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatAddress = (addr: AddressData['address']): string => {
    const parts = []
    if (addr.house_number && addr.road) parts.push(`${addr.house_number} ${addr.road}`)
    else if (addr.road) parts.push(addr.road)
    if (addr.neighbourhood) parts.push(addr.neighbourhood)
    if (addr.city) parts.push(addr.city)
    if (addr.state) parts.push(addr.state)
    if (addr.country) parts.push(addr.country)
    return parts.join(', ')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6 shadow-2xl">
              <Navigation className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Location Tracker
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover your precise location with beautiful visualization and detailed information
          </p>
        </div>

        {/* Main Action Card */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                {loading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-2xl">Locating You...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-8 h-8" />
                    <span className="text-2xl">Get My Location</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50/90 backdrop-blur-lg border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 text-xl mb-2">Location Error</h3>
                  <p className="text-red-700 text-lg">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Results */}
        {location && (
          <div className="space-y-8">
            {/* Status Header */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <span className="text-emerald-800 font-bold text-xl">Location Active</span>
                </div>
                {lastUpdated && (
                  <div className="flex items-center gap-3 text-gray-700 bg-gray-100 px-4 py-2 rounded-xl">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Last Updated: {formatTime(lastUpdated)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Coordinates Card */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Globe className="w-8 h-8" />
                    GPS Coordinates
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <label className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">
                        Latitude
                      </label>
                      <p className="text-3xl font-mono font-black text-gray-800">{location.latitude}°</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                      <label className="block text-sm font-bold text-purple-700 uppercase tracking-wider mb-2">
                        Longitude
                      </label>
                      <p className="text-3xl font-mono font-black text-gray-800">{location.longitude}°</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Accuracy
                    </label>
                    <p className="text-2xl font-bold text-gray-800">±{Math.round(location.accuracy)} meters</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => copyToClipboard(`${location.latitude}, ${location.longitude}`, 'coordinates')}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
                    >
                      <Copy className="w-5 h-5" />
                      {copySuccess === 'coordinates' ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={openInMaps}
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MapPin className="w-8 h-8" />
                    Address Details
                  </h2>
                </div>
                <div className="p-8">
                  {loadingAddress ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-gray-600">Loading address...</p>
                      </div>
                    </div>
                  ) : address ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                        <label className="block text-sm font-bold text-purple-700 uppercase tracking-wider mb-3">
                          Complete Address
                        </label>
                        <p className="text-lg text-gray-800 leading-relaxed font-medium">
                          {address.display_name}
                        </p>
                      </div>
                      
                      {address.address && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200">
                          <label className="block text-sm font-bold text-indigo-700 uppercase tracking-wider mb-3">
                            Formatted Address
                          </label>
                          <p className="text-lg text-gray-800 font-medium">{formatAddress(address.address)}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => copyToClipboard(address.display_name, 'address')}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <Copy className="w-5 h-5" />
                        {copySuccess === 'address' ? 'Address Copied!' : 'Copy Address'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-xl text-gray-600 font-semibold">Address information not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Map className="w-8 h-8" />
                  Interactive Map View
                </h2>
              </div>
              <div className="p-2">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="500"
                    frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(location.longitude) - 0.01},${parseFloat(location.latitude) - 0.01},${parseFloat(location.longitude) + 0.01},${parseFloat(location.latitude) + 0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
                    className="w-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg px-8 py-4 rounded-full shadow-lg border border-white/50">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold text-lg">
              🔒 Your location data is processed locally and never stored
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCurrentLocation