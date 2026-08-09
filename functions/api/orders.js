import { json, bad, requireRole, readJson, cleanText, cleanMediaUrl } from "./_utils.js";

function rowToOrder(row) {
    let obj = {};
    try { obj = JSON.parse(row.data) || {}; } catch (e) { obj = {}; }
    obj.id = row.id;
    obj.status = row.status;
    obj.createdAt = row.created_at;
    return obj;
}
function newId() { return "o_" + crypto.randomUUID().replace(/-/g, ""); }

function cleanNumber(value, max = 1000000) {
    return Math.max(0, Math.min(max, Number(value) || 0));
}

function cleanItem(item) {
    const data = item && typeof item === "object" ? item : {};
    const qty = Math.max(1, Math.min(99, parseInt(data.qty, 10) || 1));
    if (data.type === "custom_package") {
        return {
            type: "custom_package",
            packageId: cleanText(data.packageId, 100),
            name: cleanText(data.name, 160),
            qty,
            wrapperColor: cleanText(data.wrapperColor, 40),
            notes: cleanText(data.notes, 500),
            delivery: data.delivery === "delivery" ? "delivery" : "pickup",
            customerName: cleanText(data.customerName, 120),
            customerPhone: cleanText(data.customerPhone, 30).replace(/\D/g, ""),
            customerLocation: cleanText(data.customerLocation, 300),
            sets: Array.isArray(data.sets) ? data.sets.slice(0, 20).map((set) => ({
                chocolateType: cleanText(set && set.chocolateType, 50),
                filling: cleanText(set && set.filling, 50),
                qty: Math.max(1, Math.min(99, parseInt(set && set.qty, 10) || 1))
            })) : [],
            pricePending: true,
            lineTotal: null
        };
    }
    return {
        productId: cleanText(data.productId, 100),
        name: cleanText(data.name, 160),
        brand: cleanText(data.brand, 100),
        image: cleanMediaUrl(data.image),
        sizeIdx: Math.max(0, Math.min(100, parseInt(data.sizeIdx, 10) || 0)),
        sizeLabel: cleanText(data.sizeLabel, 100),
        qty,
        price: cleanNumber(data.price),
        lineTotal: cleanNumber(data.lineTotal)
    };
}

function cleanOrder(body) {
    const items = Array.isArray(body.items) ? body.items.slice(0, 50).map(cleanItem) : [];
    return {
        items,
        customerName: cleanText(body.customerName, 120),
        customerPhone: cleanText(body.customerPhone, 30).replace(/\D/g, ""),
        address: cleanText(body.address, 400),
        notes: cleanText(body.notes, 800),
        delivery: body.delivery === "delivery" ? "delivery" : "pickup",
        region: ["westbank", "jerusalem", "inside", "pickup"].includes(body.region) ? body.region : "pickup",
        deliveryCost: cleanNumber(body.deliveryCost, 1000),
        subtotal: cleanNumber(body.subtotal),
        total: cleanNumber(body.total),
        totalDisplay: cleanText(body.totalDisplay, 100),
        pricingPending: body.pricingPending === true,
        date: new Date().toISOString()
    };
}

// GET /api/orders        -> list, any authenticated user (admin or worker)
// GET /api/orders?id=... -> public lookup by a cryptographically random id.
export async function onRequestGet(context) {
    const id = new URL(context.request.url).searchParams.get("id");
    if (id) {
        if (!/^o_[a-f0-9]{32}$/.test(id)) return bad(400, "invalid id");
        const row = await context.env.DB
            .prepare("SELECT id, data, status, created_at FROM orders WHERE id = ?")
            .bind(id)
            .first();
        if (!row) return json({ order: null }, 404);
        return json({ order: rowToOrder(row) });
    }
    const gate = await requireRole(context.request, context.env, null);
    if (gate.error) return gate.error;
    const { results } = await context.env.DB
        .prepare("SELECT id, data, status, created_at FROM orders ORDER BY created_at DESC")
        .all();
    return json({ orders: (results || []).map(rowToOrder) });
}

// POST /api/orders -> PUBLIC (checkout). Stores the order; returns its id.
export async function onRequestPost(context) {
    const body = await readJson(context.request);
    if (!body || typeof body !== "object") return bad(400, "invalid body");
    const id = newId();
    const status = "new";
    const data = cleanOrder(body);
    if (!data.customerName || data.customerPhone.length < 7 || !data.items.length) return bad(400, "invalid order");
    const now = Date.now();
    const recent = await context.env.DB
        .prepare("SELECT COUNT(*) AS c FROM orders WHERE created_at > ? AND json_extract(data, '$.customerPhone') = ?")
        .bind(now - 60000, data.customerPhone)
        .first();
    if (recent && Number(recent.c) >= 3) return bad(429, "too many orders");
    await context.env.DB
        .prepare("INSERT INTO orders (id, data, status, created_at) VALUES (?, ?, ?, ?)")
        .bind(id, JSON.stringify(data), status, now)
        .run();
    return json({ id, order: { ...data, id, status, createdAt: now } });
}

// PATCH /api/orders?id=...  body { status } -> any authenticated user
export async function onRequestPatch(context) {
    const gate = await requireRole(context.request, context.env, null);
    if (gate.error) return gate.error;
    const id = new URL(context.request.url).searchParams.get("id");
    if (!id || !/^o_[a-f0-9]{32}$/.test(id)) return bad(400, "invalid id");
    const body = await readJson(context.request);
    if (!body || !["new", "processing", "completed", "cancelled"].includes(body.status)) return bad(400, "invalid status");
    await context.env.DB
        .prepare("UPDATE orders SET status = ? WHERE id = ?")
        .bind(String(body.status), id)
        .run();
    return json({ ok: true });
}

// DELETE /api/orders?id=... -> admin only
export async function onRequestDelete(context) {
    const gate = await requireRole(context.request, context.env, "admin");
    if (gate.error) return gate.error;
    const id = new URL(context.request.url).searchParams.get("id");
    if (!id || !/^o_[a-f0-9]{32}$/.test(id)) return bad(400, "invalid id");
    await context.env.DB.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
    return json({ ok: true });
}
