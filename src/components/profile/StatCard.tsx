import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LightColors } from '../../styles/colors';

interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  label,
  value,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Icon name={icon} size={28} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: LightColors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: LightColors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LightColors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: LightColors.textTertiary,
  },
});
