import { json, bad, requireRole, readJson, cleanText, cleanLinkUrl } from "./_utils.js";

const KEY = "config";

// GET /api/settings -> public (whatsapp number, hero text, about, links...)
export async function onRequestGet(context) {
    const row = await context.env.DB
        .prepare("SELECT data FROM settings WHERE key = ?")
        .bind(KEY)
        .first();
    let data = {};
    if (row) { try { data = JSON.parse(row.data) || {}; } catch (e) { data = {}; } }
    return json({ settings: data });
}

// POST /api/settings -> admin (replace settings object)
export async function onRequestPost(context) {
    const gate = await requireRole(context.request, context.env, "admin");
    if (gate.error) return gate.error;
    const body = await readJson(context.request);
    if (!body || typeof body !== "object") return bad(400, "invalid body");
    const data = {
        whatsappNumber: cleanText(body.whatsappNumber, 30).replace(/\D/g, ""),
        heroSubtitle: cleanText(body.heroSubtitle, 240),
        aboutText: cleanText(body.aboutText, 1600),
        instagramLink: cleanLinkUrl(body.instagramLink),
        tiktokLink: cleanLinkUrl(body.tiktokLink)
    };
    await context.env.DB
        .prepare("INSERT INTO settings (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data")
        .bind(KEY, JSON.stringify(data))
        .run();
    return json({ settings: data });
}
