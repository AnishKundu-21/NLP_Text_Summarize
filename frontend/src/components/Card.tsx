"use client";

import React from 'react';

export const Card = ({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) => (
  <div 
    onClick={onClick} 
    className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-700 transition-colors duration-200 transform hover:-translate-y-1"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);
