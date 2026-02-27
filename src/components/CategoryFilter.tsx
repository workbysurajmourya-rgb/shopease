import { memo } from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SPACING } from '../constants/theme';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  const { theme } = useTheme();
  const allCategories = ['All', ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {allCategories.map(category => {
        const isSelected =
          (category === 'All' && selectedCategory === '') ||
          category === selectedCategory;
        return (
          <TouchableOpacity
            key={category}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.primary : theme.surfaceVariant,
              },
            ]}
            onPress={() => onSelect(category === 'All' ? '' : category)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? '#FFFFFF' : theme.textSecondary,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
  },
});

export default memo(CategoryFilter);
