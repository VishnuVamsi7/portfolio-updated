'use client';

import SectionBackground from './effects/SectionBackground';
import { StaggerReveal, StaggerItem } from './effects/SectionReveal';
import CompanionAnchor from './three/CompanionAnchor';
import ClientErrorBoundary from './ui/ClientErrorBoundary';
import NeuralSkillGraph from './skills/NeuralSkillGraph';
import SkillCard from './skills/SkillCard';
import { skillCategories, allSkills } from '../data/skills';

export default function Skills() {
  return (
    <section id="skills" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="grid" />
      <CompanionAnchor id="skills" className="absolute left-[5%] top-24 hidden xl:block" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem>
            <span className="section-label">Technical Expertise</span>
          </StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Skills & <span className="text-gradient">Technologies</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto max-w-3xl text-lg text-ink-secondary">
              A categorized knowledge graph of {allSkills.length}+ skills spanning languages, frontend/mobile,
              backend APIs, RAG/LLM systems, classical ML & deep learning, data pipelines, and cloud/DevOps —
              drawn from production Zibtek work and personal AI builds.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="section-divider" />
          </StaggerItem>
        </StaggerReveal>

        <ClientErrorBoundary name="NeuralSkillGraph">
          <NeuralSkillGraph />
        </ClientErrorBoundary>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.id} index={index}>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {category.icon}
                </span>
                <h3 className="font-display text-base font-bold text-ink-primary">{category.name}</h3>
              </div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                {category.skills.length} skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-line-subtle bg-base/40 px-2 py-0.5 font-mono text-[10px] text-ink-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </SkillCard>
          ))}
        </div>
      </div>
    </section>
  );
}
