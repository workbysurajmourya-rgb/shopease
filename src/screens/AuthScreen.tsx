import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

function AuthScreen() {
  const { theme, isDark } = useTheme();
  const { signIn } = useAuth();

  const handleGoogleSignIn = useCallback(async () => {
    await signIn();
  }, [signIn]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.topSection}>
        <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
          <Icon name="bag-handle" size={48} color="#FFF" />
        </View>
        <Text style={[styles.appName, { color: theme.text }]}>ShopEase</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>
          Your one-stop shop for everything
        </Text>
      </View>

      <View style={styles.middleSection}>
        <View style={[styles.featureRow]}>
          <View style={[styles.featureIcon, { backgroundColor: theme.surfaceVariant }]}>
            <Icon name="cube-outline" size={24} color={theme.primary} />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Wide Selection</Text>
            <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
              Browse through hundreds of products
            </Text>
          </View>
        </View>
        <View style={[styles.featureRow]}>
          <View style={[styles.featureIcon, { backgroundColor: theme.surfaceVariant }]}>
            <Icon name="cart-outline" size={24} color={theme.primary} />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Easy Shopping</Text>
            <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
              Add to cart with a single tap
            </Text>
          </View>
        </View>
        <View style={[styles.featureRow]}>
          <View style={[styles.featureIcon, { backgroundColor: theme.surfaceVariant }]}>
            <Icon name="shield-checkmark-outline" size={24} color={theme.primary} />
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Secure Checkout</Text>
            <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
              Safe and secure payment process
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Button
          title="Continue with Google"
          onPress={handleGoogleSignIn}
          fullWidth
          size="large"
          icon={<Icon name="logo-google" size={20} color="#FFF" />}
          style={{...styles.googleButton, ...SHADOWS.medium}}
        />
        <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
  },
  topSection: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  appName: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FONTS.sizes.lg,
    marginTop: SPACING.sm,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  featureTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  bottomSection: {
    paddingBottom: SPACING.xxxl * 1.5,
    alignItems: 'center',
  },
  googleButton: {
    height: 56,
    borderRadius: RADIUS.lg,
  },
  disclaimer: {
    fontSize: FONTS.sizes.xs,
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 16,
  },
});

export default AuthScreen;
