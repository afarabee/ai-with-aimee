import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

const MyAIJourney = () => {
  return (
    <div className="min-h-screen bg-ivory-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-sage-gray/20 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-dark-graphite hover:text-rose-quartz transition-colors font-narrow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Header Section */}
      <header className="py-16 bg-gradient-to-br from-rose-quartz/10 via-lavender-fog/10 to-sage-gray/10 animate-fade-in">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-shadows text-5xl md:text-6xl text-dark-graphite mb-4">
            My AI Journey
          </h1>
          <p className="font-narrow text-xl md:text-2xl text-sage-gray italic">
            How a product leader found her next chapter in Generative AI
          </p>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12 animate-fade-in">
        <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-rose-quartz/20 via-lavender-fog/30 to-sage-gray/20 rounded-2xl shadow-lg flex items-center justify-center border border-sage-gray/20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-rose-quartz/30 flex items-center justify-center">
              <span className="text-3xl">🧠</span>
            </div>
            <p className="font-narrow text-sage-gray">Neural connections meet human creativity</p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-6">
            If you had told me a few years ago that I'd be spending late nights tweaking prompts, training small models, and building digital assistants, I probably would've smiled politely and changed the subject. Yet here we are. And I have never felt more curious, creative, or fulfilled by the work in front of me.
          </p>

          {/* Section 1 */}
          <h2 className="font-shadows text-3xl text-rose-quartz mt-12 mb-6">
            From Product Management to Possibility
          </h2>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            For more than fifteen years, I built a career inside large organizations like Cigna, Express Scripts, and American Express. My focus was always the same: create products that matter, solve real problems, and design for humans, not systems. I have always believed that product management sits at the intersection of technology, business, and empathy.
          </p>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-6">
            When generative AI began moving from headlines to hands-on experimentation, something clicked for me. This was more than a new tool. It was a new way of thinking about intelligence and interaction. The product manager in me saw a bridge forming between machine logic and human understanding, and I wanted to be part of building it.
          </p>

          {/* Section 2 */}
          <h2 className="font-shadows text-3xl text-rose-quartz mt-12 mb-6">
            The Spark: Generative AI Meets the Enterprise
          </h2>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            My first experiments were small: rewriting user stories, building internal automations, exploring prompts that could mimic team workflows. One prototype led to another, and soon I was helping roll out generative AI pilots at Charles River Laboratories.
          </p>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-6">
            That experience changed how I think about technology adoption inside regulated industries. AI is not a single feature. It is an organizational capability. Over the past year, I have also earned a Generative AI Specialization, diving deep into governance, enablement, and evaluation frameworks that make AI both useful and responsible.
          </p>

          {/* Callout Box */}
          <div className="bg-sage-gray/10 border-l-4 border-sage-gray p-6 rounded-r-lg my-8">
            <p className="font-narrow text-lg text-dark-graphite italic leading-relaxed">
              AI is not a single feature. It is an organizational capability.
            </p>
          </div>

          {/* Section 3 */}
          <h2 className="font-shadows text-3xl text-rose-quartz mt-12 mb-6">
            Building a Visible Track Record
          </h2>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            AI with Aims is more than a portfolio. It is a living record of what I am learning, building, and sharing. My goal is to show what it looks like when real product teams apply AI thoughtfully inside complex environments.
          </p>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            Every project featured here connects back to the same intent:
          </p>
          <ul className="font-narrow text-lg text-dark-graphite space-y-2 mb-6 ml-6">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-rose-quartz rounded-full mr-3 mt-2.5"></span>
              <span>Ship real AI outcomes like pilots and internal demos</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-rose-quartz rounded-full mr-3 mt-2.5"></span>
              <span>Translate between technical and regulatory perspectives</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-rose-quartz rounded-full mr-3 mt-2.5"></span>
              <span>Quantify business value in hours saved or impact delivered</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-rose-quartz rounded-full mr-3 mt-2.5"></span>
              <span>Make AI adoption understandable for non-technical teams</span>
            </li>
          </ul>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-6">
            This is my way of proving that curiosity can be strategic and measurable.
          </p>

          {/* Section 4 */}
          <h2 className="font-shadows text-3xl text-rose-quartz mt-12 mb-6">
            Lessons So Far
          </h2>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            A few takeaways have become clear:
          </p>
          <ul className="font-narrow text-lg text-dark-graphite space-y-2 mb-6 ml-6">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-lavender-fog rounded-full mr-3 mt-2.5"></span>
              <span>Human context is still the most powerful dataset</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-lavender-fog rounded-full mr-3 mt-2.5"></span>
              <span>Adoption requires translation, not just technology</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-lavender-fog rounded-full mr-3 mt-2.5"></span>
              <span>Responsible AI is more about processes than slogans</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-lavender-fog rounded-full mr-3 mt-2.5"></span>
              <span>A good prompt can save hours, but a good question can save weeks</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-lavender-fog rounded-full mr-3 mt-2.5"></span>
              <span>AI isn't magic. It is the next iteration of product thinking.</span>
            </li>
          </ul>

          {/* Section 5 */}
          <h2 className="font-shadows text-3xl text-rose-quartz mt-12 mb-6">
            What's Next
          </h2>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            Over the next year, I'll be sharing open demos, publishing frameworks for AI governance, and exploring how agentic AI systems can live responsibly inside enterprise workflows.
          </p>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-4">
            I am also writing for people who want to understand AI without losing their human spark. The leaders, builders, and curious professionals who feel that quiet tug between innovation and impact.
          </p>
          <p className="font-narrow text-lg text-dark-graphite leading-relaxed mb-6">
            This is the start of my visible track record, and I intend to make it both smart and a little bit quirky.
          </p>
        </div>

        {/* Author Section */}
        <div className="mt-16 pt-8 border-t-2 border-sage-gray/20">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-quartz/30 to-lavender-fog/30 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-dark-graphite" />
            </div>
            <div>
              <p className="font-narrow text-base text-dark-graphite mb-2">
                <span className="font-semibold">Written by Aimee Farabee</span> — Product Director turned AI Governance Leader.
              </p>
              <p className="font-narrow text-base text-sage-gray italic">
                Founder of <span className="font-rainbow text-rose-quartz">Aims</span>, where curiosity meets accountability.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
};

export default MyAIJourney;
