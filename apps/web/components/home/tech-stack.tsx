import Image from "next/image";

interface StackItem {
  id: number;
  name: string;
  iconUrl: string;
  category: string;
  order: number;
}

interface TechStackProps {
  stack: StackItem[];
}

export function TechStack({ stack }: TechStackProps) {
  // Group by category
  const grouped = stack.reduce<Record<string, StackItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category]!.push(item);
    return acc;
  }, {});

  if (stack.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
        Tech Stack
      </h2>
      <div className="flex flex-col gap-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:scale-105 transition-all duration-200 backdrop-blur-sm cursor-default"
                >
                  <div className="relative h-4 w-4 flex-shrink-0">
                    <Image
                      src={item.iconUrl}
                      alt={item.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
