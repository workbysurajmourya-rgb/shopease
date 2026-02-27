import { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface CartItemCardProps {
  item: CartItem;
}

function CartItemCard({ item }: CartItemCardProps) {
  const { theme } = useTheme();
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, ...SHADOWS.small, shadowColor: theme.shadow },
      ]}>
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceVariant }]}>
        <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={[styles.price, { color: theme.primary }]}>
          ₹{item.product.price.toFixed(2)}
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.surfaceVariant }]}
            onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
            <Icon name="remove" size={16} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.primary }]}
            onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
            <Icon name="add" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.deleteButton}>
          <Icon name="trash-outline" size={20} color={theme.error} />
        </TouchableOpacity>
        <Text style={[styles.subtotal, { color: theme.text }]}>
          ₹{(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  image: {
    width: 60,
    height: 60,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    lineHeight: 18,
  },
  price: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginHorizontal: SPACING.md,
    minWidth: 20,
    textAlign: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    paddingVertical: SPACING.xs,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  subtotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});

export default memo(CartItemCard);
