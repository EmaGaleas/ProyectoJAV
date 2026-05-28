import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { SIDEBAR_CONFIG } from './sidebarItems';

interface SidebarBodyProps {
  rol: keyof typeof SIDEBAR_CONFIG;
}

const ITEM_PX        = 12;   //padding-left del ítem
const ICON_W         = 20;   //ancho del ícono
const GAP            = 12;   //espacio ícono → texto
const TEXT_START     = ITEM_PX + ICON_W + GAP;        // 44px — donde empieza el texto padre
const VLINE_X        = ITEM_PX + ICON_W / 2;          // centro del ícono (ancla vertical)
const CURVE_W        = TEXT_START - VLINE_X;           //ancho del conector curvo
const CURVE_R        = 8;    // border-radius de la curva

export const SidebarBody = ({ rol }: SidebarBodyProps) => {
  const [openItem, setOpen] = useState<string | null>(null);

  const allSections  = SIDEBAR_CONFIG[rol];
  const mainSections = allSections.filter((s) => s.section !== 'Footer');

  const handleToggle = (label: string) =>
    setOpen((prev) => (prev === label ? null : label));

  return (
    <nav className="flex-1 flex flex-col overflow-y-auto w-full" style={{ gap: '6px' }}>

      {mainSections.map((section, sectionIdx) => (
        <div key={section.section} className="flex flex-col w-full">

          {/* Divisor  */}
          {sectionIdx > 0 && (
            <div
              className="rounded-full"
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #93C5A9 20%, #93C5A9 80%, transparent)',
                opacity: 0.45,
                margin: '10px 4px 18px',
              }}
            />
          )}

          {/* Etiqueta de sección*/}
          <span
            className="font-semibold uppercase text-[#8EBFA3]"
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              paddingLeft: `${ITEM_PX}px`,
              marginBottom: '6px',
              display: 'block',
            }}
          >
            {section.section}
          </span>

          {/* Lista de ítems  */}
          <div className="flex flex-col w-full" style={{ gap: '2px' }}>
            {section.items.map((item) => {

              /* dropdowns*/
              if (item.children?.length) {
                const isOpen = openItem === item.label;

                return (
                  <div key={item.label} className="flex flex-col w-full">

                    {/*btn padre */}
                    <button
                      onClick={() => handleToggle(item.label)}
                      className={[
                        'flex items-center w-full rounded-xl transition-all duration-200',
                        'text-[14px] font-medium',
                        isOpen
                          ? 'text-[#308C58] bg-[#EAF7EF]'
                          : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                      ].join(' ')}
                      style={{ gap: `${GAP}px`, padding: `10px ${ITEM_PX}px` }}
                    >
                      {/* Ícono */}
                      <div
                        className="flex-shrink-0 rounded-md transition-colors duration-150"
                        style={{
                          width:  `${ICON_W}px`,
                          height: `${ICON_W}px`,
                          backgroundColor: isOpen ? '#308C58' : '#8EBFA3',
                          opacity: isOpen ? 1 : 0.55,
                        }}
                      />
                      <span className="flex-1 text-left" style={{ lineHeight: '1.2' }}>
                        {item.label}
                      </span>
                      <svg
                        width="15" height="15" viewBox="0 0 16 16" fill="none"
                        className="flex-shrink-0 transition-transform duration-250"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Submenú con flujp */}
                    {isOpen && (
                      <div
                        className="relative w-full flex flex-col"
                        style={{ paddingTop: '2px', paddingBottom: '4px', gap: '0px' }}
                      >
                        {/*
                        */}
                        <div
                          className="absolute rounded-full"
                          style={{
                            left:    `${VLINE_X}px`,
                            top:     0,
                            bottom:  '50%',
                            width:   '1.5px',
                            background: 'linear-gradient(to bottom, #8EBFA3, #8EBFA3CC)',
                            opacity: 0.55,
                          }}
                        />

                        {item.children.map((child) => {

                          return (
                            <div
                              key={child.path}
                              className="relative flex items-center w-full"
                              style={{ minHeight: '40px' }}
                            >
                              <div
                                className="absolute pointer-events-none"
                                style={{
                                  left:         `${VLINE_X}px`,
                                  top:          0,
                                  height:       '50%',
                                  width:        `${CURVE_W}px`,
                                  borderLeft:   '1.5px solid #8EBFA3',
                                  borderBottom: '1.5px solid #8EBFA3',
                                  borderBottomLeftRadius: `${CURVE_R}px`,
                                  opacity:      0.55,
                                }}
                              />

                              <NavLink
                                to={child.path}
                                className={({ isActive }) =>
                                  [
                                    'flex-1 flex items-center rounded-lg transition-all duration-150',
                                    'text-[14px]', 
                                    isActive
                                      ? 'text-[#1A6640] font-semibold bg-[#EAF7EF]'
                                      : 'text-[#8EBFA3] font-normal hover:text-[#308C58] hover:bg-[#F0FAF4]',
                                  ].join(' ')
                                }
                                style={{
                                  // El texto empieza  alineado con el padre
                                  paddingLeft:  `${TEXT_START}px`,
                                  paddingRight: `${ITEM_PX}px`,
                                  paddingTop:   '9px',
                                  paddingBottom: '9px',
                                  lineHeight:   '1.2',
                                }}
                              >
                                {child.label}
                              </NavLink>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /*itm sin hijos*/
              return (
                <NavLink
                  key={item.path}
                  to={item.path ?? '#'}
                  className={({ isActive }) =>
                    [
                      'flex items-center w-full rounded-xl transition-all duration-200',
                      'text-[14px] font-medium',
                      isActive
                        ? 'text-[#308C58] bg-[#EAF7EF]'
                        : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                    ].join(' ')
                  }
                  style={{ gap: `${GAP}px`, padding: `10px ${ITEM_PX}px` }}
                >
                  <div
                    className="flex-shrink-0 rounded-md opacity-55 transition-colors duration-150"
                    style={{ width: `${ICON_W}px`, height: `${ICON_W}px`, backgroundColor: '#8EBFA3' }}
                  />
                  <span className="flex-1" style={{ lineHeight: '1.2' }}>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};