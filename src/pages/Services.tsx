import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Cloud, Bot, Brain, Database, Truck, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import LiveDataExtractor from '../components/LiveDataExtractor';

const Services = () => {
  const services = [
    {
      icon: Brain,
      title: "AI & Automation",
      description: "Intelligent solutions that streamline your processes and boost productivity",
      features: ["Machine Learning Models", "Process Automation", "Intelligent Analytics", "AI Integration"],
      price: "Starting at $5,000"
    },
    {
      icon: Cloud,
      title: "Cloud Solutions", 
      description: "Scalable infrastructure for modern businesses with 99.9% uptime guarantee",
      features: ["Cloud Migration", "Infrastructure Setup", "Auto-scaling", "24/7 Monitoring"],
      price: "Starting at $3,000"
    },
    {
      icon: Code,
      title: "Custom Software",
      description: "Tailored applications built for your unique business requirements",
      features: ["Web Applications", "Mobile Apps", "API Development", "System Integration"],
      price: "Starting at $8,000"
    },
    {
      icon: MessageSquare,
      title: "Chatbot Development",
      description: "Interactive AI assistants for enhanced customer engagement",
      features: ["AI Chatbots", "Customer Support", "Lead Generation", "Multi-platform"],
      price: "Starting at $2,500"
    },
    {
      icon: Database,
      title: "Web Scraping Solutions",
      description: "Automated data collection and processing for business intelligence",
      features: ["Data Extraction", "Real-time Monitoring", "Data Processing", "API Integration"],
      price: "Starting at $1,500"
    },
    {
      icon: Database,
      title: "Database Optimization",
      description: "High-performance data management systems for enterprise needs",
      features: ["Performance Tuning", "Query Optimization", "Data Migration", "Backup Solutions"],
      price: "Starting at $4,000"
    },
    {
      icon: Truck,
      title: "Logistics & Operations",
      description: "Streamlined operational management solutions for supply chain",
      features: ["Supply Chain Management", "Inventory Tracking", "Route Optimization", "Real-time Analytics"],
      price: "Starting at $6,000"
    },
    {
      icon: Shield,
      title: "Cybersecurity & AI",
      description: "Advanced security powered by artificial intelligence",
      features: ["Threat Detection", "Security Audits", "AI-powered Monitoring", "Compliance Solutions"],
      price: "Starting at $7,500"
    },
    {
      icon: Cloud,
      title: "Cloud Services",
      description: "Comprehensive cloud infrastructure and management services",
      features: ["Cloud Hosting", "DevOps", "Disaster Recovery", "Performance Optimization"],
      price: "Starting at $2,000"
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
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Services</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed px-4">
              Comprehensive technology solutions designed to transform your business operations and drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Live Data Extractor Demo */}
      <LiveDataExtractor />

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700 text-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                    {service.price}
                  </div>
                  <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    Get Quote
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Contact us today for a free consultation and let's discuss how we can help transform your business.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Contact Us Now
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

export default Services;
