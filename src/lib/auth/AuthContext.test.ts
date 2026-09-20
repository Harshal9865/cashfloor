import { describe, it, expect } from 'vitest';
import { DEMO_PERSONAS } from './AuthContext';

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
});
