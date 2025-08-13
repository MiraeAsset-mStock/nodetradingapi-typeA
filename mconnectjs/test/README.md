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

## Test Results

Each test will show:
- **Success**: Method works correctly
- **Failure**: Method has issues (with error details)

Example output:
```
=== Testing Fund Summary ===
Fund Summary Response: {
  "status": "success",
  "data": [...]
}

=== Testing Place Order ===
Place order failed: API Error: price is greater than upper circuit price (MiraeException)

Test Results Summary:
========================
PASS - Fund Summary
FAIL - Place Order

1/2 tests passed
```

## Authentication Flow

The testing process follows this authentication flow:

1. **Login** - Triggers OTP to mobile
2. **Enter OTP** - User inputs OTP received on mobile
3. **Generate Session** - Creates access token
4. **Set Access Token** - Token is used for all subsequent API calls

## Pre-Release Checklist

Before making the SDK publicly available, ensure:

- [ ] Login and OTP flow works correctly
- [ ] Session generation creates valid access tokens
- [ ] All portfolio methods return proper data
- [ ] Order placement, modification, and cancellation work
- [ ] Market data methods return valid responses
- [ ] WebSocket connection and data streaming work
- [ ] Error handling provides clear messages
- [ ] All TypeScript types are correct

## Troubleshooting

**Authentication Issues**:
- Verify API key, username, and password in test/test.ts
- Ensure OTP is entered correctly and promptly
- Check if account is active and has trading permissions

**Network Issues**:
- Check internet connection
- Verify API endpoints are accessible
- Check for firewall restrictions

**Trading Issues**:
- Verify market hours for live trading
- Check instrument symbols are correct
- Ensure sufficient account balance for orders
- Verify price is within circuit limits