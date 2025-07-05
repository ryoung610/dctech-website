import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe, X, User } from 'lucide-react';

const Hero = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      </div>
      
      {/* Floating Elements - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden md:block absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="hidden md:block absolute bottom-40 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
      
      {/* Updated padding to account for sticky navigation */}
      <div className="relative z-10 container mx-auto px-4 pt-32 md:pt-28 pb-16 md:pb-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Trust Indicators - Stack on mobile */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-8 mb-6 md:mb-8 text-white/80">
            <div className="flex items-center gap-2">
              <Shield className="w-4 md:w-5 h-4 md:h-5 text-blue-400" />
              <span className="text-xs md:text-sm font-medium">Trusted Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 md:w-5 h-4 md:h-5 text-purple-400" />
              <span className="text-xs md:text-sm font-medium">Enterprise Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 md:w-5 h-4 md:h-5 text-indigo-400" />
              <span className="text-xs md:text-sm font-medium">Global Reach</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight px-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">DCtech</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-6 md:mb-8 font-light max-w-3xl mx-auto leading-relaxed px-4">
            Your trusted partner in technology solutions.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-8 md:mb-12 border border-white/20 mx-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Enterprise Solutions that Empower
            </h2>
            <p className="text-blue-100 text-base md:text-lg mb-4 md:mb-6 max-w-4xl mx-auto">
              Corporations, Communities, and Governments with Custom Software Development
            </p>
            <p className="text-white/90 text-sm md:text-base max-w-3xl mx-auto">
              From cutting-edge database optimization to robust automation, we build tailored solutions to streamline operations and drive innovation.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Explore Our Services
              <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Button>
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 border-0"
              onClick={() => setIsAuthOpen(true)}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal - Same as Navigation */}
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
    </div>
  );
};

export default Hero;
