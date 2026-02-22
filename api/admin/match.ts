import { createClient } from "@supabase/supabase-js";

const VALID_STATUSES = ["unmatched", "matched", "confirmed"];

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith("Basic ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = Buffer.from(auth.split(" ")[1], "base64").toString();
  const [user, pass] = decoded.split(":");

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { submission_id, status, mentor_id } = req.body;

  if (!submission_id || !status) {
    return res.status(400).json({ error: "submission_id and status are required" });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  // Build the update payload based on the target status
  const update: Record<string, any> = { status };

  if (status === "matched") {
    if (!mentor_id) {
      return res.status(400).json({ error: "mentor_id is required when setting status to matched" });
    }
    update.mentor_id = Number(mentor_id);
  } else if (status === "unmatched") {
    // Moving back to unmatched clears the mentor assignment
    update.mentor_id = null;
  }
  // "confirmed" keeps the existing mentor_id

  const { data, error } = await supabase
    .from("submissions")
    .update(update)
    .eq("id", Number(submission_id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
