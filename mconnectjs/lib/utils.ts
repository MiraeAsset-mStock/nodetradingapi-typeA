// --- Utils ---
export namespace Utils {
    const baseDate = new Date('1980-01-01T00:00:00Z').getTime();

    export function unixToDateTime(unixTimeStamp: number): Date {
        return new Date(baseDate + unixTimeStamp * 1000);
    }

    export function getDecimalDivisor(instrumentToken: number): number {
        const segment = instrumentToken & 0xff;
        switch (segment) {
            case 3: // CDS
                return 10000000.0;
            case 6: // BCD
                return 10000.0;
            default:
                return 100.0;
        }
    }
}