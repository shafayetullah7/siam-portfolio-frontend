/** Max wait for GET /admin/auth/check on layout mount — avoids stuck `unknown`. */
export const ADMIN_BOOTSTRAP_TIMEOUT_MS = 15_000;

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error("Admin bootstrap timeout"));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(id);
        resolve(value);
      },
      (error) => {
        clearTimeout(id);
        reject(error);
      },
    );
  });
}
