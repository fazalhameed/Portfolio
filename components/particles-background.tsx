"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { Engine } from "@tsparticles/engine";
import { getThemeByName } from "@/lib/config";

export function ParticlesBackground() {
  const [mounted, setMounted] = useState(false);
  const [init, setInit] = useState(false); // Track engine initialization
  const { theme } = useTheme();
  const [particleConfig, setParticleConfig] = useState<any>(null);

  // 1. Initialize the engine once on mount
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
    setMounted(true);
  }, []);

  // 2. Your existing logic to set config (remains mostly the same)
  useEffect(() => {
    if (mounted && theme) {
      const currentTheme = getThemeByName(theme === "system" ? "light" : theme);
      if (currentTheme) {
        const config = currentTheme.particleConfig;

        // IMPORTANT: In v3, line_linked is renamed to 'links'
        // and 'particles_nb' is 'quantity'
        const newConfig = {
          fpsLimit: 120,
          fullScreen: { enable: true, zIndex: 0 },
          particles: {
            number: {
              value: config.particleCount,
              density: { enable: true, area: 800 }, // 'value_area' changed to 'area'
            },
            color: { value: config.color },
            shape: { type: config.shape },
            opacity: { value: config.opacity },
            size: { value: config.size },
            links: {
              // changed from line_linked
              enable: config.linked,
              distance: 150,
              color: config.linkColor,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: config.speed,
              outModes: { default: "out" }, // 'out_mode' changed to 'outModes'
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 200, duration: 0.4 },
              push: { quantity: 4 }, // 'particles_nb' changed to 'quantity'
            },
          },
          detectRetina: true,
        };
        setParticleConfig(newConfig);
      }
    }
  }, [mounted, theme]);

  // 3. Render check
  if (!mounted || !init || !particleConfig) {
    return null;
  }

  return <Particles id="tsparticles" options={particleConfig} />;
}
