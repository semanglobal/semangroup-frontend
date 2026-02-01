import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = location.pathname;

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Projects", path: "/projects" },
    { name: "Contacts", path: "/contacts" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMenuClick = (item: { name: string; path: string }) => {
    navigate(item.path);
    setIsOpen(false);
  };

  return (
    <header className="bg-gray-800 shadow-md sticky top-0 w-full z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 2xl:h-20 max-w-[1440px] mx-auto">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-bold text-white text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl">
              Logo
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 2xl:space-x-12">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className="relative text-white font-medium py-2 text-sm group"
              >
                {item.name}
                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 bg-white
                    transition-all duration-300 ease-out
                    ${
                      activeItem === item.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }
                  `}
                />
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <button
            className="hidden md:block bg-primary text-white rounded-md hover:bg-primary transition-colors px-3 py-2 lg:px-4 lg:py-2.5 text-sm"
          >
            Schedule an Appointment
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-200 hover:bg-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50
          transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={toggleMenu}
      >
        {/* Mobile Sidebar */}
        <nav
          className={`
            fixed top-0 left-0 h-full
            w-4/5 sm:w-3/5
            bg-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-gray-900 text-md">
                Menu
              </h2>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <ul className="space-y-4 sm:space-y-6">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className="relative w-full text-left rounded-lg hover:bg-gray-50 transition-colors px-4 py-3 font-medium text-gray-700 text-sm"
                  >
                    {item.name}
                    <span
                      className={`
                        absolute bottom-2 left-4 h-0.5 bg-primary
                        transition-all duration-300 ease-out
                        ${
                          activeItem === item.path
                            ? "w-1/2"
                            : "w-0 group-hover:w-1/2"
                        }
                      `}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;