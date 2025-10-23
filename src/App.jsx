import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Loading from './components/Loading'
import Gift from "./components/Gifts";
import Footer from "./components/Footer";
import Home from './components/Home'
import Navbar from './components/Navbar'
import Frolic from './components/Frolic'

// function App() {
//   return <Loading />;
// }

function App() {
  return (
    // <div>
    // <div>
    //   <Gift />
    // </div>
    // <div>
    //   <Footer />
    // </div>
    // </div>
     <div > 
     <Navbar/>
      <Home />
      <Frolic/>
    </div>
  );
}

export default App
