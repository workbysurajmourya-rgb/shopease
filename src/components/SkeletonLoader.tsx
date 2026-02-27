import { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RADIUS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

function SkeletonCard() {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={[styles.image, { backgroundColor: theme.skeleton }]} />
      <View style={styles.info}>
        <View style={[styles.titleLine, { backgroundColor: theme.skeleton }]} />
        <View style={[styles.titleLineShort, { backgroundColor: theme.skeleton }]} />
        <View style={[styles.ratingLine, { backgroundColor: theme.skeleton }]} />
        <View style={styles.bottomRow}>
          <View style={[styles.priceLine, { backgroundColor: theme.skeleton }]} />
          <View style={[styles.buttonSkeleton, { backgroundColor: theme.skeleton }]} />
        </View>
      </View>
    </View>
  );
}

function SkeletonLoader({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  info: {
    padding: SPACING.md,
  },
  titleLine: {
    height: 12,
    borderRadius: 6,
    width: '100%',
    marginBottom: SPACING.xs,
  },
  titleLineShort: {
    height: 12,
    borderRadius: 6,
    width: '60%',
    marginBottom: SPACING.sm,
  },
  ratingLine: {
    height: 10,
    borderRadius: 5,
    width: '40%',
    marginBottom: SPACING.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLine: {
    height: 16,
    borderRadius: 8,
    width: '40%',
  },
  buttonSkeleton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default memo(SkeletonLoader);
