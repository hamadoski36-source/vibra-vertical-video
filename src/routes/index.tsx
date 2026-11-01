"use client";
import { useState, useEffect } from "react";

export default function VibraFixed() {
  const [isLive, setIsLive] = useState(false);
  const [dp, setDp] = useState("https://via.placeholder.com/150");
  const [coins, setCoins] = useState(0);

  // Load DP
  useEffect(() => {
    const saved = localStorage.getItem("vibra_dp");
    if (saved) setDp(saved);
    const savedCoins = localStorage.getItem("vibra_coins");
    if (savedCoins) setCoins(parseInt(savedCoins));
  }, []);

  // 1. FIX SHARE - Sio picha tena
  const handleShare = async () => {
    const link = window.location.href;
    const text = `VIBRA WORLDWIDE 🌍 - Tazama video yangu! ${link} #vibra #mombasa`;
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Link copied! Tuma WhatsApp sasa!");
      if (navigator.share) {
        await navigator.share({ title: "VIBRA", text, url: link });
      }
    } catch {
      prompt("Copy link hii utume WhatsApp:", text);
    }
  };

  // 2. FIX LIVE
  const handleLive = () => {
    if (!isLive) {
      if (confirm("🔴 Anza LIVE kwa Mombasa Worldwide?")) {
        setIsLive(true);
        alert("🔴 Uko LIVE sasa! Watu 1.2K wanaona!");
      }
    } else {
      if (confirm("Maliza LIVE?")) {
        setIsLive(false);
        alert("Live imeisha - Safi sana!");
      }
    }
  };

  // 3. FIX DP
  const handleDpChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      setDp(ev.target.result);
      localStorage.setItem("vibra_dp", ev.target.result);
      alert("✅ DP imewekwa!");
    };
    reader.readAsDataURL(file);
  };

  const claimCoins = () => {
    const newCoins = coins + 8;
    setCoins(newCoins);
    localStorage.setItem("vibra_coins", newCoins.toString());
    alert("🎉 Umeclaim 8 Coins! Total: " + newCoins);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* TOP BAR */}
      <div className="fixed top-0 w-full flex justify-between p-3 z-50 bg-black/80">
        {/* LIVE BUTTON - HAPA NDIPO LIVE INARUDI */}
        <button
          onClick={handleLive}
          className={`px-4 py-1 rounded-full font-bold text-sm ${
            isLive ? "bg-red-600 animate-pulse" : "bg-red-600"
          }`}
        >
          {isLive ? "🔴 LIVE • 1.2K" : "🔴 LIVE"}
        </button>
        
        <div className="flex gap-2">
          <span className="text-yellow-400 font-bold">{coins} Coins</span>
          <button className="text-xs border px-2 rounded">Sound on</button>
        </div>
      </div>

      {/* VIDEO FEED - 8 Videos */}
      <div className="pt-16 pb-20">
        <div className="text-center py-10">
          <h1 className="text-3xl font-bold text-yellow-400">VIBRA WORLDWIDE 🌍</h1>
          <p>Mombasa Support Vibra - 8 Videos</p>
        </div>

        {/* Me Page - DP HAPA */}
        <div className="flex flex-col items-center p-5 border-t border-gray-800">
          <input type="file" id="dpInput" accept="image/*" hidden onChange={handleDpChange} />
          <img
            src={dp}
            onClick={() => document.getElementById("dpInput")?.click()}
            className="w-24 h-24 rounded-full border-4 border-yellow-400 cursor-pointer object-cover"
          />
          <p className="text-xs mt-2 text-gray-400">Bonyeza picha kuweka DP yako</p>
          <h2 className="font-bold mt-2">@MrVibra</h2>
          <p className="text-sm text-gray-400">8 Videos • {coins} Coins</p>
          
          <div className="grid grid-cols-3 gap-2 mt-5 w-full max-w-sm">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-gray-800 h-32 rounded flex items-center justify-center text-xs">
                Video {i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR - SHARE HAPA SIO PICHA TENA */}
      <div className="fixed bottom-0 w-full bg-black border-t border-gray-800 p-3 flex justify-around">
        <button>🏠 Home</button>
        <button>🔍 Discover</button>
        <button onClick={handleShare} className="bg-white text-black px-4 py-1 rounded-full font-bold">
          ↗️ Share
        </button>
        <button onClick={claimCoins} className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
          8 Coins
        </button>
        <button>👤 Me</button>
      </div>
    </div>
  );
}
