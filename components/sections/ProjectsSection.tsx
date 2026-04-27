"use client";

import { useState } from "react";
import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/config";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Project } from "@/config/types";
import { FaGithub } from "react-icons/fa";

export function ProjectsSection() {
  const allProjects = getProjects();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Get unique tags from all projects
  const allTags = Array.from(
    new Set(allProjects.flatMap(project => project.tags))
  ).sort();
  
  // Filter projects based on selected tag
  const filteredProjects = selectedTag
    ? allProjects.filter(project => project.tags.includes(selectedTag))
    : allProjects;
    
  return (
    <SectionContainer id="projects">
      <SectionHeading 
        title="My Projects" 
        subtitle="Here are some of my recent projects. I've worked on a variety of applications from e-commerce to data visualization."
      />
      
      <motion.div
        className="mb-12 space-y-0.5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Reset filter */}
        <div className="flex justify-center">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer px-3 py-3 text-sm rounded-full"
            onClick={() => setSelectedTag(null)}
          >
            All Projects
          </Badge>
        </div>

        {/* Row 1 – left to right */}
        <Marquee pauseOnHover reverse={false} repeat={4} className="[--duration:50s]">
          {allTags.filter((_, i) => i % 3 === 0).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer px-3 py-3 text-xs rounded-full whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </Marquee>

        {/* Row 2 – right to left */}
        <Marquee pauseOnHover reverse={false} repeat={4} className="[--duration:50s]">
          {allTags.filter((_, i) => i % 3 === 1).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer px-3 py-3 text-xs rounded-full whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </Marquee>

        {/* Row 3 – left to right */}
        <Marquee pauseOnHover reverse={false} repeat={4} className="[--duration:50s]">
          {allTags.filter((_, i) => i % 3 === 2).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer px-3 py-3 text-xs rounded-full whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </Marquee>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
<AnimatePresence>
  {filteredProjects.map((project, index) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      layout
    >
      <ProjectCard 
        project={project} 
        onSelect={() => setSelectedProject(project)} 
      />
    </motion.div>
  ))}
</AnimatePresence>
      </div>
      
      <ProjectDialog 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </SectionContainer>
  );
}

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-muted-foreground text-sm">No image available</span>
        )}
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline">+{project.tags.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSelect}>
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
        </Dialog>
        
        <div className="flex gap-2">
          {project.githubUrl && (
            <Button variant="outline" size="icon" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                <FaGithub className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="icon" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label="Live Demo">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  if (!project) return null;
  
  return (
    <Dialog open={!!project} onOpenChange={(open:any) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        
        <div className="relative h-64 md:h-80 mt-4 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 1200px) 100vw, 80vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className="text-muted-foreground">No image available</span>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">About this project</h4>
          <p className="text-muted-foreground">
            {project.longDescription || project.description}
          </p>
        </div>
        
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          {project.liveUrl && (
            <Button asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                View Live Demo <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub Repository <FaGithub className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}