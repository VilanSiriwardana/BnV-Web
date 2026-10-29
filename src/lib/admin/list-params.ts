export const PAGE_SIZE = 25;

export type ListSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

// Reads ?status, ?q and ?page, keeping status only when it is an allowed value.
export async function readListParams<S extends string>(
  searchParams: ListSearchParams,
  statuses: readonly S[],
) {
  const params = await searchParams;
  const status = first(params.status);
  const q = first(params.q)?.trim().slice(0, 100) || undefined;
  const page = Math.max(1, Number.parseInt(first(params.page) ?? '1', 10) || 1);
  return {
    status: statuses.includes(status as S) ? (status as S) : undefined,
    q,
    page,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  };
}
