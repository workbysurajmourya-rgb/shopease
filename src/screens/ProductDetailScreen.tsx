import { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

function ProductDetailScreen() {
  const { theme } = useTheme();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const inCart = isInCart(product.id);

  const handleCartAction = useCallback(() => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  }, [inCart, product, addToCart, removeFromCart]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
          size={18}
          color={theme.rating}
          style={{ marginRight: 2 }}
        />,
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.surfaceVariant }]}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          Product Details
        </Text>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.surfaceVariant }]}
          onPress={handleCartAction}>
          <Icon
            name={inCart ? 'heart' : 'heart-outline'}
            size={22}
            color={inCart ? theme.secondary : theme.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.imageContainer, { backgroundColor: theme.surfaceVariant }]}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.infoContainer}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>{renderStars(product.rating.rate)}</View>
            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
              {product.rating.rate} ({product.rating.count} reviews)
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.primary }]}>
              ₹{product.price.toFixed(2)}
            </Text>
            <View style={[styles.inStockBadge, { backgroundColor: theme.success + '15' }]}>
              <Icon name="checkmark-circle" size={14} color={theme.success} />
              <Text style={[styles.inStockText, { color: theme.success }]}>In Stock</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {product.description}
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Details</Text>
          <View style={styles.detailsGrid}>
            <View style={[styles.detailItem, { backgroundColor: theme.surfaceVariant }]}>
              <Icon name="pricetag-outline" size={20} color={theme.primary} />
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Category</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Text>
            </View>
            <View style={[styles.detailItem, { backgroundColor: theme.surfaceVariant }]}>
              <Icon name="star-outline" size={20} color={theme.primary} />
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Rating</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {product.rating.rate}/5
              </Text>
            </View>
            <View style={[styles.detailItem, { backgroundColor: theme.surfaceVariant }]}>
              <Icon name="people-outline" size={20} color={theme.primary} />
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Reviews</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {product.rating.count}
              </Text>
            </View>
            <View style={[styles.detailItem, { backgroundColor: theme.surfaceVariant }]}>
              <Icon name="cash-outline" size={20} color={theme.primary} />
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Price</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                ₹{product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, ...SHADOWS.large }]}>
        <View style={styles.bottomPriceSection}>
          <Text style={[styles.bottomPriceLabel, { color: theme.textSecondary }]}>Total Price</Text>
          <Text style={[styles.bottomPrice, { color: theme.text }]}>
            ₹{product.price.toFixed(2)}
          </Text>
        </View>
        <Button
          title={inCart ? 'Remove from Cart' : 'Add to Cart'}
          onPress={handleCartAction}
          variant={inCart ? 'outline' : 'primary'}
          size="large"
          icon={
            <Icon
              name={inCart ? 'trash-outline' : 'cart-outline'}
              size={20}
              color={inCart ? theme.primary : '#FFF'}
            />
          }
          style={styles.addToCartButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: width,
    height: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
  },
  image: {
    width: '70%',
    height: '70%',
  },
  infoContainer: {
    padding: SPACING.xl,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  categoryText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    lineHeight: 30,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  ratingText: {
    fontSize: FONTS.sizes.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
  },
  price: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  inStockText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.md,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  detailItem: {
    width: (width - SPACING.xl * 2 - SPACING.md) / 2,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
  },
  detailValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  bottomPriceSection: {},
  bottomPriceLabel: {
    fontSize: FONTS.sizes.sm,
  },
  bottomPrice: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  addToCartButton: {
    flex: 1,
    marginLeft: SPACING.xl,
    height: 52,
    borderRadius: RADIUS.lg,
  },
});

export default ProductDetailScreen;
