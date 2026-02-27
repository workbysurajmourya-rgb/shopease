import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING } from '../constants/theme';

interface OfflineBannerProps {
  isConnected: boolean;
}

function OfflineBanner({ isConnected }: OfflineBannerProps) {
  const { theme } = useTheme();

  if (isConnected) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.warning }]}>
      <Icon name="cloud-offline-outline" size={16} color="#FFF" />
      <Text style={styles.text}>No internet connection. Showing cached data.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  text: {
    color: '#FFF',
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
});

export default memo(OfflineBanner);
