import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, TrendingUp, Shield, Zap } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Don't Get Left Behind. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Start Today!
            </span>
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 mb-12">
            <p className="text-xl text-white/90 mb-8 leading-relaxed text-center">
              Now is the time to evolve your business with custom-built solutions. Our team offers 
              tailored software, advanced AI capabilities, and top-tier cloud services that will 
              accelerate your growth.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Faster Results</h3>
                <p className="text-blue-100 text-sm">Accelerated implementation and deployment</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Increased Efficiency</h3>
                <p className="text-purple-100 text-sm">Streamlined operations and automation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Measurable Success</h3>
                <p className="text-indigo-100 text-sm">Guaranteed ROI and performance metrics</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6 text-yellow-400">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Why wait? The future of your business is at stake.</span>
            </div>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Take the leap today, and secure your competitive edge. Contact us now and let's 
              discuss how we can drive your success forward.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
