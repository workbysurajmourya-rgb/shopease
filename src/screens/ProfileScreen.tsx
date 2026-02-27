import { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { getItemCount, getTotalPrice } = useCart();
  const navigation = useNavigation();
  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);

  const menuItems = [
    {
      icon: 'moon-outline',
      label: 'Dark Mode',
      value: isDark ? 'On' : 'Off',
      onPress: toggleTheme,
      toggle: true,
    },
    {
      icon: 'cart-outline',
      label: 'Cart Items',
      value: `${getItemCount()} items`,
      onPress: () => {navigation.navigate('Cart' as never)},
    }
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.card, ...SHADOWS.medium }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          )}
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'User'}</Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || ''}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{getItemCount()}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>In Cart</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              ${getTotalPrice().toFixed(0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Orders</Text>
          </View>
        </View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: theme.card, ...SHADOWS.small }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}>
            <View style={[styles.menuIconContainer, { backgroundColor: theme.surfaceVariant }]}>
              <Icon name={item.icon} size={20} color={theme.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
            {item.toggle ? (
              <View
                style={[
                  styles.toggleTrack,
                  { backgroundColor: isDark ? theme.primary : theme.border },
                ]}>
                <View
                  style={[
                    styles.toggleThumb,
                    { transform: [{ translateX: isDark ? 18 : 0 }] },
                  ]}
                />
              </View>
            ) : (
              <View style={styles.menuRight}>
                {item.value ? (
                  <Text style={[styles.menuValue, { color: theme.textSecondary }]}>
                    {item.value}
                  </Text>
                ) : null}
                <Icon name="chevron-forward" size={18} color={theme.textTertiary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.error + '10' }]}
        onPress={handleSignOut}
        activeOpacity={0.7}>
        <Icon name="log-out-outline" size={20} color={theme.error} />
        <Text style={[styles.signOutText, { color: theme.error }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: SPACING.xxxl * 2,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  profileCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '700',
    color: '#FFF',
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  menuCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    marginLeft: SPACING.md,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  menuValue: {
    fontSize: FONTS.sizes.sm,
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  signOutButton: {
    marginHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    gap: SPACING.sm,
  },
  signOutText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xxl,
    lineHeight: 18,
  },
});

export default ProfileScreen;
