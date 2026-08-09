import { json, bad, requireRole, readJson, cleanText, cleanId, cleanMediaUrl } from "./_utils.js";

function rowToProduct(row) {
    let obj = {};
    try { obj = JSON.parse(row.data) || {}; } catch (e) { obj = {}; }
    obj.id = row.id;
    return obj;
}

function newId() { return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// GET /api/products  -> public
export async function onRequestGet(context) {
    const { results } = await context.env.DB
        .prepare("SELECT id, data FROM products ORDER BY updated_at DESC")
        .all();
    return json({ products: (results || []).map(rowToProduct) });
}

// POST /api/products  -> admin. Upsert one product (body = product object).
export async function onRequestPost(context) {
    const gate = await requireRole(context.request, context.env, "admin");
    if (gate.error) return gate.error;

    const body = await readJson(context.request);
    if (!body || typeof body !== "object") return bad(400, "invalid body");

    const id = cleanId(body.id, newId());
    const sizes = Array.isArray(body.sizes) ? body.sizes.slice(0, 20).map((size) => ({
        size: cleanText(size && size.size, 80),
        unit: cleanText(size && size.unit, 20),
        price: Math.max(0, Math.min(100000, Number(size && size.price) || 0))
    })).filter((size) => size.size && size.price > 0) : [];
    const data = {
        name: cleanText(body.name, 160),
        brand: cleanText(body.brand, 100),
        category: cleanText(body.category, 100),
        description: cleanText(body.description, 1200),
        image: cleanMediaUrl(body.image),
        status: ["normal", "bestseller", "special", "soldout"].includes(body.status) ? body.status : "normal",
        inStock: body.inStock !== false,
        discount: Math.max(0, Math.min(99, Number(body.discount) || 0)),
        order: Math.max(0, Math.min(100000, Number(body.order) || 0)),
        sizes: sizes.length ? sizes : [{ size: "عبوة", unit: "", price: Math.max(0, Number(body.price) || 0) }]
    };
    if (!data.name || !data.category || !data.sizes[0].price) return bad(400, "invalid product");
    const now = Date.now();
    await context.env.DB
        .prepare("INSERT INTO products (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
        .bind(id, JSON.stringify(data), now)
        .run();
    return json({ id, product: { ...data, id } });
}

// DELETE /api/products?id=...  -> admin
export async function onRequestDelete(context) {
    const gate = await requireRole(context.request, context.env, "admin");
    if (gate.error) return gate.error;
    const id = new URL(context.request.url).searchParams.get("id");
    if (!id) return bad(400, "missing id");
    await context.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    return json({ ok: true });
}
