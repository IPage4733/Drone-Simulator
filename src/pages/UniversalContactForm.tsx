import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

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
  const formRef = useRef<HTMLFormElement>(null);

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

    // Ensure form reference exists
    if (!formRef.current) return;

    try {
      const form = formRef.current;
      const formData = {
        name: form.name.valueOf,
        email: form.email.value,
        phone: form.phone.value,
        organization: form.organization.value,
        userType: form.userType.value,
        purpose: form.purpose.value,
        message: form.message.value,
        studentsOrTeam: form.studentsOrTeam.value,
        website: form.website.value,
        dgcaId: form.dgcaId.value,
        droneModels: form.droneModels.value,
        serviceArea: form.serviceArea.value,
        pilotCertified: form.pilotCertified.value,
        useCaseDescription: form.useCaseDescription.value,
        interestedInDGCA: form.interestedInDGCA.checked
      };

      // Send form data to EmailJS
      await emailjs.send(
        "your_service_id", // Replace with your EmailJS service ID
        "your_template_id", // Replace with your EmailJS template ID
        formData, // Send the form data as the email content
        "your_user_id" // Replace with your EmailJS user ID
      );

      // Send thank-you email to user (optional)
      await emailjs.send(
        "your_service_id", // Same as above
        "your_template_id", // Replace with your thank-you email template ID
        {
          to_name: formData.name,
          to_email: formData.email
        },
        "your_user_id" // Same user ID
      );

      toast({
        title: "Submission Successful!",
        description: "Thank you. Our team will contact you shortly."
      });

      // Reset form data after successful submission
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
    } catch (error) {
      console.error("EmailJS error:", error);
      toast({
        title: "Error",
        description: "There was an issue sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white font-poppins">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-16">
        <Card className="w-full max-w-3xl shadow-xl border border-gray-200 animate-fade-in">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Connect With Us</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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

              {/* Purpose of Contact */}
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

              {/* Additional Fields for Specific User Types */}
              {/* Conditionally render additional input fields here as per the original form */}
              {/* For example: */}
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
