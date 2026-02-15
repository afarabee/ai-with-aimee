import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Save, Send, EyeOff, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { slugify } from '@/utils/slugify';

interface Metric {
  value: string;
  label: string;
  sub: string;
}

interface VisionPoint {
  heading: string;
  text: string;
}

interface Requirement {
  jdRequirement: string;
  myExperience: string;
  company: string;
  proof: string;
}

const DEFAULT_METRICS: Metric[] = [
  { value: '', label: '', sub: '' },
  { value: '', label: '', sub: '' },
  { value: '', label: '', sub: '' },
  { value: '', label: '', sub: '' },
];

const DEFAULT_VISION: VisionPoint[] = [
  { heading: '', text: '' },
  { heading: '', text: '' },
  { heading: '', text: '' },
  { heading: '', text: '' },
];

const DEFAULT_REQUIREMENTS: Requirement[] = [
  { jdRequirement: '', myExperience: '', company: '', proof: '' },
  { jdRequirement: '', myExperience: '', company: '', proof: '' },
  { jdRequirement: '', myExperience: '', company: '', proof: '' },
];

export default function WhyAimeeEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = !!editId;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('draft');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [slug, setSlug] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');
  const [metrics, setMetrics] = useState<Metric[]>(DEFAULT_METRICS);
  const [visionTitle, setVisionTitle] = useState('');
  const [visionPoints, setVisionPoints] = useState<VisionPoint[]>(DEFAULT_VISION);
  const [requirements, setRequirements] = useState<Requirement[]>(DEFAULT_REQUIREMENTS);
  const [closingTagline, setClosingTagline] = useState('');
  const [closingSubtext, setClosingSubtext] = useState('');

  useEffect(() => {
    if (editId) loadEntry();
  }, [editId]);

  useEffect(() => {
    if (!isEditing) {
      setSlug(slugify(company));
    }
  }, [company, isEditing]);

  const loadEntry = async () => {
    const { data, error } = await supabase.from('why_aimee').select('*').eq('id', editId).maybeSingle();
    if (error || !data) {
      toast.error('Entry not found');
      navigate('/admin/why-aimee');
      return;
    }
    setCompany(data.company);
    setRole(data.role);
    setSlug(data.slug);
    setHeroTagline(data.hero_tagline || '');
    setHeroSubtext(data.hero_subtext || '');
    setMetrics((data.metrics as unknown as Metric[]) || DEFAULT_METRICS);
    setVisionTitle(data.vision_title || '');
    setVisionPoints((data.vision_points as unknown as VisionPoint[]) || DEFAULT_VISION);
    setRequirements((data.requirements as unknown as Requirement[]) || DEFAULT_REQUIREMENTS);
    setClosingTagline(data.closing_tagline || '');
    setClosingSubtext(data.closing_subtext || '');
    setStatus(data.status || 'draft');
  };

  const buildPayload = (overrideStatus?: string) => ({
    company,
    role,
    slug,
    hero_tagline: heroTagline,
    hero_subtext: heroSubtext,
    metrics: metrics as any,
    vision_title: visionTitle,
    vision_points: visionPoints as any,
    requirements: requirements as any,
    closing_tagline: closingTagline,
    closing_subtext: closingSubtext,
    status: overrideStatus || status,
  });

  const handleSave = async (targetStatus?: string) => {
    if (!company.trim() || !role.trim() || !slug.trim()) {
      toast.error('Company, Role, and Slug are required');
      return;
    }
    setLoading(true);
    try {
      const payload = buildPayload(targetStatus);
      if (isEditing) {
        const { error } = await supabase.from('why_aimee').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('why_aimee').insert(payload);
        if (error) throw error;
      }
      if (targetStatus) setStatus(targetStatus);
      toast.success(targetStatus === 'published' ? 'Published!' : 'Saved!');
      if (!isEditing) navigate('/admin/why-aimee');
    } catch (error: any) {
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Metric helpers
  const updateMetric = (i: number, field: keyof Metric, val: string) => {
    const updated = [...metrics];
    updated[i] = { ...updated[i], [field]: val };
    setMetrics(updated);
  };
  const addMetric = () => { if (metrics.length < 6) setMetrics([...metrics, { value: '', label: '', sub: '' }]); };
  const removeMetric = (i: number) => { if (metrics.length > 4) setMetrics(metrics.filter((_, idx) => idx !== i)); };

  // Vision helpers
  const updateVision = (i: number, field: keyof VisionPoint, val: string) => {
    const updated = [...visionPoints];
    updated[i] = { ...updated[i], [field]: val };
    setVisionPoints(updated);
  };

  // Requirement helpers
  const updateRequirement = (i: number, field: keyof Requirement, val: string) => {
    const updated = [...requirements];
    updated[i] = { ...updated[i], [field]: val };
    setRequirements(updated);
  };
  const addRequirement = () => { if (requirements.length < 8) setRequirements([...requirements, { jdRequirement: '', myExperience: '', company: '', proof: '' }]); };
  const removeRequirement = (i: number) => { if (requirements.length > 3) setRequirements(requirements.filter((_, idx) => idx !== i)); };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.company || !json.role) {
          toast.error('JSON must contain "company" and "role" fields');
          return;
        }
        setCompany(json.company);
        setRole(json.role);
        setSlug(slugify(json.company));
        if (json.heroTagline) setHeroTagline(json.heroTagline);
        if (json.heroSubtext) setHeroSubtext(json.heroSubtext);
        if (json.visionTitle) setVisionTitle(json.visionTitle);
        if (json.closingTagline) setClosingTagline(json.closingTagline);
        if (json.closingSubtext) setClosingSubtext(json.closingSubtext);
        if (Array.isArray(json.metrics)) {
          const clamped = json.metrics.slice(0, 6);
          while (clamped.length < 4) clamped.push({ value: '', label: '', sub: '' });
          setMetrics(clamped);
        }
        if (Array.isArray(json.visionPoints)) {
          const vp = json.visionPoints.slice(0, 4);
          while (vp.length < 4) vp.push({ heading: '', text: '' });
          setVisionPoints(vp);
        }
        if (Array.isArray(json.requirements)) {
          const reqs = json.requirements.slice(0, 8);
          while (reqs.length < 3) reqs.push({ jdRequirement: '', myExperience: '', company: '', proof: '' });
          setRequirements(reqs);
        }
        toast.success(`Imported "${json.company}" — review and save when ready`);
      } catch {
        toast.error('Invalid JSON file');
      }
      // Reset input so same file can be re-imported
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const sectionHeader = "text-lg font-bold text-primary border-b border-border pb-2 mb-4 mt-8";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/why-aimee')}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Button>
          <h1 className="text-2xl font-bold text-primary">{isEditing ? 'Edit' : 'New'} Why Aimee Entry</h1>
          <Badge variant={status === 'published' ? 'default' : 'outline'}>{status.toUpperCase()}</Badge>
        </div>
      </div>

      {/* Status Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleImportJSON} />
        <Button onClick={() => fileInputRef.current?.click()} variant="outline"><Upload className="h-4 w-4 mr-1" />Import JSON</Button>
        <Button onClick={() => handleSave()} disabled={loading} variant="outline"><Save className="h-4 w-4 mr-1" />Save Draft</Button>
        {status !== 'published' && (
          <Button onClick={() => handleSave('published')} disabled={loading}><Send className="h-4 w-4 mr-1" />Publish Now</Button>
        )}
        {status === 'published' && (
          <>
            <Button onClick={() => handleSave('published')} disabled={loading}><Save className="h-4 w-4 mr-1" />Update Published</Button>
            <Button onClick={() => handleSave('draft')} disabled={loading} variant="destructive"><EyeOff className="h-4 w-4 mr-1" />Unpublish</Button>
          </>
        )}
      </div>

      {/* Hero Section */}
      <h2 className={sectionHeader}>Hero Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Company *</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Dropbox" /></div>
        <div><Label>Role *</Label><Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Sr. Director, Product Management" /></div>
        <div><Label>Slug *</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from company" /></div>
        <div className="md:col-span-2"><Label>Hero Tagline</Label><Input value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} placeholder="Why I'm the right leader for..." /></div>
        <div className="md:col-span-2"><Label>Hero Subtext</Label><Textarea value={heroSubtext} onChange={(e) => setHeroSubtext(e.target.value)} placeholder="Supporting paragraph" rows={3} /></div>
      </div>

      {/* Proven Impact Metrics */}
      <div className="flex items-center justify-between mt-8">
        <h2 className={sectionHeader + " mt-0 flex-1"}>Proven Impact Metrics ({metrics.length}/6)</h2>
        <Button size="sm" variant="outline" onClick={addMetric} disabled={metrics.length >= 6}><Plus className="h-4 w-4 mr-1" />Add Metric</Button>
      </div>
      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-card border border-border rounded-lg items-end">
            <div><Label>Value</Label><Input value={m.value} onChange={(e) => updateMetric(i, 'value', e.target.value)} placeholder="98%" /></div>
            <div><Label>Label</Label><Input value={m.label} onChange={(e) => updateMetric(i, 'label', e.target.value)} placeholder="Reduction in time" /></div>
            <div><Label>Sub</Label><Input value={m.sub} onChange={(e) => updateMetric(i, 'sub', e.target.value)} placeholder="3 hrs → 3 mins" /></div>
            <div>{metrics.length > 4 && <Button size="sm" variant="destructive" onClick={() => removeMetric(i)}><Trash2 className="h-4 w-4" /></Button>}</div>
          </div>
        ))}
      </div>

      {/* Vision Section */}
      <h2 className={sectionHeader}>Vision Section (4 Cards)</h2>
      <div className="mb-4"><Label>Section Title</Label><Input value={visionTitle} onChange={(e) => setVisionTitle(e.target.value)} placeholder="My Vision for Company's..." /></div>
      <div className="space-y-4">
        {visionPoints.map((v, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-lg space-y-2">
            <Label>Card {i + 1} Heading</Label>
            <Input value={v.heading} onChange={(e) => updateVision(i, 'heading', e.target.value)} placeholder="Vision heading" />
            <Label>Card {i + 1} Text</Label>
            <Textarea value={v.text} onChange={(e) => updateVision(i, 'text', e.target.value)} placeholder="Vision description" rows={2} />
          </div>
        ))}
      </div>

      {/* Requirement Match */}
      <div className="flex items-center justify-between mt-8">
        <h2 className={sectionHeader + " mt-0 flex-1"}>Requirement Match ({requirements.length}/8)</h2>
        <Button size="sm" variant="outline" onClick={addRequirement} disabled={requirements.length >= 8}><Plus className="h-4 w-4 mr-1" />Add Row</Button>
      </div>
      <div className="space-y-4">
        {requirements.map((r, i) => (
          <div key={i} className="p-4 bg-card border border-border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground">Row {i + 1}</span>
              {requirements.length > 3 && <Button size="sm" variant="destructive" onClick={() => removeRequirement(i)}><Trash2 className="h-4 w-4" /></Button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><Label>JD Requirement</Label><Input value={r.jdRequirement} onChange={(e) => updateRequirement(i, 'jdRequirement', e.target.value)} placeholder="What the job asks for" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Company</Label><Input value={r.company} onChange={(e) => updateRequirement(i, 'company', e.target.value)} placeholder="Company name" /></div>
                <div><Label>Proof Badge</Label><Input value={r.proof} onChange={(e) => updateRequirement(i, 'proof', e.target.value)} placeholder="e.g. 97-day launch" /></div>
              </div>
            </div>
            <div><Label>My Experience</Label><Textarea value={r.myExperience} onChange={(e) => updateRequirement(i, 'myExperience', e.target.value)} placeholder="How my experience maps to this requirement" rows={3} /></div>
          </div>
        ))}
      </div>

      {/* Closing CTA */}
      <h2 className={sectionHeader}>Closing CTA</h2>
      <div className="space-y-4 mb-12">
        <div><Label>Closing Tagline</Label><Input value={closingTagline} onChange={(e) => setClosingTagline(e.target.value)} placeholder="I want the opportunity to define how..." /></div>
        <div><Label>Closing Subtext</Label><Input value={closingSubtext} onChange={(e) => setClosingSubtext(e.target.value)} placeholder="Not just a place they store files." /></div>
      </div>
    </div>
  );
}
