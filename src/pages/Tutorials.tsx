
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Tutorials = () => {
  const tutorialLevels = [
    {
      level: "Beginner",
      color: "from-green-500 to-emerald-600",
      description: "Perfect for first-time drone pilots",
      tutorials: [
        {
          title: "Introduction to Drone Simulator",
          duration: "10 min",
          thumbnail: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Learn the interface, basic controls, and simulator navigation"
        },
        {
          title: "Basic Flight Controls",
          duration: "15 min", 
          thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Master takeoff, hovering, basic movements, and landing"
        },
        {
          title: "Understanding Drone Orientation",
          duration: "12 min",
          thumbnail: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
          description: "Learn to identify front/rear with color indicators"
        }
      ]
    },
    {
      level: "Intermediate", 
      color: "from-yellow-500 to-orange-600",
      description: "Build upon basic skills with advanced techniques",
      tutorials: [
        {
          title: "Geofencing Setup & Configuration",
          duration: "18 min",
          thumbnail: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Set up safety boundaries and height restrictions"
        },
        {
          title: "Night Flying Techniques",
          duration: "22 min",
          thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Master night operations with proper lighting and navigation"
        },
        {
          title: "Weather Condition Flying",
          duration: "20 min",
          thumbnail: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Practice flying in various weather scenarios"
        }
      ]
    },
    {
      level: "Advanced",
      color: "from-red-500 to-pink-600", 
      description: "Master professional-level operations",
      tutorials: [
        {
          title: "Return to Launch (RTL) Operations",
          duration: "25 min",
          thumbnail: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Configure and execute automated return procedures"
        },
        {
          title: "Emergency Handling Procedures",
          duration: "30 min",
          thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Handle equipment failures and emergency situations"
        },
        {
          title: "Professional Flight Planning",
          duration: "28 min", 
          thumbnail: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          description: "Plan complex missions with waypoints and automation"
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "How realistic is the flight simulation?",
      answer: "Our simulator uses advanced physics engines that replicate real-world drone behavior including wind resistance, battery consumption, and inertia. Many professional pilots use our simulator for training."
    },
    {
      question: "Can I use my own drone controller?",
      answer: "Yes! Our simulator supports most popular drone controllers and can be configured to match your specific hardware setup."
    },
    {
      question: "Are the tutorials suitable for complete beginners?",
      answer: "Absolutely! Our beginner tutorials start from the very basics and gradually build up your skills. No prior drone experience is required."
    },
    {
      question: "How long does it take to complete all tutorials?",
      answer: "The complete tutorial series takes approximately 4-5 hours to complete, but you can learn at your own pace and revisit any section as needed."
    },
    {
      question: "Do I need internet connection to access tutorials?",
      answer: "While initial download requires internet, most tutorials can be accessed offline once downloaded. Some advanced features may require online connectivity."
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
              Master Drone Flying with
              <span className="text-primary"> Expert Tutorials</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From complete beginner to professional pilot - our comprehensive tutorial 
              series will guide you through every aspect of drone operation.
            </p>
          </div>
        </div>
      </section>

      {/* Tutorial Levels */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tutorialLevels.map((level, levelIndex) => (
            <div key={levelIndex} className="mb-20 animate-fade-in" style={{animationDelay: `${levelIndex * 0.2}s`}}>
              {/* Level Header */}
              <div className={`bg-gradient-to-r ${level.color} rounded-2xl p-8 mb-8 text-white`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{level.level} Level</h2>
                <p className="text-xl opacity-90">{level.description}</p>
              </div>

              {/* Tutorials Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {level.tutorials.map((tutorial, tutorialIndex) => (
                  <Card 
                    key={tutorialIndex} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {tutorial.duration}
                      </div>
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white">
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 5v10l8-5-8-5z"/>
                          </svg>
                        </div>
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
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked
              <span className="text-primary"> Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our tutorials and simulator.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4 animate-fade-in">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-white rounded-lg shadow-sm border-0"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tutorials;
