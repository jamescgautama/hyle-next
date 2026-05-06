"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
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

export function InsightsSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/blogs")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlogs(res.data.slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch latest insights:", err);
        setLoading(false);
      });
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section id="insights" className="bg-offwhite bg-grid-pattern pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/60">
            Latest Insights
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Environmental Intelligence Reports
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200/50" />
            ))
          ) : (
            blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/insights/${blog.id}`}
                className="group block"
              >
                <Card className="h-full border border-border-subtle bg-white shadow-none transition-colors hover:bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-text-primary group-hover:text-forest line-clamp-2">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {blog.content}
                    </CardDescription>
                    <span className="mt-4 inline-block text-sm font-medium text-forest/70 transition-colors group-hover:text-forest">
                      Read more →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
