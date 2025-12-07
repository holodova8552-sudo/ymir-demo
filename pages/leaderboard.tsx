import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function Leaderboard() {
  const { data } = useSWR("/api/leaderboard", fetcher);
  if (!data) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2 className="text-2xl mb-4">Leaderboards</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>Most Money</h3>
          <ol>
            {data.money.map((u: any) => <li key={u.id}>{u.username} — {u.balance} gold</li>)}
          </ol>
        </div>
        <div>
          <h3>Most Cards</h3>
          <ol>
            {data.cards.map((u: any) => <li key={u.id}>{u.username} — {u.cardCount}</li>)}
          </ol>
        </div>
        <div>
          <h3>Most XP</h3>
          <ol>
            {data.xp.map((u: any) => <li key={u.id}>{u.username} — {u.xp} xp</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}
