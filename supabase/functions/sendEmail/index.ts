import { corsHeaders } from "../_shared/cors.ts";
import { jsonResponse, parseJsonBody } from "../_shared/response.ts";
import { serializeError } from "../_shared/errors.ts";

// ── Types ─────────────────────────────────────────────────────────────────

interface SendEmailRequest {
  to: string;
  from: string;
  subject: string;
  message: string;
  replyTo?: string; // ← optional: if omitted, Resend defaults to no reply-to header
}

interface ResendErrorResponse {
  statusCode: number;
  message: string;
  name: string;
}

interface ResendSuccessResponse {
  id: string;
}

// ── Logger ────────────────────────────────────────────────────────────────

const logger = {
  info: (msg: string, data?: unknown) =>
    data !== undefined
      ? console.log(`[sendEmail] ${msg}`, JSON.stringify(data))
      : console.log(`[sendEmail] ${msg}`),

  warn: (msg: string, data?: unknown) =>
    data !== undefined
      ? console.warn(`[sendEmail] ${msg}`, JSON.stringify(data))
      : console.warn(`[sendEmail] ${msg}`),

  error: (msg: string, data?: unknown) =>
    data !== undefined
      ? console.error(`[sendEmail] ${msg}`, JSON.stringify(data))
      : console.error(`[sendEmail] ${msg}`),
};

// ── Handler ───────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  logger.info("Function invoked", { method: req.method, url: req.url });

  if (req.method === "OPTIONS") {
    logger.info("CORS preflight request — responding with headers");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── Read API key ──────────────────────────────────────────────────────

    logger.info("Checking for VITE_RESEND_API_KEY environment variable");
    const resendApiKey = Deno.env.get("VITE_RESEND_API_KEY");

    if (!resendApiKey) {
      logger.error("VITE_RESEND_API_KEY is not set — cannot proceed");
      return jsonResponse(
        { data: null, error: { message: "Missing environment variable: VITE_RESEND_API_KEY" } },
        500
      );
    }

    logger.info("VITE_RESEND_API_KEY found");

    // ── Parse & validate input ────────────────────────────────────────────

    logger.info("Parsing request body");
    const body = await parseJsonBody<SendEmailRequest>(req);
    logger.info("Request body parsed successfully");

    const { to, from, subject, message, replyTo } = body;

    logger.info("Validating request fields");

    if (!to || typeof to !== "string") {
      logger.warn("Validation failed: missing or invalid field", { field: "to", received: to });
      return jsonResponse({ data: null, error: { message: "Missing or invalid field: to" } }, 400);
    }
    if (!from || typeof from !== "string") {
      logger.warn("Validation failed: missing or invalid field", { field: "from", received: from });
      return jsonResponse({ data: null, error: { message: "Missing or invalid field: from" } }, 400);
    }
    if (!subject || typeof subject !== "string") {
      logger.warn("Validation failed: missing or invalid field", { field: "subject", received: subject });
      return jsonResponse({ data: null, error: { message: "Missing or invalid field: subject" } }, 400);
    }
    if (!message || typeof message !== "string") {
      logger.warn("Validation failed: missing or invalid field", { field: "message", received: message });
      return jsonResponse({ data: null, error: { message: "Missing or invalid field: message" } }, 400);
    }

    // WHY: replyTo is optional so we only validate its type if it was actually
    // provided. An empty string is treated as not provided rather than an error,
    // since callers may pass replyTo: "" to mean "no reply-to".
    if (replyTo !== undefined && replyTo !== "" && typeof replyTo !== "string") {
      logger.warn("Validation failed: invalid field", { field: "replyTo", received: replyTo });
      return jsonResponse({ data: null, error: { message: "Invalid field: replyTo (must be a string)" } }, 400);
    }

    const resolvedReplyTo = replyTo && replyTo.trim() !== "" ? replyTo : undefined;

    logger.info("All fields validated successfully", {
      to,
      from,
      subject,
      replyTo: resolvedReplyTo ?? "not set",
    });

    // ── Call Resend API ───────────────────────────────────────────────────

    logger.info("Sending request to Resend API", {
      to,
      from,
      subject,
      replyTo: resolvedReplyTo ?? "not set",
    });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text: message,
        // WHY: Only include reply_to in the Resend payload if it was actually
        // provided. Sending reply_to: undefined would serialize as nothing in
        // JSON anyway, but being explicit avoids confusion.
        ...(resolvedReplyTo && { reply_to: resolvedReplyTo }),
      }),
    });

    logger.info("Received response from Resend API", { status: res.status, ok: res.ok });

    const resendData = await res.json();

    // ── Handle Resend error response ──────────────────────────────────────

    if (!res.ok) {
      const resendError = resendData as ResendErrorResponse;
      logger.error("Resend API returned an error", {
        statusCode: resendError.statusCode,
        name: resendError.name,
        message: resendError.message,
      });
      return jsonResponse(
        {
          data: null,
          error: {
            message: resendError.message,
            status: resendError.statusCode,
            name: resendError.name,
          },
        },
        res.status
      );
    }

    const successData = resendData as ResendSuccessResponse;
    logger.info("Email sent successfully", {
      resendEmailId: successData.id,
      to,
      from,
      subject,
      replyTo: resolvedReplyTo ?? "not set",
    });

    return jsonResponse({ data: { id: successData.id }, error: null }, 200);

  } catch (err: unknown) {
    const serialized = serializeError(err);
    logger.error("Unhandled exception caught", serialized);
    return jsonResponse({ data: null, error: serialized }, 500);
  }
});