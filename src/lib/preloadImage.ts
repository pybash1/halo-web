const cache = new Map<string, Promise<void>>();

export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  let promise = cache.get(src);

  if (!promise) {
    promise = new Promise<void>((resolve) => {
      const image = new Image();
      (image as HTMLImageElement & { fetchPriority?: 'high' | 'low' }).fetchPriority = priority;

      const finish = () => {
        image.decode().catch(() => {}).then(() => resolve());
      };

      image.onload = finish;
      image.onerror = finish;
      image.src = src;
    });

    cache.set(src, promise);
  }

  return promise;
}

export function preloadImagesWithConcurrency(
  srcs: string[],
  concurrency: number,
  onEach?: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    if (srcs.length === 0) {
      resolve();
      return;
    }

    let nextIndex = 0;
    let completed = 0;

    const startNext = () => {
      if (nextIndex >= srcs.length) return;
      const index = nextIndex;
      nextIndex += 1;

      preloadImage(srcs[index], index < 12 ? 'high' : 'low').then(() => {
        completed += 1;
        onEach?.();

        if (completed === srcs.length) {
          resolve();
        } else {
          startNext();
        }
      });
    };

    for (let i = 0; i < Math.min(concurrency, srcs.length); i += 1) {
      startNext();
    }
  });
}
