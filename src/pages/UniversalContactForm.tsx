import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const UniversalContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    userType: "",
    purpose: [],
    message: "",
    studentsOrTeam: "",
    website: "",
    dgcaId: "",
    droneModels: "",
    serviceArea: "",
    pilotCertified: "",
    useCaseDescription: "",
    interestedInDGCA: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const updated = prev.purpose.includes(value)
        ? prev.purpose.filter(item => item !== value)
        : [...prev.purpose, value];
      return { ...prev, purpose: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Universal Contact Form submitted:", formData);
      toast({
        title: "Submission Successful!",
        description: "Thank you. Our team will contact you shortly."
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        userType: "",
        purpose: [],
        message: "",
        studentsOrTeam: "",
        website: "",
        dgcaId: "",
        droneModels: "",
        serviceArea: "",
        pilotCertified: "",
        useCaseDescription: "",
        interestedInDGCA: false
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white font-poppins">
      <Navigation />

      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-16">
        <Card className="w-full max-w-3xl shadow-xl border border-gray-200 animate-fade-in">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Connect With Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" type="text" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="text" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div>
                <Label htmlFor="organization">Organization / Institution Name *</Label>
                <Input id="organization" type="text" required value={formData.organization} onChange={(e) => handleInputChange("organization", e.target.value)} placeholder="ABC Institute of Technology" />
              </div>
<div>
  <Label htmlFor="userType">I am a... <span className="text-red-500">*</span></Label>
  <select
    id="userType"
    required
    value={formData.userType}
    onChange={(e) => handleInputChange("userType", e.target.value)}
    className="w-full px-4 py-2 mt-1 border border-black rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
  >
    <option value="">Select</option>
    <option value="Institution">Educational Institution</option>
    <option value="University">University / Research Center</option>
    <option value="RPTO">RPTO</option>
    <option value="Pilot">Drone Pilot</option>
    <option value="ServiceProvider">Drone Service Provider</option>
    <option value="Manufacturer">Drone Manufacturer</option>
    <option value="Corporate">Corporate / Government</option>
    <option value="Student">Student</option>
  </select>
</div>

              {/* Updated Purpose Section */}
              <div>
                <Label>Purpose of Contact *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Purchase Simulator",
                    "Request a Demo",
                    "Integrate in Curriculum",
                    "Add Drone Model",
                    "Use for Research",
                    "Train My Team",
                    "Collaborate / Resell"
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center space-x-2 px-2 py-2 border rounded-md hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.purpose.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                        className="form-checkbox h-4 w-4 text-orange-600"
                      />
                      <span className="text-sm text-gray-800">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(formData.userType === "Institution" || formData.userType === "RPTO" || formData.userType === "Corporate") && (
                <div>
                  <Label>No. of Students / Team Members</Label>
                  <Input type="number" value={formData.studentsOrTeam} onChange={(e) => handleInputChange("studentsOrTeam", e.target.value)} placeholder="e.g. 100" />
                </div>
              )}
              {(formData.userType === "Institution" || formData.userType === "University") && (
                <div>
                  <Label>Institution / College Website</Label>
                  <Input type="url" value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} placeholder="https://example.edu" />
                </div>
              )}
              {formData.userType === "RPTO" && (
                <div>
                  <Label>DGCA RPTO ID</Label>
                  <Input type="text" value={formData.dgcaId} onChange={(e) => handleInputChange("dgcaId", e.target.value)} placeholder="e.g. DGCA-XX123" />
                </div>
              )}
              {formData.userType === "Manufacturer" && (
                <div>
                  <Label>Drone Models / Product Line</Label>
                  <Textarea value={formData.droneModels} onChange={(e) => handleInputChange("droneModels", e.target.value)} placeholder="List your drone models or SKUs..." />
                </div>
              )}
              {formData.userType === "ServiceProvider" && (
                <div>
                  <Label>Drone Service Area / Experience</Label>
                  <Textarea value={formData.serviceArea} onChange={(e) => handleInputChange("serviceArea", e.target.value)} placeholder="Agri spraying, surveillance, mapping..." />
                </div>
              )}
              {formData.userType === "Pilot" && (
                <div>
                  <Label>Pilot Certification Status</Label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="certified" value="Yes" checked={formData.pilotCertified === "Yes"} onChange={(e) => handleInputChange("pilotCertified", e.target.value)} className="mr-2" /> Yes
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="certified" value="No" checked={formData.pilotCertified === "No"} onChange={(e) => handleInputChange("pilotCertified", e.target.value)} className="mr-2" /> No
                    </label>
                  </div>
                </div>
              )}
              <div>
                <Label>Use Case Description</Label>
                <Textarea value={formData.useCaseDescription} onChange={(e) => handleInputChange("useCaseDescription", e.target.value)} placeholder="Tell us about your interest in using the drone simulator..." />
              </div>

              <label className="flex items-center bg-orange-50 text-orange-800 p-4 rounded-md">
                <input
                  type="checkbox"
                  checked={formData.interestedInDGCA}
                  onChange={(e) => handleInputChange("interestedInDGCA", e.target.checked)}
                  className="mr-3 mt-1"
                />
                <span className="text-lg font-semibold">
                  Interested in Partnership for DGCA (Directorate General of Civil Aviation India), For DGCA Drone Pilot Training
                </span>
              </label>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default UniversalContactForm;
