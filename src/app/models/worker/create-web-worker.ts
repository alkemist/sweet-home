export const createWebWorker = () => {
  return new Worker(
    new URL(`../../../workers/web.worker`, import.meta.url)
  );
}
