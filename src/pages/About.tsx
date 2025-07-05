import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Cloud, Code, MessageSquare, Database, Truck, Shield, Server } from 'lucide-react';
import Navigation from '../components/Navigation';

const About = () => {
  const services = [
    {
      icon: Brain,
      title: "AI & Automation",
      description: "Intelligent solutions that streamline your processes"
    },
    {
      icon: Cloud,
      title: "Cloud Solutions", 
      description: "Scalable infrastructure for modern businesses"
    },
    {
      icon: Code,
      title: "Custom Software",
      description: "Tailored applications built for your unique needs"
    },
    {
      icon: MessageSquare,
      title: "Chatbot Development",
      description: "Interactive AI assistants for customer engagement"
    },
    {
      icon: Database,
      title: "Web Scraping Solutions",
      description: "Automated data collection and processing"
    },
    {
      icon: Database,
      title: "Database Optimization",
      description: "High-performance data management systems"
    },
    {
      icon: Truck,
      title: "Logistics & Operations ",
      description: "Streamlined operational management solutions"
    },
    {
      icon: Shield,
      title: "Cybersecurity & AI",
      description: "Advanced security powered by artificial intelligence"
    },
    {
      icon: Server,
      title: "Cloud Services",
      description: "Comprehensive cloud infrastructure and management"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">DC Tech</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed px-4">
              At DC Tech, we don't just build software—we create solutions that empower businesses to thrive. 
              Whether you need cutting-edge AI, secure cloud infrastructure, or a custom-built application, 
              we tailor technology to fit your needs. Our pricing is transparent and attainable, ensuring 
              businesses of all sizes can access top-tier innovation. Ready to transform your business? 
              Let's build something extraordinary together.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology solutions designed to drive your business forward
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Let's Build Something Great Together!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Ready to transform your business with cutting-edge technology solutions?
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Explore Our Services
            <ArrowRight className="ml-3 w-6 h-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70">© 2025 DC Tech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
