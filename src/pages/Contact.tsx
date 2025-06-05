
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
//added contact 
// added

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Contact form submitted:", formData);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
        {/* Floating drone animation */}
        <div className="absolute top-20 right-10 w-16 h-16 opacity-20 animate-float">
          <img 
            src="https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
            alt="Drone" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in
              <span className="text-primary"> Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions about our drone simulator? Need technical support? 
              We're here to help you master the skies!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-2xl animate-fade-in">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="mt-1 min-h-[120px]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
              {/* Contact Details */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xl">📧</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email Support</h4>
                        <p className="text-gray-600">info@ipageums.com</p>
                        <p className="text-sm text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xl">📞</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone Support</h4>
                        <p className="text-gray-600">+91-8804349999</p>
                        <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM IST</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xl"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Office Location</h4>
                        <p className="text-gray-600">
                          6418 Pungol Drive<br />
                          Singapore,<br />
                          821641<br />
                        </p>
                        <p className="text-sm text-gray-500">By appointment only</p>
                      </div>
                    </div>
                      <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xl"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Support Location</h4>
                        <p className="text-gray-600">
                          IPage UM Services Pvt Ltd<br />
                          5A/6B, White Waters,<br />
                          Timber Lake Colony, Shaikpet,<br />
                          Gachibowli, Hyderabad - 500008<br />
                          India
                        </p>
                        <p className="text-sm text-gray-500">By appointment only</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-gradient-to-r from-primary to-accent text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                  <p className="opacity-90 mb-6">
                    Stay updated with the latest features, tutorials, and community highlights.
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <span className="text-white font-bold">f</span>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <span className="text-white font-bold">t</span>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <span className="text-white font-bold">in</span>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <span className="text-white font-bold">yt</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                      <div className="font-semibold text-gray-900">Installation Issues</div>
                      <div className="text-sm text-gray-500">Can't install the APK?</div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                      <div className="font-semibold text-gray-900">Controller Setup</div>
                      <div className="text-sm text-gray-500">Need help configuring controls?</div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                      <div className="font-semibold text-gray-900">Feature Requests</div>
                      <div className="text-sm text-gray-500">Suggest new features</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
            <p className="text-xl text-gray-600">Located in Gachibowli, Hyderabad</p>
          </div>
          
          <Card className="overflow-hidden shadow-2xl animate-fade-in">
            <div className="h-96 bg-gradient-to-br from-blue-200 to-primary/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📍</span>
                </div>
                <p className="text-gray-700 font-semibold">Interactive Map Coming Soon</p>
                <p className="text-gray-600">
                  IPage UM Services Pvt Ltd<br />
                  5A/6B, White Waters, Timber Lake Colony, Shaikpet,<br />
                  Gachibowli, Hyderabad - 500008, India
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
