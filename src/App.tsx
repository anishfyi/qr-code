import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import QRCodeGenerator from './components/QRCodeGenerator'
import { HeartIcon } from '@heroicons/react/24/solid'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 sm:p-6 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto flex-1">
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

      <footer className="mt-8 text-center text-sm text-neutral-600">
        <p className="flex items-center justify-center gap-1">
          Made with <HeartIcon className="h-4 w-4 text-red-500" /> by{' '}
          <a 
            href="https://anishfyi.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neutral-800 hover:text-neutral-900 underline"
          >
            anishfyi
          </a>
        </p>
      </footer>

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
