import { createClient } from "@supabase/supabase-js";

function authorize(req: any): boolean {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Basic ")) return false;
  const decoded = Buffer.from(auth.split(" ")[1], "base64").toString();
  const [user, pass] = decoded.split(":");
  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req: any, res: any) {
  if (!authorize(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("mentors")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "id is required" });

    const { error } = await supabase
      .from("mentors")
      .delete()
      .eq("id", Number(id));

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
