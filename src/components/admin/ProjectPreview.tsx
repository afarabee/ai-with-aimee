import { parseMarkdownContent } from '@/utils/markdownParser';
import { format } from 'date-fns';
import { Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectPreviewProps {
  title: string;
  subtitle: string;
  excerpt?: string;
  body: string;
  thumbnail?: string;
  technologies: string[];
  githubLink?: string;
  projectPageLink?: string;
  publishDate: string;
  status: string;
}

export default function ProjectPreview({
  title,
  subtitle,
  excerpt,
  body,
  thumbnail,
  technologies,
  githubLink,
  projectPageLink,
  publishDate,
  status,
}: ProjectPreviewProps) {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <article className="max-w-4xl mx-auto p-8">
        {/* Banner Image */}
        {thumbnail && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'hsl(var(--color-pink))' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl mb-4" style={{ color: 'hsl(var(--color-cyan))' }}>
              {subtitle}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 items-center text-sm" style={{ color: 'hsl(var(--foreground) / 0.7)' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={publishDate}>
                {format(new Date(publishDate), 'MMMM d, yyyy')}
              </time>
            </div>
            <Badge variant="outline" style={{ 
              borderColor: status === 'Active' ? 'hsl(var(--color-yellow))' : 'hsl(var(--color-cyan))',
              color: status === 'Active' ? 'hsl(var(--color-yellow))' : 'hsl(var(--color-cyan))'
            }}>
              {status}
            </Badge>
          </div>
        </header>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4" style={{ color: 'hsl(var(--color-yellow))' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'hsl(var(--color-yellow))' }}>
                Technologies
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  style={{
                    borderColor: 'hsl(var(--color-cyan))',
                    color: 'hsl(var(--color-cyan))',
                    background: 'hsl(var(--color-cyan) / 0.1)',
                  }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(githubLink || projectPageLink) && (
          <div className="mb-8 flex flex-wrap gap-3">
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: 'hsl(var(--color-pink))',
                  color: 'hsl(var(--color-pink))',
                }}
              >
                <Github className="w-4 h-4" />
                View Repository
              </a>
            )}
            {projectPageLink && (
              <a
                href={projectPageLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
                style={{
                  borderColor: 'hsl(var(--color-cyan))',
                  color: 'hsl(var(--color-cyan))',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                View Project
              </a>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-invert max-w-none">
          {parseMarkdownContent(body)}
        </div>
      </article>
    </div>
  );
}
