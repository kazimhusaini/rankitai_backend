import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

export const processPayPalPayment = async (amount, currency) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{ amount: { currency_code: currency, value: amount } }],
  });

  try {
    const order = await client.execute(request);
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
