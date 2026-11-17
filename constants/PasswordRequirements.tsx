import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Requirement = {
  label: string;
  test: (pw: string) => boolean;
};

export const REQUIREMENTS: Requirement[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /\d/.test(pw) },
  { label: 'One special character (!@#$...)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export const isPasswordValid = (pw: string) => REQUIREMENTS.every((r) => r.test(pw));

export default function PasswordRequirements({ password }: { password: string }) {
  return (
    <View style={styles.container}>
      {REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <View key={req.label} style={styles.row}>
            <Text style={[styles.icon, met ? styles.met : styles.unmet]}>{met ? '✓' : '✗'}</Text>
            <Text style={[styles.label, met ? styles.met : styles.unmet]}>{req.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 20, fontWeight: 'bold' },
  label: { fontSize: 14 },
  met: { color: '#22c55e' },   // green
  unmet: { color: '#ef4444' }, // red
});
