import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceId, userId, email } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            success_url: `${process.env.NEXT_PUBLIC_URL || 'https://yourdomain.com'}/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://yourdomain.com'}/?canceled=true`,
            customer_email: email,
            metadata: {
                userId: userId
            }
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({ error: error.message });
    }
}