
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

import {
  getEditableBlogs,
  saveBlogEdit,
  resetBlogEdit,
  createBlog,
} from "./blogStorage";

import {
  Save,
  RotateCcw,
  Eye,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Search,
  ChevronDown,
  CheckCircle,
  Globe,
  Settings,
  Plus,
  X,
} from "lucide-react";

export default function Dashboard() {
  const [blogs, setBlogs] = useState(() => getEditableBlogs());

  const [selectedSlug, setSelectedSlug] = useState(
    () => getEditableBlogs()[0]?.slug || ""
  );

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");

  const [category, setCategory] = useState("Healthcare");
  const [blogColor, setBlogColor] = useState("#0da1df");

  const [message, setMessage] = useState("");
  const [activeSeoTab, setActiveSeoTab] = useState("SEO");
  const [isCreating, setIsCreating] = useState(false);

  const selectedBlog = blogs.find(
    (blog) => blog.slug === selectedSlug
  );

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image,
    ],
    content: "",
    onUpdate: () => setMessage(""),
  });

  // Load selected blog into editor
  useEffect(() => {
    if (!selectedBlog || isCreating) return;

    setTitle(selectedBlog.title || "");
    setExcerpt(selectedBlog.excerpt || "");
    setSeoTitle(selectedBlog.seoTitle || "");
    setMetaDescription(selectedBlog.metaDescription || "");
    setFocusKeyword(selectedBlog.focusKeyword || "");

    setCategory(selectedBlog.category || "Healthcare");
    setBlogColor(selectedBlog.color || "#0da1df");

    editor?.commands.setContent(
      typeof selectedBlog.content === "string"
        ? selectedBlog.content
        : "",
      { emitUpdate: false }
    );

    setMessage("");
  }, [selectedSlug, editor]);

  // Generate URL slug
  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const currentSlug = isCreating
    ? generateSlug(title)
    : selectedBlog?.slug || "";

  // Search blogs
  const filteredBlogs = blogs.filter((blog) =>
    (blog.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Add New Blog
  const handleAddBlog = () => {
    setIsCreating(true);
    setSelectedSlug("");

    setTitle("");
    setExcerpt("");
    setSeoTitle("");
    setMetaDescription("");
    setFocusKeyword("");

    setCategory("Healthcare");
    setBlogColor("#0da1df");

    setActiveSeoTab("SEO");

    editor?.commands.clearContent();

    setMessage("");
  };

  // Cancel New Blog
  const handleCancelCreate = () => {
    setIsCreating(false);

    const updatedBlogs = getEditableBlogs();

    setBlogs(updatedBlogs);

    const firstBlog = updatedBlogs[0];

    if (firstBlog) {
      setSelectedSlug(firstBlog.slug);
    }

    setMessage("");
  };

  // Create Blog
  const handleCreateBlog = () => {
    if (!title.trim()) {
      setMessage("Please enter a blog title.");
      return;
    }

    if (!currentSlug) {
      setMessage("Please enter a valid blog title.");
      return;
    }

    try {
      const newBlog = createBlog({
        title: title.trim(),
        slug: currentSlug,
        excerpt,
        content: editor?.getHTML() || "",
        category,
        color: blogColor,
        seoTitle,
        metaDescription,
        focusKeyword,
      });

      const updatedBlogs = getEditableBlogs();

      setBlogs(updatedBlogs);
      setSelectedSlug(newBlog.slug);
      setIsCreating(false);

      setMessage("New blog created successfully!");
    } catch (error) {
      setMessage(error.message || "Unable to create blog.");
    }
  };

  // Save Existing Blog
  const handleSave = () => {
    if (!selectedBlog) {
      setMessage("Please select a blog.");
      return;
    }

    try {
      saveBlogEdit(selectedSlug, {
        title,
        excerpt,
        content: editor?.getHTML() || "",
        category,
        color: blogColor,
        seoTitle,
        metaDescription,
        focusKeyword,
      });

      setBlogs(getEditableBlogs());

      setMessage("Changes saved successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save changes.");
    }
  };

  // Save Button Handler
  const handleSaveAction = () => {
    if (isCreating) {
      handleCreateBlog();
    } else {
      handleSave();
    }
  };

  // Restore Original Blog
  const handleReset = () => {
    if (!selectedBlog) return;

    const confirmed = window.confirm(
      selectedBlog.createdByCMS
        ? "Are you sure you want to delete this newly created blog?"
        : "Are you sure you want to restore this blog to its original content?"
    );

    if (!confirmed) return;

    try {
      resetBlogEdit(selectedSlug);

      const updatedBlogs = getEditableBlogs();

      setBlogs(updatedBlogs);

      const nextBlog = updatedBlogs[0];

      if (nextBlog) {
        setSelectedSlug(nextBlog.slug);
      }

      setMessage(
        selectedBlog.createdByCMS
          ? "New blog deleted successfully."
          : "Original blog content restored."
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to restore blog.");
    }
  };

  // Add Link
  const addLink = () => {
    const url = window.prompt("Enter link URL:");

    if (!url) return;

    try {
      const validUrl = new URL(url);

      if (!["http:", "https:", "mailto:"].includes(validUrl.protocol)) {
        setMessage("Please enter a valid HTTP, HTTPS or email link.");
        return;
      }

      editor?.chain().focus().extendMarkRange("link").setLink({
        href: url,
      }).run();
    } catch {
      setMessage("Please enter a valid link URL.");
    }
  };

  // Add Image
  const addImage = () => {
    const url = window.prompt("Enter image URL:");

    if (!url) return;

    try {
      const validUrl = new URL(url);

      if (!["http:", "https:"].includes(validUrl.protocol)) {
        setMessage("Please enter a valid image URL.");
        return;
      }

      editor?.chain().focus().setImage({
        src: url,
      }).run();
    } catch {
      setMessage("Please enter a valid image URL.");
    }
  };

  // Preview Blog
  const previewBlog = () => {
    if (!title.trim()) {
      setMessage("Please enter a blog title before previewing.");
      return;
    }

    const html = editor?.getHTML() || "";

    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
      setMessage("Please allow pop-ups to preview the blog.");
      return;
    }

    const safe = (value) =>
      String(value || "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]));

    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safe(seoTitle || title)}</title>

          <meta
            name="description"
            content="${safe(metaDescription || excerpt)}"
          >

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          >

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              max-width: 850px;
              margin: 50px auto;
              padding: 20px;
              font-family: Arial, sans-serif;
              line-height: 1.8;
              color: #263238;
            }

            h1, h2, h3 {
              line-height: 1.3;
            }

            img {
              max-width: 100%;
              height: auto;
            }

            a {
              color: #2563eb;
            }

            ul {
              list-style: disc;
              padding-left: 25px;
            }

            ol {
              list-style: decimal;
              padding-left: 25px;
            }
          </style>
        </head>

        <body>
          <p style="color:#64748b;font-size:13px">
            ${safe(category)}
          </p>

          <h1>${safe(title)}</h1>

          <p>${safe(excerpt)}</p>

          <hr style="margin:30px 0;border:0;border-top:1px solid #e2e8f0">

          ${html}
        </body>
      </html>
    `);

    previewWindow.document.close();
  };

  // SEO Score
  const seoTabs = ["SEO", "Readability", "Schema", "Social"];

  const seoScore = [
    Boolean(focusKeyword.trim()),
    Boolean(seoTitle.trim()),
    Boolean(metaDescription.trim()),
    Boolean(title.trim()),
    Boolean(excerpt.trim()),
  ].filter(Boolean).length;

  const seoPercentage = Math.round((seoScore / 5) * 100);

  if (!blogs.length && !isCreating) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] p-8">
        <h2 className="mb-4 text-xl font-bold">
          No existing blogs found.
        </h2>

        <button
          onClick={handleAddBlog}
          className="rounded-md bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          <Plus size={17} className="mr-2 inline" />
          Add New Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] p-3 md:p-6">

      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Blog Editor
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage your existing TransMedex blog posts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={previewBlog}
              className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              <Eye size={17} />
              Preview
            </button>

            <button
              onClick={handleSaveAction}
              className="flex items-center gap-2 rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Save size={17} />
              {isCreating ? "Create Blog" : "Save Changes"}
            </button>

          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-5 flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">

            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              className="ml-3"
            >
              <X size={17} />
            </button>

          </div>
        )}

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

          {/* LEFT SIDEBAR */}
          <aside className="rounded-lg border bg-white p-4 shadow-sm xl:col-span-3">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="font-bold text-gray-900">
                Existing Blogs
              </h2>

              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">
                {blogs.length}
              </span>

            </div>

            {/* ADD BLOG BUTTON */}
            <button
              onClick={handleAddBlog}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              <Plus size={19} />
              Add New Blog
            </button>

            {/* SEARCH */}
            <div className="relative mb-4">

              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={17}
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search blogs..."
                className="w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />

            </div>

            {/* BLOG LIST */}
            <div className="max-h-[750px] space-y-2 overflow-y-auto">

              {filteredBlogs.map((blog) => (

                <button
                  key={blog.slug}
                  onClick={() => {
                    setIsCreating(false);
                    setSelectedSlug(blog.slug);
                    setMessage("");
                  }}
                  className={`w-full rounded-md border p-3 text-left transition ${
                    selectedSlug === blog.slug && !isCreating
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >

                  <p className="mb-1 text-xs text-gray-500">
                    {blog.createdByCMS
                      ? "New Blog"
                      : `Blog ${blogs.findIndex(
                          (item) => item.slug === blog.slug
                        ) + 1}`}
                  </p>

                  <p className="text-sm font-semibold text-gray-800">
                    {blog.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {blog.category || "Blog"}
                  </p>

                </button>

              ))}

              {filteredBlogs.length === 0 && (
                <p className="p-4 text-sm text-gray-500">
                  No blogs found.
                </p>
              )}

            </div>

          </aside>

          {/* CENTER EDITOR */}
          <main className="space-y-5 xl:col-span-6">

            {selectedBlog || isCreating ? (

              <>

                {/* BLOG TITLE */}
                <section className="rounded-lg border bg-white p-5 shadow-sm">

                  {isCreating && (
                    <div className="mb-4 flex items-center justify-between">

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        Creating New Blog
                      </span>

                      <button
                        onClick={handleCancelCreate}
                        className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                        Cancel
                      </button>

                    </div>
                  )}

                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Add blog title"
                    className="w-full border-0 text-2xl font-bold text-gray-900 outline-none placeholder:text-gray-400"
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">

                    <Globe size={14} />

                    <span>Permalink:</span>

                    <span className="break-all text-blue-700">
                      /resources/blog/{currentSlug || "your-blog-slug"}
                    </span>

                  </div>

                  {/* NEW BLOG CATEGORY AND COLOR */}
                  {isCreating && (

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Blog Category
                        </label>

                        <input
                          value={category}
                          onChange={(event) => setCategory(event.target.value)}
                          placeholder="Enter blog category"
                          className="w-full rounded-md border p-3 text-sm outline-none focus:border-blue-500"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Blog Theme Color
                        </label>

                        <div className="flex items-center gap-3">

                          <input
                            type="color"
                            value={blogColor}
                            onChange={(event) => setBlogColor(event.target.value)}
                            className="h-11 w-14 cursor-pointer rounded border"
                          />

                          <span className="text-sm text-gray-600">
                            {blogColor}
                          </span>

                        </div>

                      </div>

                    </div>

                  )}

                </section>

                {/* BLOG CONTENT EDITOR */}
                <section className="rounded-lg border bg-white p-5 shadow-sm">

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                    <h2 className="font-bold text-gray-900">
                      Blog Content
                    </h2>

                    <span className="rounded bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      Visual Editor
                    </span>

                  </div>

                  {/* EXCERPT */}
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Short Description / Excerpt
                  </label>

                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={3}
                    placeholder="Write a short blog description..."
                    className="mb-5 w-full rounded-md border p-3 text-sm outline-none focus:border-blue-500"
                  />

                  {/* TOOLBAR */}
                  <div className="mb-2 flex flex-wrap gap-1 rounded-md border bg-gray-50 p-2">

                    {[
                      {
                        label: "Bold",
                        icon: <Bold size={18} />,
                        action: () => editor?.chain().focus().toggleBold().run(),
                      },
                      {
                        label: "Italic",
                        icon: <Italic size={18} />,
                        action: () => editor?.chain().focus().toggleItalic().run(),
                      },
                      {
                        label: "Underline",
                        icon: <UnderlineIcon size={18} />,
                        action: () => editor?.chain().focus().toggleUnderline().run(),
                      },
                      {
                        label: "Heading 1",
                        icon: <Heading1 size={18} />,
                        action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                      },
                      {
                        label: "Heading 2",
                        icon: <Heading2 size={18} />,
                        action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                      },
                      {
                        label: "Heading 3",
                        icon: <Heading3 size={18} />,
                        action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                      },
                      {
                        label: "Bullet List",
                        icon: <List size={18} />,
                        action: () => editor?.chain().focus().toggleBulletList().run(),
                      },
                      {
                        label: "Numbered List",
                        icon: <ListOrdered size={18} />,
                        action: () => editor?.chain().focus().toggleOrderedList().run(),
                      },
                    ].map((item) => (

                      <button
                        key={item.label}
                        type="button"
                        title={item.label}
                        onClick={item.action}
                        disabled={!editor}
                        className="rounded p-2 hover:bg-gray-200 disabled:opacity-40"
                      >
                        {item.icon}
                      </button>

                    ))}

                    <button
                      type="button"
                      title="Add Link"
                      onClick={addLink}
                      disabled={!editor}
                      className="rounded p-2 hover:bg-gray-200 disabled:opacity-40"
                    >
                      <LinkIcon size={18} />
                    </button>

                    <button
                      type="button"
                      title="Add Image"
                      onClick={addImage}
                      disabled={!editor}
                      className="rounded p-2 hover:bg-gray-200 disabled:opacity-40"
                    >
                      <ImageIcon size={18} />
                    </button>

                  </div>

                  {/* EDITOR AREA */}
                  <div className="min-h-[450px] rounded-md border p-4">

                    <EditorContent
                      editor={editor}
                      className="blog-editor-content"
                    />

                  </div>

                  <style>{`
                    .blog-editor-content .tiptap {
                      min-height: 400px;
                      outline: none;
                      line-height: 1.8;
                      color: #263238;
                    }

                    .blog-editor-content .tiptap p {
                      margin-bottom: 12px;
                    }

                    .blog-editor-content h1 {
                      font-size: 2rem;
                      font-weight: 700;
                      margin: 1rem 0;
                    }

                    .blog-editor-content h2 {
                      font-size: 1.5rem;
                      font-weight: 700;
                      margin: 1rem 0;
                    }

                    .blog-editor-content h3 {
                      font-size: 1.25rem;
                      font-weight: 700;
                      margin: 1rem 0;
                    }

                    .blog-editor-content ul {
                      list-style: disc;
                      padding-left: 1.5rem;
                    }

                    .blog-editor-content ol {
                      list-style: decimal;
                      padding-left: 1.5rem;
                    }

                    .blog-editor-content img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 8px;
                    }

                    .blog-editor-content a {
                      color: #2563eb;
                      text-decoration: underline;
                    }
                  `}</style>

                </section>

                {/* SEO PANEL */}
                <section
                  id="seo-panel"
                  className="overflow-hidden rounded-lg border bg-white shadow-sm"
                >

                  {/* SEO HEADER */}
                  <div className="flex flex-wrap items-center justify-between border-b p-5">

                    <div>

                      <h2 className="text-lg font-bold text-gray-900">
                        SEO Optimization
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Optimize your blog search appearance.
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="text-right">

                        <p className="text-xs text-gray-500">
                          SEO Checklist
                        </p>

                        <p className="text-lg font-bold text-gray-800">
                          {seoPercentage}%
                        </p>

                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-600 text-xs font-bold">
                        {seoScore}/5
                      </div>

                    </div>

                  </div>

                  {/* SEO TABS */}
                  <div className="flex flex-wrap border-b bg-gray-50">

                    {seoTabs.map((tab) => (

                      <button
                        key={tab}
                        onClick={() => setActiveSeoTab(tab)}
                        className={`px-5 py-3 text-sm font-semibold ${
                          activeSeoTab === tab
                            ? "border-b-2 border-blue-600 bg-white text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {tab}
                      </button>

                    ))}

                  </div>

                  <div className="p-5">

                    {/* SEO TAB */}
                    {activeSeoTab === "SEO" && (

                      <div className="space-y-5">

                        {/* FOCUS KEYWORD */}
                        <div>

                          <label className="mb-2 block text-sm font-semibold">
                            Focus Keyphrase
                          </label>

                          <input
                            value={focusKeyword}
                            onChange={(event) => setFocusKeyword(event.target.value)}
                            placeholder="Enter your main focus keyword"
                            className="w-full rounded-md border p-3 text-sm outline-none focus:border-blue-500"
                          />

                          <p className="mt-1 text-xs text-gray-500">
                            Main keyword you want this blog to rank for.
                          </p>

                        </div>

                        {/* SEO TITLE */}
                        <div>

                          <label className="mb-2 block text-sm font-semibold">
                            SEO Title
                          </label>

                          <input
                            value={seoTitle}
                            onChange={(event) => setSeoTitle(event.target.value)}
                            placeholder="Enter SEO title"
                            className="w-full rounded-md border p-3 text-sm outline-none focus:border-blue-500"
                          />

                          <div className="mt-1 flex justify-between text-xs text-gray-500">

                            <span>
                              Recommended: around 50–60 characters
                            </span>

                            <span>
                              {seoTitle.length} characters
                            </span>

                          </div>

                        </div>

                        {/* META DESCRIPTION */}
                        <div>

                          <label className="mb-2 block text-sm font-semibold">
                            Meta Description
                          </label>

                          <textarea
                            value={metaDescription}
                            onChange={(event) => setMetaDescription(event.target.value)}
                            rows={4}
                            placeholder="Write your search engine description..."
                            className="w-full rounded-md border p-3 text-sm outline-none focus:border-blue-500"
                          />

                          <div className="mt-1 flex justify-between text-xs text-gray-500">

                            <span>
                              Recommended: around 150–160 characters
                            </span>

                            <span>
                              {metaDescription.length} characters
                            </span>

                          </div>

                        </div>

                        {/* GOOGLE PREVIEW */}
                        <div className="rounded-lg border bg-gray-50 p-4">

                          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">

                            <Search size={16} />

                            Google Search Preview

                          </div>

                          <div className="rounded-md bg-white p-4">

                            <div className="mb-1 flex items-center gap-2 text-xs text-gray-600">

                              <Globe size={14} />

                              transmedex.org › resources › blog › {currentSlug}

                            </div>

                            <h3 className="text-lg text-blue-800">
                              {seoTitle || title || "Your SEO title"}
                            </h3>

                            <p className="mt-1 text-sm text-gray-600">
                              {metaDescription || excerpt || "Your meta description will appear here."}
                            </p>

                          </div>

                        </div>

                        {/* SEO CHECKLIST */}
                        <div className="space-y-2">

                          <p className="text-sm font-bold text-gray-800">
                            SEO Checklist
                          </p>

                          {[
                            ["Focus keyphrase added", Boolean(focusKeyword.trim())],
                            ["SEO title added", Boolean(seoTitle.trim())],
                            ["Meta description added", Boolean(metaDescription.trim())],
                            ["Blog title added", Boolean(title.trim())],
                            ["Blog description added", Boolean(excerpt.trim())],
                          ].map(([label, done]) => (

                            <div
                              key={label}
                              className="flex items-center gap-2 text-sm"
                            >

                              <CheckCircle
                                size={16}
                                className={done ? "text-green-600" : "text-gray-300"}
                              />

                              <span className={done ? "text-gray-700" : "text-gray-500"}>
                                {label}
                              </span>

                            </div>

                          ))}

                        </div>

                      </div>

                    )}

                    {/* READABILITY TAB */}
                    {activeSeoTab === "Readability" && (

                      <div className="space-y-4">

                        <h3 className="font-bold text-gray-800">
                          Readability Overview
                        </h3>

                        <p className="text-sm text-gray-600">
                          This section gives you a basic content checklist.
                          It is not a full Yoast readability analysis.
                        </p>

                        {[
                          ["Blog title is present", Boolean(title.trim())],
                          ["Short description is present", Boolean(excerpt.trim())],
                          ["Content has been added", Boolean(editor?.getText().trim())],
                          ["Content includes headings", Boolean(editor?.getHTML().match(/<h[1-6]/i))],
                          ["Content includes paragraphs", Boolean(editor?.getHTML().includes("<p"))],
                        ].map(([label, done]) => (

                          <div key={label} className="flex items-center gap-2 text-sm">

                            <CheckCircle
                              size={17}
                              className={done ? "text-green-600" : "text-gray-300"}
                            />

                            <span>{label}</span>

                          </div>

                        ))}

                      </div>

                    )}

                    {/* SCHEMA TAB */}
                    {activeSeoTab === "Schema" && (

                      <div className="space-y-4">

                        <h3 className="font-bold text-gray-800">
                          Schema Settings
                        </h3>

                        <div className="rounded-md border p-4">

                          <p className="text-sm font-semibold text-gray-800">
                            Article Schema
                          </p>

                          <p className="mt-2 text-sm text-gray-600">
                            This blog is identified as an Article in this CMS.
                          </p>

                          <p className="mt-3 text-xs text-gray-500">
                            Schema selection is currently informational.
                            Structured data has not yet been connected to
                            the website's page output.
                          </p>

                        </div>

                      </div>

                    )}

                    {/* SOCIAL TAB */}
                    {activeSeoTab === "Social" && (

                      <div className="space-y-4">

                        <h3 className="font-bold text-gray-800">
                          Social Preview
                        </h3>

                        <p className="text-sm text-gray-600">
                          Preview how your current blog title and description
                          may appear when shared.
                        </p>

                        <div className="overflow-hidden rounded-lg border">

                          <div
                            className="flex h-32 items-center justify-center text-sm text-gray-500"
                            style={{
                              background: `linear-gradient(135deg, ${blogColor}22, #f1f5f9)`,
                            }}
                          >
                            Featured image preview
                          </div>

                          <div className="p-4">

                            <p className="text-xs uppercase text-gray-500">
                              transmedex.org
                            </p>

                            <h4 className="mt-2 font-bold text-gray-900">
                              {seoTitle || title}
                            </h4>

                            <p className="mt-1 text-sm text-gray-600">
                              {metaDescription || excerpt}
                            </p>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                </section>

              </>

            ) : (

              <div className="rounded-lg border bg-white p-8 text-center">

                <FileText
                  size={40}
                  className="mx-auto mb-4 text-gray-400"
                />

                <h2 className="font-bold text-gray-800">
                  Select a blog to start editing.
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Select an existing blog or create a new one.
                </p>

              </div>

            )}

          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5 xl:col-span-3">

            {/* PUBLISH BOX */}
            <section className="rounded-lg border bg-white shadow-sm">

              <div className="flex items-center justify-between border-b p-4">

                <h2 className="font-bold text-gray-900">
                  Publish
                </h2>

                <ChevronDown size={18} className="text-gray-500" />

              </div>

              <div className="space-y-4 p-4">

                <div className="flex items-center gap-2 text-sm text-gray-600">

                  <Globe size={17} />

                  <span>
                    Visibility: Public
                  </span>

                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">

                  <FileText size={17} />

                  <span>
                    {isCreating ? "New blog post" : "Existing blog post"}
                  </span>

                </div>

                <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
                  Changes are saved in this browser's local storage.
                  They are not automatically published to the live website.
                </div>

                <button
                  onClick={handleSaveAction}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
                >

                  <Save size={17} />

                  {isCreating ? "Create Blog" : "Save Changes"}

                </button>

                <button
                  onClick={previewBlog}
                  className="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                >

                  <Eye size={17} />

                  Preview

                </button>

                {!isCreating && (

                  <button
                    onClick={handleReset}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-3 text-sm text-red-700 hover:bg-red-50"
                  >

                    <RotateCcw size={17} />

                    {selectedBlog?.createdByCMS
                      ? "Delete New Blog"
                      : "Restore Original"}

                  </button>

                )}

              </div>

            </section>

            {/* BLOG INFORMATION */}
            <section className="rounded-lg border bg-white shadow-sm">

              <div className="flex items-center justify-between border-b p-4">

                <h2 className="font-bold text-gray-900">
                  Blog Information
                </h2>

                <Settings size={17} className="text-gray-500" />

              </div>

              <div className="space-y-4 p-4">

                <div>

                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    Category
                  </p>

                  <p className="text-sm font-semibold text-gray-800">
                    {category || "Blog"}
                  </p>

                </div>

                <div>

                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    URL Slug
                  </p>

                  <p className="break-all text-sm text-blue-700">
                    {currentSlug || "Not generated yet"}
                  </p>

                </div>

                <div>

                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">
                    Post Type
                  </p>

                  <p className="text-sm text-gray-800">
                    {isCreating
                      ? "New Blog"
                      : selectedBlog?.createdByCMS
                        ? "CMS Blog"
                        : "Existing Blog"}
                  </p>

                </div>

              </div>

            </section>

            {/* SEO SUMMARY */}
            <section className="rounded-lg border bg-white shadow-sm">

              <div className="border-b p-4">

                <h2 className="font-bold text-gray-900">
                  SEO Summary
                </h2>

              </div>

              <div className="space-y-3 p-4">

                <div>

                  <div className="mb-1 flex justify-between text-xs">

                    <span className="text-gray-600">
                      Checklist completion
                    </span>

                    <span className="font-bold">
                      {seoPercentage}%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${seoPercentage}%`,
                      }}
                    />

                  </div>

                </div>

                <button
                  onClick={() => {
                    setActiveSeoTab("SEO");

                    document.getElementById("seo-panel")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="w-full rounded-md border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                >

                  <span className="flex items-center justify-center gap-2">

                    <Search size={16} />

                    Open SEO Settings

                  </span>

                </button>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </div>
  );
}
