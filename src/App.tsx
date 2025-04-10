import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import QRCodeGenerator from './components/QRCodeGenerator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800">
            QR Code Generator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            Generate and customize QR codes instantly
          </p>
        </header>
        
        <main className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl border border-neutral-100">
          <QRCodeGenerator />
        </main>
      </div>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App
