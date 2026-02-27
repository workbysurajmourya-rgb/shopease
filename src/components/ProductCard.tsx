import { memo } from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

function ProductCard({ product, onPress }: ProductCardProps) {
  const { theme } = useTheme();
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          ...SHADOWS.medium,
          shadowColor: theme.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceVariant }]}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        {inCart && (
          <View style={[styles.cartBadge, { backgroundColor: theme.success }]}>
            <Icon name="checkmark" size={12} color="#FFF" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color={theme.rating} />
          <Text style={[styles.rating, { color: theme.textSecondary }]}>
            {product.rating.rate} ({product.rating.count})
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={[styles.price, { color: theme.primary }]}>
            ₹{product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: inCart ? theme.success : theme.primary },
            ]}
            onPress={() => addToCart(product)}
            activeOpacity={0.7}>
            <Icon name={inCart ? 'checkmark' : 'add'} size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    position: 'relative',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  cartBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  rating: {
    fontSize: FONTS.sizes.xs,
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ProductCard);
