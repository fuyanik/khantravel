import React from "react";

export default function FormPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Sayfası</h1>
      <form className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Adınız</label>
          <input type="text" className="w-full border px-3 py-2 rounded" placeholder="Adınızı girin" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">E-posta</label>
          <input type="email" className="w-full border px-3 py-2 rounded" placeholder="E-posta adresinizi girin" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Gönder</button>
      </form>
    </main>
  );
} 