import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import QRCodeGenerator from './components/QRCodeGenerator'

function App() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-700">QR Code Generator</h1>
          <p className="mt-2 text-gray-600">Generate and customize QR codes instantly</p>
        </header>
        
        <main>
          <QRCodeGenerator />
        </main>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  )
}

export default App
