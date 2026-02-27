import { memo, type ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FONTS, RADIUS, SPACING } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.md,
      ...(fullWidth && { width: '100%' }),
    };

    switch (size) {
      case 'small':
        base.paddingHorizontal = SPACING.md;
        base.paddingVertical = SPACING.sm;
        break;
      case 'large':
        base.paddingHorizontal = SPACING.xxl;
        base.paddingVertical = SPACING.lg;
        break;
      default:
        base.paddingHorizontal = SPACING.xl;
        base.paddingVertical = SPACING.md;
    }

    switch (variant) {
      case 'secondary':
        base.backgroundColor = theme.secondary;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = theme.primary;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      default:
        base.backgroundColor = theme.primary;
    }

    if (disabled) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: '600',
    };

    switch (size) {
      case 'small':
        base.fontSize = FONTS.sizes.sm;
        break;
      case 'large':
        base.fontSize = FONTS.sizes.lg;
        break;
      default:
        base.fontSize = FONTS.sizes.md;
    }

    switch (variant) {
      case 'outline':
      case 'ghost':
        base.color = theme.primary;
        break;
      default:
        base.color = '#FFFFFF';
    }

    return base;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? theme.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), icon ? { marginLeft: SPACING.sm } : {}, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export default memo(Button);
