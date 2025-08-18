# Testing MConnect SDK

This folder contains testing utilities to validate individual SDK methods before public release.

## Quick Start

1. **Update credentials** in `test/test.ts`:
   ```typescript
   const api_key = "your_actual_api_key";
   const username = "your_username";
   const password = "your_password";
   ```

2. **Run tests**:
   ```bash
   # Interactive testing menu
   npx ts-node test/test.ts
   ```

## Available Test Commands

| Command | Description |
|---------|-------------|
| `npx ts-node test/test.ts` | Interactive testing menu |
| `npm run example:mconnect` | Run complete example with authentication |

## Interactive Testing

Run `npx ts-node test/test.ts` for an interactive menu:

```
MConnect Interactive Testing
================================
Authentication:
1. Test Login (Triggers OTP)
2. Test Generate Session (Enter OTP)
3. Test Verify TOTP
4. Test Full Auth Flow

Portfolio & Account:
5. Test Fund Summary
6. Test Positions
7. Test Holdings
8. Test Position Conversion

Market Data:
9. Test Instruments
10. Test OHLC
11. Test LTP
12. Test Historical Data
13. Test Intraday Data
14. Test Loser Gainer

Orders:
15. Test Place Order
16. Test Modify Order
17. Test Cancel Order
18. Test Cancel All Orders
19. Test Order Book
20. Test Order Details
21. Test Order Margin

Trades:
22. Test Trade Book
23. Test Trade History

Baskets:
24. Test Create Basket
25. Test Fetch Basket
26. Test Rename Basket
27. Test Delete Basket
28. Test Calculate Basket

Options:
29. Test Option Chain Master
30. Test Option Chain

Other:
31. Test Logout
32. Run All Tests
0. Exit

Enter your choice (0-32):
```