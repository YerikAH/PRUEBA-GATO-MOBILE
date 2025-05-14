import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services";
import { User } from "../../models";

export function usePaginatedUsers() {
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    data,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error: queryError,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchUsers(pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialData: {
      pages: [],
      pageParams: [1],
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data?.pages.length === 1) {
      fetchNextPage();
    }
  }, [data?.pages.length, fetchNextPage]);

  useEffect(() => {
    const users = data?.pages.flatMap((page) => page.data) ?? [];
    setLocalUsers(users);

    if (users.length > 0 && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [data?.pages, isInitialLoading]);

  useEffect(() => {
    if (isFetching && !isFetchingNextPage) {
      setIsInitialLoading(true);
    }
  }, [isFetching, isFetchingNextPage]);

  const loadMoreUsers = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsInitialLoading(true);
    refetch();
  };

  return {
    users: localUsers,
    isPending: isPending || isInitialLoading,
    isFetchingNextPage,
    loadMoreUsers,
    hasNextPage,
    refetch: handleRefresh,
    queryError,
  };
}
