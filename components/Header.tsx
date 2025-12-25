
import React from 'react';
import { View, SearchCriteria } from '../types';
import { GlobeIcon, HelpCircleIcon, UserIcon, CalendarIcon, UsersIcon } from './icons/Icons';

interface HeaderProps {
    currentView: View;
    criteria: SearchCriteria | null;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode; active?: boolean }> = ({ href, children, active }) => (
    <a href={href} className={`px-3 py-2 text-sm font-medium rounded-md ${active ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        {children}
    </a>
);

const UtilityButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ currentView, criteria }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
                {/* Left Side */}
                <div className="flex items-center gap-6">
                    <a href="#" className="text-2xl font-bold text-teal-600">mytrip</a>
                    <nav className="hidden md:flex items-center gap-2">
                        <NavLink href="#" active>Voos</NavLink>
                        <NavLink href="#">Estadias</NavLink>
                        <NavLink href="#">Veículos de aluguer</NavLink>
                    </nav>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                     <div className="hidden md:flex items-center gap-2">
                        <UtilityButton>
                            <GlobeIcon className="w-5 h-5" />
                            <span>Português</span>
                        </UtilityButton>
                        <UtilityButton>
                            <HelpCircleIcon className="w-5 h-5" />
                            <span>Assistência</span>
                        </UtilityButton>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-300 rounded-full hover:bg-gray-50">
                       <UserIcon className="w-5 h-5" />
                       <span className="hidden md:inline">As minhas reservas</span>
                    </button>
                </div>
            </div>
             {currentView === View.FLIGHTS && criteria && (
                <div className="flex items-center gap-4 h-14 border-t text-sm">
                    <span className="font-semibold">{criteria.origin} &rarr; {criteria.destination}</span>
                    <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{criteria.departureDate} - {criteria.returnDate}</span>
                    </div>
                     <div className="flex items-center gap-2 text-gray-600">
                        <UsersIcon className="w-4 h-4" />
                        <span>{criteria.passengers}</span>
                    </div>
                </div>
            )}
        </div>
    </header>
  );
};

export default Header;
