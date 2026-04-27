"use client";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import {
  getWorkExperiences,
  getEducationExperiences,
} from "@/lib/config";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BriefcaseIcon, GraduationCap } from "lucide-react";
import { Experience } from "@/config/types";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const workExperiences = getWorkExperiences();
  const educationExperiences = getEducationExperiences();

  return (
    <SectionContainer id="experience">
      <SectionHeading
        title="Experience & Education"
        subtitle="My professional journey and educational background"
      />

      <Tabs defaultValue="work" className="max-w-3xl mx-auto">
        {/* Tabs Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="work" className="gap-2">
              <BriefcaseIcon className="h-4 w-4" />
              Work
            </TabsTrigger>

            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* WORK */}
        <TabsContent value="work" className="space-y-6">
          {workExperiences.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={i}
              total={workExperiences.length}
              icon={<BriefcaseIcon className="h-5 w-5" />}
            />
          ))}
        </TabsContent>

        {/* EDUCATION */}
        <TabsContent value="education" className="space-y-6">
          {educationExperiences.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              index={i}
              total={educationExperiences.length}
              icon={<GraduationCap className="h-5 w-5" />}
            />
          ))}
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}

/* ---------------------------
   EXPERIENCE CARD COMPONENT
---------------------------- */

function ExperienceCard({
  experience,
  index,
  total,
  icon,
}: {
  experience: Experience;
  index: number;
  total: number;
  icon: React.ReactNode;
}) {
  const isLast = index === total - 1;

  return (
    <div className="relative pl-12">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-3 top-6 h-6 w-6 rounded-full border bg-background flex items-center justify-center">
        {icon}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        viewport={{ once: true }}
      >
        <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {experience.position}
            </CardTitle>

            <CardDescription className="text-sm">
              <span className="font-medium text-foreground">
                {experience.company}
              </span>{" "}
              • {experience.duration}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {experience.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}