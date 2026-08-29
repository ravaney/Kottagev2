export interface DocumentMeta {
  title: string;
  description?: string;
}

export const ensureDescriptionTag = () => {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }

  return tag;
};

export const applyDocumentMeta = ({ title, description }: DocumentMeta) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.title = title;

  if (description !== undefined) {
    ensureDescriptionTag().setAttribute('content', description);
  }
};
