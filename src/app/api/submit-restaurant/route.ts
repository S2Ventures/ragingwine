import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { restaurantName, city, reason, contactName, contactEmail } = body;

    // Validation
    if (!restaurantName || !city || !reason || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from('restaurant_submissions').insert({
      restaurant_name: restaurantName.trim(),
      city: city.trim(),
      reason: reason.trim(),
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim().toLowerCase(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    // Send notification email via Resend (optional)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Raging Wine <notifications@ragingwine.com>',
            to: 'hello@ragingwine.com',
            subject: `Restaurant Submission: ${restaurantName} (${city})`,
            html: `
              <h2>Restaurant Wants a Vibe-Check</h2>
              <p><strong>Restaurant:</strong> ${restaurantName}</p>
              <p><strong>City:</strong> ${city}</p>
              <p><strong>Why we should review them:</strong> ${reason}</p>
              <hr />
              <p><strong>Contact:</strong> ${contactName}</p>
              <p><strong>Email:</strong> ${contactEmail}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Email notification failed (non-blocking):', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Submit-restaurant route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
