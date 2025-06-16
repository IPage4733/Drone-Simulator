import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TutorialsPreview = () => {
  const tutorials = [
    {
      title: "Crystalball Drone | Smart Missions for Solar, Agri & Urban Zones",
      level: "Beginner",
      duration: "10 min",
      video: "https://www.youtube.com/embed/RVQ8oiLejLs",
      description: "Explore the Crystalball drone performing multi-zone operations across solar fields, farms, and urban infrastructure."
    },
    {
      title: "Agriculture Drone | Precision Farming & RPTO Ground Training",
      level: "Intermediate",
      duration: "15 min",
      video: "https://www.youtube.com/embed/cYKk5S0aOGU",
      description: "Watch precision farming in action as RPTO trainees perform real-time spraying operations using smart agriculture drones."
    },
    {
      title: "DJI Marvic | Urban Mapping & RPTO Missions",
      level: "Advanced",
      duration: "18 min",
      video: "https://www.youtube.com/embed/HyuewgCoSNE",
      description: "DJI Marvic takes on complex RPTO missions including urban inspections, aerial surveys, and mapping operations."
    }
  ];

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learn with Our
            <span className="text-primary"> Expert Drone Tutorials</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience real-world training in mapping, agriculture, and RPTO ops through curated, immersive video tutorials.
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tutorials.map((tutorial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in overflow-hidden"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="relative overflow-hidden">
                <iframe 
                  src={tutorial.video} 
                  title={tutorial.title} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-48"
                ></iframe>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(tutorial.level)}`}>
                    {tutorial.level}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {tutorial.duration}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tutorial.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <Link to="/tutorials">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg">
              View All Tutorials
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TutorialsPreview;