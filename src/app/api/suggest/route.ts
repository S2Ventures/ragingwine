import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      restaurantName, city, reason, submitterName, submitterEmail,
      listVariety, markupFairness, glasswareGrade, staffConfidence,
      specialsDeals, storageTemp,
    } = body;

    // Validation
    if (!restaurantName || !city || !reason || !submitterName || !submitterEmail) {
      return NextResponse.json(
        { error: 'All required fields must be filled in.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error } = await supabase.from('restaurant_suggestions').insert({
      restaurant_name: restaurantName.trim(),
      city: city.trim(),
      reason: reason.trim(),
      submitter_name: submitterName.trim(),
      submitter_email: submitterEmail.trim().toLowerCase(),
      list_variety: listVariety?.trim() || null,
      markup_fairness: markupFairness?.trim() || null,
      glassware_grade: glasswareGrade?.trim() || null,
      staff_confidence: staffConfidence?.trim() || null,
      specials_deals: specialsDeals?.trim() || null,
      storage_temp: storageTemp?.trim() || null,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    // Send notification email via Resend (optional, fails silently if not configured)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const metricsHtml = [
          listVariety && `<p><strong>List Variety:</strong> ${listVariety}</p>`,
          markupFairness && `<p><strong>Markup Fairness:</strong> ${markupFairness}</p>`,
          glasswareGrade && `<p><strong>Glassware Grade:</strong> ${glasswareGrade}</p>`,
          staffConfidence && `<p><strong>Staff Confidence:</strong> ${staffConfidence}</p>`,
          specialsDeals && `<p><strong>Specials & Deals:</strong> ${specialsDeals}</p>`,
          storageTemp && `<p><strong>Storage & Temp:</strong> ${storageTemp}</p>`,
        ].filter(Boolean).join('');

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Raging Wine <notifications@ragingwine.com>',
            to: 'hello@ragingwine.com',
            subject: `New Restaurant Suggestion: ${restaurantName} (${city})`,
            html: `
              <h2>New Restaurant Suggestion</h2>
              <p><strong>Restaurant:</strong> ${restaurantName}</p>
              <p><strong>City:</strong> ${city}</p>
              <p><strong>Why:</strong> ${reason}</p>
              ${metricsHtml ? `<h3>Wingman Metrics Observations</h3>${metricsHtml}` : ''}
              <hr />
              <p><strong>Submitted by:</strong> ${submitterName}</p>
              <p><strong>Email:</strong> ${submitterEmail}</p>
            `,
          }),
        });
      } catch (emailErr) {
        console.error('Email notification failed (non-blocking):', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Suggest route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
