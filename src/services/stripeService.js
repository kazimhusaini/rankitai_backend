import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processStripePayment = async (amount, currency, source) => {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });
    return charge;
  } catch (error) {
    throw new Error(error.message);
  }
};
