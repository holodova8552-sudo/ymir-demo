import useSWR from "swr";
import axios from "axios";
import { useState } from "react";

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function Shop() {
  const { data: me } = useSWR("/api/auth/me", fetcher);
  const { data } = useSWR("/api/shop/items", fetcher);
  const [loading, setLoading] = useState(false);

  async function buy(itemId: string) {
    setLoading(true);
    try {
      await axios.post("/api/shop/buy", { itemId });
      alert("Bought!");
      location.reload();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  }

  if (!me) return <div className="card">Loading...</div>;
  return (
    <div className="card">
      <h2 className="text-2xl mb-4">Shop</h2>
      <div>Your balance: {me.user.balance} gold</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {data?.items?.map((it: any) => (
          <div key={it.id} className="p-3 bg-black bg-opacity-30 rounded">
            <img src={it.image || "/images/shop/placeholder.png"} alt={it.name} className="h-32 w-full object-cover" />
            <div className="mt-2">
              <strong>{it.name}</strong>
              <div>{it.price} gold</div>
              <button disabled={loading} onClick={() => buy(it.id)} className="mt-2 bg-yellow-500 px-3 py-1 rounded">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
