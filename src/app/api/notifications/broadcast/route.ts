import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { district, level, message, targetPhone } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Broadcast message is required" }, { status: 400 });
    }

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    let twilioResult: any = null;
    let deliveryMode = "simulated_cell_broadcast";

    // If real Twilio credentials are configured and a target phone is provided, send actual SMS!
    if (twilioSid && twilioToken && twilioFrom && targetPhone) {
      try {
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
        const bodyParams = new URLSearchParams({
          To: targetPhone,
          From: twilioFrom,
          Body: `[PRANRAKSHA AI - ${level?.toUpperCase() || "ALERT"}] ${message}`,
        });

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        });

        const data = await res.json();
        if (res.ok) {
          twilioResult = {
            status: "delivered",
            sid: data.sid,
            to: targetPhone,
          };
          deliveryMode = "twilio_live_sms";
        } else {
          twilioResult = {
            status: "twilio_api_response",
            error: data.message || "Failed to deliver via Twilio",
            code: data.code,
          };
        }
      } catch (err: any) {
        twilioResult = { status: "network_error", error: err.message };
      }
    }

    const broadcastId = `notif-${Date.now()}`;
    const recipientsEstimate = district === "All Tripura Districts" ? "420,000 devices" : "52,400 devices";

    return NextResponse.json({
      success: true,
      broadcastId,
      district: district || "West Tripura (Agartala)",
      level: level || "extreme",
      message,
      deliveryMode,
      recipients: recipientsEstimate,
      twilioResult,
      sentAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
