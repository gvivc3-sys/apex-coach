import { supabase } from '../supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handleStripeWebhook(request) {
    const sig = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Create user account
        const { data, error } = await supabase.auth.admin.createUser({
            email: session.customer_email,
            password: Math.random().toString(36).slice(-8), // Generate random password
            email_confirm: true
        });

        if (!error) {
            // Store subscription info
            await supabase.from('subscriptions').insert({
                user_id: data.user.id,
                stripe_customer_id: session.customer,
                stripe_subscription_id: session.subscription,
                tier: session.metadata.tier,
                status: 'active'
            });

            // Send welcome email with login details
            // (You'd implement this with your email service)
        }
    }

    return new Response('Success', { status: 200 });
}