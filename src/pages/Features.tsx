
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const mainFeatures = [
    {
      title: "Realistic Flight Physics & Environment",
      description: "Experience authentic drone behavior with our advanced physics engine that simulates real-world conditions including wind resistance, battery drain, and weather effects.",
      image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      details: [
        "Advanced physics simulation",
        "Weather condition effects",
        "Realistic battery consumption",
        "Wind resistance modeling"
      ]
    },
    {
      title: "Night Flying with Focus Light",
      description: "Master night operations with our comprehensive night flying module featuring adjustable lighting systems and realistic low-light conditions.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      details: [
        "Adjustable focus beam intensity",
        "Realistic night visibility",
        "LED navigation lights",
        "Low-light obstacle detection"
      ]
    },
    {
      title: "Red/Green Drone Orientation",
      description: "Never lose track of your drone's direction with our color-coded orientation system that provides clear visual indicators for front and rear positioning.",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      details: [
        "Front: Green LED indicators",
        "Rear: Red LED indicators",
        "Customizable color schemes",
        "Enhanced visibility modes"
      ]
    },
    {
      title: "Manual Geofencing Setup",
      description: "Create custom flight boundaries with our intuitive geofencing system. Set height and radius parameters to ensure safe and legal operations.",
      image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      details: [
        "Custom boundary creation",
        "Height restriction settings",
        "Radius limitation controls",
        "Visual boundary indicators"
      ]
    },
    {
      title: "Smooth RTL with Configurable Height",
      description: "Automated Return to Launch feature with customizable altitude settings ensures your drone returns safely to its starting point.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      details: [
        "Automated return navigation",
        "Configurable RTL altitude",
        "Obstacle avoidance during return",
        "Emergency activation options"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Advanced
              <span className="text-primary"> Features</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the comprehensive set of features that make our drone simulator 
              the most realistic and educational flight training experience available.
            </p>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`grid lg:grid-cols-2 gap-12 items-center mb-20 animate-fade-in ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {feature.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <Card className="overflow-hidden shadow-2xl">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-80 object-cover"
                  />
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Additional
              <span className="text-primary"> Capabilities</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Multi-Camera Views", desc: "Switch between FPV, third-person, and ground observer perspectives" },
              { title: "Weather Simulation", desc: "Practice flying in various weather conditions and wind patterns" },
              { title: "Emergency Scenarios", desc: "Train for real-world emergencies and equipment failures" },
              { title: "Flight Path Recording", desc: "Record and replay your flights for analysis and improvement" },
              { title: "Customizable Controls", desc: "Adjust sensitivity and control mapping to match your preferences" },
              { title: "Performance Analytics", desc: "Track your progress with detailed flight statistics and metrics" }
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 animate-fade-in">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
