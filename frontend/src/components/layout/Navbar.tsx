'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, CheckSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <CheckSquare className="w-6 h-6" />
              <span>TaskFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hello, {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
