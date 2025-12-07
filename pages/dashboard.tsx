import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function Dashboard() {
  const { data, error } = useSWR("/api/auth/me", fetcher);

  if (error) return <div className="card">Error loading</div>;
  if (!data) return <div className="card">Loading...</div>;

  const user = data.user;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card col-span-1">
        <img src={user.pfpUrl || "/images/default-pfp.png"} alt="pfp" className="h-24 w-24 rounded-full" />
        <h2 className="text-xl">{user.username}</h2>
        <p>Phone: {user.phone}</p>
        <p>Balance: {user.balance} gold</p>
        <p>Level: {user.level} (XP: {user.xp})</p>
      </div>

      <div className="card col-span-2">
        <h3 className="text-lg mb-2">Cards ({user.cards.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {user.cards.map((c: any) => (
            <div key={c.id} className="bg-black bg-opacity-30 p-2 rounded">
              {/* placeholder for card image*/}
              <img src={`/images/cards/${c.name.replace(/\s+/g,'_')}.png`} alt={c.name} className="h-20 w-full object-contain" />
              <div className="mt-1">{c.name}</div>
              <div className="text-xs text-gray-200">{c.rarity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
