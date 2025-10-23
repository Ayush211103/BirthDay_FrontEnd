// src/components/Gifts.jsx
import React from "react";

const gifts = [
  {
    id: 1,
    title: "Birthday Surprise",
    description: "Make their birthday unforgettable with a Polaroid gift set!",
    image: "/images/gift1.png",
  },
  {
    id: 2,
    title: "Wedding Memories",
    description: "Capture precious moments and cherish them forever.",
    image: "/images/gift2.png",
  },
  {
    id: 3,
    title: "Custom Photo Pack",
    description: "Create a personalized photo pack for your loved ones.",
    image: "/images/gift3.jpg",
  },
  {
    id: 4,
    title: "Custom Photo Pack",
    description: "Create a personalized photo pack for your loved ones.",
    image: "/images/gift3.jpg",
  },
];

// const categories = [
//   { name: "All", icon: "🎉" },
//   { name: "Trending", icon: "🔥" },
//   { name: "Most Popular", icon: "⭐" },
//   { name: "Indian", icon: "IN" },
//   { name: "Western", icon: "🌍" },
//   { name: "Trendy", icon: "💫" },
//   { name: "Boys", icon: "👦" },
//   { name: "Girls", icon: "👧" },
// ];


const Gifts = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 md:px-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Our Gift Ideas
      </h2>
      {/* <div className="flex flex-wrap justify-center gap-8"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {gifts.map((gift, index) => (
          <div
            key={gift.id}
            // 💡 Final size adjustment: Card width w-40 (160px)
            // className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 w-40"
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 w-48"
          >
            {/* Polaroid Image */}
            <div className="bg-white p-2">
              <img
                src={gift.image}
                alt={gift.title}
                // 💡 Final size adjustment: Image height h-56 (224px)
                className="w-full h-40 object-cover rounded-md"
              />
            </div>
            {/* Caption */}
            <div className="px-4 py-3 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {gift.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{gift.description}</p>
              {/* Ribbon Button */}
              <button className="relative inline-block px-5 py-2 font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition">
                <span className="absolute -top-2 -left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                Explore
              </button>
            </div>
            {/* Hover rotation */}
            <style jsx>{`
              .group:hover {
                transform: scale(1.05) rotate(${index % 2 === 0 ? "-3deg" : "3deg"});
              }
            `}</style>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gifts;