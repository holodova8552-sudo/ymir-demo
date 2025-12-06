import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Shop() {
  const { data: me } = useSWR("/api/auth/me", fetcher);
  const { data } = useSWR("/api/shop/items", fetcher);

  async function buy(itemId: string) {
    const res = await fetch("/api/shop/buy", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ itemId }) });
    const j = await res.json();
    if (res.ok) {
      alert("Bought!");
      location.reload();
    } else {
      alert(j.message || "Error");
    }
  }

  if (!me) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>Shop</h2>
      <div>Your balance: {me.user.balance} gold</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 12 }}>
        {data?.items?.map((it: any) => (
          <div key={it.id} style={{ background: "rgba(0,0,0,0.4)", padding: 8, borderRadius: 6 }}>
            <img src={it.image} alt={it.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
            <div style={{ marginTop: 6 }}>
              <div><strong>{it.name}</strong></div>
              <div>{it.price} gold</div>
              <button onClick={() => buy(it.id)} style={{ marginTop: 6 }}>Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
