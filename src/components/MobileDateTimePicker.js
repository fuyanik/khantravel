"use client"

import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function MobileDateTimePicker({
  isOpen,
  onClose,
  value,
  onChange,
  title,
  dateFading = false,
  timeFading = false
}) {
  const [view, setView] = useState('date'); // 'date' or 'time'
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setView('date');
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleComplete = () => {
    setView('date');
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end">
      <div className={`bg-white w-full flex flex-col h-[80vh] rounded-t-3xl p-6 pb-20 relative ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
       
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={handleClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Custom Date & Time Display - Hidden only on very small screens (iPhone 7 and below) */}
        <div className="hidden min-[380px]:flex items-center justify-center mb-2 p-4 bg-gray-50 rounded-2xl">
          <div className="flex-1 flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className={`text-lg font-bold text-gray-900 transition-opacity duration-200 ${dateFading ? 'opacity-0' : 'opacity-100'}`}>
                {(value || dayjs()).format('MMM DD')}
              </div>
              <div className={`text-xs text-gray-500 uppercase tracking-wide transition-opacity duration-200 ${dateFading ? 'opacity-0' : 'opacity-100'}`}>
                {(value || dayjs()).format('dddd')}
              </div>
            </div>
          </div>
          
          
          
          <div className="flex-1 flex items-center gap-2 pl-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className={`text-lg font-bold text-gray-900 transition-opacity duration-200 ${timeFading ? 'opacity-0' : 'opacity-100'}`}>
                {(value || dayjs()).format('HH:mm')}
              </div>
              <div className={`text-xs text-gray-500 uppercase tracking-wide transition-opacity duration-200 ${timeFading ? 'opacity-0' : 'opacity-100'}`}>
                Time
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1  ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker
              orientation="portrait"
              value={value || dayjs()}
              onChange={onChange}
              onAccept={handleComplete}
              onViewChange={(newView) => {
                if (['hours', 'minutes'].includes(newView)) {
                  setView('time');
                } else {
                  setView('date');
                }
              }}
              ampm={false}
              view={view === 'date' ? 'day' : 'hours'}
              views={view === 'date' ? ['month', 'day'] : ['hours', 'minutes']}
              closeOnSelect={false}
              sx={{
                width: '100%',
                height: '100%',
                '& .MuiPickersLayout-root': {
                  backgroundColor: '#ffffff !important',
                  height: '100%',
                  width: '100%',
                },
                '& .MuiDayCalendar-root': {
                  width: '100% !important',
                  maxWidth: 'none !important',
                  overflow: 'visible !important',
                },
                '& .MuiPickersCalendarHeader-root': {
                  width: '100% !important',
                  maxWidth: 'none !important',
                  paddingLeft: '0px !important',
                  paddingRight: '0px !important',
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  maxWidth: 'none !important',
                  fontSize: '0.75rem !important',
                  margin: '0 2px !important',
                  // Compact for very small screens (iPhone 7 and below)  
                  '@media (max-width: 379px)': {
                    fontSize: '0.65rem !important',
                    margin: '0 1px !important',
                  },
                  // Extra spacing for very large screens (iPhone 15 Pro Max and above)
                  '@media (min-width: 430px)': {
                    margin: '0 6px !important',
                    fontSize: '0.8rem !important',
                  },
                },
                '& .MuiDayCalendar-slideTransition': {
                  width: '100% !important',
                  minHeight: '240px !important',
                  height: 'auto !important',
                },
                '& .MuiDayCalendar-weekContainer': {
                  width: '100% !important',
                  justifyContent: 'space-between !important',
                  // Extra spacing for very large screens (iPhone 15 Pro Max and above)
                  '@media (min-width: 430px)': {
                    justifyContent: 'space-around !important',
                    padding: '0 8px !important',
                  },
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
                  width: '40px !important',
                  height: '40px !important',
                  minHeight: '40px !important',
                  display: 'inline-flex !important',
                  alignItems: 'center !important',
                  justifyContent: 'center !important',
                  fontSize: '0.875rem !important',
                  fontWeight: '400 !important',
                  color: '#374151 !important',
                  margin: '2px !important',
                  // Compact for very small screens (iPhone 7 and below)
                  '@media (max-width: 379px)': {
                    width: '32px !important',
                    height: '32px !important',
                    minHeight: '32px !important',
                    fontSize: '0.75rem !important',
                    margin: '2px !important',
                  },
                  // Extra spacing for very large screens (iPhone 15 Pro Max and above)
                  '@media (min-width: 430px)': {
                    width: '44px !important',
                    height: '42px !important',
                    minHeight: '35px !important',
                    margin: '3px !important',
                    fontSize: '0.9rem !important',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#000000 !important',
                    color: '#ffffff !important',
                    borderRadius: '50% !important',
                  },
                  '&.MuiPickersDay-today': {
                    backgroundColor: '#e5e7eb !important',
                    color: '#374151 !important',
                    border: 'none !important',
                  },
                  '&:hover': {
                    backgroundColor: '#000000 !important',
                    color: '#ffffff !important',
                    borderRadius: '50% !important',
                  },
                  '&:focus': {
                    backgroundColor: '#000000 !important',
                    color: '#ffffff !important',
                    borderRadius: '50% !important',
                  },
                },
                // Clock styling
                '& .MuiTimeClock-root': {
                  width: '100% !important',
                  maxWidth: 'none !important',
                },
                '& .MuiClock-root': {
                  width: '100% !important',
                  maxWidth: 'none !important',
                },
                '& .MuiClock-clock': {
                  width: '80% !important',
                  maxWidth: 'none !important',
                  margin: '0 auto !important',
                },
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
                    borderRadius: '50% !important',
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
                    borderRadius: '50% !important',
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
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5  ">
         
          <div className="flex justify-between items-center h-[8vh]">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            {view === 'date' ? (
              <button
                onClick={() => setView('time')}
                className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
