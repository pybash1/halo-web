import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: existingUser } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "You are already on the waitlist!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error: "Failed to save email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      await resend.emails.send({
        from: "Halo <ananjan@pybash.xyz>",
        to: [email],
        subject: "Welcome to the Halo Waitlist!",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #000; margin-bottom: 20px;">Welcome to Halo!</h2>
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              Thanks for joining our waitlist. We're building something special to make every journey home safe and worry-free.
            </p>
            <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
              You'll be among the first to know when Halo launches. Stay tuned for updates!
            </p>
            <p style="color: #333; line-height: 1.6;">
              Best,<br>
              The Halo Team
            </p>
          </div>
        `,
        text: `Welcome to Halo!
Thanks for joining our waitlist. We're building something special to make every journey home safe and worry-free.

You'll be among the first to know when Halo launches. Stay tuned for updates!

Best,
The Halo Team`,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const prerender = false;
