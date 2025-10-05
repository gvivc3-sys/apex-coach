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
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const tier = session.metadata.tier || 'starter';

        console.log('Payment received for:', customerEmail, 'Tier:', tier);

        // Create Supabase user
        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: {
                tier,
                stripe_customer_id: session.customer
            }
        });

        if (signUpError) {
            console.error('Error creating user:', signUpError);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        if (authData?.user) {
            // Create usage record
            const { error: usageError } = await supabase
                .from('user_usage')
                .insert({
                    user_id: authData.user.id,
                    subscription_tier: tier,
                    tokens_used: 0,
                    tokens_limit: tierLimits[tier],
                    period_start: new Date().toISOString(),
                    period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                });

            if (usageError) {
                console.error('Error creating usage:', usageError);
            } else {
                console.log('User and usage created successfully for:', customerEmail);
            }
        }
    }

    res.status(200).json({ received: true });
}