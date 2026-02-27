import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SPACING } from '../constants/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color={theme.textTertiary} />
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={onAction}
          activeOpacity={0.7}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginTop: SPACING.lg,
  },
  message: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  button: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});

export default memo(EmptyState);
