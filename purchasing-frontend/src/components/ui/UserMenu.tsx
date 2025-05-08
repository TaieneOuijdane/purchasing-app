import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-full outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Menu utilisateur"
        >
          <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white">
            <Avatar.Fallback className="leading-none">
              {userInitials}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-lg p-1 shadow-lg"
          sideOffset={5}
          align="end"
        >
          <div className="border-b border-gray-200 px-3 py-2 mb-1">
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <DropdownMenu.Item 
            className="flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none hover:bg-blue-50 hover:text-blue-600"
            onClick={() => navigate('/profile')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Profil
          </DropdownMenu.Item>
          
          {isAdmin && (
            <DropdownMenu.Item 
              className="flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none hover:bg-blue-50 hover:text-blue-600"
              onClick={() => navigate('/admin')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Administration
            </DropdownMenu.Item>
          )}
          
          <DropdownMenu.Separator className="h-px m-1 bg-gray-200" />
          
          <DropdownMenu.Item 
            className="flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none text-red-600 hover:bg-red-50"
            onClick={() => logout()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2v3h3v10H4V5h6z" clipRule="evenodd" />
            </svg>
            Déconnexion
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}