// SearchableSelect.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { INPUT_CLS } from './types'; 
interface Option<T = any> {
  label: string;
  value: string;
  data?: T; // Aquí guardaremos cualquier dato extra (monto, objeto usuario, etc.)
}

interface Props<T = any> {
  options: Option<T>[];
  value: string;
  onChange: (opt: Option<T>) => void; // Recibe la opción genérica
  placeholder?: string;
  icon?: 'search' | 'chevron';
}

export function SearchableSelect<T = any>({ options, value, onChange, placeholder, icon }: Props<T>) {
    const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar opciones basado en lo que el usuario escribe
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className={`${INPUT_CLS} pr-10 cursor-text`}
          placeholder={placeholder}
          value={isOpen ? query : value}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery(''); // Limpiar query al enfocar para ver todas las opciones
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#abafb1] pointer-events-none">
          {icon === 'search' ? <Search size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isOpen && (
        <ul 
          className="absolute z-50 w-full mt-1 bg-white border border-[#d1d5dc] rounded-[10px] shadow-lg max-h-48 overflow-y-auto py-1"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className="px-4 py-2 hover:bg-[#F0FAF4] cursor-pointer text-[15px] font-['Arimo',sans-serif] text-[#514f4f] transition-colors"
                onClick={() => {
                onChange(opt); 
                setQuery('');
                setIsOpen(false);
              }}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500 italic text-center">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
}