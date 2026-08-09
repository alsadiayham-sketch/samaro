import { json, bad, requireRole, readJson, cleanText, cleanId, cleanMediaUrl } from "./_utils.js";

function rowToHero(row) {
    let obj = {};
    try { obj = JSON.parse(row.data) || {}; } catch (e) { obj = {}; }
    obj.id = row.id;
    return obj;
}
function newId() { return "h_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// GET /api/hero -> public (storefront hero slides)
export async function onRequestGet(context) {
    const { results } = await context.env.DB
        .prepare("SELECT id, data FROM hero ORDER BY ord ASC")
        .all();
    return json({ hero: (results || []).map(rowToHero) });
}

// POST /api/hero -> admin (upsert a slide; body may include ord)
export async function onRequestPost(context) {
    const gate = await requireRole(context.request, context.env, "admin");
    if (gate.error) return gate.error;
    const body = await readJson(context.request);
    if (!body || typeof body !== "object") return bad(400, "invalid body");
    const id = cleanId(body.id, newId());
    const ord = Number(body.ord != null ? body.ord : (body.order != null ? body.order : 0));
    const data = {
        url: cleanMediaUrl(body.url),
        type: body.type === "video" ? "video" : "image",
        title: cleanText(body.title, 180),
        subtitle: cleanText(body.subtitle, 300),
        order: Math.max(0, Math.min(1000, ord || 0))
    };
    if (!data.url) return bad(400, "invalid media url");
    await context.env.DB
        .prepare("INSERT INTO hero (id, data, ord) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, ord = excluded.ord")
        .bind(id, JSON.stringify(data), ord)
        .run();
    return json({ id, slide: { ...data, id } });
}

// DELETE /api/hero?id=... -> admin
export async function onRequestDelete(context) {
    const gate = await requireRole(context.request, context.env, "admin");
    if (gate.error) return gate.error;
    const id = new URL(context.request.url).searchParams.get("id");
    if (!id) return bad(400, "missing id");
    await context.env.DB.prepare("DELETE FROM hero WHERE id = ?").bind(id).run();
    return json({ ok: true });
}
