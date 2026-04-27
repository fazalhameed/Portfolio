"use client";

import { SectionContainer } from "@/components/section-container";
import { getSkills } from "@/lib/config";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { SectionHeading } from "../section-heading";

export function AboutSection() {
  const skills = getSkills();
  const frontendSkills = skills.filter(
    (skill) => skill.category === "frontend",
  );
  const backendSkills = skills.filter((skill) => skill.category === "backend");
  const otherSkills = skills.filter(
    (skill) => skill.category !== "frontend" && skill.category !== "backend",
  );

  return (
    <SectionContainer id="about">
      <SectionHeading
        title="About Me"
        subtitle="Passionate Embedded Systems & Firmware Engineer | Building Efficient, Reliable, and Intelligent Solutions by Seamlessly Integrating Hardware and Software"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-xl font-semibold mb-4">My Background</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
             I specialize in designing and developing embedded systems and firmware using modern microcontroller platforms. 
             My interest in embedded engineering started with building real-world hardware projects and has grown into a strong 
             focus on creating efficient, reliable, and intelligent systems.
            </p>
            <p>
              I work across the embedded stack using C/C++ and platforms like ESP32 and STM32, with hands-on experience in sensor interfacing, real-time operating systems 
              (FreeRTOS), and communication protocols such as UART, SPI, and I²C. 
              I also develop connected systems using wireless technologies including Wi-Fi, BLE, RF, and LoRa for scalable IoT applications.
            </p>
            <p>
             Beyond project development, I focus on writing clean, efficient firmware and designing robust hardware-software integrations. 
             I’m continuously learning and exploring advanced areas like RTOS optimization, device drivers, 
             and embedded communication systems to build high-performance solutions that solve real-world problems.
            </p>
          </div>
        </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-xl font-semibold mb-4">Frontend Skills</h3>
            <div className="space-y-4">
              {frontendSkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </motion.div>
       
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-xl font-semibold mb-4">Backend Skills</h3>
            <div className="space-y-4">
              {backendSkills.map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </motion.div> */}

          {otherSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
              <div className="space-y-4">
                {otherSkills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>
          )}
       
      </div>
    </SectionContainer>
  );
}

interface SkillBarProps {
  skill: {
    name: string;
    level: number;
  };
  index: number;
}

function SkillBar({ skill, index }: SkillBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.level}%</span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        transition={{ duration: 1, delay: 0.1 * index }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Progress value={skill.level} className="h-2" />
      </motion.div>
    </div>
  );
}
