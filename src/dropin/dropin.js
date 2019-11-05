// 0. Get originKey
getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            originKey: originKey, // Mandatory. originKey from Costumer Area
            paymentMethodsResponse,
            removePaymentMethods: ['paysafecard', 'c_cash']
        });

        // 2. Create and mount the Component
        const dropin = checkout
            .create('dropin', {
                paymentMethodsConfiguration: {
                    applepay: { // Example required configuration for Apple Pay
                      configuration: {
                        merchantName: 'Adyen Test merchant', // Name to be displayed on the form
                        merchantIdentifier: 'adyen.test.merchant' // Your Apple merchant identifier as described in https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951611-merchantidentifier
                      }
                    },
                    paywithgoogle: { // Example required configuration for Google Pay
                      environment: "TEST", // Change this to PRODUCTION when you're ready to accept live Google Pay payments
                      configuration: {
                       gatewayMerchantId: "YourCompanyOrMerchantAccount", // Your Adyen merchant or company account name. Remove this field in TEST.
                       merchantIdentifier: "12345678910111213141" // Required for PRODUCTION. Remove this field in TEST. Your Google Merchant ID as described in https://developers.google.com/pay/api/web/guides/test-and-deploy/deploy-production-environment#obtain-your-merchantID
                      }
                    },
                    card: { // Example optional configuration for Cards
                      hasHolderName: true,
                      holderNameRequired: true,
                      enableStoreDetails: true,
                      name: 'Credit or debit card'
                    }
                  },
                // Events
                onSelect: activeComponent => {
                    updateStateContainer(activeComponent.data); // Demo purposes only
                },
                onChange: state => {
                    updateStateContainer(state); // Demo purposes only
                },
                onSubmit: (state, component) => {
                    // state.data;
                    // state.isValid;
                    // delete state.data.browserInfo;

                    makePayment(state.data)// Your function calling your server to make the /payments request
                    .then(res => {
                        if(res.action) {
                          dropin.handleAction(res.action);
                        }
                    })
                    .catch(error => {
                      throw Error(error);
                    });;
                },

                onAdditionalDetails: (state, dropin) => {
                  console.log(state);
                  // TODO make payments/details call

                  details(state.data).then(res => {
                    console.log(res);
                    if(res.action) {
                      dropin.handleAction(res.action);
                    }
                });
                }
            })
            .mount('#dropin-container');
    });
});
