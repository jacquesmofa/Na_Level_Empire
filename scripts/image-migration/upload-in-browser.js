/**
 * One-time image move, run in a browser that can reach api.cloudinary.com
 * (no API secret needed). Call: await uploadAll(PLAN) with PLAN = plan.json.
 * Cloudinary downloads each image from its current address and stores it
 * under the given public ID (all start with "nlem/"). Save the returned array
 * as results.json, then run: node scripts/migrate-images.ts apply results.json
 */
async function uploadAll(PLAN, { cloud = 'beavj5sp', preset = 'nlem_migration' } = {}) {
  const results = [];
  for (const item of PLAN) {
    const body = new FormData();
    body.append('file', item.url);
    body.append('upload_preset', preset);
    body.append('public_id', item.publicId);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
      const data = await res.json();
      results.push(
        res.ok
          ? { url: item.url, secure_url: data.secure_url, public_id: data.public_id, width: data.width, height: data.height }
          : { url: item.url, error: data.error?.message ?? String(res.status) },
      );
    } catch (e) {
      results.push({ url: item.url, error: String(e) });
    }
  }
  return results;
}
