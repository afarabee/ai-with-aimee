import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Rocket, Brain, StickyNote, X, Plus, Check, Search, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface SelectedItem {
  type: 'blog' | 'project' | 'prompt' | 'note';
  id: string;
  title: string;
  data?: any;
}

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string | null;
  date_published: string;
  banner_image: string | null;
}

interface Project {
  id: string;
  project_title: string;
  subtitle: string;
  status: string;
  updated_at: string;
  thumbnail: string | null;
}

interface Prompt {
  id: string;
  title: string;
  category: string | null;
  tags: string[];
  last_modified: string;
}

interface CustomNote {
  id: string;
  title: string;
  body: string;
}

export default function NewsletterDashboard() {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [activeTab, setActiveTab] = useState('blogs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Custom notes state
  const [notes, setNotes] = useState<CustomNote[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  // Load selections from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('newsletterSelections');
    if (saved) {
      try {
        setSelectedItems(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved selections:', error);
      }
    }
  }, []);

  // Save selections to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('newsletterSelections', JSON.stringify(selectedItems));
  }, [selectedItems]);

  // Fetch blogs
  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['newsletter-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, excerpt, category, date_published, banner_image')
        .eq('status', 'published')
        .order('date_published', { ascending: false });
      if (error) throw error;
      return data as Blog[];
    },
  });

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['newsletter-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_title, subtitle, status, updated_at, thumbnail')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  // Fetch prompts
  const { data: prompts, isLoading: promptsLoading } = useQuery({
    queryKey: ['newsletter-prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('id, title, category, tags, last_modified')
        .order('last_modified', { ascending: false });
      if (error) throw error;
      return data as Prompt[];
    },
  });

  // Get unique categories/statuses for filters
  const blogCategories = useMemo(() => {
    if (!blogs) return [];
    return [...new Set(blogs.map(b => b.category).filter(Boolean))].sort();
  }, [blogs]);

  const projectStatuses = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map(p => p.status))].sort();
  }, [projects]);

  const promptCategories = useMemo(() => {
    if (!prompts) return [];
    return [...new Set(prompts.map(p => p.category).filter(Boolean))].sort();
  }, [prompts]);

  // Filtered data
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter(blog => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchLower) ||
        (blog.excerpt?.toLowerCase() || '').includes(searchLower);
      const matchesFilter = filterValue === 'all' || blog.category === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [blogs, searchTerm, filterValue]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        project.project_title.toLowerCase().includes(searchLower) ||
        project.subtitle.toLowerCase().includes(searchLower);
      const matchesFilter = filterValue === 'all' || project.status === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, filterValue]);

  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    return prompts.filter(prompt => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.tags.some(t => t.toLowerCase().includes(searchLower));
      const matchesFilter = filterValue === 'all' || prompt.category === filterValue;
      return matchesSearch && matchesFilter;
    });
  }, [prompts, searchTerm, filterValue]);

  // Reset filters when switching tabs
  useEffect(() => {
    setSearchTerm('');
    setFilterValue('all');
  }, [activeTab]);

  // Selection handlers
  const isSelected = (id: string, type: string) => {
    return selectedItems.some(item => item.id === id && item.type === type);
  };

  const handleToggleSelection = (item: SelectedItem) => {
    setSelectedItems(prev => {
      const exists = prev.some(i => i.id === item.id && i.type === item.type);
      if (exists) {
        toast.info('Removed from selection');
        return prev.filter(i => !(i.id === item.id && i.type === item.type));
      } else {
        toast.success('Added to selection');
        return [...prev, item];
      }
    });
  };

  const handleRemoveItem = (id: string, type: string) => {
    setSelectedItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
  };

  const handleClearAll = () => {
    setSelectedItems([]);
    toast.info('All selections cleared');
  };

  const handleCompileNewsletter = () => {
    console.log('Selected items for newsletter:', selectedItems);
    toast.info('Compile feature coming in Phase 2!', {
      style: {
        background: 'rgba(249, 249, 64, 0.1)',
        border: '1px solid hsl(var(--color-yellow))',
        color: 'hsl(var(--color-yellow))',
      },
    });
  };

  // Custom note handlers
  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteBody.trim()) {
      toast.error('Title and body are required');
      return;
    }
    const newNote = {
      id: crypto.randomUUID(),
      title: noteTitle,
      body: noteBody,
    };
    setNotes(prev => [...prev, newNote]);
    setNoteTitle('');
    setNoteBody('');
    toast.success('Note added');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    handleRemoveItem(id, 'note');
    toast.info('Note deleted');
  };

  // Group selected items by type
  const groupedSelections = useMemo(() => {
    const groups = {
      blog: selectedItems.filter(i => i.type === 'blog'),
      project: selectedItems.filter(i => i.type === 'project'),
      prompt: selectedItems.filter(i => i.type === 'prompt'),
      note: selectedItems.filter(i => i.type === 'note'),
    };
    return groups;
  }, [selectedItems]);

  const SidebarContent = () => (
    <div className="newsletter-sidebar rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-rajdhani font-bold text-cyan-400">Selected Content</h3>
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400">
          {selectedItems.length} items
        </Badge>
      </div>

      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {groupedSelections.blog.length > 0 && (
            <div>
              <h4 className="text-sm font-rajdhani font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blogs ({groupedSelections.blog.length})
              </h4>
              <div className="space-y-2">
                {groupedSelections.blog.map(item => (
                  <div key={item.id} className="newsletter-selected-item flex items-center justify-between bg-background/50 p-2 rounded border border-cyan-400/30">
                    <span className="text-sm text-foreground truncate flex-1">{item.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="remove-btn h-6 w-6 p-0 text-muted-foreground hover:text-pink-400"
                      onClick={() => handleRemoveItem(item.id, item.type)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {groupedSelections.project.length > 0 && (
            <div>
              <h4 className="text-sm font-rajdhani font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Projects ({groupedSelections.project.length})
              </h4>
              <div className="space-y-2">
                {groupedSelections.project.map(item => (
                  <div key={item.id} className="newsletter-selected-item flex items-center justify-between bg-background/50 p-2 rounded border border-cyan-400/30">
                    <span className="text-sm text-foreground truncate flex-1">{item.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="remove-btn h-6 w-6 p-0 text-muted-foreground hover:text-pink-400"
                      onClick={() => handleRemoveItem(item.id, item.type)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {groupedSelections.prompt.length > 0 && (
            <div>
              <h4 className="text-sm font-rajdhani font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Prompts ({groupedSelections.prompt.length})
              </h4>
              <div className="space-y-2">
                {groupedSelections.prompt.map(item => (
                  <div key={item.id} className="newsletter-selected-item flex items-center justify-between bg-background/50 p-2 rounded border border-cyan-400/30">
                    <span className="text-sm text-foreground truncate flex-1">{item.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="remove-btn h-6 w-6 p-0 text-muted-foreground hover:text-pink-400"
                      onClick={() => handleRemoveItem(item.id, item.type)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {groupedSelections.note.length > 0 && (
            <div>
              <h4 className="text-sm font-rajdhani font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Notes ({groupedSelections.note.length})
              </h4>
              <div className="space-y-2">
                {groupedSelections.note.map(item => (
                  <div key={item.id} className="newsletter-selected-item flex items-center justify-between bg-background/50 p-2 rounded border border-cyan-400/30">
                    <span className="text-sm text-foreground truncate flex-1">{item.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="remove-btn h-6 w-6 p-0 text-muted-foreground hover:text-pink-400"
                      onClick={() => handleRemoveItem(item.id, item.type)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No content selected yet</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full border-pink-400 text-pink-400 hover:bg-pink-400/10"
          onClick={handleClearAll}
          disabled={selectedItems.length === 0}
        >
          Clear All
        </Button>
        <Button
          className="w-full bg-cyan-400/20 text-cyan-400 border border-cyan-400 hover:bg-cyan-400/30"
          onClick={handleCompileNewsletter}
          disabled={selectedItems.length === 0}
        >
          Compile Newsletter
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-rajdhani font-bold text-cyan-400 mb-2">
            🧠 Newsletter Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Curate, review, and prepare content for your next AI with Aimee Digest.
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-pink-400 rounded mt-2" />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Main Content */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="newsletter-tabs">
              <TabsList className="grid w-full grid-cols-4 bg-background/50 border border-cyan-400/30">
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="notes">Custom Note</TabsTrigger>
              </TabsList>

              {/* Blogs Tab */}
              <TabsContent value="blogs" className="space-y-4">
                {/* Search & Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search blogs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterValue} onValueChange={setFilterValue}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {blogCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground">
                  Showing {filteredBlogs.length} of {blogs?.length || 0} blogs
                </p>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blogsLoading ? (
                    <p className="text-muted-foreground">Loading blogs...</p>
                  ) : filteredBlogs.length === 0 ? (
                    <p className="text-muted-foreground">No blogs found</p>
                  ) : (
                    filteredBlogs.map(blog => (
                      <Card
                        key={blog.id}
                        className={`newsletter-card border-2 ${
                          isSelected(blog.id, 'blog')
                            ? 'selected border-yellow-400'
                            : 'border-cyan-400/30'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            {blog.banner_image && (
                              <img
                                src={blog.banner_image}
                                alt=""
                                className="w-20 h-20 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <CardTitle className="text-lg text-cyan-400 font-rajdhani">
                                {blog.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {blog.excerpt}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {blog.category && (
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                  {blog.category}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(blog.date_published), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant={isSelected(blog.id, 'blog') ? 'default' : 'outline'}
                              className={
                                isSelected(blog.id, 'blog')
                                  ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400'
                                  : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10'
                              }
                              onClick={() =>
                                handleToggleSelection({
                                  type: 'blog',
                                  id: blog.id,
                                  title: blog.title,
                                  data: blog,
                                })
                              }
                            >
                              {isSelected(blog.id, 'blog') ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" /> Selected
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-1" /> Select
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4">
                {/* Search & Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterValue} onValueChange={setFilterValue}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground">
                  Showing {filteredProjects.length} of {projects?.length || 0} projects
                </p>

                {/* Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsLoading ? (
                    <p className="text-muted-foreground">Loading projects...</p>
                  ) : filteredProjects.length === 0 ? (
                    <p className="text-muted-foreground">No projects found</p>
                  ) : (
                    filteredProjects.map(project => (
                      <Card
                        key={project.id}
                        className={`newsletter-card border-2 ${
                          isSelected(project.id, 'project')
                            ? 'selected border-yellow-400'
                            : 'border-cyan-400/30'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            {project.thumbnail && (
                              <img
                                src={project.thumbnail}
                                alt=""
                                className="w-20 h-20 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <CardTitle className="text-lg text-cyan-400 font-rajdhani">
                                {project.project_title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {project.subtitle}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                {project.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(project.updated_at), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant={isSelected(project.id, 'project') ? 'default' : 'outline'}
                              className={
                                isSelected(project.id, 'project')
                                  ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400'
                                  : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10'
                              }
                              onClick={() =>
                                handleToggleSelection({
                                  type: 'project',
                                  id: project.id,
                                  title: project.project_title,
                                  data: project,
                                })
                              }
                            >
                              {isSelected(project.id, 'project') ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" /> Selected
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-1" /> Select
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Prompts Tab */}
              <TabsContent value="prompts" className="space-y-4">
                {/* Search & Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterValue} onValueChange={setFilterValue}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {promptCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-muted-foreground">
                  Showing {filteredPrompts.length} of {prompts?.length || 0} prompts
                </p>

                {/* Prompt Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promptsLoading ? (
                    <p className="text-muted-foreground">Loading prompts...</p>
                  ) : filteredPrompts.length === 0 ? (
                    <p className="text-muted-foreground">No prompts found</p>
                  ) : (
                    filteredPrompts.map(prompt => (
                      <Card
                        key={prompt.id}
                        className={`newsletter-card border-2 ${
                          isSelected(prompt.id, 'prompt')
                            ? 'selected border-yellow-400'
                            : 'border-cyan-400/30'
                        }`}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg text-cyan-400 font-rajdhani">
                            {prompt.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {prompt.category && (
                                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                  {prompt.category}
                                </Badge>
                              )}
                              {prompt.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="tag-pill">
                                  {tag}
                                </span>
                              ))}
                              {prompt.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{prompt.tags.length - 3} more
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(prompt.last_modified), 'MMM dd, yyyy')}
                              </span>
                              <Button
                                size="sm"
                                variant={isSelected(prompt.id, 'prompt') ? 'default' : 'outline'}
                                className={
                                  isSelected(prompt.id, 'prompt')
                                    ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400'
                                    : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10'
                                }
                                onClick={() =>
                                  handleToggleSelection({
                                    type: 'prompt',
                                    id: prompt.id,
                                    title: prompt.title,
                                    data: prompt,
                                  })
                                }
                              >
                                {isSelected(prompt.id, 'prompt') ? (
                                  <>
                                    <Check className="w-4 h-4 mr-1" /> Selected
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-1" /> Select
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Custom Note Tab */}
              <TabsContent value="notes" className="space-y-4">
                <Card className="border-cyan-400/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 font-rajdhani">Create Custom Note</CardTitle>
                    <CardDescription>Add custom content to your newsletter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        placeholder="Note title..."
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="note-body">Content</Label>
                      <Textarea
                        id="note-body"
                        placeholder="Write your custom note here..."
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button
                      onClick={handleAddNote}
                      className="bg-cyan-400/20 text-cyan-400 border border-cyan-400 hover:bg-cyan-400/30"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Note
                    </Button>
                  </CardContent>
                </Card>

                {/* Saved Notes */}
                {notes.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-rajdhani font-semibold text-cyan-400">Saved Notes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {notes.map(note => (
                        <Card
                          key={note.id}
                          className={`newsletter-card border-2 ${
                            isSelected(note.id, 'note')
                              ? 'selected border-yellow-400'
                              : 'border-cyan-400/30'
                          }`}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg text-cyan-400 font-rajdhani">
                              {note.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3">
                              {note.body}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-pink-400 text-pink-400 hover:bg-pink-400/10"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                variant={isSelected(note.id, 'note') ? 'default' : 'outline'}
                                className={
                                  isSelected(note.id, 'note')
                                    ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400'
                                    : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400/10'
                                }
                                onClick={() =>
                                  handleToggleSelection({
                                    type: 'note',
                                    id: note.id,
                                    title: note.title,
                                    data: note,
                                  })
                                }
                              >
                                {isSelected(note.id, 'note') ? (
                                  <>
                                    <Check className="w-4 h-4 mr-1" /> Selected
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-1" /> Select
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <SidebarContent />
          </div>

          {/* Mobile Floating Button */}
          <div className="fixed bottom-6 right-6 lg:hidden z-50">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-full h-14 w-14 bg-cyan-400/20 text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400/30 shadow-lg"
                >
                  <Mail className="w-6 h-6" />
                  {selectedItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-yellow-400 text-black">
                      {selectedItems.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle className="text-cyan-400 font-rajdhani">Selected Content</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
