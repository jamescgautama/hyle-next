"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      institutions: formData.get("institution"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      request: formData.get("request"),
    };

    try {
      await axios.post("/api/request-analysis", data);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="bg-sage py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-forest/60">
              Get in Touch
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-forest md:text-5xl lg:text-7xl">
              Request Data Access
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-primary/80">
              Interested in detailed environmental data for research or policy?
              Fill out the form and our team will follow up.
            </p>
          </div>

          <div>
            {submitted ? (
              <div className="rounded-xl border border-forest/10 bg-white/40 px-6 py-10 text-center animate-in fade-in zoom-in duration-300">
                <p className="text-base font-medium text-forest">
                  Thank you for your request.
                </p>
                <p className="mt-2 text-sm text-text-primary/70">
                  We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-sm text-forest font-medium">
                      Name
                    </Label>
                    <Input
                      id="contact-name"
                      name="name"
                      placeholder="Your full name"
                      required
                      className="h-10 rounded-lg border-forest/15 bg-white/60 text-text-primary placeholder:text-text-primary/40 focus-visible:border-forest focus-visible:ring-forest/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-institution" className="text-sm text-forest font-medium">
                      Institution
                    </Label>
                    <Input
                      id="contact-institution"
                      name="institution"
                      placeholder="Organization"
                      required
                      className="h-10 rounded-lg border-forest/15 bg-white/60 text-text-primary placeholder:text-text-primary/40 focus-visible:border-forest focus-visible:ring-forest/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-sm text-forest font-medium">
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="h-10 rounded-lg border-forest/15 bg-white/60 text-text-primary placeholder:text-text-primary/40 focus-visible:border-forest focus-visible:ring-forest/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="text-sm text-forest font-medium">
                      Phone
                    </Label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder="+62"
                      required
                      className="h-10 rounded-lg border-forest/15 bg-white/60 text-text-primary placeholder:text-text-primary/40 focus-visible:border-forest focus-visible:ring-forest/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-request" className="text-sm text-forest font-medium">
                    Request
                  </Label>
                  <textarea
                    id="contact-request"
                    name="request"
                    placeholder="Describe the data or information you need"
                    rows={4}
                    required
                    className="w-full rounded-lg border border-forest/15 bg-white/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-primary/40 outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-10 w-full rounded-lg bg-forest text-sm font-medium text-white hover:bg-forest/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}