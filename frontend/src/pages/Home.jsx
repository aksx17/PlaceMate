import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiFileText, FiLayout, FiMessageSquare, FiTrendingUp, FiZap, FiTarget, FiCheckCircle, FiStar } from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: <FiBriefcase className="w-8 h-8" />,
      title: 'Job Scraping & Aggregation',
      description: 'Automatically scrape and aggregate jobs from LinkedIn, Glassdoor, Naukri, Unstop, and Indeed.',
      color: 'from-blue-500 to-cyan-500',
      badge: '5 Platforms'
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: 'AI Resume Tailoring',
      description: 'Generate tailored resumes for each job using your GitHub and LinkedIn profile data.',
      color: 'from-purple-500 to-pink-500',
      badge: 'AI-Powered'
    },
    {
      icon: <FiLayout className="w-8 h-8" />,
      title: 'Portfolio Generator',
      description: 'Automatically create a stunning portfolio website from your GitHub projects and LinkedIn profile.',
      color: 'from-green-500 to-teal-500',
      badge: 'Instant'
    },
    {
      icon: <FiMessageSquare className="w-8 h-8" />,
      title: '3D AI Mock Interviews',
      description: 'Practice interviews with an AI-powered 3D avatar tailored to your background and target job.',
      color: 'from-orange-500 to-red-500',
      badge: '3D Avatar'
    }
  ];

  const stats = [
    { value: '5+', label: 'Job Platforms', icon: <FiBriefcase /> },
    { value: '100%', label: 'AI-Powered', icon: <FiZap /> },
    { value: '∞', label: 'Resumes', icon: <FiFileText /> },
    { value: '24/7', label: 'Available', icon: <FiTarget /> }
  ];

  const benefits = [
    'Automated job discovery from 5 major platforms',
    'AI-tailored resumes that pass ATS systems',
    'Professional portfolio in minutes',
    'Personalized interview prep with AI',
    'Real-time job alerts and notifications',
    'Dark mode for comfortable viewing'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-300 dark:bg-secondary-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800 dark:from-primary-700 dark:via-secondary-700 dark:to-primary-900"></div>
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8"
            >
              <FiStar className="text-yellow-300 mr-2" />
              <span className="text-white text-sm font-medium">AI-Powered Placement Platform</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
              Your AI-Powered
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                Placement Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Automate job discovery, create AI-tailored resumes, build stunning portfolios, and ace interviews with cutting-edge technology
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-primary-600 transition-all duration-200 bg-white rounded-xl hover:bg-gray-50 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <span className="relative">Get Started Free</span>
                <FiZap className="ml-2 group-hover:animate-pulse" />
              </Link>
              
              <Link
                to="/login"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 hover:scale-105"
              >
                <span className="relative">Sign In</span>
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-yellow-300 text-3xl">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-gray-50 dark:fill-gray-900"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Placements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powered by cutting-edge AI, designed specifically for students
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-600 dark:to-gray-700 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Learn more →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose PlaceMate?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                We've built the ultimate placement tool to give you an edge in your job search
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <FiCheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-lg text-gray-700 dark:text-gray-300">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-primary-400 via-secondary-400 to-primary-600 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 via-primary-400 to-secondary-600 rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <FiTrendingUp className="w-24 h-24 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">Boost Your Success</h3>
                  <p className="text-xl">Join thousands of successful placements</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 dark:from-primary-700 dark:via-secondary-700 dark:to-primary-800 rounded-3xl shadow-2xl p-12 md:p-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Placements?
            </h2>
            <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
              Join thousands of students already using PlaceMate to land their dream jobs
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-primary-600 bg-white rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
            >
              Start Your Journey
              <FiZap className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
