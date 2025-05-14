import { StyleSheet, View, FlatList } from "react-native";
import { colors } from "../../../../../utils";
import {
  Header,
  UserCard,
  UserCardSkeleton,
  ErrorContainer,
  FooterLoader,
} from "../components";
import { usePaginatedUsers } from "../../../../../hooks/use_paginated_users";

const Home = () => {
  const {
    users,
    isPending,
    isFetchingNextPage,
    loadMoreUsers,
    refetch,
    queryError,
  } = usePaginatedUsers();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <Header onRefresh={handleRefresh} />

      {isPending ? (
        <FlatList
          data={[...Array(6)]}
          renderItem={() => <UserCardSkeleton />}
          keyExtractor={(_, index) => `skeleton-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : queryError ? (
        <ErrorContainer queryError={queryError} refetch={handleRefresh} />
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserCard handleRefresh={handleRefresh} user={item} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<FooterLoader loading={isFetchingNextPage} />}
          onRefresh={handleRefresh}
          refreshing={isPending}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
    paddingTop: 50,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
});

export default Home;
