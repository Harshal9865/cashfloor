import { describe, it, expect } from 'vitest';
import { generateTaxDeadlinesIcs } from './icsGenerator';

describe('Tax Calendar ICS Generator', () => {
  it('generates valid RFC 5545 iCalendar content', () => {
    const ics = generateTaxDeadlinesIcs();

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//CashFloor Technologies//Freelance Tax Deadlines//EN');
  });

  it('includes all 4 quarterly estimated tax deadlines with correct IRS dates', () => {
    const ics = generateTaxDeadlinesIcs();
    const currentYear = new Date().getFullYear();

    // Q1: April 15
    expect(ics).toContain(`DTSTART:${currentYear}0415T090000`);
    expect(ics).toContain('IRS Estimated Tax Payment — Q1');

    // Q2: June 15
    expect(ics).toContain(`DTSTART:${currentYear}0615T090000`);
    expect(ics).toContain('IRS Estimated Tax Payment — Q2');

    // Q3: Sept 15
    expect(ics).toContain(`DTSTART:${currentYear}0915T090000`);
    expect(ics).toContain('IRS Estimated Tax Payment — Q3');

    // Q4: Jan 15 of next year
    expect(ics).toContain(`DTSTART:${currentYear + 1}0115T090000`);
    expect(ics).toContain('IRS Estimated Tax Payment — Q4');
  });

  it('configures reminder alarms (7-day and 1-day notifications)', () => {
    const ics = generateTaxDeadlinesIcs();

    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-P7D');
    expect(ics).toContain('TRIGGER:-P1D');
    expect(ics).toContain('END:VALARM');
  });
});
