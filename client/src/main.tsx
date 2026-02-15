import { createRoot } from 'react-dom/client'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ClerkProvider } from '@clerk/clerk-react'
import {dark} from "@clerk/themes"



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}



createRoot(document.getElementById('root')!).render(
    <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
        theme:dark,
        variables :{
            colorPrimary:'#4f39f6',
            colorTextOnPrimaryBackground:"#ffffff"
            
        }
    }}> 
    <BrowserRouter>
    {/* <AuthProvider>  */}
        <App />
    {/* </AuthProvider> */}
    </BrowserRouter>,
    </ClerkProvider>
)