import React from 'react'

export default function TourLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

export async function generateMetadata({ params }) {
  return {
    title: `Tour Details - Khan Travel`,
    description: 'Discover amazing tours in Istanbul with Khan Travel',
  }
}
