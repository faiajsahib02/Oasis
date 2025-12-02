import { CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-primary py-20 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About Ocean Paradise</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Redefining luxury hospitality since 1995.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Nestled on the pristine shores of Paradise City, Ocean Paradise began as a dream to create a sanctuary where luxury meets nature. Over the past two decades, we have evolved into an award-winning resort, celebrated for our impeccable service, breathtaking architecture, and commitment to sustainability.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our philosophy is simple: every guest deserves to feel like royalty. From our private butler service to our curated culinary experiences, every detail is designed to provide an unforgettable escape from the ordinary.
            </p>
            
            <div className="space-y-3 mt-8">
              {[
                "5-Star Diamond Award Winner (2020-2024)",
                "Green Globe Certified for Sustainability",
                "Home to 'Azure', a 3-Michelin Star Restaurant",
                "Private Beach Access for All Guests"
              ].map((item, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 rounded-xl transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Hotel Exterior" 
              className="relative rounded-xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">Meet Our Team</h2>
            <p className="text-gray-600">The dedicated professionals making your stay magical.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Sarah Jenkins", role: "General Manager", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Michael Chen", role: "Head Chef", img: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Elena Rodriguez", role: "Guest Experience", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "David Kim", role: "Concierge Lead", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
            ].map((member, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-accent"
                />
                <h3 className="font-bold text-primary">{member.name}</h3>
                <p className="text-sm text-accent">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
