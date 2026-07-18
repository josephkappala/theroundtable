import { cn } from "@/utils/cn";

type MarkdownContentProps = { content: string; className?: string };

// Lightweight, intentionally constrained rendering for model text. It does not inject HTML.
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className={cn("space-y-3 text-sm leading-6 text-slate-300", className)}>
      {blocks.map((block, index) => {
        const lines = block.split("\n").filter(Boolean);
        const heading = lines[0]?.match(/^#{1,3}\s+(.+)/)?.[1];
        if (heading) {
          return (
            <section key={`${heading}-${index}`} className="space-y-1.5">
              <h3 className="text-sm font-semibold text-white">{heading}</h3>
              {lines.slice(1).map((line, lineIndex) => (
                <p key={lineIndex}>{line.replace(/^[-*]\s+/, "")}</p>
              ))}
            </section>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="space-y-1.5 pl-4">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="list-disc pl-1">{line.replace(/^[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}
