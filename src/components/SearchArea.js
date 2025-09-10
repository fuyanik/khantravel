"use client"

import Image from "next/image";
import webBanner from "../assets/web-banner.jpg"
import Slider from "@/components/Slider";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonIcon from '@mui/icons-material/Person';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import { Switch } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function SearchArea() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Date and time states
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  // Round trip states
  const [selectedPickupDateTime, setSelectedPickupDateTime] = useState(null);
  const [selectedReturnDateTime, setSelectedReturnDateTime] = useState(null);
  const [showPickupDateTimePicker, setShowPickupDateTimePicker] = useState(false);
  const [showReturnDateTimePicker, setShowReturnDateTimePicker] = useState(false);
  const [isPickupClosing, setIsPickupClosing] = useState(false);
  const [isReturnClosing, setIsReturnClosing] = useState(false);

  // Person picker states
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [isPersonClosing, setIsPersonClosing] = useState(false);
  const [isPersonPickerClosing, setIsPersonPickerClosing] = useState(false);

  // Location input states
  const [fromWhere, setFromWhere] = useState('');
  const [toWhere, setToWhere] = useState('');
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const [showFromResults, setShowFromResults] = useState(false);
  const [showToResults, setShowToResults] = useState(false);
  const [fromSearchResults, setFromSearchResults] = useState([]);
  const [toSearchResults, setToSearchResults] = useState([]);
  const [fromLoading, setFromLoading] = useState(false);
  const [toLoading, setToLoading] = useState(false);
  const [fromTyping, setFromTyping] = useState(false);
  const [toTyping, setToTyping] = useState(false);

  // Swap states
  const [isSwapping, setIsSwapping] = useState(false);
  const [fromJustSelected, setFromJustSelected] = useState(false);
  const [toJustSelected, setToJustSelected] = useState(false);

  // Option selection states
  const [selectedOption, setSelectedOption] = useState('transfer');
  const [isAnimating, setIsAnimating] = useState(false);

  // Duration picker states
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [isDurationClosing, setIsDurationClosing] = useState(false);

  // Web date picker view states  
  const [webPickerView, setWebPickerView] = useState('date');
  const [webPickupView, setWebPickupView] = useState('date');
  const [webReturnView, setWebReturnView] = useState('date');

  // Mobile date picker view states
  const [mobilePickerView, setMobilePickerView] = useState('date'); // 'date' or 'time'
  const [mobilePickupView, setMobilePickupView] = useState('date');
  const [mobileReturnView, setMobileReturnView] = useState('date');

  // Person counter helper functions
  const incrementCounter = (type) => {
    if (type === 'adults') setAdults(prev => prev + 1);
    if (type === 'children') setChildren(prev => prev + 1);
    if (type === 'babies') setBabies(prev => prev + 1);
  };

  const decrementCounter = (type) => {
    if (type === 'adults' && adults > 0) setAdults(prev => prev - 1);
    if (type === 'children' && children > 0) setChildren(prev => prev - 1);
    if (type === 'babies' && babies > 0) setBabies(prev => prev - 1);
  };

  const getTotalPersons = () => adults + children + babies;

  // Swap locations function with fade effect
  const swapLocations = () => {
    setIsSwapping(true);
    
    // First fade out
    setTimeout(() => {
      const tempFrom = fromWhere;
      const tempTo = toWhere;
      setFromWhere(tempTo);
      setToWhere(tempFrom);
      
      // Then fade in
      setTimeout(() => {
        setIsSwapping(false);
      }, 100);
    }, 100);
  };

  // Get icon based on place type
  const getLocationIcon = (types) => {
    if (!types) return "📍";
    
    if (types.includes("airport")) return "✈️";
    if (types.includes("lodging") || types.includes("hotel")) return "🏨";
    if (types.includes("hospital") || types.includes("pharmacy")) return "🏥";
    if (types.includes("shopping_mall") || types.includes("store")) return "🏬";
    if (types.includes("parking")) return "🅿️";
    if (types.includes("tourist_attraction")) return "🎯";
    if (types.includes("restaurant") || types.includes("food")) return "🍽️";
    if (types.includes("transit_station") || types.includes("subway_station")) return "🚇";
    if (types.includes("university") || types.includes("school")) return "🎓";
    if (types.includes("bank") || types.includes("atm")) return "🏦";
    
    return "📍";
  };

  // Google Places API search function
  const searchGooglePlaces = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(`/api/places?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('API returned error:', data.error);
        return [];
      }
      
      if (data.status === 'OK' && data.predictions) {
        return data.predictions.map((prediction, index) => ({
          id: prediction.place_id || index,
          name: prediction.structured_formatting?.main_text || prediction.description,
          address: prediction.description,
          types: prediction.types || [],
          icon: getLocationIcon(prediction.types),
          placeId: prediction.place_id
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Google Places API error:', error);
      return [];
    }
  }, []);

  // Handle input changes
  const handleFromChange = (value) => {
    setFromTyping(true);
    setFromWhere(value);
  };

  const handleToChange = (value) => {
    setToTyping(true);
    setToWhere(value);
  };

  const selectLocation = (location, type) => {
    const fullLocationText = `${location.name} | ${location.address}`;
    
    if (type === 'from') {
      setFromTyping(false);
      setShowFromResults(false);
      setFromSearchResults([]);
      setFromJustSelected(true);
      
      setTimeout(() => {
        setFromWhere(fullLocationText);
        setTimeout(() => {
          setFromJustSelected(false);
        }, 100);
      }, 100);
      
    } else {
      setToTyping(false);
      setShowToResults(false);
      setToSearchResults([]);
      setToJustSelected(true);
      
      setTimeout(() => {
        setToWhere(fullLocationText);
        setTimeout(() => {
          setToJustSelected(false);
        }, 100);
      }, 100);
    }
  };

  // Clear location functions
  const clearFromLocation = () => {
    setFromWhere('');
    setFromFocused(false);
    setFromTyping(false);
    setShowFromResults(false);
    setFromSearchResults([]);
  };

  const clearToLocation = () => {
    setToWhere('');
    setToFocused(false);
    setToTyping(false);
    setShowToResults(false);
    setToSearchResults([]);
  };

  // Seçim değiştirme fonksiyonu
  const handleOptionChange = (option) => {
    if (option === selectedOption) return;
    
    setIsAnimating(true);
    setSelectedOption(option);
    
    if (option === 'rent') {
      setIsRoundTrip(false);
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle search button click
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (fromWhere) params.append('from', fromWhere);
    if (toWhere) params.append('to', toWhere);
    
    params.append('type', selectedOption);
    
    if (isRoundTrip) {
      if (selectedPickupDateTime) {
        params.append('date', selectedPickupDateTime.format('DD MMMM, ddd'));
        params.append('time', selectedPickupDateTime.format('HH:mm'));
      }
      if (selectedReturnDateTime) {
        params.append('returnDate', selectedReturnDateTime.format('DD MMMM, ddd'));
        params.append('returnTime', selectedReturnDateTime.format('HH:mm'));
      }
      params.append('roundTrip', 'true');
    } else {
      if (selectedDateTime) {
        params.append('date', selectedDateTime.format('DD MMMM, ddd'));
        params.append('time', selectedDateTime.format('HH:mm'));
      }
      params.append('roundTrip', 'false');
    }
    
    if (selectedOption === 'rent') {
      params.append('duration', selectedDuration.toString());
    }
    
    params.append('passengers', getTotalPersons().toString());
    
    router.push(`/transfer?${params.toString()}`);
  };

  // Debounced search with useEffect
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      const searchQuery = fromWhere.split(' | ')[0];
      if (!fromFocused || !fromTyping) {
        setShowFromResults(false);
        setFromSearchResults([]);
        setFromLoading(false);
        return;
      }

      if (searchQuery && searchQuery.length >= 2) {
        setFromLoading(true);
        try {
          const results = await searchGooglePlaces(searchQuery);
          setFromSearchResults(results);
          setShowFromResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setFromSearchResults([]);
        } finally {
          setFromLoading(false);
        }
      } else {
        setShowFromResults(false);
        setFromSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [fromWhere, fromFocused, fromTyping, searchGooglePlaces]);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      const searchQuery = toWhere.split(' | ')[0];
      if (!toFocused || !toTyping) {
        setShowToResults(false);
        setToSearchResults([]);
        setToLoading(false);
        return;
      }

      if (searchQuery && searchQuery.length >= 2) {
        setToLoading(true);
        try {
          const results = await searchGooglePlaces(searchQuery);
          setToSearchResults(results);
          setShowToResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setToSearchResults([]);
        } finally {
          setToLoading(false);
        }
      } else {
        setShowToResults(false);
        setToSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [toWhere, toFocused, toTyping, searchGooglePlaces]);

  // Click outside to close popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPersonPicker && !isMobile && !event.target.closest('.person-picker-container')) {
        setIsPersonClosing(true);
        setTimeout(() => {
          setShowPersonPicker(false);
          setIsPersonClosing(false);
        }, 200);
      }
      
      if (showDurationPicker && !event.target.closest('.duration-picker-container')) {
        setIsDurationClosing(true);
        setTimeout(() => {
          setShowDurationPicker(false);
          setIsDurationClosing(false);
        }, 200);
      }
      
      if (!event.target.closest('#fromInput') && !event.target.closest('.from-results')) {
        setShowFromResults(false);
      }
      if (!event.target.closest('#toInput') && !event.target.closest('.to-results')) {
        setShowToResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPersonPicker, showDurationPicker, showFromResults, showToResults, isMobile]);

  // Add animations styles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeInScale {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fadeOutScale {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.9);
            opacity: 0;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-100 md:pt-24 pt-0"> 
      <div className="md:w-[94%] w-full h-full bg-slate-50 md:rounded-t-3xl"> 
        <div className="w-full h-full flex flex-col md:gap-10 gap-0 md:rounded-t-3xl bg-slate-50 relative md:px-5 px-0">
          {/* Mobile: Slider and banner at top */}
          {isMobile ? (
            <div className="relative w-full h-[15vh] overflow-hidden">
              <Image src={webBanner} alt="Travel banner background" className="absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 bg-black/20 z-10" />
              <div className="relative z-20 h-full">
                <Slider/>
              </div>
            </div>
          ) : (
            <>
              <br></br>
              <Slider/>
              <Image src={webBanner} alt="Travel banner background" className="absolute right-0 w-[80%] h-full object-cover rounded-t-3xl z-0" />
            </>
          )}
          
          {/* Search Area */}
          <div className="flex flex-col z-10 md:w-[90%] w-full h-auto self-center md:mt-0 mt-4"> 

            {/* Desktop view - tab selector */}
            {!isMobile && (
              <div className="relative flex items-center px-5 justify-between h-[50px] rounded-t-2xl bg-white overflow-hidden w-[310px]">
              <div 
                className={`absolute top-1/2 transform -translate-y-1/2 h-[70%] bg-gray-800 rounded-full transition-all duration-300 ease-in-out ${
                  selectedOption === 'transfer' 
                    ? 'left-3 w-28' 
                    : 'left-[calc(100%-10rem-1.25rem)] w-44'
                }`}
              />
              
              <div 
                className={`relative z-10 flex items-center justify-center gap-2 h-[70%] w-24 cursor-pointer rounded-full text-sm font-semibold transition-colors duration-300 ${
                  selectedOption === 'transfer' ? 'text-white' : 'text-[rgb(87,87,87)]'
                }`}
                onClick={() => handleOptionChange('transfer')}
              >
                <DirectionsCarIcon className="w-4 h-4" />
                Transfer
              </div>
              
              <div 
                className={`relative z-10 flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors duration-300 ${
                  selectedOption === 'rent' ? 'text-white' : 'text-[rgb(87,87,87)]'
                }`}
                onClick={() => handleOptionChange('rent')}
              >
                <AccessTimeIcon className="w-4 h-4" />
                Rent By The Hour
              </div>
            </div>
            )}

            {/* Mobile view - tab selector */}
            {isMobile && (
              <div className="relative flex items-center px-3 justify-between h-[50px] rounded-t-2xl bg-white overflow-hidden mx-4 w-[calc(100%-2rem)] shadow-sm border-b border-gray-100">
                <div 
                  className={`absolute top-1/2 transform -translate-y-1/2 h-[35px] bg-gray-800 rounded-full transition-all duration-300 ease-in-out ${
                    selectedOption === 'transfer' 
                      ? 'left-2 w-[45%]' 
                      : 'left-[calc(50%+0.25rem)] w-[45%]'
                  }`}
                />
                
                <div 
                  className={`relative z-10 flex items-center justify-center gap-1.5 h-[35px] w-[45%] cursor-pointer rounded-full text-xs font-semibold transition-colors duration-300 ${
                    selectedOption === 'transfer' ? 'text-white' : 'text-[rgb(87,87,87)]'
                  }`}
                  onClick={() => handleOptionChange('transfer')}
                >
                  <DirectionsCarIcon className="w-4 h-4" />
                  Transfer
                </div>
                
                <div 
                  className={`relative z-10 flex items-center justify-center gap-1.5 h-[35px] w-[45%] cursor-pointer rounded-full text-xs font-semibold transition-colors duration-300 ${
                    selectedOption === 'rent' ? 'text-white' : 'text-[rgb(87,87,87)]'
                  }`}
                  onClick={() => handleOptionChange('rent')}
                >
                  <AccessTimeIcon className="w-4 h-4" />
                  Rent By Hour
                </div>
              </div>
            )}

            {/* Main search container */}
            <div className={`self-center flex items-center justify-center gap-5 shadow-lg w-full z-10 relative ${
              isMobile 
                ? 'flex-col px-4 py-4 rounded-b-2xl mx-4' 
                : 'px-10 h-[200px] rounded-b-lg bg-white'
            }`}
            style={{
              background: isMobile 
                ? 'white'
                : 'white',
              backdropFilter: 'none'
            }}>
              
              {/* Mobile Inputs */}
              {isMobile ? (
                <>
                  {/* From Where - Mobile */}
                  <div className="relative w-full mb-1">
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden h-[60px]" 
                         onClick={() => {
                           setFromFocused(true);
                           setTimeout(() => document.getElementById('fromInputMobile')?.focus(), 50);
                         }}>
                      <div className="w-12 h-full bg-zinc-900 flex items-center justify-center">
                        <FlightTakeoffIcon className="text-white w-5 h-5" />
                      </div>
                      <div className="flex-1 px-3 py-2 relative">
                        {!fromFocused && !fromWhere ? (
                          <>
                            <p className="text-sm font-bold text-black">
                              {selectedOption === 'rent' ? 'PICKUP LOCATION' : 'FROM WHERE'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Address, Airport, Hotel, Hospital...</p>
                          </>
                        ) : (
                          <>
                            <label className="text-[10px] text-gray-500 font-bold">
                              {selectedOption === 'rent' ? 'PICKUP LOCATION' : 'FROM WHERE'}
                            </label>
                            {fromWhere && !fromFocused ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-black">{fromWhere.split(' | ')[0]}</span>
                                {fromWhere.includes(' | ') && (
                                  <span className="text-[10px] text-gray-500 truncate">
                                    {fromWhere.split(' | ')[1]}
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearFromLocation();
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <input
                                id="fromInputMobile"
                                type="text"
                                value={fromWhere.split(' | ')[0] || fromWhere}
                                onChange={(e) => handleFromChange(e.target.value)}
                                onFocus={() => setFromFocused(true)}
                                onBlur={() => setTimeout(() => setFromFocused(false), 100)}
                                className="w-full bg-transparent border-none outline-none text-sm font-bold text-black"
                                placeholder="Enter location..."
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Search Results - From */}
                    {(showFromResults || fromLoading) && (
                      <div className="from-results absolute top-full left-0 w-full z-50 mt-2">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-y-auto">
                          {fromLoading ? (
                            <div className="flex items-center justify-center p-4">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              <span className="ml-2 text-gray-600 text-sm">Searching...</span>
                            </div>
                          ) : fromSearchResults.length > 0 ? (
                            fromSearchResults.map((location) => (
                              <div
                                key={location.id}
                                onClick={() => selectLocation(location, 'from')}
                                className="flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <span className="text-xl mr-3 mt-1">{location.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 text-sm">{location.name}</h4>
                                  <p className="text-xs text-gray-500 mt-1 truncate">{location.address}</p>
                                </div>
                              </div>
                            ))
                          ) : fromWhere.length >= 2 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No locations found for "{fromWhere}"
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* To Where - Mobile */}
                  <div className="relative w-full mb-1">
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden h-[60px]"
                         onClick={() => {
                           setToFocused(true);
                           setTimeout(() => document.getElementById('toInputMobile')?.focus(), 50);
                         }}>
                      <div className="w-12 h-full bg-zinc-900 flex items-center justify-center">
                        <FlightLandIcon className="text-white w-5 h-5" />
                      </div>
                      <div className="flex-1 px-3 py-2 relative">
                        {!toFocused && !toWhere ? (
                          <>
                            <p className="text-sm font-bold text-black">
                              {selectedOption === 'rent' ? 'DROP OFF POINT' : 'TO WHERE'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Address, Airport, Hotel, Hospital...</p>
                          </>
                        ) : (
                          <>
                            <label className="text-[10px] text-gray-500 font-bold">
                              {selectedOption === 'rent' ? 'DROP OFF POINT' : 'TO WHERE'}
                            </label>
                            {toWhere && !toFocused ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-black">{toWhere.split(' | ')[0]}</span>
                                {toWhere.includes(' | ') && (
                                  <span className="text-[10px] text-gray-500 truncate">
                                    {toWhere.split(' | ')[1]}
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearToLocation();
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <input
                                id="toInputMobile"
                                type="text"
                                value={toWhere.split(' | ')[0] || toWhere}
                                onChange={(e) => handleToChange(e.target.value)}
                                onFocus={() => setToFocused(true)}
                                onBlur={() => setTimeout(() => setToFocused(false), 100)}
                                className="w-full bg-transparent border-none outline-none text-sm font-bold text-black"
                                placeholder="Enter location..."
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Search Results - To */}
                    {(showToResults || toLoading) && (
                      <div className="to-results absolute top-full left-0 w-full z-50 mt-2">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-60 overflow-y-auto">
                          {toLoading ? (
                            <div className="flex items-center justify-center p-4">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              <span className="ml-2 text-gray-600 text-sm">Searching...</span>
                            </div>
                          ) : toSearchResults.length > 0 ? (
                            toSearchResults.map((location) => (
                              <div
                                key={location.id}
                                onClick={() => selectLocation(location, 'to')}
                                className="flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <span className="text-xl mr-3 mt-1">{location.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 text-sm">{location.name}</h4>
                                  <p className="text-xs text-gray-500 mt-1 truncate">{location.address}</p>
                                </div>
                              </div>
                            ))
                          ) : toWhere.length >= 2 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No locations found for "{toWhere}"
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date & Time - Mobile */}
                  <div className="relative w-full mb-1">
                    {/* Single Trip Date */}
                    {!isRoundTrip ? (
                      <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden h-[60px] cursor-pointer" onClick={() => setShowDateTimePicker(true)}>
                        <div className="w-12 h-full bg-zinc-900 flex items-center justify-center">
                          <CalendarTodayIcon className="text-white w-5 h-5" />
                        </div>
                        <div className="flex-1 px-3 py-2">
                          <p className="text-sm font-bold text-black">
                            {selectedOption === 'rent' ? 'SELECT DATE' : 'DATE & TIME'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedDateTime 
                              ? selectedDateTime.format('DD MMMM, ddd HH:mm')
                              : selectedOption === 'rent' ? 'Rental Date' : 'Starting Date'
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Round Trip Dates */
                      <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden h-[60px]">
                        <div className="w-12 h-full bg-zinc-900 flex items-center justify-center">
                          <CalendarTodayIcon className="text-white w-5 h-5" />
                        </div>
                        <div className="flex-1 flex">
                          {/* Pickup Date */}
                          <div className="flex-1 px-3 py-2 cursor-pointer hover:bg-gray-50 border-r border-gray-200" onClick={() => setShowPickupDateTimePicker(true)}>
                            <p className="text-xs font-bold text-black">PICKUP</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {selectedPickupDateTime 
                                ? selectedPickupDateTime.format('DD MMM, HH:mm')
                                : 'Select pickup'
                              }
                            </p>
                          </div>
                          
                          {/* Return Date */}
                          <div className="flex-1 px-3 py-2 cursor-pointer hover:bg-gray-50" onClick={() => setShowReturnDateTimePicker(true)}>
                            <p className="text-xs font-bold text-black">RETURN</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {selectedReturnDateTime 
                                ? selectedReturnDateTime.format('DD MMM, HH:mm')
                                : 'Select return'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Options Row */}
                  <div className="flex items-center gap-3 w-full mb-1">
                    {/* Round Trip Toggle - Only for transfer */}
                    {selectedOption === 'transfer' && (
                      <div className={`flex items-center justify-between bg-white border-2 border-gray-200 rounded-lg px-4 h-[60px] flex-1 transition-all duration-300 ${
                        selectedOption === 'transfer' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}>
                        <span className="text-sm font-bold text-black">ROUND TRIP</span>
                        <Switch
                          checked={isRoundTrip}
                          onChange={(e) => setIsRoundTrip(e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase': {
                              padding: 0,
                              margin: '2px',
                              transform: 'translateX(0px)',
                              '&.Mui-checked': {
                                color: '#000',
                                transform: 'translateX(20px)',
                                '& + .MuiSwitch-track': {
                                  backgroundColor: '#000',
                                  opacity: 1,
                                },
                              },
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#d1d5db',
                              height: '24px',
                              width: '44px',
                              borderRadius: '12px',
                              opacity: 1,
                            },
                            '& .MuiSwitch-thumb': {
                              width: '20px',
                              height: '20px',
                              backgroundColor: '#fff',
                            },
                          }}
                        />
                      </div>
                    )}

                    {/* Person/Duration Selector - Mobile with transition */}
                    <div className={`flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden h-[60px] cursor-pointer transition-all duration-300 ${
                      selectedOption === 'transfer' ? 'flex-1' : 'w-full'
                    }`} onClick={() => selectedOption === 'transfer' ? setShowPersonPicker(true) : setShowDurationPicker(true)}>
                      <div className="w-12 h-full bg-zinc-900 flex items-center justify-center">
                        {selectedOption === 'transfer' ? (
                          <PersonIcon className="text-white w-5 h-5 transition-all duration-300" />
                        ) : (
                          <AccessTimeFilledIcon className="text-white w-5 h-5 transition-all duration-300" />
                        )}
                      </div>
                      <div className="flex-1 px-3 py-2">
                        <p className="text-sm font-bold text-black transition-all duration-300">
                          {selectedOption === 'transfer' ? 'PERSON' : 'DURATION'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 transition-all duration-300">
                          {selectedOption === 'transfer' 
                            ? `${getTotalPersons()} Person${getTotalPersons() > 1 ? 's' : ''}`
                            : `${selectedDuration} Hour${selectedDuration > 1 ? 's' : ''}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Search Button */}
                  <button 
                    onClick={handleSearch}
                    className="w-full h-[60px] bg-gradient-to-r from-gray-800 to-black rounded-lg flex items-center justify-center gap-3 group shadow-lg active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="text-white font-bold text-base">Search</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <ArrowForwardIcon className="text-white w-5 h-5 transition-transform duration-300 group-active:translate-x-1" />
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {/* Desktop Inputs - Full functionality restored */}
                  {/* Swap Button - Desktop */}
                <div className="absolute top-4 left-[48%] transform -translate-x-1/2 z-20">
                  <button 
                    onClick={swapLocations}
                    className="group bg-white border-2 border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-black transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-black/60 cursor-pointer"
                  >
                    <SyncAltIcon className="w-4 h-4 text-gray-600 group-hover:text-black transition-colors duration-300 transform group-hover:rotate-180" />
                  </button>
                </div>
                  
                  {/* From Where - Desktop */}
                  <div className="relative rounded-lg border-2 border-gray-200 flex h-[120px] w-[27%]">
                <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                  <FlightTakeoffIcon className="text-white w-5 h-5" />
                </div>
                
                <div 
                  className="flex-1 h-full flex flex-col relative cursor-text"
                  onClick={() => {
                    if (!fromFocused) {
                      setFromFocused(true);
                      setTimeout(() => document.getElementById('fromInput')?.focus(), 50);
                    }
                  }}
                >
                  <div className="relative h-full flex flex-col justify-center px-4">
                    {!fromFocused && !fromWhere && (
                      <div className="flex flex-col items-start transition-all duration-250 ease-out transform opacity-100">
                            <span className="text-sm font-bold text-black transition-all duration-300 ease-out">
                          {selectedOption === 'rent' ? 'PICKUP LOCATION' : 'FROM WHERE'}
                        </span>
                          <span className="text-gray-500 text-[10px] mt-1 transition-all duration-300 ease-out">Address, Airport, Hotel, Hospital...</span>
                      </div>
                    )}
                    
                    <label 
                      className={`absolute transition-all duration-300 ease-out cursor-text transform ${
                        fromFocused || fromWhere 
                          ? 'top-2 left-4 text-[10px] text-gray-500 font-bold opacity-100 translate-y-0' 
                          : 'top-1/2 left-4 text-sm text-black font-bold opacity-0 -translate-y-1/2'
                      }`}
                    >
                      {selectedOption === 'rent' ? 'PICKUP LOCATION' : 'FROM WHERE'}
                    </label>
                    
                    {fromWhere && !fromFocused ? (
                      <div className={`absolute inset-0 flex flex-col justify-center items-start px-4 transition-all duration-250 ease-out transform ${
                        isSwapping || fromJustSelected 
                          ? 'opacity-0 translate-y-1' 
                          : 'opacity-100 translate-y-0'
                      }`}>
                        <span className="text-sm font-bold text-black">{fromWhere.split(' | ')[0]}</span>
                        {fromWhere.includes(' | ') && (
                          <span className="text-[10px] text-gray-500">
                            {(() => {
                              const address = fromWhere.split(' | ')[1];
                              const words = address.split(' ');
                              const limitedWords = words.slice(0, 8).join(' ');
                              return limitedWords.length < address.length ? limitedWords + '...' : limitedWords;
                            })()}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFromLocation();
                          }}
                          className="absolute top-2 right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform hover:scale-110 group cursor-pointer"
                        >
                          <span className="text-gray-600 group-hover:text-gray-800 text-xs font-bold leading-none">✕</span>
                        </button>
                      </div>
                    ) : (
                      <input
                        id="fromInput"
                        type="text"
                        value={fromWhere.split(' | ')[0] || fromWhere}
                        onChange={(e) => handleFromChange(e.target.value)}
                        onFocus={() => {
                          setFromFocused(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setFromFocused(false), 100);
                        }}
                        placeholder=""
                        className={`absolute w-full bg-transparent border-none outline-none transition-all duration-300 ease-out transform ${
                          fromFocused || fromWhere 
                            ? 'top-1/2 left-4 right-4 -translate-y-1/2 text-sm font-bold text-black opacity-100' 
                            : 'top-1/2 left-4 right-4 -translate-y-1/2 text-transparent opacity-0'
                        }`}
                        style={{ width: 'calc(100% - 2rem)' }}
                      />
                    )}
                  </div>
                </div>
                
                    {/* Desktop Search Results - From */}
                {(showFromResults || fromLoading) && (
                  <div className="from-results absolute top-full left-0 w-full z-50 mt-2 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto">
                      {fromLoading ? (
                        <div className="flex items-center justify-center p-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600 text-sm">Searching locations...</span>
                        </div>
                      ) : fromSearchResults.length > 0 ? (
                        fromSearchResults.map((location) => (
                          <div
                            key={location.id}
                            onClick={() => selectLocation(location, 'from')}
                            className="flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ease-out transform hover:scale-[1.02]"
                          >
                            <span className="text-2xl mr-3 mt-1">{location.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 text-sm">{location.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{location.address}</p>
                            </div>
                          </div>
                        ))
                      ) : fromWhere.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                              No locations found for "{fromWhere}"
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            
                  {/* To Where - Desktop */}
                  <div className="relative rounded-lg border-2 border-gray-200 flex h-[120px] w-[27%]">
                <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                  <FlightLandIcon className="text-white w-5 h-5" />
                </div>
                
                <div 
                  className="flex-1 h-full flex flex-col relative cursor-text"
                  onClick={() => {
                    if (!toFocused) {
                      setToFocused(true);
                      setTimeout(() => document.getElementById('toInput')?.focus(), 50);
                    }
                  }}
                >
                  <div className="relative h-full flex flex-col justify-center px-4">
                    {!toFocused && !toWhere && (
                      <div className="flex flex-col items-start transition-all duration-250 ease-out transform opacity-100">
                            <span className="text-sm font-bold text-black transition-all duration-300 ease-out">
                          {selectedOption === 'rent' ? 'DROP OFF POINT' : 'TO WHERE'}
                        </span>
                          <span className="text-gray-500 text-[10px] mt-1 transition-all duration-300 ease-out">Address, Airport, Hotel, Hospital...</span>
                      </div>
                    )}
                    
                    <label 
                      className={`absolute transition-all duration-300 ease-out cursor-text transform ${
                        toFocused || toWhere 
                          ? 'top-2 left-4 text-[10px] text-gray-500 font-bold opacity-100 translate-y-0' 
                          : 'top-1/2 left-4 text-sm text-black font-bold opacity-0 -translate-y-1/2'
                      }`}
                    >
                      {selectedOption === 'rent' ? 'DROP OFF POINT' : 'TO WHERE'}
                    </label>
                    
                    {toWhere && !toFocused ? (
                      <div className={`absolute inset-0 flex flex-col justify-center items-start px-4 transition-all duration-250 ease-out transform ${
                        isSwapping || toJustSelected 
                          ? 'opacity-0 translate-y-1' 
                          : 'opacity-100 translate-y-0'
                      }`}>
                        <span className="text-sm font-bold text-black">{toWhere.split(' | ')[0]}</span>
                        {toWhere.includes(' | ') && (
                          <span className="text-[10px] text-gray-500">
                            {(() => {
                              const address = toWhere.split(' | ')[1];
                              const words = address.split(' ');
                              const limitedWords = words.slice(0, 8).join(' ');
                              return limitedWords.length < address.length ? limitedWords + '...' : limitedWords;
                            })()}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearToLocation();
                          }}
                          className="absolute top-2 right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform hover:scale-110 group cursor-pointer"
                        >
                          <span className="text-gray-600 group-hover:text-gray-800 text-xs font-bold leading-none">✕</span>
                        </button>
                      </div>
                    ) : (
                      <input
                        id="toInput"
                        type="text"
                        value={toWhere.split(' | ')[0] || toWhere}
                        onChange={(e) => handleToChange(e.target.value)}
                        onFocus={() => {
                          setToFocused(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setToFocused(false), 100);
                        }}
                        placeholder=""
                        className={`absolute w-full bg-transparent border-none outline-none transition-all duration-300 ease-out transform ${
                          toFocused || toWhere 
                            ? 'top-1/2 left-4 right-4 -translate-y-1/2 text-sm font-bold text-black opacity-100' 
                            : 'top-1/2 left-4 right-4 -translate-y-1/2 text-transparent opacity-0'
                        }`}
                        style={{ width: 'calc(100% - 2rem)' }}
                      />
                    )}
                  </div>
                </div>
                
                    {/* Desktop Search Results - To */}
                {(showToResults || toLoading) && (
                  <div className="to-results absolute top-full left-0 w-full z-50 mt-2 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto">
                      {toLoading ? (
                        <div className="flex items-center justify-center p-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="ml-3 text-gray-600 text-sm">Searching locations...</span>
                        </div>
                      ) : toSearchResults.length > 0 ? (
                        toSearchResults.map((location) => (
                          <div
                            key={location.id}
                            onClick={() => selectLocation(location, 'to')}
                            className="flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ease-out transform hover:scale-[1.02]"
                          >
                            <span className="text-2xl mr-3 mt-1">{location.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 text-sm">{location.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{location.address}</p>
                            </div>
                          </div>
                        ))
                      ) : toWhere.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                              No locations found for "{toWhere}"
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

                  {/* Date Time Picker - Desktop */}
                  <div className="flex items-center justify-center relative rounded-lg border-2 border-gray-200 h-[120px] w-[26%]">
                  <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                      <div className="flex flex-col items-center gap-1">
                    <CalendarTodayIcon className="text-white w-5 h-5" />
                        {isRoundTrip && (
                          <SyncAltIcon className="text-white w-4 h-4" />
                        )}
                      </div>
                  </div>
                  
                    {/* Single Trip Date */}
                    {!isRoundTrip ? (
                  <div className="flex-1 h-full flex items-center px-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => {
                    setWebPickerView('date');
                    setShowDateTimePicker(true);
                  }}>
                    <div className="flex flex-col">
                      <span className={`text-black font-medium ${
                        selectedDateTime 
                          ? 'text-[10px] text-gray-500' 
                              : 'text-sm font-bold'
                      }`}>
                        {selectedOption === 'rent' ? 'SELECT DATE' : 'DATE & TIME'}
                      </span>
                      {selectedDateTime ? (
                            <span className="text-sm font-bold text-black">
                              {selectedDateTime.format('DD MMMM, ddd HH:mm')}
                        </span>
                      ) : (
                          <span className="text-gray-500 text-[10px]">
                            {selectedOption === 'rent' ? 'Rental Date' : 'Starting Date'}
                          </span>
                      )}
                    </div>
                </div>
              ) : (
                      /* Round Trip Dates */
                      <div className="flex-1 h-full flex flex-col">
                        {/* Pickup Date */}
                        <div className="flex-1 flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out border-b border-gray-200" onClick={() => {
                          setWebPickupView('date');
                          setShowPickupDateTimePicker(true);
                        }}>
                          <div className="flex flex-col">
                            <span className={`text-black font-medium ${
                              selectedPickupDateTime 
                                ? 'text-[9px] text-gray-500' 
                                : 'text-xs font-bold'
                            }`}>
                              PICKUP
                            </span>
                      {selectedPickupDateTime ? (
                              <span className="text-xs font-bold text-black">
                                {selectedPickupDateTime.format('DD MMM, HH:mm')}
                        </span>
                      ) : (
                              <span className="text-gray-500 text-[9px]">
                                Select pickup
                              </span>
                      )}
                    </div>
                  </div>
                  
                        {/* Return Date */}
                        <div className="flex-1 flex items-center px-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out" onClick={() => {
                          setWebReturnView('date');
                          setShowReturnDateTimePicker(true);
                        }}>
                          <div className="flex flex-col">
                            <span className={`text-black font-medium ${
                              selectedReturnDateTime 
                                ? 'text-[9px] text-gray-500' 
                                : 'text-xs font-bold'
                            }`}>
                              RETURN
                            </span>
                      {selectedReturnDateTime ? (
                              <span className="text-xs font-bold text-black">
                                {selectedReturnDateTime.format('DD MMM, HH:mm')}
                        </span>
                      ) : (
                              <span className="text-gray-500 text-[9px]">
                                Select return
                              </span>
                      )}
                    </div>
                  </div>
                      </div>
                    )}
                    
                  
                  {/* Single Date Time Picker */}
                  {showDateTimePicker && (
                    <div className="absolute bottom-0 left-0 z-50" style={{
                      animation: isClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                      transformOrigin: 'bottom left'
                    }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDateTimePicker
                          orientation="landscape"
                          value={selectedDateTime || dayjs()}
                          onChange={(newValue) => setSelectedDateTime(newValue)}
                          onAccept={(newValue) => {
                            setSelectedDateTime(newValue);
                            setIsClosing(true);
                            setTimeout(() => {
                              setShowDateTimePicker(false);
                              setIsClosing(false);
                            }, 200);
                          }}
                          onClose={() => {
                            setIsClosing(true);
                            setTimeout(() => {
                              setShowDateTimePicker(false);
                              setIsClosing(false);
                            }, 200);
                          }}
                          onViewChange={(view) => {
                            if (['hours', 'minutes'].includes(view)) {
                              setWebPickerView('time');
                            } else {
                              setWebPickerView('date');
                            }
                          }}
                          ampm={false}
                          view={webPickerView === 'date' ? 'day' : 'hours'}
                          views={webPickerView === 'date' ? ['year', 'month', 'day'] : ['hours', 'minutes']}
                          closeOnSelect={false}
                          sx={{
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            borderRadius: '16px 16px 0 0 !important',
                            overflow: 'hidden !important',
                            '& .MuiPaper-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                              borderRadius: '16px !important',
                              overflow: 'hidden !important',
                            },
                            '& .MuiPickersLayout-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                              borderRadius: '16px 16px 0 0 !important',
                              overflow: 'hidden !important',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important',
                            },
                            '& .MuiPickersLayout-contentWrapper': {
                              borderRadius: '0px 0 0 0 !important',
                            },
                            '& .MuiDateCalendar-root': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiDayCalendar-root': {
                              borderRadius: '0 !important',
                            },
                            '& .MuiPickersSlideTransition-root': {
                              borderRadius: '0 !important',
                            },
                            '& .MuiTypography-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersDay-root': {
                              color: '#ffffff !important',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6 !important',
                                color: '#ffffff !important',
                              },
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersCalendarHeader-label': {
                              color: '#ffffff !important',
                            },
                            '& .MuiIconButton-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersArrowSwitcher-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                                color: '#ffffff !important',
                              },
                            '& .MuiClock-root': {
                              backgroundColor: '#1a1a1a !important',
                            },
                            '& .MuiClockPointer-root': {
                              backgroundColor: '#3b82f6 !important',
                            },
                            '& .MuiClockPointer-thumb': {
                              backgroundColor: '#3b82f6 !important',
                              borderColor: '#3b82f6 !important',
                            },
                            '& .MuiClock-pin': {
                              backgroundColor: '#3b82f6 !important',
                            },
                            '& .MuiClockNumber-root': {
                              color: '#ffffff !important',
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6 !important',
                                color: '#ffffff !important',
                              },
                            },
                            '& .MuiPickersToolbar-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersToolbar-content': {
                              color: '#ffffff !important',
                            },
                            '& .MuiButton-root': {
                              color: '#ffffff !important',
                            },
                          }}
                          slots={{
                            actionBar: () => null,
                          }}
                        />
                        
                        {/* Custom Navigation Buttons */}
                        <div className="flex justify-between items-center p-4 bg-[#1a1a1a] border-t border-gray-700 rounded-b-2xl">
                          <button
                            onClick={() => {
                              setWebPickerView('date');
                              setIsClosing(true);
                              setTimeout(() => {
                                setShowDateTimePicker(false);
                                setIsClosing(false);
                              }, 200);
                            }}
                            className="px-6 py-2 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          {webPickerView === 'date' ? (
                            <button
                              onClick={() => setWebPickerView('time')}
                              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setWebPickerView('date');
                                setIsClosing(true);
                                setTimeout(() => {
                                  setShowDateTimePicker(false);
                                  setIsClosing(false);
                                }, 200);
                              }}
                              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                             Complete
                            </button>
                          )}
                        </div>
                      </LocalizationProvider>
                    </div>
                  )}

                  {/* Pickup Date Time Picker */}
                  {showPickupDateTimePicker && (
                    <div className="absolute bottom-0 left-0 z-50" style={{
                      animation: isPickupClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                      transformOrigin: 'bottom left'
                    }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDateTimePicker
                          orientation="landscape"
                          value={selectedPickupDateTime || dayjs()}
                          onChange={(newValue) => setSelectedPickupDateTime(newValue)}
                          onAccept={(newValue) => {
                            setSelectedPickupDateTime(newValue);
                            setIsPickupClosing(true);
                            setTimeout(() => {
                              setShowPickupDateTimePicker(false);
                              setIsPickupClosing(false);
                            }, 200);
                          }}
                          onClose={() => {
                            setIsPickupClosing(true);
                            setTimeout(() => {
                              setShowPickupDateTimePicker(false);
                              setIsPickupClosing(false);
                            }, 200);
                          }}
                          onViewChange={(view) => {
                            if (['hours', 'minutes'].includes(view)) {
                              setWebPickupView('time');
                            } else {
                              setWebPickupView('date');
                            }
                          }}
                          ampm={false}
                          view={webPickupView === 'date' ? 'day' : 'hours'}
                          views={webPickupView === 'date' ? ['year', 'month', 'day'] : ['hours', 'minutes']}
                          closeOnSelect={false}
                          sx={{
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            borderRadius: '16px 16px 0 0 !important',
                            overflow: 'hidden !important',
                            '& .MuiPaper-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                              borderRadius: '16px !important',
                              overflow: 'hidden !important',
                            },
                            '& .MuiPickersLayout-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                              borderRadius: '16px 16px 0 0 !important',
                              overflow: 'hidden !important',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important',
                            },
                            '& .MuiPickersLayout-contentWrapper': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiDateCalendar-root': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiDayCalendar-root': {
                              borderRadius: '0 !important',
                            },
                            '& .MuiPickersSlideTransition-root': {
                              borderRadius: '0 !important',
                            },
                            '& .MuiTypography-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersDay-root': {
                              color: '#ffffff !important',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6 !important',
                                color: '#ffffff !important',
                              },
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersCalendarHeader-label': {
                              color: '#ffffff !important',
                            },
                            '& .MuiIconButton-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersArrowSwitcher-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                                color: '#ffffff !important',
                              },
                            '& .MuiClock-root': {
                              backgroundColor: '#1a1a1a !important',
                            },
                            '& .MuiClockPointer-root': {
                              backgroundColor: '#3b82f6 !important',
                            },
                            '& .MuiClockPointer-thumb': {
                              backgroundColor: '#3b82f6 !important',
                              borderColor: '#3b82f6 !important',
                            },
                            '& .MuiClock-pin': {
                              backgroundColor: '#3b82f6 !important',
                            },
                            '& .MuiClockNumber-root': {
                              color: '#ffffff !important',
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6 !important',
                                color: '#ffffff !important',
                              },
                            },
                            '& .MuiPickersToolbar-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersToolbar-content': {
                              color: '#ffffff !important',
                            },
                            '& .MuiButton-root': {
                              color: '#ffffff !important',
                            },
                          }}
                          slots={{
                            actionBar: () => null,
                          }}
                        />
                        
                        {/* Custom Navigation Buttons */}
                        <div className="flex justify-between items-center p-4 bg-[#1a1a1a] border-t border-gray-700 rounded-b-2xl">
                          <button
                            onClick={() => {
                              setWebPickupView('date');
                              setIsPickupClosing(true);
                              setTimeout(() => {
                                setShowPickupDateTimePicker(false);
                                setIsPickupClosing(false);
                              }, 200);
                            }}
                            className="px-6 py-2 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          {webPickupView === 'date' ? (
                            <button
                              onClick={() => setWebPickupView('time')}
                              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setWebPickupView('date');
                                setIsPickupClosing(true);
                                setTimeout(() => {
                                  setShowPickupDateTimePicker(false);
                                  setIsPickupClosing(false);
                                }, 200);
                              }}
                              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </LocalizationProvider>
                    </div>
                  )}
                  
                  {/* Return Date Time Picker */}
                  {showReturnDateTimePicker && (
                    <div className="absolute bottom-0 left-0 z-50" style={{
                      animation: isReturnClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                      transformOrigin: 'bottom left'
                    }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDateTimePicker
                          orientation="landscape"
                          value={selectedReturnDateTime || dayjs()}
                          onChange={(newValue) => setSelectedReturnDateTime(newValue)}
                          onAccept={(newValue) => {
                            setSelectedReturnDateTime(newValue);
                            setIsReturnClosing(true);
                            setTimeout(() => {
                              setShowReturnDateTimePicker(false);
                              setIsReturnClosing(false);
                            }, 200);
                          }}
                          onClose={() => {
                            setIsReturnClosing(true);
                            setTimeout(() => {
                              setShowReturnDateTimePicker(false);
                              setIsReturnClosing(false);
                            }, 200);
                          }}
                          onViewChange={(view) => {
                            if (['hours', 'minutes'].includes(view)) {
                              setWebReturnView('time');
                            } else {
                              setWebReturnView('date');
                            }
                          }}
                          ampm={false}
                          view={webReturnView === 'date' ? 'day' : 'hours'}
                          views={webReturnView === 'date' ? ['year', 'month', 'day'] : ['hours', 'minutes']}
                          closeOnSelect={false}
                          sx={{
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            borderRadius: '16px 16px 0 0 !important',
                            overflow: 'hidden !important',
                            '& .MuiPaper-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                              borderRadius: '16px !important',
                              overflow: 'hidden !important',
                            },
                            '& .MuiPickersLayout-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                              borderRadius: '16px 16px 0 0 !important',
                              overflow: 'hidden !important',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important',
                            },
                            '& .MuiPickersLayout-contentWrapper': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiDateCalendar-root': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              borderRadius: '16px 0 0 0 !important',
                            },
                            '& .MuiDayCalendar-root': {
                              borderRadius: '0 !important',
                            },
                            '& .MuiPickersSlideTransition-root': {
                              borderRadius: '0 !important',
                            },
                            '& .MuiTypography-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersDay-root': {
                              color: '#ffffff !important',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                              },
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6 !important',
                                color: '#ffffff !important',
                              },
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersCalendarHeader-label': {
                              color: '#ffffff !important',
                            },
                            '& .MuiIconButton-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersArrowSwitcher-root': {
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersArrowSwitcher-button': {
                                color: '#ffffff !important',
                              },
                            '& .MuiClock-root': {
                              backgroundColor: '#1a1a1a !important',
                            },
                            '& .MuiClockPointer-root': {
                              backgroundColor: '#3b82f6 !important',
                            },
                            '& .MuiClockPointer-thumb': {
                              backgroundColor: '#3b82f6 !important',
                              borderColor: '#3b82f6 !important',
                            },
                            '& .MuiClock-pin': {
                              backgroundColor: '#3b82f6 !important',
                            },
                            '& .MuiClockNumber-root': {
                              color: '#ffffff !important',
                              '&.Mui-selected': {
                                backgroundColor: '#3b82f6 !important',
                                color: '#ffffff !important',
                              },
                            },
                            '& .MuiPickersToolbar-root': {
                              backgroundColor: '#1a1a1a !important',
                              color: '#ffffff !important',
                            },
                            '& .MuiPickersToolbar-content': {
                              color: '#ffffff !important',
                            },
                            '& .MuiButton-root': {
                              color: '#ffffff !important',
                            },
                          }}
                          slots={{
                            actionBar: () => null,
                          }}
                        />
                        
                        {/* Custom Navigation Buttons */}
                        <div className="flex justify-between items-center p-4 bg-[#1a1a1a] border-t border-gray-700 rounded-b-2xl">
                          <button
                            onClick={() => {
                              setWebReturnView('date');
                              setIsReturnClosing(true);
                              setTimeout(() => {
                                setShowReturnDateTimePicker(false);
                                setIsReturnClosing(false);
                              }, 200);
                            }}
                            className="px-6 py-2 text-white/80 font-medium rounded-lg hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          {webReturnView === 'date' ? (
                            <button
                              onClick={() => setWebReturnView('time')}
                              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setWebReturnView('date');
                                setIsReturnClosing(true);
                                setTimeout(() => {
                                  setShowReturnDateTimePicker(false);
                                  setIsReturnClosing(false);
                                }, 200);
                              }}
                              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </LocalizationProvider>
                    </div>
                  )}
                </div>

                  {/* Desktop Round Trip Toggle */}
                    {selectedOption === 'transfer' && (
                    <div className="flex items-center justify-center relative h-[120px] rounded-lg border-2 border-gray-200 w-[10%]">
                <div className="w-full h-full flex flex-col items-center justify-center px-2 gap-2">
                  <span className="text-[10px] text-gray-500">ROUND TRIP</span>
                  <Switch
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    sx={{
                      transform: 'scale(1.5)',
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          color: '#3b82f6',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#3b82f6',
                          },
                        },
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#d1d5db',
                      },
                    }}
                  />
                </div>
              </div>
              )}

                  {/* Desktop Person/Duration Selector */}
              <div className={`flex items-center justify-center relative h-[120px] rounded-lg border-2 border-gray-200 transition-all duration-500 ease-in-out ${
                selectedOption === 'transfer' ? 'w-[90px]' : 'w-[calc(10%+90px)]'
              }`}>
                {selectedOption === 'transfer' ? (
                  <>
                    <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                      <PersonIcon className="text-white w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 h-full flex flex-col items-center justify-center px-2 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowPersonPicker(true)}>
                      <span className="text-gray-500 font-bold text-[10px]">PERSON</span>
                      <span className="text-black text-sm font-bold">
                        {getTotalPersons()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-full w-10 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                      <AccessTimeFilledIcon className="text-white w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 h-full flex flex-col items-center justify-center px-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowDurationPicker(true)}>
                      <span className="text-gray-500 font-bold text-[11px]">DURATION</span>
                      <span className="text-black text-base font-bold">
                        {selectedDuration}h
                      </span>
                    </div>
                  </>
                )}
                
                    {/* Desktop Person Picker - Dropdown style */}
                    {showPersonPicker && !isMobile && (
                      <div className="absolute bottom-0 right-0 z-50" style={{
                        animation: isPersonClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                        transformOrigin: 'bottom right'
                      }}>
                        <div className="person-picker-container bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-200">
                          <h3 className="font-semibold text-gray-800 mb-4">Select Passengers</h3>
                          
                          <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                              <h4 className="font-medium text-gray-800 text-sm">Adults</h4>
                              <p className="text-gray-500 text-xs">13 years and above</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => decrementCounter('adults')}
                                disabled={adults <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <RemoveIcon className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{adults}</span>
                              <button 
                                onClick={() => incrementCounter('adults')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <AddIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                              <h4 className="font-medium text-gray-800 text-sm">Children</h4>
                              <p className="text-gray-500 text-xs">2-12 years</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => decrementCounter('children')}
                                disabled={children <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <RemoveIcon className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{children}</span>
                              <button 
                                onClick={() => incrementCounter('children')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <AddIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <h4 className="font-medium text-gray-800 text-sm">Babies</h4>
                              <p className="text-gray-500 text-xs">Under 2 years</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => decrementCounter('babies')}
                                disabled={babies <= 0}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <RemoveIcon className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{babies}</span>
                              <button 
                                onClick={() => incrementCounter('babies')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <AddIcon className="w-4 h-4" />
                              </button>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <button
                              onClick={() => {
                                setIsPersonClosing(true);
                                setTimeout(() => {
                                  setShowPersonPicker(false);
                                  setIsPersonClosing(false);
                                }, 200);
                              }}
                              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            Done ({getTotalPersons()} {getTotalPersons() === 1 ? 'person' : 'people'})
                          </button>
                        </div>
                    </div>
                      </div>
                )}
                
                {/* Duration Picker */}
                {showDurationPicker && (
                  <div className="absolute bottom-0 right-0 z-50" style={{
                    animation: isDurationClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                    transformOrigin: 'bottom right'
                  }}>
                    <div className="duration-picker-container bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-4">Select Duration</h3>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((hours) => (
                          <button
                            key={hours}
                            onClick={() => setSelectedDuration(hours)}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                              selectedDuration === hours
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {hours}h
                          </button>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Duration (hours)
                        </label>
                        <div className="flex items-center gap-3 justify-center">
                          <button 
                            onClick={() => setSelectedDuration(prev => Math.max(1, prev - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <RemoveIcon className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{selectedDuration}h</span>
                          <button 
                            onClick={() => setSelectedDuration(prev => Math.min(24, prev + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <AddIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setIsDurationClosing(true);
                            setTimeout(() => {
                              setShowDurationPicker(false);
                              setIsDurationClosing(false);
                            }, 200);
                          }}
                          className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Done ({selectedDuration} hour{selectedDuration > 1 ? 's' : ''})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Search Button */}
              <div className="absolute group cursor-pointer -bottom-10 right-7 z-20" onClick={handleSearch}>
                <div className="relative flex items-center justify-between w-60 h-16 bg-black rounded-full overflow-hidden px-6">
                  <span className="text-white text-lg font-bold tracking-wide z-20">Search</span>
                  <div className="absolute right-2 top-2 w-12 h-12 bg-gray-800 rounded-full transition-all duration-500 ease-in-out group-hover:w-56 group-hover:h-12 group-hover:right-2 group-hover:top-2"></div>
                  <div className="absolute right-2 top-2 w-12 h-12 flex items-center justify-center z-30">
                    <ArrowForwardIcon className="text-white w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Date Time Picker Modal */}
      {showDateTimePicker && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className={`bg-white w-full h-[80vh] rounded-t-3xl p-6 pb-20 relative ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Date & Time</h3>
              <button onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setShowDateTimePicker(false);
                  setIsClosing(false);
                }, 300);
              }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Custom Date & Time Display */}
            <div className="flex items-center justify-center mb-5 p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedDateTime || dayjs()).format('MMM DD')}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {(selectedDateTime || dayjs()).format('dddd')}
                  </div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="flex-1 flex items-center gap-2 pl-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedDateTime || dayjs()).format('HH:mm')}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Time
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDateTimePicker
                  orientation="portrait"
                  value={selectedDateTime || dayjs()}
                  onChange={(newValue) => setSelectedDateTime(newValue)}
                  onAccept={(newValue) => {
                    setSelectedDateTime(newValue);
                    setIsClosing(true);
                    setTimeout(() => {
                      setShowDateTimePicker(false);
                      setIsClosing(false);
                    }, 300);
                  }}
                  onViewChange={(view) => {
                    if (['hours', 'minutes'].includes(view)) {
                      setMobilePickerView('time');
                    } else {
                      setMobilePickerView('date');
                    }
                  }}
                  ampm={false}
                  view={mobilePickerView === 'date' ? 'day' : 'hours'}
                  views={mobilePickerView === 'date' ? ['month', 'day'] : ['hours', 'minutes']}
                  closeOnSelect={false}
                  sx={{
                    width: '100%',
                    height: '100%',
                    '& .MuiPickersLayout-root': {
                      backgroundColor: '#ffffff !important',
                      height: '100%',
                    },
                    // Hide only MUI's date/time text displays, keep calendar/clock
                    '& .MuiPickersLayout-toolbar': {
                      display: 'none !important',
                    },
                    '& .MuiDateTimePickerToolbar-root': {
                      display: 'none !important',
                    },
                    '& .MuiPickersToolbar-root': {
                      display: 'none !important',
                    },
                    // Calendar styling
                    '& .MuiPickersDay-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#000000 !important',
                        color: '#ffffff !important',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
                      },
                    },
                    // Clock styling
                    '& .MuiClockPointer-root': {
                      backgroundColor: '#000000 !important',
                    },
                    '& .MuiClockPointer-thumb': {
                      backgroundColor: '#000000 !important',
                      borderColor: '#000000 !important',
                    },
                    '& .MuiClock-pin': {
                      backgroundColor: '#000000 !important',
                    },
                    '& .MuiClockNumber-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#000000 !important',
                        color: '#ffffff !important',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
                      },
                    },
                    // Additional clock styling for all time selections
                    '& .MuiClock-clockNumber': {
                      '&.Mui-selected': {
                        backgroundColor: '#000000 !important',
                        color: '#ffffff !important',
                      },
                    },
                    '& .MuiMultiSectionDigitalClock-root': {
                      '& .Mui-selected': {
                        backgroundColor: '#000000 !important',
                        color: '#ffffff !important',
                      },
                    },
                    // Tab styling for date/time switcher
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#000000 !important',
                    },
                    '& .MuiTab-root': {
                      '&.Mui-selected': {
                        color: '#000000 !important',
                      },
                    },
                  }}
                  slots={{
                    actionBar: () => null,
                  }}
                />
              </LocalizationProvider>
            </div>
            
            {/* Fixed Bottom Button Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setMobilePickerView('date');
                    setIsClosing(true);
                    setTimeout(() => {
                      setShowDateTimePicker(false);
                      setIsClosing(false);
                    }, 300);
                  }}
                  className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                {mobilePickerView === 'date' ? (
                  <button
                    onClick={() => setMobilePickerView('time')}
                    className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobilePickerView('date');
                      setIsClosing(true);
                      setTimeout(() => {
                        setShowDateTimePicker(false);
                        setIsClosing(false);
                      }, 300);
                    }}
                    className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Pickup Date Time Picker Modal */}
      {showPickupDateTimePicker && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className={`bg-white w-full h-[80vh] rounded-t-3xl p-6 pb-20 relative ${isPickupClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Pickup Date & Time</h3>
              <button onClick={() => {
                setIsPickupClosing(true);
                setTimeout(() => {
                  setShowPickupDateTimePicker(false);
                  setIsPickupClosing(false);
                }, 300);
              }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Custom Date & Time Display */}
            <div className="flex items-center justify-center mb-5 p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedPickupDateTime || dayjs()).format('MMM DD')}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {(selectedPickupDateTime || dayjs()).format('dddd')}
                  </div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="flex-1 flex items-center gap-2 pl-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedPickupDateTime || dayjs()).format('HH:mm')}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Time
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDateTimePicker
                  orientation="portrait"
                  value={selectedPickupDateTime || dayjs()}
                  onChange={(newValue) => setSelectedPickupDateTime(newValue)}
                  onAccept={(newValue) => {
                    setSelectedPickupDateTime(newValue);
                    setIsPickupClosing(true);
                    setTimeout(() => {
                      setShowPickupDateTimePicker(false);
                      setIsPickupClosing(false);
                    }, 300);
                  }}
                  onViewChange={(view) => {
                    if (['hours', 'minutes'].includes(view)) {
                      setMobilePickupView('time');
                    } else {
                      setMobilePickupView('date');
                    }
                  }}
                  ampm={false}
                  view={mobilePickupView === 'date' ? 'day' : 'hours'}
                  views={mobilePickupView === 'date' ? ['month', 'day'] : ['hours', 'minutes']}
                  closeOnSelect={false}
                  sx={{
                    width: '100%',
                    height: '100%',
                  '& .MuiPickersLayout-root': {
                    backgroundColor: '#ffffff !important',
                    height: '100%',
                  },
                  // Hide only MUI's date/time text displays, keep calendar/clock
                  '& .MuiPickersLayout-toolbar': {
                    display: 'none !important',
                  },
                  '& .MuiDateTimePickerToolbar-root': {
                    display: 'none !important',
                  },
                  '& .MuiPickersToolbar-root': {
                    display: 'none !important',
                  },
                  // Calendar styling
                  '& .MuiPickersDay-root': {
                    '&.Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                    '&.MuiPickersDay-today': {
                      backgroundColor: '#e5e7eb !important',
                      color: '#374151 !important',
                      border: 'none !important',
                    },
                    '&:hover': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                    '&:focus': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                  },
                  // Clock styling
                  '& .MuiClockPointer-root': {
                    backgroundColor: '#000000 !important',
                  },
                  '& .MuiClockPointer-thumb': {
                    backgroundColor: '#000000 !important',
                    borderColor: '#000000 !important',
                  },
                  '& .MuiClock-pin': {
                    backgroundColor: '#000000 !important',
                  },
                  '& .MuiClockNumber-root': {
                    '&.Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
                    },
                  },
                  // Additional clock styling for all time selections
                  '& .MuiClock-clockNumber': {
                    '&.Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                  },
                  '& .MuiMultiSectionDigitalClock-root': {
                    '& .Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                  },
                  // Tab styling for date/time switcher
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#000000 !important',
                  },
                  '& .MuiTab-root': {
                    '&.Mui-selected': {
                      color: '#000000 !important',
                    },
                  },
                }}
                slots={{
                  actionBar: () => null,
                }}
              />
              </LocalizationProvider>
            </div>
            
            {/* Fixed Bottom Button Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setMobilePickupView('date');
                    setIsPickupClosing(true);
                    setTimeout(() => {
                      setShowPickupDateTimePicker(false);
                      setIsPickupClosing(false);
                    }, 300);
                  }}
                  className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                {mobilePickupView === 'date' ? (
                  <button
                    onClick={() => setMobilePickupView('time')}
                    className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobilePickupView('date');
                      setIsPickupClosing(true);
                      setTimeout(() => {
                        setShowPickupDateTimePicker(false);
                        setIsPickupClosing(false);
                      }, 300);
                    }}
                    className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Return Date Time Picker Modal */}
      {showReturnDateTimePicker && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className={`bg-white w-full h-[80vh] rounded-t-3xl p-6 pb-20 relative ${isReturnClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Return Date & Time</h3>
              <button onClick={() => {
                setIsReturnClosing(true);
                setTimeout(() => {
                  setShowReturnDateTimePicker(false);
                  setIsReturnClosing(false);
                }, 300);
              }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Custom Date & Time Display */}
            <div className="flex items-center justify-center mb-5 p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedReturnDateTime || dayjs()).format('MMM DD')}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {(selectedReturnDateTime || dayjs()).format('dddd')}
                  </div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-gray-300"></div>
              
              <div className="flex-1 flex items-center gap-2 pl-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {(selectedReturnDateTime || dayjs()).format('HH:mm')}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Time
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDateTimePicker
                  orientation="portrait"
                  value={selectedReturnDateTime || dayjs()}
                  onChange={(newValue) => setSelectedReturnDateTime(newValue)}
                  onAccept={(newValue) => {
                    setSelectedReturnDateTime(newValue);
                    setIsReturnClosing(true);
                    setTimeout(() => {
                      setShowReturnDateTimePicker(false);
                      setIsReturnClosing(false);
                    }, 300);
                  }}
                  onViewChange={(view) => {
                    if (['hours', 'minutes'].includes(view)) {
                      setMobileReturnView('time');
                    } else {
                      setMobileReturnView('date');
                    }
                  }}
                  ampm={false}
                  view={mobileReturnView === 'date' ? 'day' : 'hours'}
                  views={mobileReturnView === 'date' ? ['month', 'day'] : ['hours', 'minutes']}
                  closeOnSelect={false}
                  sx={{
                    width: '100%',
                    height: '100%',
                  '& .MuiPickersLayout-root': {
                    backgroundColor: '#ffffff !important',
                    height: '100%',
                  },
                  // Hide only MUI's date/time text displays, keep calendar/clock
                  '& .MuiPickersLayout-toolbar': {
                    display: 'none !important',
                  },
                  '& .MuiDateTimePickerToolbar-root': {
                    display: 'none !important',
                  },
                  '& .MuiPickersToolbar-root': {
                    display: 'none !important',
                  },
                  // Calendar styling
                  '& .MuiPickersDay-root': {
                    '&.Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                    '&.MuiPickersDay-today': {
                      backgroundColor: '#e5e7eb !important',
                      color: '#374151 !important',
                      border: 'none !important',
                    },
                    '&:hover': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                    '&:focus': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                  },
                  // Clock styling
                  '& .MuiClockPointer-root': {
                    backgroundColor: '#000000 !important',
                  },
                  '& .MuiClockPointer-thumb': {
                    backgroundColor: '#000000 !important',
                    borderColor: '#000000 !important',
                  },
                  '& .MuiClock-pin': {
                    backgroundColor: '#000000 !important',
                  },
                  '& .MuiClockNumber-root': {
                    '&.Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
                    },
                  },
                  // Additional clock styling for all time selections
                  '& .MuiClock-clockNumber': {
                    '&.Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                  },
                  '& .MuiMultiSectionDigitalClock-root': {
                    '& .Mui-selected': {
                      backgroundColor: '#000000 !important',
                      color: '#ffffff !important',
                    },
                  },
                  // Tab styling for date/time switcher
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#000000 !important',
                  },
                  '& .MuiTab-root': {
                    '&.Mui-selected': {
                      color: '#000000 !important',
                    },
                  },
                }}
                slots={{
                  actionBar: () => null,
                }}
              />
              </LocalizationProvider>
            </div>
            
            {/* Fixed Bottom Button Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setMobileReturnView('date');
                    setIsReturnClosing(true);
                    setTimeout(() => {
                      setShowReturnDateTimePicker(false);
                      setIsReturnClosing(false);
                    }, 300);
                  }}
                  className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                {mobileReturnView === 'date' ? (
                  <button
                    onClick={() => setMobileReturnView('time')}
                    className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileReturnView('date');
                      setIsReturnClosing(true);
                      setTimeout(() => {
                        setShowReturnDateTimePicker(false);
                        setIsReturnClosing(false);
                      }, 300);
                    }}
                    className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Person Picker Modal */}
      {showPersonPicker && isMobile && selectedOption === 'transfer' && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className={`bg-white w-full rounded-t-3xl p-6 ${isPersonPickerClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Select Passengers</h3>
              <button onClick={() => {
                setIsPersonPickerClosing(true);
                setTimeout(() => {
                  setShowPersonPicker(false);
                  setIsPersonPickerClosing(false);
                }, 300);
              }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <h4 className="font-medium">Adults</h4>
                <p className="text-sm text-gray-500">13 years and above</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => decrementCounter('adults')}
                  disabled={adults <= 0}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <RemoveIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{adults}</span>
                <button 
                  onClick={() => incrementCounter('adults')}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <AddIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <h4 className="font-medium">Children</h4>
                <p className="text-sm text-gray-500">2-12 years</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => decrementCounter('children')}
                  disabled={children <= 0}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <RemoveIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{children}</span>
                <button 
                  onClick={() => incrementCounter('children')}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <AddIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <h4 className="font-medium">Babies</h4>
                <p className="text-sm text-gray-500">Under 2 years</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => decrementCounter('babies')}
                  disabled={babies <= 0}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <RemoveIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{babies}</span>
                <button 
                  onClick={() => incrementCounter('babies')}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  <AddIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPersonPickerClosing(true);
                setTimeout(() => {
                  setShowPersonPicker(false);
                  setIsPersonPickerClosing(false);
                }, 300);
              }}
              className="w-full bg-black text-white py-3 rounded-lg font-medium mt-6"
            >
              Done ({getTotalPersons()} people)
            </button>
          </div>
        </div>
      )}

      {/* Mobile Duration Picker Modal */}
      {showDurationPicker && isMobile && selectedOption === 'rent' && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Select Duration</h3>
              <button onClick={() => setShowDurationPicker(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setSelectedDuration(hours)}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    selectedDuration === hours
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Custom Duration (hours)
              </label>
              <div className="flex items-center gap-3 justify-center">
                <button 
                  onClick={() => setSelectedDuration(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <RemoveIcon className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-medium text-lg">{selectedDuration}h</span>
                <button 
                  onClick={() => setSelectedDuration(prev => Math.min(24, prev + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <AddIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowDurationPicker(false)}
              className="w-full bg-black text-white py-3 rounded-lg font-medium mt-6"
            >
              Done ({selectedDuration} hour{selectedDuration > 1 ? 's' : ''})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
