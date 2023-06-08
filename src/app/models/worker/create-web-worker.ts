// @ts-ignore
import getCrossOriginWorkerURL from 'crossoriginworker';

export const createLocalWebWorker = () => {
  return new Worker(new URL(`../../../workers/web.worker`, import.meta.url), { type: "module" });
}

export const createDistantWebWorker = async (baseUrl: string) => {
  const workerURL = await getCrossOriginWorkerURL(`${baseUrl}/assets/workers/workers/web.worker.js`);
  return new Worker(workerURL, { type: "module" });
}
