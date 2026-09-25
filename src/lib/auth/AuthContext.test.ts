import { describe, it, expect } from 'vitest';
import { DEMO_PERSONAS, formatInitials, LOCAL_STORAGE_USER_KEY } from './AuthContext';

describe('AuthContext and Persona Configuration', () => {
  it('defines realistic, diversified demo personas', () => {
    expect(DEMO_PERSONAS.consultant).toBeDefined();
    expect(DEMO_PERSONAS.freelancer).toBeDefined();
    expect(DEMO_PERSONAS.agency).toBeDefined();

    expect(DEMO_PERSONAS.consultant.monthlyIncome).toBeGreaterThan(10000);
    expect(DEMO_PERSONAS.consultant.initialSavings).toBeGreaterThan(30000);
    expect(DEMO_PERSONAS.consultant.email).toContain('@cashfloor.app');

    expect(DEMO_PERSONAS.freelancer.monthlyIncome).toBeGreaterThan(5000);
    expect(DEMO_PERSONAS.agency.monthlyIncome).toBeGreaterThan(20000);
  });

  it('provides all expected persona roles and valid metadata', () => {
    Object.values(DEMO_PERSONAS).forEach((persona) => {
      expect(persona.name).toBeTruthy();
      expect(persona.role).toBeTruthy();
      expect(persona.description).toBeTruthy();
      expect(persona.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it('correctly generates initials for profile fallback', () => {
    expect(formatInitials('Sarah Jenkins')).toBe('SJ');
    expect(formatInitials('alex.rivera@cashfloor.app')).toBe('AR');
    expect(formatInitials('SingleWord')).toBe('SI');
    expect(formatInitials('')).toBe('CF');
  });

  it('maintains the expected local storage key for profile persistence and preloading', () => {
    expect(LOCAL_STORAGE_USER_KEY).toBe('cf_auth_profile_v2');
  });
});
