
import { blogPosts } from "../data/blogData";

const STORAGE_KEY = "transmedex_blog_edits";
const NEW_BLOGS_KEY = "transmedex_new_blogs";

function readStorage(key, fallback = {}) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Storage could not be loaded: ${key}`, error);
    return fallback;
  }
}

function getAllEdits() {
  return readStorage(STORAGE_KEY, {});
}

function getNewBlogs() {
  return readStorage(NEW_BLOGS_KEY, []);
}

// Get one blog with saved edits
export function getEditableBlog(blog) {
  if (!blog) return null;

  const edits = getAllEdits();

  return {
    ...blog,
    ...(edits[blog.slug] || {}),
  };
}

// Get original blogs + newly created blogs
export function getEditableBlogs() {
  const originalBlogs = blogPosts.map(getEditableBlog);
  const newBlogs = getNewBlogs();

  return [...originalBlogs, ...newBlogs];
}

// Create a completely new blog
export function createBlog(blogData) {
  const title = (blogData.title || "").trim();
  const slug = (blogData.slug || "").trim();

  if (!title) {
    throw new Error("Blog title is required.");
  }

  if (!slug) {
    throw new Error("Blog URL slug is required.");
  }

  const existingBlog = getEditableBlogs().find(
    (blog) => blog.slug === slug
  );

  if (existingBlog) {
    throw new Error("This blog URL already exists. Use another title.");
  }

  const newBlog = {
    id: `cms-${Date.now()}`,
    title,
    slug,
    excerpt: blogData.excerpt || "",
    content: blogData.content || "",
    category: blogData.category || "Healthcare",
    color: blogData.color || "#0da1df",
    seoTitle: blogData.seoTitle || "",
    metaDescription: blogData.metaDescription || "",
    focusKeyword: blogData.focusKeyword || "",
    createdAt: new Date().toISOString(),
    createdByCMS: true,
  };

  const blogs = getNewBlogs();

  blogs.unshift(newBlog);

  localStorage.setItem(
    NEW_BLOGS_KEY,
    JSON.stringify(blogs)
  );

  return newBlog;
}

// Save changes for existing or newly created blogs
export function saveBlogEdit(slug, changes) {
  const blog = getEditableBlogs().find(
    (item) => item.slug === slug
  );

  if (!blog) {
    throw new Error("Blog not found.");
  }

  const allowedFields = [
    "title",
    "excerpt",
    "content",
    "category",
    "color",
    "seoTitle",
    "metaDescription",
    "focusKeyword",
  ];

  const safeChanges = {};

  for (const field of allowedFields) {
    if (typeof changes[field] === "string") {
      safeChanges[field] = changes[field];
    }
  }

  // Update newly created blog
  if (blog.createdByCMS) {
    const blogs = getNewBlogs();

    const updatedBlogs = blogs.map((item) =>
      item.slug === slug
        ? { ...item, ...safeChanges }
        : item
    );

    localStorage.setItem(
      NEW_BLOGS_KEY,
      JSON.stringify(updatedBlogs)
    );

    return updatedBlogs.find((item) => item.slug === slug);
  }

  // Update original blog
  const edits = getAllEdits();

  edits[slug] = {
    ...(edits[slug] || {}),
    ...safeChanges,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(edits)
  );

  return getEditableBlog(blogPosts.find(
    (item) => item.slug === slug
  ));
}

// Restore original blog or delete a newly created blog
export function resetBlogEdit(slug) {
  const blog = getEditableBlogs().find(
    (item) => item.slug === slug
  );

  if (blog?.createdByCMS) {
    const updatedBlogs = getNewBlogs().filter(
      (item) => item.slug !== slug
    );

    localStorage.setItem(
      NEW_BLOGS_KEY,
      JSON.stringify(updatedBlogs)
    );

    return;
  }

  const edits = getAllEdits();

  delete edits[slug];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(edits)
  );
}
