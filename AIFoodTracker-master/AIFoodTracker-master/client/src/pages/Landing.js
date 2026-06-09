import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiHeart, FiArrowRight, FiStar, FiUsers, FiTarget, FiTrendingUp, FiAward } from 'react-icons/fi';

const Landing = () => {
  const quotes = [
    {
      text: "Take care of your body. It's the only place you have to live.",
      author: "Jim Rohn"
    },
    {
      text: "The greatest wealth is health.",
      author: "Virgil"
    },
    {
      text: "Healthy citizens are the greatest asset any country can have.",
      author: "Winston Churchill"
    }
  ];

  const features = [
    {
      icon: <FiTarget className="h-8 w-8" />,
      title: "Smart Calorie Tracking",
      description: "AI-powered nutrition analysis with real-time insights"
    },
    {
      icon: <FiTrendingUp className="h-8 w-8" />,
      title: "Progress Analytics",
      description: "Visual charts and trends to monitor your health journey"
    },
    {
      icon: <FiHeart className="h-8 w-8" />,
      title: "Personalized Goals",
      description: "Custom nutrition targets based on your lifestyle"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-secondary-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft-lg">
                <FiActivity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-secondary-800">
                CalWise
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/about"
                className="text-secondary-600 hover:text-primary-600 font-body font-medium transition-colors duration-200"
              >
                About
              </Link>
              <Link
                to="/login"
                className="bg-primary-500 text-white px-6 py-2 rounded-xl font-heading font-medium hover:bg-primary-600 transition-colors duration-200 shadow-soft-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-100 rounded-full opacity-30 animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent-100 rounded-full opacity-25 animate-float-slow"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 bg-primary-100 rounded-full px-6 py-3 mb-8">
                <FiHeart className="h-5 w-5 text-primary-600" />
                <span className="text-primary-800 font-body font-medium">
                  AI-Powered Nutrition Intelligence
                </span>
                <FiHeart className="h-5 w-5 text-primary-600" />
              </div>

              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-secondary-800 mb-6 leading-tight">
                Your Health,
                <span className="text-primary-600"> Simplified</span>
              </h1>

              <p className="text-xl lg:text-2xl text-secondary-600 font-body max-w-4xl mx-auto mb-12 leading-relaxed">
                Track calories effortlessly with AI-powered insights.
                Make informed decisions about your nutrition and live healthier every day.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-heading font-semibold hover:bg-primary-600 transition-all duration-200 shadow-soft-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 group"
                >
                  <span>Start Your Journey</span>
                  <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-secondary-300 text-secondary-700 px-8 py-4 rounded-2xl font-heading font-semibold hover:border-primary-500 hover:text-primary-600 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary-800 mb-4">
              Why Choose CalWise?
            </h2>
            <p className="text-lg text-secondary-600 font-body max-w-2xl mx-auto">
              Experience the future of nutrition tracking with intelligent features designed for your lifestyle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-200">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold text-secondary-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 font-body">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspirational Quotes */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FiStar className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-heading font-bold text-secondary-800">
                Words of Wisdom
              </h2>
              <FiStar className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-secondary-600 font-body">
              Inspirational quotes to fuel your healthy journey
            </p>
          </div>

          <div className="space-y-8">
            {quotes.map((quote, index) => (
              <div key={index} className="card text-center bg-white/70 backdrop-blur-sm">
                <div className="text-4xl text-primary-300 mb-4">"</div>
                <blockquote className="text-lg lg:text-xl text-secondary-700 font-body italic mb-4">
                  {quote.text}
                </blockquote>
                <cite className="text-secondary-500 font-heading font-medium">
                  — {quote.author}
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-heading font-bold text-primary-600">10K+</div>
              <div className="text-secondary-600 font-body">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-heading font-bold text-primary-600">1M+</div>
              <div className="text-secondary-600 font-body">Meals Tracked</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-heading font-bold text-primary-600">98%</div>
              <div className="text-secondary-600 font-body">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-primary-100 font-body mb-8">
            Join thousands of users who are already living healthier, happier lives with CalWise.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-heading font-semibold hover:bg-primary-50 transition-all duration-200 shadow-soft-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FiUsers className="h-5 w-5" />
            <span>Get Started Today</span>
            <FiArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <FiActivity className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold">CalWise</h3>
              </div>
              <p className="text-secondary-300 font-body mb-4">
                AI-powered calorie tracking made simple. Take control of your nutrition and live your healthiest life.
              </p>
              <div className="flex space-x-4">
                <Link to="/about" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
                <Link to="/login" className="text-secondary-300 hover:text-white transition-colors duration-200">
                  Sign In
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-secondary-300 font-body">
                <li>Smart Tracking</li>
                <li>Analytics</li>
                <li>Goal Setting</li>
                <li>Progress Reports</li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-secondary-300 font-body">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
            <p className="text-secondary-400 font-body">
              © 2024 CalWise. Made with 💚 and 💙 by Arpit & Krrish
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
