import { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import CartItemCard from '../components/CartItemCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

function CartScreen() {
  const { theme } = useTheme();
  const { items, getTotalPrice, getItemCount, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const itemCount = getItemCount();

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ],
    );
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    Alert.alert(
      'Order Placed! 🎉',
      `Your order of ₹₹{totalPrice.toFixed(2)} has been placed successfully!`,
      [{ text: 'Great!', onPress: clearCart }],
    );
  }, [totalPrice, clearCart]);

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
        </View>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Looks like you haven't added any products yet. Start shopping to fill it up!"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <Icon name="trash-outline" size={18} color={theme.error} />
          <Text style={[styles.clearText, { color: theme.error }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => <CartItemCard item={item} />}
        keyExtractor={item => item.product.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.bottomBar, { backgroundColor: theme.surface, ...SHADOWS.large }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            ₹{totalPrice.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Shipping</Text>
          <Text style={[styles.freeShipping, { color: theme.success }]}>Free</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.primary }]}>
            ₹{totalPrice.toFixed(2)}
          </Text>
        </View>
        <Button
          title={`Checkout (₹${totalPrice.toFixed(2)})`}
          onPress={handleCheckout}
          fullWidth
          size="large"
          icon={<Icon name="lock-closed-outline" size={18} color="#FFF" />}
          style={styles.checkoutButton}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: SPACING.sm,
  },
  clearText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 300,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.md,
  },
  summaryValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  freeShipping: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  checkoutButton: {
    marginTop: SPACING.lg,
    height: 56,
    borderRadius: RADIUS.lg,
  },
});

export default CartScreen;
