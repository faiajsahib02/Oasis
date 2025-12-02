import Button from '../components/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-gray-600">We'd love to hear from you. Reach out to us for any inquiries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-accent mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Address</h3>
                  <p className="text-gray-600">123 Ocean Drive<br />Paradise City, PC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-accent mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-400">Mon-Fri 9am-6pm</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-accent mr-4 mt-1" />
                <div>
                  <h3 className="font-bold text-primary">Email</h3>
                  <p className="text-gray-600">info@oceanparadise.com</p>
                  <p className="text-gray-600">reservations@oceanparadise.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent" placeholder="Your Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent focus:border-accent" placeholder="How can we help you?"></textarea>
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
