import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Leaderboard() {
  const { data } = useSWR("/api/leaderboard", fetcher);
  if (!data) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>Leaderboards</h2>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3>Most Money</h3>
          <ol>
            {data.money.map((u: any) => <li key={u.id}>{u.username} — {u.balance} gold</li>)}
          </ol>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Most Cards</h3>
          <ol>
            {data.cards.map((u: any) => <li key={u.id}>{u.username} — {u.cardCount}</li>)}
          </ol>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Most XP</h3>
          <ol>
            {data.xp.map((u: any) => <li key={u.id}>{u.username} — {u.xp} xp</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}
