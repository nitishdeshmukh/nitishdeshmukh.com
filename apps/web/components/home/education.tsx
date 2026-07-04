interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  logoUrl: string | null;
  startYear: number;
  endYear: number | null;
}

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
        Education
      </h2>
      <div className="flex flex-col gap-3">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {edu.institution}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {edu.degree} in {edu.field}
                </p>
              </div>
              <span className="text-xs text-neutral-400 flex-shrink-0 mt-0.5">
                {edu.startYear} — {edu.endYear ?? "Present"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
