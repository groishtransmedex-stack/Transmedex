import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getEditableBlogs } from '@/admin/blogStorage.js';

const POSTS_PER_PAGE = 9;

const categories = ['All', ...new Set(getEditableBlogs().map((p) => p.category))];

function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

const filteredPosts = useMemo(() => {
  return getEditableBlogs().filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  /* Card animations */
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' }
    })
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white text-foreground">
        <Header />

        <main className="flex-grow">
          {/* ── Hero ── */}
          <section className="relative bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] pt-32 pb-20 overflow-hidden">
            {/* decorative blobs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#0da1df]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm font-medium mb-6"
              >
                <BookOpen className="w-4 h-4" />
                TransMedex Knowledge Hub
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight"
              >
                Blog & <span className="text-sky-200">Resources</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/75 max-w-2xl mx-auto mb-10"
              >
                Stay ahead with the latest insights on medical billing, CPT &amp; ICD-10 codes, compliance updates, and healthcare revenue optimization.
              </motion.p>


            </div>
          </section>

          {/* ── Category filter pills ── */}
          <section className="bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap gap-2.5 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[#0da1df] text-white shadow-md shadow-[#0da1df]/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0da1df]/30 hover:text-[#0da1df]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* ── Blog Grid ── */}
          <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {paginatedPosts.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No articles found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                      variants={cardVariants}
                    >
                      <Link
                        to={`/resources/blog/${post.slug}`}
                        className="group flex flex-col h-full rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400"
                      >
                        {/* Image area */}
                        <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
                          {post.image ? (
                            <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                          ) : (
                            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${post.color}22 0%, ${post.color}11 50%, #f1f5f9 100%)` }} />
                          )}
                          {/* Category badge */}
                          <span
                            className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white shadow-sm"
                            style={{ backgroundColor: post.color }}
                          >
                            {post.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-5">
                          <h2 className="text-[17px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-[#0da1df] transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-1.5 text-[#0da1df] font-bold text-sm group-hover:gap-2.5 transition-all duration-300">
                            READ MORE <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-[#0da1df] hover:text-white hover:border-[#0da1df] transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-500 disabled:hover:border-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        currentPage === page
                          ? 'bg-[#0da1df] text-white shadow-md shadow-[#0da1df]/20'
                          : 'border border-slate-200 text-slate-500 hover:border-[#0da1df]/30 hover:text-[#0da1df]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-[#0da1df] hover:text-white hover:border-[#0da1df] transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-500 disabled:hover:border-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </section>


        </main>

        <Footer />
      </div>
    </>
  );
}

export default BlogPage;
