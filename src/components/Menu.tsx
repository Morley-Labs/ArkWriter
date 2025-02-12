import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

interface MenuItem {
  label: string;
  onClick?: () => void;
  type?: 'separator';
  shortcut?: string;
  icon?: React.ComponentType<any>;
  checked?: boolean;
  disabled?: boolean;
}

interface MenuProps {
  label: string;
  items: MenuItem[];
}

export const Menu: React.FC<MenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = prev + 1;
          return next >= items.filter(i => i.type !== 'separator').length ? 0 : next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const next = prev - 1;
          return next < 0 ? items.filter(i => i.type !== 'separator').length - 1 : next;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const item = items.filter(i => i.type !== 'separator')[selectedIndex];
          item.onClick?.();
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`px-2.5 py-1 text-sm text-white rounded hover:bg-[#FF7F11] transition-colors ${
          isOpen ? 'bg-[#FF7F11]' : 'bg-transparent'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
      </button>
      
      {isOpen && (
        <div 
          className="absolute left-0 mt-1 py-1 w-48 bg-white rounded-lg shadow-xl z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          {items.map((item, index) => (
            item.type === 'separator' ? (
              <hr key={index} className="my-1 border-gray-200" role="separator" />
            ) : (
              <button
                key={index}
                ref={el => menuItemsRef.current[index] = el}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-1.5 text-sm text-left text-gray-700 hover:bg-[#FF7F11] hover:text-white transition-colors flex items-center justify-between ${
                  selectedIndex === index ? 'bg-[#FF7F11] text-white' : ''
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                role="menuitem"
                tabIndex={selectedIndex === index ? 0 : -1}
                disabled={item.disabled}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.checked && <Check className="w-4 h-4" />}
                  {item.shortcut && (
                    <span className="text-xs text-gray-500">{item.shortcut}</span>
                  )}
                </div>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};