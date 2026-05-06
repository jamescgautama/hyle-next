"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ContactSection } from "@/components/sections/ContactSection";
import Link from "next/link";



interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function InsightDetailPage() {
  const params = useParams();
  const id = params.id;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <div className="animate-pulse text-forest font-medium">Loading report...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mx-auto max-w-[800px] px-6 py-40 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Insight not found</h1>
        <Link href="/insights" className="text-forest hover:underline mt-4 inline-block">
          Return to insights
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <article className="bg-offwhite bg-grid-pattern py-20 flex-grow">
        <div className="mx-auto max-w-[800px] px-6">
          <Link href="/insights" className="text-sm font-medium text-forest/70 hover:text-forest mb-8 inline-block">
            ← Back to insights
          </Link>

          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/60">
            {new Date(blog.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-forest md:text-4xl lg:text-5xl mb-8">
            {blog.title}
          </h1>

          {blog.image_url && (
            <div className="relative aspect-video mb-10 overflow-hidden rounded-2xl border border-border-subtle shadow-sm">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="prose prose-forest max-w-none text-lg leading-relaxed text-text-primary/90 whitespace-pre-wrap">
            {blog.content}
          </div>
        </div>
      </article>

      <ContactSection />
    </div>
  );
}
