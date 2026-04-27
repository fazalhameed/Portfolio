"use client";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { getPersonalInfo, getSocialLinks } from "@/lib/config";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import emailjs from "@emailjs/browser";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { toast } = useToast();
  const personalInfo = getPersonalInfo();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first — catches ZodError before we even try to send
    let parsed: ContactFormData;
    try {
      parsed = contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<ContactFormData> = {};
        error.issues.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: parsed.name,
          from_email: parsed.email,
          message: parsed.message,
          to_email: personalInfo.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch {
      toast({
        title: "Failed to send message",
        description: "Something went wrong. Please try emailing me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = getSocialLinks();

  return (
    <SectionContainer id="contact">
      <SectionHeading
        title="Get In Touch"
        subtitle="Have a question or want to work together? Feel free to contact me."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        {/* Contact Info Sidebar - 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-2 flex flex-col gap-8 order-2 lg:order-1"
        >
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <p className="text-muted-foreground mb-8">
              I'm always open to discussing new projects, creative ideas or
              opportunities to be part of your visions.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Discuss via Email
                  </p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-base font-semibold hover:text-primary transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Based in
                  </p>
                  <p className="text-base font-semibold">
                    {personalInfo.location}
                  </p>
                </div>
              </div>

              {personalInfo.phone && (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Call Me
                    </p>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-base font-semibold hover:text-primary transition-colors"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contact Form - 3 columns */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-3 order-1 lg:order-2"
        >
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(
                        "h-12 bg-background/50 border-primary/10 focus:border-primary transition-all rounded-xl",
                        errors.name &&
                          "border-destructive focus:border-destructive",
                      )}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive font-medium italic">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(
                        "h-12 bg-background/50 border-primary/10 focus:border-primary transition-all rounded-xl",
                        errors.email &&
                          "border-destructive focus:border-destructive",
                      )}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive font-medium italic">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold">
                    Tell me about your project
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Hello! I'd like to talk about..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={cn(
                      "bg-background/50 border-primary/10 focus:border-primary transition-all resize-none rounded-xl",
                      errors.message &&
                        "border-destructive focus:border-destructive",
                    )}
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive font-medium italic">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-base font-bold rounded-xl shadow-sm shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Connection..." : "Send Message"}
                  <Send
                    className={cn(
                      "ml-2 h-5 w-5",
                      isSubmitting && "animate-pulse",
                    )}
                  />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </SectionContainer>
  );
}
