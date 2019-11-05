const paymentMethodsConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'NL',
    amount: {
        value: 1000,
        currency: 'EUR'
    }
};

const paymentsDefaultConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'NL',
    channel: 'web',
    returnUrl: 'https://your-company.com/',
    amount: {
        value: 1000,
        currency: 'EUR'
    },
    lineItems: [{
        id: '1',
        description: 'Test Item 1',
        amountExcludingTax: 10000,
        amountIncludingTax: 11800,
        taxAmount: 1800,
        taxPercentage: 1800,
        quantity: 1,
        taxCategory: 'High'
    }],
    additionalData: {
        executeThreeD: true,
        allow3DS2: true
    },
    "accountInfo": {
        "accountCreationDate": "2019-01-17T13:42:40+01:00" // provided by backend
    },
    "shopperEmail": "s.hopper@test.com", // provided by backend
    "shopperIP": "192.0.2.1", // provided by backend
    //"browserInfo": ... Update the sdk version to 3.3.0 this will be included automatically
    "origin": location.origin,

};

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());

// Get all available payment methods from the local server
const getPaymentMethods = () =>
    httpPost('paymentMethods', paymentMethodsConfig)
    .then(response => {
        if (response.error) throw 'No paymentMethods available';

        return response;
    })
    .catch(console.error);

// Posts a new payment into the local server
const makePayment = (paymentMethod, config = {}) => {
    const paymentsConfig = {
        ...paymentsDefaultConfig,
        ...config
    };
    const paymentRequest = {
        ...paymentsConfig,
        ...paymentMethod
    };

    updateRequestContainer(paymentRequest);

    return httpPost('payments', paymentRequest)
        .then(response => {
            if (response.error) throw 'Payment initiation failed';

            updateResponseContainer(response);

            return response;
        })
        .catch(console.error);
};

// Posts a new payment details into the local server
const details = (paymentMethod, config = {}) => {
    const paymentsConfig = {
        ...paymentsDefaultConfig,
        ...config
    };
    const paymentRequest = {
        ...paymentsConfig,
        ...paymentMethod
    };

    updateRequestContainer(paymentRequest);

    return httpPost('details', paymentRequest)
        .then(response => {
            if (response.error) throw 'Payment initiation failed';

            updateResponseContainer(response);

            return response;
        })
        .catch(console.error);
};

// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
    .then(response => {
        if (response.error || !response.originKeys) throw 'No originKey available';

        return response.originKeys[Object.keys(response.originKeys)[0]];
    })
    .catch(console.error);