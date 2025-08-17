"use client"

import Image from "next/image";
import webBanner from "../assets/web-banner.jpg"
import Slider from "@/components/Slider";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import { Switch } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "@/components/Navbar";


export default function Home() {
  const router = useRouter();
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  // Set document title on client side
  useEffect(() => {
    document.title = "Khan Travel - Premium Transfer & Car Rental Services";
  }, []);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  
  // Round trip için yeni state'ler
  const [selectedPickupDateTime, setSelectedPickupDateTime] = useState(null);
  const [selectedReturnDateTime, setSelectedReturnDateTime] = useState(null);
  const [showPickupDateTimePicker, setShowPickupDateTimePicker] = useState(false);
  const [showReturnDateTimePicker, setShowReturnDateTimePicker] = useState(false);
  const [isPickupClosing, setIsPickupClosing] = useState(false);
  const [isReturnClosing, setIsReturnClosing] = useState(false);

  // Person seçici için state'ler
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [isPersonClosing, setIsPersonClosing] = useState(false);

  // Location input'ları için state'ler
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

  // Seçim göstergesi için state'ler
  const [selectedOption, setSelectedOption] = useState('transfer'); // 'transfer' veya 'rent'
  const [isAnimating, setIsAnimating] = useState(false);

  // Duration seçici için state'ler
  const [selectedDuration, setSelectedDuration] = useState(1); // Saat cinsinden
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [isDurationClosing, setIsDurationClosing] = useState(false);

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
  const [isSwapping, setIsSwapping] = useState(false);
  const [fromJustSelected, setFromJustSelected] = useState(false);
  const [toJustSelected, setToJustSelected] = useState(false);
  
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

  // Google Places API configuration moved to API route

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
    
    console.log('Frontend: Searching for:', query);
    
    try {
      const response = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      
      console.log('Frontend: API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Frontend: API Error:', errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Frontend: Received data:', data);
      
      if (data.error) {
        console.error('Frontend: API returned error:', data.error);
        return [];
      }
      
      if (data.status === 'OK' && data.predictions) {
        console.log('Frontend: Processing', data.predictions.length, 'predictions');
        return data.predictions.map((prediction, index) => ({
          id: prediction.place_id || index,
          name: prediction.structured_formatting?.main_text || prediction.description,
          address: prediction.description,
          types: prediction.types || [],
          icon: getLocationIcon(prediction.types),
          placeId: prediction.place_id
        }));
      } else {
        console.log('Frontend: API status:', data.status, 'predictions:', data.predictions?.length || 0);
      }
      
      return [];
    } catch (error) {
      console.error('Frontend: Google Places API error:', error);
      return [];
    }
  }, []);

  // Debounced search with useEffect
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      const searchQuery = fromWhere.split(' | ')[0];
      // Sadece kullanıcı yazarken ve input fokusken ara
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
      // Sadece kullanıcı yazarken ve input fokusken ara
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
    // Ana isim | Tam adres formatında kaydet
    const fullLocationText = `${location.name} | ${location.address}`;
    
    if (type === 'from') {
      setFromTyping(false);
      setShowFromResults(false);
      setFromSearchResults([]);
      
      // Swap mantığı gibi: önce fade out, sonra değiştir, sonra fade in
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
      
      // Swap mantığı gibi: önce fade out, sonra değiştir, sonra fade in
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
    
    // Rent moduna geçildiğinde Round Trip'i kapat
    if (option === 'rent') {
      setIsRoundTrip(false);
    }
    
    // Animasyon tamamlandıktan sonra animating state'ini sıfırla
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle search button click
  const handleSearch = () => {
    // Create URL parameters
    const params = new URLSearchParams();
    
    // Add locations
    if (fromWhere) params.append('from', fromWhere);
    if (toWhere) params.append('to', toWhere);
    
    // Add trip type
    params.append('type', selectedOption);
    
    // Add date and time based on trip type
    if (isRoundTrip) {
      // Round trip dates
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
      // Single trip date
      if (selectedDateTime) {
        params.append('date', selectedDateTime.format('DD MMMM, ddd'));
        params.append('time', selectedDateTime.format('HH:mm'));
      }
      params.append('roundTrip', 'false');
    }
    
    // Add duration for rent mode
    if (selectedOption === 'rent') {
      params.append('duration', selectedDuration.toString());
    }
    
    // Add passengers
    params.append('passengers', getTotalPersons().toString());
    
    // Navigate to transfer page with params
    router.push(`/transfer?${params.toString()}`);
  };

  // Click outside to close popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close person picker
      if (showPersonPicker && !event.target.closest('.person-picker-container')) {
        setIsPersonClosing(true);
        setTimeout(() => {
          setShowPersonPicker(false);
          setIsPersonClosing(false);
        }, 200);
      }
      
      // Close duration picker
      if (showDurationPicker && !event.target.closest('.duration-picker-container')) {
        setIsDurationClosing(true);
        setTimeout(() => {
          setShowDurationPicker(false);
          setIsDurationClosing(false);
        }, 200);
      }
      
      // Close location search results
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
  }, [showPersonPicker, showDurationPicker, showFromResults, showToResults]);

  return (
    <> 
     <Navbar />
     <main className="w-screen flex flex-col h-[300vh] bg-slate-200">


    <div className="h-screen w-screen flex items-center justify-center bg-slate-100 pt-28"> 
      
      <div className=" w-[94%] h-full bg-slate-50 rounded-t-3xl   "> 
      
        <div className="w-full h-full flex flex-col gap-10  bg-slate-50 relative  justify-center px-5  ">
          <Slider/>
          <Image src={webBanner} alt="Travel banner background" className="absolute right-0 w-[%80] h-full object-cover rounded-t-3xl z-0" />
           
           {/*  Search Area */}
        <div className="flex flex-col z-10 w-[90%] h-auto  self-center"> 

          <div className="relative flex items-center px-5 justify-between w-[310px] h-[50px] rounded-t-2xl bg-white overflow-hidden">
            {/* Animasyonlu arka plan göstergesi */}
            <div 
              className={`absolute top-1/2 transform -translate-y-1/2 h-[70%] bg-gray-800 rounded-full transition-all duration-300 ease-in-out ${
                selectedOption === 'transfer' 
                  ? 'left-3 w-28' 
                  : 'left-[calc(100%-10rem-1.25rem)] w-44'
              }`}
            />
            
            {/* Transfer seçeneği */}
            <div 
              className={`relative z-10 flex items-center justify-center gap-2 h-[70%] w-24 cursor-pointer rounded-full text-sm font-semibold transition-colors duration-300 ${
                selectedOption === 'transfer' ? 'text-white' : 'text-[rgb(87,87,87)]'
              }`}
              onClick={() => handleOptionChange('transfer')}
            >
              <DirectionsCarIcon className="w-4 h-4" />
              Transfer
            </div>
            
            {/* Rent By The Hour seçeneği */}
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

           <div className="self-center flex px-10 items-center justify-center gap-5 rounded-b-lg bg-white shadow-lg w-full h-[200px]  z-10 relative">
            
            {/* Swap Button - Üst orta */}
            <div className="absolute top-4 left-[48%] transform -translate-x-1/2 z-20">
              <button 
                onClick={swapLocations}
                className="group bg-white border-2 border-gray-200 rounded-full w-10 h-10 flex items-center justify-center hover:border-black transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-black/60 cursor-pointer"
              >
                <SyncAltIcon className="w-4 h-4 text-gray-600 group-hover:text-black transition-colors duration-300 transform group-hover:rotate-180" />
              </button>
            </div>
            
                           {/* From Where*/}
               <div className="relative h-[120px] w-[27%] rounded-lg border-2 border-gray-200 flex">
                 {/* Sol taraf - Location İkonu */}
                 <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                   <FlightTakeoffIcon className="text-white w-5 h-5" />
                 </div>
                 
                 {/* Sağ taraf - Input */}
                  <div 
                    className="flex-1 h-full flex flex-col relative cursor-text"
                    onClick={() => {
                      if (!fromFocused) setFromFocused(true);
                      setTimeout(() => document.getElementById('fromInput')?.focus(), 0);
                    }}
                  >
                   <div className="relative h-full flex flex-col justify-center px-4">
                     {/* Normal durum - grup olarak ortalı */}
                     {!fromFocused && !fromWhere && (
                       <div className="flex flex-col items-start">
                         <span className="text-sm font-bold text-black">
                           {selectedOption === 'rent' ? 'PICKUP LOCATION' : 'FROM WHERE'}
                         </span>
                         <span className="text-gray-500 text-[10px] mt-1">Address, Airport, Hotel, Hospital...</span>
                       </div>
                     )}
                     
                     {/* Focus durumu - label yukarı */}
                     <label 
                       className={`absolute transition-all duration-200 ease-in-out cursor-text ${
                         fromFocused || fromWhere 
                           ? 'top-2 left-4 text-[10px] text-gray-500 font-medium' 
                           : 'opacity-0'
                       }`}
                     >
                       {selectedOption === 'rent' ? 'PICKUP LOCATION' : 'FROM WHERE'}
                     </label>
                     
                     {/* Input alanı - yazı varken iki satır göster */}
                     {fromWhere && !fromFocused ? (
                       <div className={`absolute inset-0 flex flex-col justify-center items-start px-4 transition-opacity duration-200 ease-out ${
                         isSwapping || fromJustSelected 
                           ? 'opacity-0' 
                           : 'opacity-100'
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
                         {/* Clear button */}
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             clearFromLocation();
                           }}
                           className="absolute top-2 right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200 group cursor-pointer"
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
                         onFocus={() => setFromFocused(true)}
                         onBlur={() => setFromFocused(false)}
                         placeholder=""
                         className={`absolute w-full bg-transparent border-none outline-none transition-all duration-200 ${
                           fromFocused || fromWhere 
                             ? 'top-1/2 left-4 right-4 transform -translate-y-1/2 text-sm font-bold text-black' 
                             : 'text-transparent h-0'
                         }`}
                         style={{ width: 'calc(100% - 2rem)' }}
                       />
                     )}
                   </div>
                 </div>
                 
                 {/* Search Results */}
                 {(showFromResults || fromLoading) && (
                   <div className="from-results absolute top-full left-0 w-full z-50 mt-2">
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
                             className="flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
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
                          No locations found for &quot;{fromWhere}&quot;
                        </div>
                       ) : null}
                     </div>
                   </div>
                 )}
               </div>
             
              {/* To Where*/}
             <div className="relative h-[120px] w-[27%] rounded-lg border-2 border-gray-200 flex">
               {/* Sol taraf - Destination İkonu */}
               <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                 <FlightLandIcon className="text-white w-5 h-5" />
               </div>
               
               {/* Sağ taraf - Input */}
                <div 
                  className="flex-1 h-full flex flex-col relative cursor-text"
                  onClick={() => {
                    if (!toFocused) setToFocused(true);
                    setTimeout(() => document.getElementById('toInput')?.focus(), 0);
                  }}
                >
                 <div className="relative h-full flex flex-col justify-center px-4">
                   {/* Normal durum - grup olarak ortalı */}
                   {!toFocused && !toWhere && (
                     <div className="flex flex-col items-start">
                       <span className="text-sm font-bold text-black">
                         {selectedOption === 'rent' ? 'DROP OFF POINT' : 'TO WHERE'}
                       </span>
                       <span className="text-gray-500 text-[10px] mt-1">Address, Airport, Hotel, Hospital...</span>
                     </div>
                   )}
                   
                   {/* Focus durumu - label yukarı */}
                   <label 
                     className={`absolute transition-all duration-200 ease-in-out cursor-text ${
                       toFocused || toWhere 
                         ? 'top-2 left-4 text-[10px] text-gray-500 font-medium' 
                         : 'opacity-0'
                     }`}
                   >
                     {selectedOption === 'rent' ? 'DROP OFF POINT' : 'TO WHERE'}
                   </label>
                   
                   {/* Input alanı - yazı varken iki satır göster */}
                   {toWhere && !toFocused ? (
                     <div className={`absolute inset-0 flex flex-col justify-center items-start px-4 transition-opacity duration-200 ease-out ${
                       isSwapping || toJustSelected 
                         ? 'opacity-0' 
                         : 'opacity-100'
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
                       {/* Clear button */}
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           clearToLocation();
                         }}
                         className="absolute top-2 right-2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200 group cursor-pointer"
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
                       onFocus={() => setToFocused(true)}
                       onBlur={() => setToFocused(false)}
                       placeholder=""
                       className={`absolute w-full bg-transparent border-none outline-none transition-all duration-200 ${
                         toFocused || toWhere 
                           ? 'top-1/2 left-4 right-4 transform -translate-y-1/2 text-sm font-bold text-black' 
                           : 'text-transparent h-0'
                       }`}
                       style={{ width: 'calc(100% - 2rem)' }}
                     />
                   )}
                 </div>
               </div>
               
               {/* Search Results */}
               {(showToResults || toLoading) && (
                 <div className="to-results absolute top-full left-0 w-full z-50 mt-2">
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
                           className="flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
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
                        No locations found for &quot;{toWhere}&quot;
                      </div>
                     ) : null}
                   </div>
                 </div>
               )}
             </div>


             {/* Date Time Picker */}
             {!isRoundTrip ? (
               // Tek yönlü seyahat için mevcut picker
               <div className="flex items-center justify-center relative h-[120px] w-[26%] rounded-lg border-2 border-gray-200">
                 {/* Sol taraf - Takvim İkonu */}
                 <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                   <CalendarTodayIcon className="text-white w-5 h-5" />
                 </div>
                 
                 {/* Sağ taraf - İçerik */}
                 <div className="flex-1 h-full flex items-center px-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowDateTimePicker(true)}>
                   <div className="flex flex-col">
                     <span className={`text-black font-medium ${selectedDateTime ? 'text-[10px] text-gray-500' : 'text-sm font-bold'}`}>
                       {selectedOption === 'rent' ? 'SELECT DATE' : 'DATE & TIME'}
                     </span>
                     {selectedDateTime ? (
                       <span className="text-black text-sm font-bold">
                         {selectedDateTime.format('DD MMMM, ddd HH:mm')}
                       </span>
                     ) : (
                       <span className="text-gray-500 text-[10px]">
                         {selectedOption === 'rent' ? 'Rental Date' : 'Starting Date'}
                       </span>
                     )}
                   </div>
                 </div>
                 
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
                         ampm={false}
                         views={['year', 'month', 'day', 'hours', 'minutes']}
                         closeOnSelect={false}
                         sx={{
                           backgroundColor: '#1a1a1a',
                           color: '#ffffff',
                           borderRadius: '16px !important',
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
                             borderRadius: '16px !important',
                             overflow: 'hidden !important',
                             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important',
                           },
                           '& .MuiPickersLayout-contentWrapper': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersDay-root': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                             '&.MuiPickersDay-today': {
                               border: '1px solid #3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiDayCalendar-weekDayLabel': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-root': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-label': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-switchViewButton': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersArrowSwitcher-button': {
                             color: '#ffffff !important',
                           },
                           '& .MuiClockNumber-root': {
                             color: '#ffffff !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiClock-clock': {
                             backgroundColor: '#2a2a2a !important',
                           },
                           '& .MuiClockPointer-root': {
                             backgroundColor: '#3b82f6 !important',
                           },
                           '& .MuiClockPointer-thumb': {
                             backgroundColor: '#3b82f6 !important',
                             border: '2px solid #ffffff !important',
                           },
                           '& .MuiClock-pin': {
                             backgroundColor: '#3b82f6 !important',
                           },
                           '& .MuiPickersYear-yearButton': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiPickersMonth-monthButton': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiPickersTimeZoneToolbar-label': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersTimeZoneToolbar-valueLabel': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersLayout-toolbar': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersLayout-actionBar': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiButton-root': {
                             color: '#ffffff !important',
                             '&.MuiButton-textPrimary': {
                               color: '#3b82f6 !important',
                             },
                           },
                           '& .MuiTypography-root': {
                             color: '#ffffff !important',
                           },
                           '& .MuiSvgIcon-root': {
                             color: '#ffffff !important',
                           },
                           '& .MuiIconButton-root': {
                             color: '#ffffff !important',
                             '&:hover': {
                               backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                             },
                           },
                         }}
                       />
                     </LocalizationProvider>
                   </div>
                 )}
               </div>
             ) : (
               // Round trip için çift picker
               <div className="flex items-center justify-center relative h-[120px] w-[26%] rounded-lg border-2 border-gray-200">
                 
                 {/* Sol taraf - Takvim İkonu */}
                 <div className="h-full w-12 bg-zinc-900 flex flex-col items-center justify-center gap-1 rounded-l-lg">
                   <CalendarTodayIcon className="text-white w-4 h-4" />
                   <SwapHorizIcon className="text-white w-3 h-3" />
                 </div>
                 
                 {/* Sağ taraf - İkiye bölünmüş alan */}
                 <div className="flex-1 h-full flex">
                   {/* Pick Up Tarih Seçici */}
                   <div className="w-1/2 h-full flex flex-col justify-center px-2 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowPickupDateTimePicker(true)}>
                     <span className="text-gray-500 font-bold text-[10px]">PICK UP</span>
                     {selectedPickupDateTime ? (
                       <span className="text-black text-sm font-bold">
                         {selectedPickupDateTime.format('DD MMM, HH:mm')}
                       </span>
                     ) : (
                       <span className="text-gray-500 text-[8px]">Date</span>
                     )}
                   </div>
                   
                   {/* Dikey ayırıcı çizgi */}
                   <div className="w-[1px] h-[60%] bg-gray-300 self-center"></div>
                   
                   {/* Return Tarih Seçici */}
                   <div className="w-1/2 h-full flex flex-col justify-center px-2 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowReturnDateTimePicker(true)}>
                     <span className="text-gray-500 font-bold text-[10px]">RETURN</span>
                     {selectedReturnDateTime ? (
                       <span className="text-black text-sm font-bold">
                         {selectedReturnDateTime.format('DD MMM, HH:mm')}
                       </span>
                     ) : (
                       <span className="text-gray-500 text-[8px]">Date</span>
                     )}
                   </div>
                 </div>
                 
                 {/* Pick Up DateTimePicker */}
                 {showPickupDateTimePicker && (
                   <div className="absolute bottom-0 left-0 z-50" style={{
                     animation: isPickupClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                     transformOrigin: 'bottom left'
                   }}>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                       <StaticDateTimePicker
                         orientation="landscape"
                         value={selectedPickupDateTime || dayjs()}
                         onChange={(newValue) => {
                           setSelectedPickupDateTime(newValue);
                           // Return tarihi pick up tarihinden önceyse sıfırla
                           if (selectedReturnDateTime && newValue && selectedReturnDateTime.isBefore(newValue)) {
                             setSelectedReturnDateTime(null);
                           }
                         }}
                         onAccept={(newValue) => {
                           setSelectedPickupDateTime(newValue);
                           // Return tarihi pick up tarihinden önceyse sıfırla
                           if (selectedReturnDateTime && newValue && selectedReturnDateTime.isBefore(newValue)) {
                             setSelectedReturnDateTime(null);
                           }
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
                         ampm={false}
                         views={['year', 'month', 'day', 'hours', 'minutes']}
                         closeOnSelect={false}
                         sx={{
                           backgroundColor: '#1a1a1a',
                           color: '#ffffff',
                           borderRadius: '16px !important',
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
                             borderRadius: '16px !important',
                             overflow: 'hidden !important',
                             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important',
                           },
                           '& .MuiPickersLayout-contentWrapper': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersDay-root': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                             '&.MuiPickersDay-today': {
                               border: '1px solid #3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiDayCalendar-weekDayLabel': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-root': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-label': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-switchViewButton': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersArrowSwitcher-button': {
                             color: '#ffffff !important',
                           },
                           '& .MuiClockNumber-root': {
                             color: '#ffffff !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiClock-clock': {
                             backgroundColor: '#2a2a2a !important',
                           },
                           '& .MuiClockPointer-root': {
                             backgroundColor: '#3b82f6 !important',
                           },
                           '& .MuiClockPointer-thumb': {
                             backgroundColor: '#3b82f6 !important',
                             border: '2px solid #ffffff !important',
                           },
                           '& .MuiClock-pin': {
                             backgroundColor: '#3b82f6 !important',
                           },
                           '& .MuiPickersYear-yearButton': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiPickersMonth-monthButton': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiPickersTimeZoneToolbar-label': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersTimeZoneToolbar-valueLabel': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersLayout-toolbar': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersLayout-actionBar': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiButton-root': {
                             color: '#ffffff !important',
                             '&.MuiButton-textPrimary': {
                               color: '#3b82f6 !important',
                             },
                           },
                           '& .MuiTypography-root': {
                             color: '#ffffff !important',
                           },
                           '& .MuiSvgIcon-root': {
                             color: '#ffffff !important',
                           },
                           '& .MuiIconButton-root': {
                             color: '#ffffff !important',
                             '&:hover': {
                               backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                             },
                           },
                         }}
                       />
                     </LocalizationProvider>
                   </div>
                 )}
                 
                 {/* Return DateTimePicker */}
                 {showReturnDateTimePicker && (
                   <div className="absolute bottom-0 right-0 z-50" style={{
                     animation: isReturnClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                     transformOrigin: 'bottom right'
                   }}>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                       <StaticDateTimePicker
                         orientation="landscape"
                         value={selectedReturnDateTime || dayjs()}
                         minDate={selectedPickupDateTime || dayjs()}
                         shouldDisableDate={(date) => selectedPickupDateTime && date.isBefore(selectedPickupDateTime, 'day')}
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
                         ampm={false}
                         views={['year', 'month', 'day', 'hours', 'minutes']}
                         closeOnSelect={false}
                         sx={{
                           backgroundColor: '#1a1a1a',
                           color: '#ffffff',
                           borderRadius: '16px !important',
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
                             borderRadius: '16px !important',
                             overflow: 'hidden !important',
                             boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important',
                           },
                           '& .MuiPickersLayout-contentWrapper': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersDay-root': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                             '&.MuiPickersDay-today': {
                               border: '1px solid #3b82f6 !important',
                               color: '#ffffff !important',
                             },
                             '&.Mui-disabled': {
                               color: '#888888 !important',
                               textDecoration: 'line-through !important',
                               textDecorationColor: '#ff6b6b !important',
                               textDecorationThickness: '2px !important',
                             },
                           },
                           '& .MuiDayCalendar-weekDayLabel': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-root': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-label': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersCalendarHeader-switchViewButton': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersArrowSwitcher-button': {
                             color: '#ffffff !important',
                           },
                           '& .MuiClockNumber-root': {
                             color: '#ffffff !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiClock-clock': {
                             backgroundColor: '#2a2a2a !important',
                           },
                           '& .MuiClockPointer-root': {
                             backgroundColor: '#3b82f6 !important',
                           },
                           '& .MuiClockPointer-thumb': {
                             backgroundColor: '#3b82f6 !important',
                             border: '2px solid #ffffff !important',
                           },
                           '& .MuiClock-pin': {
                             backgroundColor: '#3b82f6 !important',
                           },
                           '& .MuiPickersYear-yearButton': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiPickersMonth-monthButton': {
                             color: '#ffffff !important',
                             borderRadius: '8px !important',
                             '&.Mui-selected': {
                               backgroundColor: '#3b82f6 !important',
                               color: '#ffffff !important',
                             },
                           },
                           '& .MuiPickersTimeZoneToolbar-label': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersTimeZoneToolbar-valueLabel': {
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersLayout-toolbar': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiPickersLayout-actionBar': {
                             backgroundColor: '#1a1a1a !important',
                             color: '#ffffff !important',
                           },
                           '& .MuiButton-root': {
                             color: '#ffffff !important',
                             '&.MuiButton-textPrimary': {
                               color: '#3b82f6 !important',
                             },
                           },
                           '& .MuiTypography-root': {
                             color: '#ffffff !important',
                           },
                           '& .MuiSvgIcon-root': {
                             color: '#ffffff !important',
                           },
                           '& .MuiIconButton-root': {
                             color: '#ffffff !important',
                             '&:hover': {
                               backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                             },
                           },
                         }}
                       />
                     </LocalizationProvider>
                   </div>
                 )}
               </div>
             )}
            
                         {/* İs Round Trip - Animasyonlu gösterim/gizleme */}
            <div className={`flex items-center justify-center relative h-[120px] rounded-lg border-2 border-gray-200 transition-all duration-500 ease-in-out overflow-hidden ${
              selectedOption === 'transfer' ? 'w-[10%] opacity-100' : 'w-0 opacity-0'
            }`}>
               <div className="w-full h-full flex flex-col items-center justify-center px-2 gap-2">
                 <span className=" text-[10px] text-gray-500 ">ROUND TRIP</span>
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

             {/* Person - Transfer modunda göster, Rent modunda Duration göster */}
              <div className={`flex items-center justify-center relative h-[120px] rounded-lg border-2 border-gray-200 transition-all duration-500 ease-in-out ${
                selectedOption === 'transfer' ? 'w-[90px]' : 'w-[calc(10%+90px)]'
              }`}>
                {selectedOption === 'transfer' ? (
                  <>
                    {/* Sol taraf - Person İkonu */}
                    <div className="h-full w-12 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                      <PersonIcon className="text-white w-5 h-5" />
                    </div>
                    
                    {/* Sağ taraf - İçerik */}
                    <div className="flex-1 h-full flex flex-col items-center justify-center px-2 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowPersonPicker(true)}>
                      <span className="text-gray-500 font-bold text-[10px]">PERSON</span>
                      <span className="text-black text-sm font-bold">
                        {getTotalPersons()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Sol taraf - Duration İkonu */}
                    <div className="h-full w-10 bg-zinc-900 flex items-center justify-center rounded-l-lg">
                      <AccessTimeFilledIcon className="text-white w-6 h-6" />
                    </div>
                    
                    {/* Sağ taraf - İçerik */}
                    <div className="flex-1 h-full flex flex-col items-center justify-center px-4 cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => setShowDurationPicker(true)}>
                      <span className="text-gray-500 font-bold text-[11px]">DURATION</span>
                      <span className="text-black text-base font-bold">
                        {selectedDuration}h
                      </span>
                    </div>
                  </>
                )}
                
                {/* Person Picker */}
                {showPersonPicker && (
                  <div className="absolute bottom-0 right-0 z-50" style={{
                    animation: isPersonClosing ? 'fadeOutScale 0.2s ease-in' : 'fadeInScale 0.3s ease-out',
                    transformOrigin: 'bottom right'
                  }}>
                    <div className="person-picker-container bg-white rounded-2xl shadow-2xl p-6 w-116 border border-gray-200">
                      {/* Adults */}
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-800">Adults</h4>
                          <p className="text-sm text-gray-500">13 years and above</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => decrementCounter('adults')}
                            disabled={adults <= 0}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <RemoveIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{adults}</span>
                          <button 
                            onClick={() => incrementCounter('adults')}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <AddIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Children */}
                      <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-800">Children</h4>
                          <p className="text-sm text-gray-500">2-12 years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => decrementCounter('children')}
                            disabled={children <= 0}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <RemoveIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{children}</span>
                          <button 
                            onClick={() => incrementCounter('children')}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <AddIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Babies */}
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h4 className="font-medium text-gray-800">Babies</h4>
                          <p className="text-sm text-gray-500">Under 2 years</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => decrementCounter('babies')}
                            disabled={babies <= 0}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <RemoveIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{babies}</span>
                          <button 
                            onClick={() => incrementCounter('babies')}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <AddIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="mt-6">
                        <button
                          onClick={() => {
                            setIsPersonClosing(true);
                            setTimeout(() => {
                              setShowPersonPicker(false);
                              setIsPersonClosing(false);
                            }, 200);
                          }}
                          className="w-full bg-slate-900 text-white py-3 cursor-pointer rounded-lg font-medium hover:bg-slate-700 transition-colors"
                        >
                          Done ({getTotalPersons()} people)
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
                      
                      {/* Duration Options */}
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
                      
                      {/* Custom Duration */}
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
                      
                      {/* Footer */}
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

                                   {/* Search Button */}
             <div className="absolute group cursor-pointer -bottom-10 right-7 z-20" onClick={handleSearch}>
               <div className="relative flex items-center justify-between w-60 h-16 bg-black rounded-full overflow-hidden px-6">
                 {/* Search Text - Left aligned */}
                 <span className="text-white text-lg font-bold tracking-wide z-20">Search</span>
                 
                 {/* Expanding Black Background */}
                 <div className="absolute right-2 top-2 w-12 h-12 bg-gray-800 rounded-full transition-all duration-500 ease-in-out group-hover:w-56 group-hover:h-12 group-hover:right-2 group-hover:top-2"></div>
                 
                 {/* Arrow Icon */}
                 <div className="absolute right-2 top-2 w-12 h-12 flex items-center justify-center z-30">
                   <ArrowForwardIcon className="text-white w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                 </div>
               </div>
             </div>

              </div>
       
       
        </div>
       
       
        </div>
     </div>
    

      </div>
     
    </main>
    </>
 
  );
} 