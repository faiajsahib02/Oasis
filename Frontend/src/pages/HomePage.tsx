import { ArrowRight, Star, Wifi, Coffee, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 animate-fade-in-up">
            Ocean Paradise
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light tracking-wide">
            Experience the pinnacle of luxury and relaxation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rooms">
              <Button size="lg" className="w-full sm:w-auto">
                View Rooms
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-primary">
                Book Your Stay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">World-Class Amenities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a perfect stay, from high-speed internet to gourmet dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Wifi className="w-8 h-8" />, title: "High-Speed Wi-Fi", desc: "Stay connected with our complimentary fiber-optic internet throughout the resort." },
              { icon: <Coffee className="w-8 h-8" />, title: "Gourmet Dining", desc: "Experience culinary excellence at our 3 Michelin-starred restaurants." },
              { icon: <Tv className="w-8 h-8" />, title: "Smart Entertainment", desc: "Enjoy 4K streaming and smart home controls in every suite." },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-slate-50 transition-colors duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 text-accent mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Featured Suites</h2>
              <p className="text-gray-600">Hand-picked for your ultimate comfort.</p>
            </div>
            <Link to="/rooms" className="hidden md:flex items-center text-accent hover:text-accent-hover font-medium">
              View All Rooms <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Placeholder Cards - In a real app, these would come from an API */}
            {[
              { title: "Deluxe Ocean View", price: "$450", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Presidential Suite", price: "$1,200", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { title: "Garden Villa", price: "$850", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
            ].map((room, index) => (
              <Card key={index} className="group cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary">
                    {room.price} <span className="font-normal text-gray-500">/ night</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-1 text-accent mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{room.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Enjoy breathtaking views and unparalleled service in our signature suites.
                  </p>
                  <Button variant="outline" className="w-full">View Details</Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/rooms">
              <Button variant="secondary">View All Rooms</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
