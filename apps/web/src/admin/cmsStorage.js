const STORAGE_KEY = 'transmedex_cms_content';

export function getCMSContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('CMS content could not be loaded:', error);
    return {};
  }
}

export function getPageContent(page = 'home') {
  const allContent = getCMSContent();
  return allContent[page] || {};
}

export function savePageContent(page, content) {
  const allContent = getCMSContent();

  allContent[page] = {
    ...allContent[page],
    ...content,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allContent));

  return allContent[page];
}