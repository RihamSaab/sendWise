"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE_OPTIONS: Array<number> = [10, 25, 50];
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function useTransactionPagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("pageSize"));

  const page =
    Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_PAGE;

  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize)
    ? rawPageSize
    : DEFAULT_PAGE_SIZE;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("page") !== String(page)) {
      params.set("page", String(page));
    }

    if (params.get("pageSize") !== String(pageSize)) {
      params.set("pageSize", String(pageSize));
    }

    if (params.toString() !== searchParams.toString()) {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [page, pageSize, pathname, router, searchParams]);

  const updatePage = useCallback(
    (nextPage: number, replace = false) => {
      if (!Number.isInteger(nextPage) || nextPage < 1) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(nextPage));
      params.set("pageSize", String(pageSize));

      const url = `${pathname}?${params.toString()}`;

      if (replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pageSize, pathname, router, searchParams],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => updatePage(nextPage),
    [updatePage],
  );

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      if (!PAGE_SIZE_OPTIONS.includes(nextPageSize)) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(DEFAULT_PAGE));
      params.set("pageSize", String(nextPageSize));

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const resetPage = useCallback(
    () => updatePage(DEFAULT_PAGE, true),
    [updatePage],
  );

  const correctOutOfRangePage = useCallback(
    (totalPages: number) => {
      if (page <= Math.max(totalPages, 1)) {
        return;
      }

      updatePage(DEFAULT_PAGE, true);
    },
    [page, updatePage],
  );

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    resetPage,
    correctOutOfRangePage,
  };
}
