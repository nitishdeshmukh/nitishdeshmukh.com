async function run() {
  // 1. Submit message
  console.log("Submitting message...");
  const postRes = await fetch("http://localhost:8787/api/guestbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Nitish", message: "This is a real-time message!" })
  });
  const msg = await postRes.json();
  console.log("Submitted:", msg);

  // 2. Approve message
  console.log("Approving message ID:", msg.id);
  const putRes = await fetch(`http://localhost:8787/api/admin/guestbook/${msg.id}/approve`, {
    method: "PUT",
    headers: { "X-API-Key": "test" } // as in .dev.vars
  });
  const approved = await putRes.json();
  console.log("Approved:", approved);
}
run();
