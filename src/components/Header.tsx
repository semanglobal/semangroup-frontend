import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { imageAssets } from "../assets/imageAssets";

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
    // navigate(item.path);
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 2xl:h-20 max-w-360 mx-auto">

          {/* Logo */}
          <a href="/" className="shrink-0">
            <img src={imageAssets.logo} alt="logo" className="w-15" />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8 2xl:space-x-12">
            {menuItems.map((item, index) => (
              <a
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`relative text-gray-800 font-medium py-2 text-sm group ${activeItem === item.path && 'text-primary'}`}
                href={item.path}
              >
                {item.name}
                <span
                  className={`
                    absolute bottom-0 left-0 h-0.5 bg-primary
                    transition-all duration-300 ease-out
                    ${activeItem === item.path
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                    }
                  `}
                />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            className="hidden md:block bg-primary text-white rounded-md hover:bg-primary transition-colors px-3 py-2 lg:px-4 lg:py-2.5 text-sm"
            href="https://calendly.com/semanglobalgroup/30min" target="_blank" rel="noopener noreferrer"
          >
            Schedule an Appointment
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-700"
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
                  <a
                    onClick={() => handleMenuClick(item)}
                    className="relative w-full text-left rounded-lg hover:bg-gray-50 transition-colors px-4 py-3 font-medium text-gray-700 text-sm"
                    href={item.path}
                  >
                    {item.name}
                    <span
                      className={`
                        absolute bottom-2 left-4 h-0.5 bg-primary
                        transition-all duration-300 ease-out
                        ${activeItem === item.path
                          ? "w-1/2"
                          : "w-0 group-hover:w-1/2"
                        }
                      `}
                    />
                  </a>
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