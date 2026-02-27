import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Text,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortButton from '../components/SortButton';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import OfflineBanner from '../components/OfflineBanner';
import { FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';

const PAGE_SIZE = 6;

function HomeScreen() {
  const { theme } = useTheme();
  const { getItemCount } = useCart();
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [productsResult, categoriesResult] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsResult.data);
      setCategories(categoriesResult.data);
      setIsOffline(productsResult.fromCache || categoriesResult.fromCache);
    } catch (err: any) {
      setError(err.message || 'Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setDisplayCount(PAGE_SIZE);
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.title.toLowerCase().includes(query));
    }

    switch (sortOption) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortOption]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  const hasMore = displayCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300);
  }, [hasMore, loadingMore]);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory, sortOption]);

  const cartCount = getItemCount();

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome to</Text>
          <Text style={[styles.brandName, { color: theme.text }]}>ShopEase</Text>
        </View>
        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: theme.surfaceVariant }]}
          onPress={() => navigation.navigate('Cart' as never)}>
          <Icon name="cart-outline" size={24} color={theme.text} />
          {cartCount > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: theme.secondary }]}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        <View style={{ marginLeft: SPACING.sm }}>
          <SortButton currentSort={sortOption} onSortChange={setSortOption} />
        </View>
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <View style={styles.resultsRow}>
        <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        {loadingMore && <ActivityIndicator color={theme.primary} />}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        {renderHeader()}
        <SkeletonLoader count={6} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Something went wrong"
          message={error}
          actionLabel="Try Again"
          onAction={() => {
            setIsLoading(true);
            loadData();
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
      <OfflineBanner isConnected={!isOffline} />
      <FlatList
        data={paginatedProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No products found"
            message="Try adjusting your search or filter criteria"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.sizes.md,
  },
  brandName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  resultsRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  resultsText: {
    fontSize: FONTS.sizes.sm,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  listContent: {
    paddingBottom: SPACING.xxxl * 2,
  },
  footer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
});

export default HomeScreen;
