import { getDb, getUserFromRequest } from "./db.js";

function mapNote(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let user;
  try {
    user = await getUserFromRequest(req);
  } catch {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const sql = getDb();

  try {
    // GET /api/notes
    if (req.method === "GET") {
      const notes = await sql`
        SELECT id, title, content, tags, created_at, updated_at
        FROM notes
        WHERE user_id = ${user.id}
        ORDER BY updated_at DESC
      `;

      return res.status(200).json(notes.map(mapNote));
    }

    // POST /api/notes
    if (req.method === "POST") {
      const { title = "Untitled", content = "", tags = [] } = req.body;

      const result = await sql`
        INSERT INTO notes (user_id, title, content, tags)
        VALUES (${user.id}, ${title}, ${content}, ${tags})
        RETURNING id, title, content, tags, created_at, updated_at
      `;

      return res.status(201).json(mapNote(result[0]));
    }

    // PUT /api/notes
    if (req.method === "PUT") {
      const { id, title, content, tags } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Note id is required" });
      }

      const result = await sql`
        UPDATE notes
        SET
          title = COALESCE(${title ?? null}, title),
          content = COALESCE(${content ?? null}, content),
          tags = COALESCE(${tags ?? null}, tags),
          updated_at = NOW()
        WHERE id = ${id} AND user_id = ${user.id}
        RETURNING id, title, content, tags, created_at, updated_at
      `;

      if (result.length === 0) {
        return res.status(404).json({ error: "Note not found" });
      }

      return res.status(200).json(mapNote(result[0]));
    }

    // DELETE /api/notes?id=X
    if (req.method === "DELETE") {
      const id = req.query?.id;

      if (!id) {
        return res.status(400).json({ error: "Note id is required" });
      }

      await sql`
        DELETE FROM notes WHERE id = ${id} AND user_id = ${user.id}
      `;

      return res.status(200).json({ message: "Note deleted" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
