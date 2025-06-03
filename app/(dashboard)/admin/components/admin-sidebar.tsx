"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Users, Layers, X } from 'lucide-react';
import Image from 'next/image';
import logo from "/public/bran4-logo.svg";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-8 m-2 bg-white p-2 rounded-md">
          <Image
            src={logo}
            alt="Brand4Print Logo"
            width={40}
            height={40}
            className="h-16 w-full"
          />
          <p className="text-xl text-center text-black font-semibold mb-2">Admin Dashboard</p>
        </div>

        <nav className='p-4'>
          <ul className="space-y-1">
            <li>
              <Link 
                href="/admin/products" 
                className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-800 hover:text-white"
                onClick={() => onClose()}
              >
                <ShoppingCart className="mr-3 h-5 w-5" />
                <span>Products</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/admin/users" 
                className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-800 hover:text-white"
                onClick={() => onClose()}
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Users</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/admin/orders" 
                className="flex items-center p-3 text-gray-300 rounded hover:bg-gray-800 hover:text-white"
                onClick={() => onClose()}
              >
                <Layers className="mr-3 h-5 w-5" />
                <span>Orders</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link 
            href="/" 
            className="block w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-center rounded"
            onClick={() => onClose()}
          >
            Back to Store
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
