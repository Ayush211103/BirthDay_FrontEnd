import React from 'react';

const Home = () => {
  const heroTextLines = [
    "the future is too far, we",
    "are obsessed with",
    "making today better"
  ];

  const videoUrl = './video/Moving_video.mp4'; 

  return (
    <div className="relative w-full h-screen bg-[#f5f5f5] overflow-hidden flex flex-col">
      
      {/* Top Navigation */}
      {/* <div className="absolute top-0 left-0 w-full px-6 md:px-12 lg:px-16 py-6 flex justify-between items-center z-20 text-red-600">
        <a href="#" className="italic text-sm tracking-tight">(projectyuli)</a>
        <div className="flex space-x-4 md:space-x-8 text-sm">
          <a href="#" className="hover:underline">work</a>
          <a href="#" className="hover:underline">contact</a>
          <a href="#" className="hover:underline">about</a>
          <a href="#" className="hover:underline">archive</a>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-between px-6 md:px-16 lg:px-16 space-y-8 md:space-y-0">
        
        {/* Left Text */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl leading-snug md:leading-tight text-red-600 font-serif font-normal max-w-lg text-left">
          {heroTextLines.map((line, index) => (
            <span key={index} className="block">{line}</span>
          ))}
        </h1>

        {/* Right Video */}
        <div className="relative w-full md:w-1/2 h-[60vh] md:h-[90vh] flex items-center justify-center">
          <video
            className="w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute top-0 left-0 w-full h-full bg-red-600 mix-blend-multiply opacity-70"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;