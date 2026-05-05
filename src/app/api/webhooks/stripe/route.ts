import { NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/services/stripe";
import { paymentStore } from "@/lib/stores";

/**
 * Stripe Webhook handler — processes payment lifecycle events.
 * Verifies webhook signature, then updates internal payment records.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const event = await constructWebhookEvent(body, signature);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const paymentId = session.metadata?.paymentId;
        if (paymentId) {
          const payment = await paymentStore.findById(paymentId);
          if (payment) {
            await paymentStore.update(paymentId, { status: "completed" });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentId = paymentIntent.metadata?.paymentId;
        if (paymentId) {
          await paymentStore.update(paymentId, { status: "failed" });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const paymentId = charge.metadata?.paymentId;
        if (paymentId) {
          await paymentStore.update(paymentId, { status: "refunded" });
        }
        break;
      }

      case "account.updated": {
        // Stripe Connect account status change — log for monitoring
        console.info(`Stripe Connect account updated: ${event.data.object.id}`);
        break;
      }

      default:
        // Unhandled event type — log but don't fail
        console.info(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
