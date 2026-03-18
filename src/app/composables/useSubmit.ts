import { FetchError } from 'ofetch';

type RevertFn<T = unknown> = (
  success: boolean,
  data: T | undefined
) => Promise<void>;

type SubmitOpts<T = unknown> = {
  revert: RevertFn<T>;
  successMsg?: string;
  noSuccessToast?: boolean;
};

export function useSubmit<T = unknown>(
  url: string,
  options: Record<string, unknown>,
  opts: SubmitOpts<T>
) {
  const toast = useToast();
  const submitRequest = $fetch as <Response>(
    url: string,
    options: Record<string, unknown>
  ) => Promise<Response>;

  return async (data: unknown) => {
    try {
      const res = await submitRequest<T>(url, {
        ...options,
        body: data as Record<string, unknown> | undefined,
      });

      if (!opts.noSuccessToast) {
        toast.showToast({
          type: 'success',
          message: opts.successMsg,
        });
      }

      await opts.revert(true, res);
    } catch (e) {
      if (e instanceof FetchError) {
        toast.showToast({
          type: 'error',
          message: e.data.message,
        });
      } else if (e instanceof Error) {
        toast.showToast({
          type: 'error',
          message: e.message,
        });
      } else {
        console.error(e);
      }
      await opts.revert(false, undefined);
    }
  };
}
