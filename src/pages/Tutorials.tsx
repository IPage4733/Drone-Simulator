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
          title: "High-Tech Farming Drone in Action",
          duration: "10 min",
          video: "https://www.youtube.com/embed/RVQ8oiLejLs",
          description: "Watch how high-tech farming drones revolutionize agriculture with precision spraying and smart automation."
        },
        {
          title: "Agri Mapping Masterclass with DJI Matrice 350 RTK",
          duration: "15 min",
          video: "https://www.youtube.com/embed/cYKk5S0aOGU",
          description: "Learn precision agriculture techniques in this Agri Mapping Masterclass using the DJI Matrice 350 RTK for accurate field insights and data-driven farming."
        },
        {
          title: "Agriculture Drone in Action | Precision Spraying & Crop Monitoring Demo",
          duration: "12 min",
          video: "https://www.youtube.com/embed/xIXtQn9oLgI",
          description: "See the Agriculture Drone in action as it performs precision spraying and real-time crop monitoring for smarter, efficient farming."
        }
      ]
    },
    {
      level: "Intermediate",
      color: "from-yellow-500 to-orange-600",
      description: "Build upon basic skills with advanced techniques",
      tutorials: [
        {
          title: "DJI Marvic in Action | Mapping, Urban Inspections & RPTO Flights",
          duration: "18 min",
          video: "https://www.youtube.com/embed/HyuewgCoSNE",
          description: "Watch the DJI Mavic in action as it handles mapping, urban inspections, and RPTO-compliant training flights with precision and reliability."
        },
        {
          title: "Crystalball Model Multi-Zone Smart Drone for Solar, Agri & Urban Missions",
          duration: "22 min",
          video: "https://www.youtube.com/embed/Bu4e5W0thPE",
          description: "Discover the Crystalball Model, a multi-zone smart drone designed for high-performance solar inspections, precision agriculture, and complex urban missions."
        },
        {
          title: "High-Speed Racing Drone | FPV Flight Across RPTO & Defense Zones",
          duration: "20 min",
          video: "https://www.youtube.com/embed/DDh0sCOs4nE",
          description: "Experience the thrill of a high-speed racing drone as it navigates FPV flights across RPTO training courses and simulated defense zones with agility and control."
        }
      ]
    },
    {
      level: "Advanced",
      color: "from-red-500 to-pink-600",
      description: "Master professional-level operations",
      tutorials: [
        {
          title: "DJI Matrice 350 RTK Multi-Zone Drone for Inspection, Defense & RPTO Training",
          duration: "25 min",
          video: "https://www.youtube.com/embed/g1MnCKU8Bg0",
          description: "CExplore the DJI Matrice 350 RTK, a powerful multi-zone drone built for industrial inspections, defense simulations, and DGCA-compliant RPTO training missions."
        },
        {
          title: "Agriculture Drone in Action | Precision Farming & RPTO Ground Training",
          duration: "30 min",
          video: "https://www.youtube.com/embed/2DlM4dM2GVU",
          description: "Watch the Agriculture Drone in action as it delivers precision farming solutions and supports RPTO ground training with real-time spraying and flight simulation."
        },
        {
          title: "Agriculture Drone in Action | Precision Spraying & Crop Monitoring Demo",
          duration: "28 min",
          video: "https://www.youtube.com/embed/xIXtQn9oLgI",
          description: "Watch the Agriculture Drone in action as it showcases precision spraying and advanced crop monitoring for efficient, data-driven farming."
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
            <div key={levelIndex} className="mb-20 animate-fade-in" style={{ animationDelay: `${levelIndex * 0.2}s` }}>
              <div className={`bg-gradient-to-r ${level.color} rounded-2xl p-8 mb-8 text-white`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{level.level} Level</h2>
                <p className="text-xl opacity-90">{level.description}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {level.tutorials.map((tutorial, tutorialIndex) => (
                  <Card key={tutorialIndex} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer">
                    <div className="relative overflow-hidden">
                      <iframe
                        className="w-full h-48"
                        src={tutorial.video}
                        title={tutorial.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
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
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border-0">
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