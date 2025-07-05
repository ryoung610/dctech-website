
import React from 'react';
import { TrendingUp, DollarSign, Zap, Users } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increased Revenue",
      description: "Our solutions directly impact your bottom line with measurable ROI",
      stat: "40% Average Growth"
    },
    {
      icon: Zap,
      title: "Enhanced Efficiency",
      description: "Streamline operations and reduce manual processes",
      stat: "60% Time Savings"
    },
    {
      icon: Users,
      title: "Better Customer Experience",
      description: "Improve customer satisfaction with seamless digital experiences",
      stat: "95% Satisfaction Rate"
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      description: "Reduce operational costs while increasing productivity",
      stat: "30% Cost Reduction"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Our Services Boost Your Finances
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our premium services are designed to help you grow your business and increase your revenue. 
            By leveraging our custom software, cloud solutions, and AI capabilities, you can streamline 
            your operations, improve efficiency, and drive innovation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <benefit.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 mb-3">{benefit.description}</p>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {benefit.stat}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 text-center">
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our team of experts will work with you to create tailored solutions that meet your unique 
            needs and help you achieve your business goals. With our cutting-edge technologies, we 
            guarantee faster results, increased efficiency, and measurable success.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
