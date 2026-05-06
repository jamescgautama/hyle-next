"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";



interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function InsightsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/blogs")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else {
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load insights.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-offwhite bg-grid-pattern py-20 md:py-24 flex-grow">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-12 text-center md:text-left">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/60">
              Environmental Insights
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-forest md:text-4xl lg:text-5xl">
              Research & Analysis Reports
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-pulse text-forest font-medium">Loading insights...</div>
            </div>
          ) : error ? (
            <div className="bg-white border border-border-subtle p-8 rounded-xl text-center">
              <p className="text-destructive font-medium">{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white border border-border-subtle p-12 rounded-xl text-center">
              <p className="text-muted-foreground">No insights published yet.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/insights/${blog.id}`} className="group block">
                  <Card className="h-full border border-border-subtle bg-white shadow-none transition-colors hover:bg-secondary/50">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-text-primary group-hover:text-forest">
                        {blog.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {blog.image_url && (
                        <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {blog.content}
                      </CardDescription>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-forest/70">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-forest group-hover:translate-x-1 transition-transform inline-block">
                          Read Report →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
