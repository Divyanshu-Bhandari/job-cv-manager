"use client";
import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import Autoplay from "embla-carousel-autoplay";

import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layout,
  Rocket,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ResumeCount {
  count: number;
}

interface Job {
  id: string;
  positionName: string;
  description: string;
  jobLink: string;
  location: string;
  company: string;
  lastDate: string;
}

async function getResumesCreated(): Promise<number> {
  try {
    const infoDoc = await getDoc(doc(db, "info", "resumesCreated"));
    return infoDoc.exists() ? (infoDoc.data() as ResumeCount).count : 0;
  } catch (error) {
    console.error("Error fetching resumes count:", error);
    return 0;
  }
}

const FeatureCard: FC<{
  icon: React.ReactNode;
  title: string;
  features: string[];
}> = ({ icon, title, features }) => (
  <Card className="transition-all duration-300 hover:shadow-lg">
    <CardHeader>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const TemplateTabs: FC<{ templates: string[] }> = ({ templates }) => (
  <Tabs defaultValue="modern" className="w-full max-w-3xl">
    <TabsList className="grid w-full grid-cols-3">
      {templates.map((template) => (
        <TabsTrigger key={template} value={template.toLowerCase()}>
          {template}
        </TabsTrigger>
      ))}
    </TabsList>
    {templates.map((template) => (
      <TabsContent key={template} value={template.toLowerCase()}>
        <Card>
          <CardContent className="p-6">
            <div className="aspect-[1366/2739] rounded-lg bg-muted flex items-center justify-center">
              <Image
                src={`/assets/${template}.png`}
                alt={template}
                width={720}
                height={368}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    ))}
  </Tabs>
);

function getFaviconUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "/favicon.ico";
  }
}

function getTimeLeft(date: string) {
  const daysLeft = Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return `${daysLeft > 0 ? daysLeft : 0} days left`;
}

export default function HomePage() {
  const templatesRef = useRef<HTMLDivElement>(null);
  const [resumesCreated, setResumesCreated] = useState(0);
  const templates = ["Modern", "Professional", "Minimal"];
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await fetch("/api/careers");
        const data = await res.json();
        setJobs(data.careers);
      } catch {
        console.error("Error fetching jobs");
      }
    };
    getJobs();
  }, []);

  useEffect(() => {
    const fetchResumesCount = async () => {
      const count = await getResumesCreated();
      setResumesCreated(count);
    };
    fetchResumesCount();
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center bg-gradient-to-b from-background to-muted">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <Badge className="mb-4" variant="secondary">
            100% Free & Open Source
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build Your Resume & Launch Your Career
          </h1>
          <p className="text-xl text-muted-foreground max-w-[750px]">
            Create stunning resumes and explore career opportunities—all in one
            place. Free, open-source, and powered by AI with no watermarks or
            hidden fees.
          </p>
        </div>

        <div className="flex flex-col sm:items-center sm:flex-row gap-4 mb-12">
          <Link
            href="/resume/create"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/careers"
            className="inline-flex items-center justify-center rounded-md border border-primary px-8 py-2 text-lg font-medium text-primary shadow transition-colors hover:bg-primary/10"
          >
            Find Careers
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">
              <CountUp
                start={0}
                end={resumesCreated}
                duration={1}
                separator=","
                enableScrollSpy={true}
              />
              +
            </p>
            <p className="text-sm text-muted-foreground">Resumes Created</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">Free Forever</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">ATS</p>
            <p className="text-sm text-muted-foreground">Optimized</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">Fast</p>
            <p className="text-sm text-muted-foreground">and Secure</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center px-16 pt-14 pb-20 sm:px-24 sm:pt-14 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-10">
            Latest Career Opportunities
          </h2>

          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-6xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {jobs && jobs.length > 0
                ? jobs.map((job) => (
                    <CarouselItem
                      key={job.id}
                      className="ml-3 basis-full sm:basis-1/2 md:basis-1/3 px-4 sm:min-w-96"
                    >
                      <Card
                        className="min-h-56 h-full cursor-pointer hover:bg-muted hover:dark:bg-[#20202a] transition group shadow-sm"
                        onClick={() => window.open(job.jobLink, "_blank")}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-2 overflow-hidden">
                            <Image
                              src={getFaviconUrl(job.jobLink)}
                              alt={job.company}
                              width={35}
                              height={35}
                              className="shrink-0 rounded-md"
                            />
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {job.company}
                            </p>
                          </div>

                          <h3
                            className="text-base sm:text-lg font-semibold mb-1 truncate whitespace-nowrap overflow-hidden"
                            title={job.positionName}
                          >
                            {job.positionName}
                          </h3>

                          <p
                            className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3 h-[60px]"
                            title={job.description}
                          >
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{job.location}</Badge>
                            <Badge variant="secondary">
                              {getTimeLeft(job.lastDate)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))
                : // Skeleton UI when jobs are loading or empty
                  Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="ml-3 basis-full sm:basis-1/2 md:basis-1/3 px-4 sm:min-w-96"
                    >
                      <Card className="min-h-56 h-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-3 mb-2">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-4 w-24 rounded" />
                          </div>
                          <Skeleton className="h-5 w-full rounded" />
                          <Skeleton className="h-4 w-3/4 rounded" />
                          <div className="flex gap-2 mt-4">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
            </CarouselContent>

            <CarouselPrevious className="text-primary" />
            <CarouselNext className="text-primary" />
          </Carousel>

          <div className="flex flex-col justify-center items-center mt-8">
            <Link href="/careers">
              <Button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                View all <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-16 pb-24 bg-muted/50 flex flex-col items-center">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Job-CV-Manager?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern tools and designed for everyone. Create
              professional resumes without watermarks or hidden fees — and apply
              for real job openings with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Layout className="h-6 w-6 text-primary" />}
              title="Professional Templates"
              features={[
                "ATS-friendly designs",
                "Multiple layout options",
                "Customizable sections",
                "Print-ready formats",
              ]}
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-primary" />}
              title="AI-Powered"
              features={[
                "Smart content suggestions",
                "Auto Generate Content",
                "Keyword optimization",
                "Powered by Llama 3.1",
              ]}
            />
            <FeatureCard
              icon={<Rocket className="h-6 w-6 text-primary" />}
              title="Built for Everyone"
              features={[
                "No sign-up required",
                "100% free, forever",
                "Export to PDF",
                "Open-source code",
              ]}
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6 text-primary" />}
              title="Career Opportunities"
              features={[
                "Browse job listings",
                "Apply directly with your resume",
                "Updated regularly",
                "Dedicated career page",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section
        ref={templatesRef}
        className="py-24 scroll-mt-16 flex flex-col items-center"
      >
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Professional Templates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of ATS-optimized templates designed to
              help you stand out while ensuring compatibility with applicant
              tracking systems.
            </p>
          </div>

          <div className="flex justify-center">
            <TemplateTabs templates={templates} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground flex flex-col items-center">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully created their
            resumes using our platform. No credit card required, no hidden fees.
          </p>
          <Link
            href="/resume/create"
            className="inline-flex items-center justify-center rounded-md bg-background text-primary px-8 py-2 text-lg font-medium shadow transition-colors hover:bg-background/90"
          >
            Create Your Resume Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
