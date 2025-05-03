"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default function JobListSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const getLiveJobs = async () => {
      try {
        const res = await fetch("/api/careers");
        const data = await res.json();

        const now = new Date();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const liveJobs = data.careers.filter((job: any) => {
          const start = new Date(job.startDate);
          const end = new Date(job.lastDate);
          return start <= now && end >= now;
        });

        setJobs(liveJobs);
      } catch {
        console.error("Error fetching jobs");
      }
    };

    getLiveJobs();
  }, []);

  return (
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
  );
}
