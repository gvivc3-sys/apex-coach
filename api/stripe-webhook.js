import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const tierLimits = {
    'starter': 100000,
    'hustler': 200000,
    'empire': 300000
};

export const config = {
    api: {
        bodyParser: false,
    },
};

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful subscription
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        // Get the subscription to find the price
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;

        // Map price ID to tier
        const priceTierMap = {
            'price_YOUR_STARTER_PRICE_ID': 'starter',
            'price_YOUR_HUSTLER_PRICE_ID': 'hustler',
            'price_YOUR_EMPIRE_PRICE_ID': 'empire'
        };

        const tier = priceTierMap[priceId] || 'starter';

        // Create or update user usage
        await supabase
            .from('user_usage')
            .upsert({
                user_id: userId,
                subscription_tier: tier,
                tokens_used: 0,
                tokens_limit: tierLimits[tier],
                period_start: new Date().toISOString(),
                period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            });
    }

    res.status(200).json({ received: true });
}