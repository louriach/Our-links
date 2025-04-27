module.exports = {

"[project]/.next-internal/server/app/api/auth/generate-code/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/lib/email.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "sendVerificationEmail": (()=>sendVerificationEmail)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
;
if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
}
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY);
async function sendVerificationEmail(email, code) {
    console.log('Attempting to send email to:', email);
    try {
        console.log('Creating email with Resend...');
        const { data, error } = await resend.emails.send({
            from: 'LinkShare <onboarding@resend.dev>',
            to: email,
            subject: 'Your verification code for LinkShare',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; text-align: center;">Your verification code</h1>
          <p style="color: #444; font-size: 16px;">Here's your verification code for LinkShare:</p>
          <div style="background: #f4f4f4; padding: 16px; border-radius: 4px; text-align: center; font-size: 24px; font-weight: bold; margin: 16px 0;">
            ${code}
          </div>
          <p style="color: #444; font-size: 16px;">This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `
        });
        if (error) {
            console.error('Resend API error:', error);
            throw error;
        }
        console.log('Resend API response:', data);
        return data;
    } catch (error) {
        console.error('Error in sendVerificationEmail:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
        throw error;
    }
}
}}),
"[project]/app/api/auth/generate-code/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$auth$2d$helpers$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/auth-helpers-nextjs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/email.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(request) {
    try {
        console.log('Generate code API called');
        const { email } = await request.json();
        console.log('Email received:', email);
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$auth$2d$helpers$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRouteHandlerClient"])({
            cookies: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"]
        });
        // Check rate limits
        console.log('Checking rate limits...');
        const { data: rateLimit, error: rateLimitError } = await supabase.from('email_rate_limits').select('*').eq('email', email).single();
        if (rateLimitError && rateLimitError.code !== 'PGRST116') {
            console.error('Error checking rate limits:', rateLimitError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: rateLimitError.message
            }, {
                status: 500
            });
        }
        const now = new Date();
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        // Update or create rate limit record
        console.log('Updating rate limit record...');
        const { error: upsertError } = await supabase.from('email_rate_limits').upsert({
            email,
            last_code_sent_at: now.toISOString(),
            codes_sent_in_last_hour: rateLimit ? new Date(rateLimit.last_reset_at) < hourAgo ? 1 : rateLimit.codes_sent_in_last_hour + 1 : 1,
            last_reset_at: rateLimit && new Date(rateLimit.last_reset_at) < hourAgo ? now.toISOString() : rateLimit?.last_reset_at || now.toISOString()
        }, {
            onConflict: 'email'
        });
        if (upsertError) {
            console.error('Error upserting rate limit:', upsertError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: upsertError.message
            }, {
                status: 500
            });
        }
        // Check if we've hit the rate limit
        if (rateLimit) {
            if (new Date(rateLimit.last_reset_at) < hourAgo) {
                console.log('Rate limit was reset');
            } else if (rateLimit.codes_sent_in_last_hour >= 5) {
                console.log('Rate limit exceeded');
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Too many code requests. Please wait before requesting another code.'
                }, {
                    status: 429
                });
            }
        }
        // Check active codes
        console.log('Checking active codes...');
        const { data: activeCodes, error: activeCodesError } = await supabase.from('email_codes').select('*').eq('email', email).eq('used', false).gt('expires_at', now.toISOString());
        if (activeCodesError) {
            console.error('Error checking active codes:', activeCodesError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: activeCodesError.message
            }, {
                status: 500
            });
        }
        if (activeCodes && activeCodes.length >= 3) {
            console.log('Too many active codes');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'You have too many active codes. Please use an existing code or wait for it to expire.'
            }, {
                status: 429
            });
        }
        // Generate and insert the new code
        console.log('Generating new code...');
        const code = generateRandomCode(12);
        const { error: insertError } = await supabase.from('email_codes').insert({
            email,
            code,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes from now
        });
        if (insertError) {
            console.error('Error inserting code:', insertError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: insertError.message
            }, {
                status: 500
            });
        }
        // Send the code via email
        try {
            console.log('Attempting to send email...');
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendVerificationEmail"])(email, code);
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            if (emailError instanceof Error) {
                console.error('Email error details:', {
                    name: emailError.name,
                    message: emailError.message,
                    stack: emailError.stack
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to send email'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Error in generate-code API:', error);
        if (error instanceof Error) {
            console.error('API error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Failed to generate code'
        }, {
            status: 500
        });
    }
}
function generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for(let i = 0; i < length; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__3e276b7d._.js.map