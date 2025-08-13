export const ROUTES = {
    login: "/openapi/typea/connect/login",
    sessionToken: "/openapi/typea/session/token",
    totpToken: "/openapi/typea/session/verifytotp",
    orderplacement: "/openapi/typea/orders/{variety}",
    ordermodify: "/openapi/typea/orders/{variety}/{order_id}",
    ordercancel: "/openapi/typea/orders/regular/{order_id}",
    cancellall: "/openapi/typea/orders/cancelall",
    getorders: "/openapi/typea/orders",
    getorderdetails: "/openapi/typea/order/details",
    ordermargin: "/openapi/typea/margins/orders",
    losergainer: "/openapi/typea/losergainer",
    netpositions: "/openapi/typea/portfolio/positions",
    holdings: "/openapi/typea/portfolio/holdings",
    historicalcandledata: "/openapi/typea/instruments/historical/{instrument_token}/{interval}",
    intradychartdata: "/openapi/typea/instruments/intraday/{exchange}/{scriptName}/{interval}",
    scriptmaster: "/openapi/typea/instruments/scriptmaster",
    ohlcdata: "/openapi/typea/instruments/quote/ohlc",
    ltpdata: "/openapi/typea/instruments/quote/ltp",
    fundsummary: "/openapi/typea/user/fundsummary",
    positionconversion: "/openapi/typea/portfolio/convertposition",
    trades: "/openapi/typea/trades",
    tradebook: "/openapi/typea/tradebook",
    logout: "/openapi/typea/logout",
    createbasket: "/openapi/typea/CreateBasket",
    fetchbasket: "/openapi/typea/FetchBasket",
    renamebasket: "/openapi/typea/RenameBasket",
    deletebasket: "/openapi/typea/DeleteBasket",
    calculatebasket: "/openapi/typea/CalculateBasket",
    optionchainmaster: "/openapi/typea/getoptionchainmaster/{exchange}",
    optionchain: "/openapi/typea/GetOptionChain/{exchange}/{expiry}/{token}"
};

export const DEFAULTS = {
    baseURL: 'https://api.mstock.trade',
    wsURL: 'wss://ws.mstock.trade',
    timeout: 7000,
    debug: false
};