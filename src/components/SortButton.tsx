import { memo, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

export type SortOption = 'default' | 'price_low' | 'price_high' | 'rating';

interface SortButtonProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { key: SortOption; label: string; icon: string }[] = [
  { key: 'default', label: 'Default', icon: 'swap-vertical' },
  { key: 'price_low', label: 'Price: Low to High', icon: 'arrow-up' },
  { key: 'price_high', label: 'Price: High to Low', icon: 'arrow-down' },
  { key: 'rating', label: 'Top Rated', icon: 'star' },
];

function SortButton({ currentSort, onSortChange }: SortButtonProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.surfaceVariant }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}>
        <Icon name="funnel-outline" size={18} color={theme.primary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={[styles.menu, { backgroundColor: theme.surface, ...SHADOWS.large }]}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Sort By</Text>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.menuItem,
                  currentSort === option.key && { backgroundColor: theme.surfaceVariant },
                ]}
                onPress={() => {
                  onSortChange(option.key);
                  setVisible(false);
                }}>
                <Icon
                  name={option.icon}
                  size={18}
                  color={currentSort === option.key ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      color: currentSort === option.key ? theme.primary : theme.text,
                      fontWeight: currentSort === option.key ? '600' : '400',
                    },
                  ]}>
                  {option.label}
                </Text>
                {currentSort === option.key && (
                  <Icon name="checkmark" size={18} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  menu: {
    width: '100%',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  menuTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  menuItemText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    marginLeft: SPACING.md,
  },
});

export default memo(SortButton);
