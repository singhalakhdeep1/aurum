import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function createPaymentIntent(amount: number, currency: string = 'usd') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  })
  return paymentIntent
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)
  return paymentIntent
}

export async function createSubscription(priceId: string, customerId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })
  return subscription
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function createCustomer(email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })
  return customer
}

export async function createInvoice(customerId: string, amount: number, description: string) {
  const invoice = await stripe.invoices.create({
    customer: customerId,
    description,
    currency: 'usd',
  })
  
  await stripe.invoiceItems.create({
    customer: customerId,
    amount: amount * 100,
    currency: 'usd',
    description,
  })
  
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
  return finalizedInvoice
}
