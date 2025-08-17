import React from "react";
import Header from "@/componentssss/student/header";


export default function HeroSection() {

    return (
        <>
        <Header/>
        
        
       
        <div className="relative flex items-center justify-center h-screen bg-gray-10   00 text-white">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex flex-col items-start p-8">
              
                <h1 className="text-5xl font-bold mb-4">
                    Advance Your Career in a Digitalized World
                </h1>
                <p className="mb-6">
                    We provide you with unrestricted access to the greatest courses from the top specialists, allowing you to learn countless practical lessons in a range of topics.
                </p>
                <div className="flex mb-4 ">
                    <input 
                        type="text" 
                        placeholder="Search course, event or author" 
                        className="p-3 rounded-l-md bg-white text-gray-900 outline-none w-200"
                    />
                    <button className="p-3 bg-cyan-500 rounded-r-md ">
                        Search
                    </button>
                </div>
                <div className="text-sm">
                    Popular: <span className="font-medium">UI Design, UX Research, Android, C++</span>
                </div>
            </div>
            
        </div>
         </>
    );
};

