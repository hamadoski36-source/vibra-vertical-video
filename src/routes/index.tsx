import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [clips, setClips] = useState<any[]>([]);

  useEffect(() => {
    const fetchClips = async () => {
      const { data } = await supabase.from("clips").select("*").order("created_at", { ascending: false });
      if (data) setClips(data);
    };
    fetchClips();
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* TOP - Search kama TikTok */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
          <input placeholder="Search..." className="bg-transparent w-full outline-none text-white placeholder:text-white/50 text-sm" />
        </div>
      </div>

      {/* VIDEO FEED */}
      <div className="h-full overflow-y-scroll snap-y snap-mandatory">
        {clips.length === 0 ? (
          <div className="h-screen flex items-center justify-center text-white">No videos yet - upload first video</div>
        ) : (
          clips.map((clip) => (
            <div key={clip.id} className="relative h-screen w-full snap-start bg-black">
              <video
                src={clip.video_url}
                className="h-full w-full object-cover"
                autoPlay
                loop
                playsInline
                muted
              />

              {/* RIGHT SIDE BUTTONS - ZOTE */}
              <div className="absolute right-2 bottom-28 flex flex-col items-center gap-4 z-20">
                {/* Profile H */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white">
                    {clip.username?.charAt(0)?.toUpperCase() || 'H'}
                  </div>
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center -mt-3 border-2 border-black">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>

                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <span className="text-[28px]">❤️</span>
                  </div>
                  <span className="text-white text-xs font-bold mt-1">650</span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <span className="text-[24px]">💬</span>
                  </div>
                  <span className="text-white text-xs font-bold mt-1">85</span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <span className="text-[20px]">🔖</span>
                  </div>
                  <span className="text-white text-xs font-bold mt-1">52</span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <span className="text-[20px]">↗️</span>
                  </div>
                  <span className="text-white text-xs font-bold mt-1">32</span>
                </button>
              </div>

              {/* BOTTOM LEFT CAPTION - @vibra_official + @hamadoski36 */}
              <div className="absolute bottom-24 left-3 right-20 z-20">
                <p className="text-white font-bold text-[16px] drop-shadow-lg">@{clip.user_handle || 'hamadoski36'}</p>
                <p className="text-white text-sm mt-1 drop-shadow-lg leading-tight">
                  {clip.caption || 'Vibra 🥰 #viral #fyp'} <span className="font-bold">Together Forever ❤️∞</span>
                </p>
                <p className="text-white/80 text-xs mt-1">@vibra_official</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOTTOM NAV - Home Explore + Inbox Me */}
      <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-black border-t border-white/10 flex items-center justify-around z-30 px-2">
        <button className="flex flex-col items-center text-white">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-white/60">
          <span className="text-xl">🔍</span>
          <span className="text-[10px] mt-1">Explore</span>
        </button>
        <button className="w-14 h-9 bg-white rounded-lg flex items-center justify-center">
          <span className="text-black text-2xl font-bold">+</span>
        </button>
        <button className="flex flex-col items-center text-white/60">
          <span className="text-xl">💬</span>
          <span className="text-[10px] mt-1">Inbox</span>
        </button>
        <button className="flex flex-col items-center text-white/60">
          <span className="text-xl">👤</span>
          <span className="text-[10px] mt-1">Me</span>
        </button>
      </div>
    </div>
  );
}
