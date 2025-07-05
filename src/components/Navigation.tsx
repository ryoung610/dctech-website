import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ArrowRight } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOverLightBackground, setIsOverLightBackground] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  // Detect background color based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Define sections where background is light (white/gray)
      // Adjust these values based on your page structure
      const lightSections = [
        { start: 800, end: 1200 },   // Services section
        { start: 1600, end: 2000 },  // Benefits section
        { start: 2400, end: 2800 },  // Contact section
      ];
      
      const isOverLight = lightSections.some(section => 
        scrollY >= section.start && scrollY <= section.end
      );
      
      setIsOverLightBackground(isOverLight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic styling based on background
  const textColor = isOverLightBackground ? 'text-gray-900' : 'text-white';
  const hoverBg = isOverLightBackground ? 'hover:bg-gray-100' : 'hover:bg-white/10';
  const borderColor = isOverLightBackground ? 'border-gray-300' : 'border-white/30';
  const hoverBorder = isOverLightBackground ? 'hover:border-gray-400' : 'hover:border-white/50';
  
  // Keep original active tab styling (gradient for both light and dark)
  const activeTabStyle = 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-lg transition-all duration-300 ${
      isOverLightBackground 
        ? 'bg-white/95 border-gray-200/50' 
        : 'bg-white/10 border-white/20'
    }`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* DC Tech Logo - Enhanced visibility */}
          <Link to="/" className={`text-xl md:text-2xl font-bold ${textColor} drop-shadow-sm transition-all duration-300`}>
            DC Tech
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4 items-center">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className={location.pathname === item.path 
                    ? `${activeTabStyle} transition-all duration-300 transform hover:scale-105` 
                    : `${textColor} ${hoverBg} transition-all duration-300`
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Desktop Sign In Button - Enhanced visibility */}
            <Button
              size="sm"
              className={`${textColor} ${borderColor} ${hoverBg} ${hoverBorder} transition-all duration-300 drop-shadow-sm font-medium`}
              onClick={() => setIsAuthOpen(true)}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`md:hidden ${textColor} ${hoverBg} transition-all duration-300 drop-shadow-sm`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t backdrop-blur-md ${
            isOverLightBackground 
              ? 'border-gray-200 bg-white/95' 
              : 'border-white/20 bg-white/10'
          }`}>
            <div className="flex flex-col py-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-center font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : `${textColor} ${hoverBg}`
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Sign In Button - Enhanced visibility */}
              <Button
                className={`mx-4 mt-4 ${borderColor} ${textColor} ${hoverBg} ${hoverBorder} transition-all duration-300 drop-shadow-sm font-medium`}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthOpen(true);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/30 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-white/80">Sign in to access your account</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2"
                onClick={() => setIsAuthOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Quick Sign In Options */}
            <div className="space-y-4 mb-6">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                <User className="w-5 h-5 mr-3" />
                Continue with Google
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
                <User className="w-5 h-5 mr-3" />
                Continue with Email
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-white/70">
                Don't have an account?{' '}
                <button className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors">
                  Sign up for free
                </button>
              </p>
              
              {/* Close Link */}
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="text-white/60 hover:text-white/90 text-sm underline transition-colors"
              >
                Maybe later, take me back
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
