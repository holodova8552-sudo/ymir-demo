import useSWR from "swr";
import axios from "axios";
import { useState } from "react";

const fetcher = (url: string) => axios.get(url).then(r => r.data);

export default function Profile() {
  const { data } = useSWR("/api/auth/me", fetcher);
  const [pfpFile, setPfpFile] = useState<File | null>(null);

  if (!data) return <div className="card">Loading...</div>;

  async function uploadPfp(e: any) {
    e.preventDefault();
    if (!pfpFile) return alert("Pick a file");
    const fd = new FormData();
    fd.append("pfp", pfpFile);
    const res = await axios.post("/api/profile/upload-pfp", fd);
    alert("Uploaded");
    location.reload();
  }

  return (
    <div className="card max-w-xl mx-auto">
      <h2 className="text-2xl">Profile</h2>
      <img src={data.user.pfpUrl || "/images/default-pfp.png"} className="h-40 w-40 rounded-full" />
      <form onSubmit={uploadPfp} className="mt-3">
        <input type="file" onChange={(e) => setPfpFile(e.target.files?.[0] ?? null)} />
        <button className="bg-blue-600 px-3 py-1 rounded ml-2">Upload</button>
      </form>
      <p className="mt-3">Username: {data.user.username}</p>
    </div>
  );
}
