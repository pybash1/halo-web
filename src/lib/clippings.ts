export interface Clipping {
  id: number;
  src: string;
  alt: string;
}

export const clippingCount = 44;

export const clippings: Clipping[] = Array.from({ length: clippingCount }, (_, index) => {
  const id = index + 1;

  return {
    id,
    src: `/news/clippings/news-${String(id).padStart(2, '0')}.webp`,
    alt: `Newspaper clipping ${id}`,
  };
});
