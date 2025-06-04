
import { Card, CardContent } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      title: "Realistic Flight Physics",
      description: "Experience authentic drone behavior with realistic physics engine and environmental factors.",
      icon: "🚁",
      color: "from-blue-500 to-primary"
    },
    {
      title: "Night Flying Mode",
      description: "Master night operations with advanced lighting systems and focus beam functionality.",
      icon: "🌙",
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Color-coded Orientation",
      description: "Red and green visual indicators help you maintain perfect drone orientation during flight.",
      icon: "🎯",
      color: "from-primary to-accent"
    },
    {
      title: "Manual Geofencing",
      description: "Set custom flight boundaries with adjustable height and radius parameters for safe operations.",
      icon: "📍",
      color: "from-green-500 to-primary"
    },
    {
      title: "Smooth RTL Function",
      description: "Automated Return to Launch with configurable altitude settings for emergency situations.",
      icon: "🏠",
      color: "from-accent to-yellow-500"
    },
    {
      title: "Advanced Controls",
      description: "Professional-grade control interface with customizable sensitivity and response settings.",
      icon: "🎮",
      color: "from-red-500 to-primary"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our
            <span className="text-primary"> Simulator</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the most comprehensive drone simulation with features designed 
            for both learning and professional training.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in border-0 shadow-lg"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take Flight?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of pilots who have mastered drone flying with our simulator.
            </p>
            <button className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-300">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
