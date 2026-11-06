import React, { useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Bookmark, Twitter, Linkedin, Facebook } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getEditableBlogs } from '@/admin/blogStorage.js';


function BlogTemplate() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // const post = useMemo(() => {
  //   return blogPosts.find((p) => p.slug === slug);
  // }, [slug]);

const post = useMemo(() => {
  return getEditableBlogs().find((p) => p.slug === slug);
}, [slug]);

  // const relatedPosts = useMemo(() => {
  //   if (!post) return [];
  //   return blogPosts
  //     .filter((p) => p.category === post.category && p.id !== post.id)
  //     .slice(0, 3);
  // }, [post]);

  // Scroll to top on mount or when slug changes
  
  const relatedPosts = useMemo(() => {
  if (!post) return [];

  return getEditableBlogs()
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);
}, [post]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Article Not Found</h1>
          <p className="text-slate-500 mb-8 max-w-md">
            We couldn't find the article you were looking for. It might have been moved or deleted.
          </p>
          <button
            onClick={() => navigate('/resources/blog')}
            className="px-6 py-3 rounded-xl bg-[#0da1df] text-white font-semibold hover:bg-sky-500 transition-all shadow-lg shadow-[#0da1df]/20 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* ── Hero Section ── */}
        <section className="relative pt-12 pb-24 overflow-hidden">
          {/* Subtle gradient background based on post color */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${post.color}, transparent 70%)`
            }}
          />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back Button */}
            <Link 
              to="/resources/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0da1df] transition-colors mb-8 group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#0da1df]/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to all articles
            </Link>

            {/* Meta tags */}
            <div className="flex items-center gap-3 mb-6">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold tracking-widest text-white shadow-sm"
                style={{ backgroundColor: post.color }}
              >
                {post.category}
              </span>
              <span className="text-sm font-medium text-slate-400">
                8 min read
              </span>
            </div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-500 leading-relaxed max-w-3xl"
            >
              {post.excerpt}
            </motion.p>
          </div>
        </section>

        {/* ── Featured Image ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl relative bg-slate-100 ring-1 ring-slate-900/5"
          >
            {/* Placeholder for real image */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${post.color}22 0%, ${post.color}11 50%, #f1f5f9 100%)`
              }}
            />
            {/* Glassmorphism pattern overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </motion.div>
        </div>

        {/* ── Article Content & Sidebar ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <article className="flex-1 max-w-3xl">
              <style>{`
                .blog-content p { margin-bottom: 1.25rem; color: #475569; line-height: 1.8; font-size: 1.0625rem; }
                .blog-content p.lead { font-size: 1.25rem; color: #334155; font-weight: 300; line-height: 1.75; margin-bottom: 2.5rem; }
                .blog-content h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-top: 2.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #f1f5f9; }
                .blog-content h3 { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-top: 1.75rem; margin-bottom: 0.6rem; }
                .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1.25rem; color: #475569; }
                .blog-content ul { list-style-type: disc; }
                .blog-content ol { list-style-type: decimal; }
                .blog-content li { margin-bottom: 0.5rem; line-height: 1.75; }
                .blog-content strong { color: #1e293b; font-weight: 700; }
                .blog-content a { color: #0da1df; text-decoration: underline; }
                .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9375rem; }
                .blog-content th { background: #f8fafc; color: #0f172a; font-weight: 700; padding: 0.75rem 1rem; text-align: left; border-bottom: 2px solid #e2e8f0; }
                .blog-content td { padding: 0.65rem 1rem; border-bottom: 1px solid #e2e8f0; color: #475569; }
                .blog-content tr:last-child td { border-bottom: none; }
                .blog-content .callout { background: #f8fafc; border-left: 4px solid ${post.color}; border-radius: 0.75rem; padding: 1.5rem 2rem; margin: 2rem 0; font-size: 1.1rem; font-style: italic; color: #334155; font-weight: 500; line-height: 1.7; }
              `}</style>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Sidebar (Share & Sticky Meta) */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="sticky top-32">
                
                {/* Author Info */}
                <div className="mb-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
                    TM
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">TransMedex Team</h4>
                    <p className="text-xs text-slate-500">Revenue Cycle Experts</p>
                  </div>
                </div>

                {/* Share Actions */}
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Share this article</h4>
                <div className="flex gap-2 mb-8">
                  <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2] hover:text-white hover:border-transparent transition-all">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0A66C2] hover:text-white hover:border-transparent transition-all">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:text-white hover:border-transparent transition-all">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </aside>
          </div>
        </div>

        {/* ── Related Articles ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-24 pt-20 border-t border-slate-100 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-bold text-slate-900">More in {post.category}</h3>
                <Link to="/resources/blog" className="text-sm font-bold text-[#0da1df] hover:text-sky-500 transition-colors">
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((related, i) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={`/resources/blog/${related.slug}`}
                      className="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100 shrink-0">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${related.color}22 0%, ${related.color}11 50%, #f1f5f9 100%)`
                          }}
                        />
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <h4 className="text-[15px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-[#0da1df] transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                          {related.excerpt}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default BlogTemplate;
