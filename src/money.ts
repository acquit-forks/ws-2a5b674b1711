export type Line = { amount: number };

// ISO 4217 List One assigns each currency a minor-unit exponent. The codes
// below include XCG, which replaced ANG with the same exponent in 2025.
const CURRENCY_CODES_BY_MINOR_UNITS = {
  0: `BIF CLP DJF GNF ISK JPY KMF KRW PYG RWF UGX UYI VND VUV XAF XOF XPF`.split(' '),
  2: `AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BMD BND BOB
      BOV BRL BSD BTN BWP BYN BZD CAD CDF CHE CHF CHW CNY COP COU CRC CUC
      CUP CVE CZK DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GHS GIP GMD
      GTQ GYD HKD HNL HTG HUF IDR ILS INR IRR JMD KES KGS KHR KPW KYD KZT
      LAK LBP LKR LRD LSL MAD MDL MGA MKD MMK MNT MOP MRU MUR MVR MWK MXN
      MXV MYR MZN NAD NGN NIO NOK NPR NZD PAB PEN PGK PHP PKR PLN QAR RON
      RSD RUB SAR SBD SCR SDG SEK SGD SHP SLE SOS SRD SSP STN SVC SYP SZL
      THB TJS TMT TOP TRY TTD TWD TZS UAH USD USN UYU UZS VED VES WST XCD
      XCG YER ZAR ZMW ZWG`.split(/\s+/),
  3: `BHD IQD JOD KWD LYD OMR TND`.split(' '),
  4: `CLF UYW`.split(' '),
} as const;

// ISO 4217 marks these codes' minor units as "N.A.", so no precision may be
// inferred for them either.
const CURRENCIES_WITHOUT_MINOR_UNITS = new Set(
  `XAG XAU XBA XBB XBC XBD XDR XPD XPT XSU XTS XUA XXX`.split(' '),
);

const MINOR_UNITS_BY_CURRENCY = new Map<string, number>();
for (const [minorUnits, codes] of Object.entries(CURRENCY_CODES_BY_MINOR_UNITS)) {
  for (const code of codes) {
    MINOR_UNITS_BY_CURRENCY.set(code, Number(minorUnits));
  }
}

export function formatTotal(lines: Line[], currency: string): string {
  const code = currency.toUpperCase();
  const minorUnits = MINOR_UNITS_BY_CURRENCY.get(code);

  if (minorUnits === undefined) {
    const reason = CURRENCIES_WITHOUT_MINOR_UNITS.has(code)
      ? 'has no ISO 4217 minor-unit exponent'
      : 'is not a supported ISO 4217 currency code';
    throw new RangeError(`${code} ${reason}`);
  }

  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return sum.toFixed(minorUnits);
}
