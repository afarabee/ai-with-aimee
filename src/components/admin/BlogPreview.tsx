import AboutBackground from '@/components/AboutBackground';
import { parseMarkdownContent } from '@/utils/markdownParser';
import { Calendar } from 'lucide-react';
interface BlogPreviewProps {
  title: string;
  subtitle?: string;
  author: string;
  date_published: Date;
  banner_image?: string;
  excerpt: string;
  body: string;
}
const BlogPreview: React.FC<BlogPreviewProps> = ({
  title,
  subtitle,
  author,
  date_published,
  banner_image,
  excerpt,
  body
}) => {
  return <div className="blog-preview h-full overflow-y-auto bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16">
        <AboutBackground />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h1 className="blog-h1">{title || 'Untitled Post'}</h1>
          {subtitle && <p className="blog-subtitle">{subtitle}</p>}
          <div className="blog-author">{author}</div>
          <div className="flex items-center justify-center gap-2 text-sm mt-2" style={{
          color: 'hsl(var(--color-light-text))'
        }}>
            <Calendar size={16} />
            <span>{new Date(date_published).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </section>

      {/* Banner Image */}
      {banner_image && <section className="py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <img src={banner_image} alt={title} className="w-full rounded-xl" style={{
          border: '2px solid hsl(var(--color-cyan) / 0.3)',
          boxShadow: '0 0 20px hsl(var(--color-cyan) / 0.2)'
        }} />
          </div>
        </section>}


      {/* Body Content */}
      <article className="py-16 px-6">
        <div className="max-w-[740px] mx-auto">
          <div className="blog-body">
            {body ? parseMarkdownContent(body) : <p style={{
            color: 'hsl(var(--color-light-text) / 0.5)'
          }}>
                Start writing to see preview...
              </p>}
          </div>
        </div>
      </article>

      {/* Footer Signature */}
      <section className="py-16 px-6 border-t" style={{
      borderColor: 'hsl(var(--color-cyan) / 0.2)'
    }}>
        <div className="max-w-[740px] mx-auto text-center">
          
        </div>
      </section>
    </div>;
};

export default BlogPreview;