
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Download = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    purpose: "",
    country: "",
    termsAccepted: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.termsAccepted) {
    toast({
      title: "Terms Required",
      description: "Please accept the terms and conditions to continue.",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);

  const safePassword = `${formData.name.replace(/\s/g, '')}@1234`;

  const payload = {
    email: formData.email,
    username: formData.name.split(' ')[0] || formData.name,
    password: safePassword,
    password_confirm: safePassword,
    full_name: formData.name,
    phone_number: formData.phone,
    city: formData.city,
    state_province: formData.state,
    country: formData.country,
    purpose_of_use: formData.purpose.toLowerCase()
  };

  try {
    const response = await fetch("https://34-93-79-185.nip.io/api/download-app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Submission failed");
    }

    console.log("Success:", result);
    setIsSubmitted(true);
    toast({
      title: "Download Ready!",
      description: "Your download link has been generated successfully.",
    });
  } catch (error: any) {
    console.error("API Error:", error);
    toast({
      title: "Error",
      description: error.message || "Something went wrong.",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};



  const purposeOptions = [
    "Personal/Hobby Use",
    "Educational/Learning",
    "Professional Training",
    "Commercial Operations",
    "Research & Development",
    "Flight Instruction",
    "Other"
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white font-poppins">
        <Navigation />
        <section className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Thank You!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Your download request has been processed successfully. Check your email for the download link and installation instructions.
            </p>

            <Card className="bg-gradient-to-r from-primary to-accent text-white mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Download Your APK</h3>
                <p className="mb-6 opacity-90">Click the button below to start downloading the DroneSimulator APK file.</p>
                <Button className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3">
                  Download APK (25.4 MB)
                </Button>
              </CardContent>
            </Card>

            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-4">Next Steps:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Download and install the APK on your Android device</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Check out our beginner tutorials to get started</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span>Join our community for tips and support</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Download
              <span className="text-primary"> DroneSimulator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get instant access to the most comprehensive drone flight simulator. 
              Fill out the form below to receive your download link.
            </p>
          </div>
        </div>
      </section>

      {/* Download Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <Card className="shadow-2xl animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Download Form</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
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
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  
                  </div>
                  <div>
  <Label htmlFor="country">Country *</Label>
  <Input
    id="country"
    type="text"
    required
    value={formData.country}
    onChange={(e) => handleInputChange("country", e.target.value)}
    className="mt-1"
  />
</div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Purpose of Use *</Label>
                      <Select onValueChange={(value) => handleInputChange("purpose", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the <span className="text-primary cursor-pointer">Terms & Conditions</span> and 
                      <span className="text-primary cursor-pointer"> Privacy Policy</span>. I understand that my 
                      information will be used to provide access to the DroneSimulator software.
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Get Download Link"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <div className="space-y-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What You'll Get</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>DroneSimulator APK file (25.4 MB)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Installation guide and quick start tutorial</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Access to all simulation features</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Free updates and support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">System Requirements</h3>
                  <div className="space-y-3 text-gray-600">
                    <p><strong>OS:</strong> Android 6.0 or higher</p>
                    <p><strong>RAM:</strong> 3GB minimum, 4GB recommended</p>
                    <p><strong>Storage:</strong> 500MB free space</p>
                    <p><strong>GPU:</strong> OpenGL ES 3.0 support</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-primary to-accent text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">🔒 Your Privacy Matters</h3>
                  <p className="opacity-90">
                    Your information is encrypted and securely stored. We never share 
                    your data with third parties and you can opt out at any time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Download;
