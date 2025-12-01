"use client";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { Share2, Download, Upload, Shield, Save, Trophy, Users, Lock, LogIn, PlusCircle, Search, Globe } from "lucide-react";

// --- TAKIM VERİTABANI (LOGO VE BAYRAKLAR) ---
const TEAMS_DATA = [
  {
    country: "Türkiye",
    flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",
    teams: [
      { name: "Galatasaray", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png" },
      { name: "Fenerbahçe", logo: "https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbah%C3%A7e_SK.png" },
      { name: "Beşiktaş", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Besiktas_jk.png" },
      { name: "Trabzonspor", logo: "https://upload.wikimedia.org/wikipedia/tr/a/ab/Trabzonspor_Amblemi.png" },
      { name: "Başakşehir", logo: "https://upload.wikimedia.org/wikipedia/tr/d/d0/Istanbul_Basaksehir_FK.png" },
      { name: "Samsunspor", logo: "https://upload.wikimedia.org/wikipedia/tr/e/ef/Samsunspor_logo_2.png" },
      { name: "Adana Demir", logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Adana_Demirspor_logo.svg" },
      { name: "Kasımpaşa", logo: "https://upload.wikimedia.org/wikipedia/en/2/22/Kasımpaşa_SK_logo.png" }
    ]
  },
  {
    country: "İngiltere",
    flag: "https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg",
    teams: [
      { name: "Man City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
      { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
      { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
      { name: "Man Utd", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
      { name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
      { name: "Tottenham", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg" },
      { name: "Newcastle", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg" },
      { name: "Aston Villa", logo: "https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg" },
      { name: "West Ham", logo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg" },
      { name: "Brighton", logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg" }
    ]
  },
  {
    country: "İspanya",
    flag: "https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg",
    teams: [
      { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
      { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
      { name: "Atl. Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg" },
      { name: "Sevilla", logo: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg" },
      { name: "R. Sociedad", logo: "https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg" },
      { name: "Ath. Bilbao", logo: "https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg" },
      { name: "Real Betis", logo: "https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg" },
      { name: "Villarreal", logo: "https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg" }
    ]
  },
  {
    country: "Almanya",
    flag: "https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg",
    teams: [
      { name: "Bayern Münih", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
      { name: "Dortmund", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
      { name: "Leverkusen", logo: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg" },
      { name: "RB Leipzig", logo: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg" },
      { name: "Frankfurt", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg" },
      { name: "Stuttgart", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg" }
    ]
  },
  {
    country: "İtalya",
    flag: "https://upload.wikimedia.org/wikipedia/en/0/03/Flag_of_Italy.svg",
    teams: [
      { name: "Inter", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" },
      { name: "Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
      { name: "Juventus", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg" },
      { name: "Napoli", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Neapel.svg" },
      { name: "Roma", logo: "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg" },
      { name: "Atalanta", logo: "https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg" },
      { name: "Lazio", logo: "https://upload.wikimedia.org/wikipedia/en/c/ce/S.S._Lazio_badge.svg" }
    ]
  },
  {
    country: "Fransa",
    flag: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
    teams: [
      { name: "PSG", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
      { name: "Monaco", logo: "https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg" },
      { name: "Lille", logo: "https://upload.wikimedia.org/wikipedia/en/6/6f/Lille_OSC_2018_logo.svg" },
      { name: "Marseille", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg" },
      { name: "Lyon", logo: "https://upload.wikimedia.org/wikipedia/en/c/c6/Olympique_Lyonnais.svg" }
    ]
  },
  {
    country: "Dünya (Diğer)",
    flag: "https://upload.wikimedia.org/wikipedia/commons/e/ef/International_Flag_of_Planet_Earth.svg",
    teams: [
        { name: "Benfica", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg" },
        { name: "Sporting", logo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal.svg" },
        { name: "Porto", logo: "https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg" },
        { name: "Ajax", logo: "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg" },
        { name: "Al Nassr", logo: "https://upload.wikimedia.org/wikipedia/en/8/86/Al_Nassr_FC_Logo.svg" },
        { name: "Al Hilal", logo: "https://upload.wikimedia.org/wikipedia/en/f/f6/Al_Hilal_SFC_logo.svg" },
        { name: "Al Ittihad", logo: "https://upload.wikimedia.org/wikipedia/en/a/a3/Al-Ittihad_Jeddah_Club_logo.svg" },
        { name: "Inter Miami", logo: "https://upload.wikimedia.org/wikipedia/en/5/5c/Inter_Miami_CF_logo.svg" },
        { name: "LA Galaxy", logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/Los_Angeles_Galaxy_logo.svg" }
    ]
  }
];

export default function Home() {
  // --- STATE YÖNETİMİ ---
  const [view, setView] = useState("LOGIN"); // LOGIN, LOBBY, DRAFT, LEAGUE
  const [mode, setMode] = useState("JOIN"); // 'JOIN' veya 'CREATE'
  
  // Kullanıcı Giriş
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [roomId, setRoomId] = useState("");
  
  // Ayarlar
  const [config, setConfig] = useState({
      maxPlayers: 3,
      teamsPerPlayer: 6
  });

  // Veriler
  const [data, setData] = useState(null);
  const [myId, setMyId] = useState(null);
  const [draftInput, setDraftInput] = useState(""); // Manuel giriş için hala yedek
  const [selectedCountry, setSelectedCountry] = useState(TEAMS_DATA[0]); // Draft Seçim Ekranı İçin
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("FIXTURE");
  const [logoInputs, setLogoInputs] = useState({});

  // --- 1. ODA & BAĞLANTI İŞLEMLERİ ---

  const createRoom = async () => {
    if (!name || !password) return alert("Lütfen isim ve oda şifresi belirleyin!");
    
    const newRoomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const adminKey = Math.random().toString(36);
    const totalTeams = config.maxPlayers * config.teamsPerPlayer;

    const initialData = {
      status: "LOBBY",
      createdAt: new Date().toISOString(),
      adminKey: adminKey,
      password: password,
      config: config,
      players: [{ name, id: 0 }],
      teams: Array(totalTeams).fill(null),
      turn: 0,
      draftOrder: [],
      fixtures: []
    };
    
    await setDoc(doc(db, "rooms", newRoomId), initialData);
    localStorage.setItem(`admin_${newRoomId}`, adminKey);
    joinSession(newRoomId, name, password, true);
  };

  const joinRoom = async () => {
    if (!name || !roomId || !password) return alert("Tüm bilgileri giriniz!");
    await joinSession(roomId.toUpperCase(), name, password, false);
  };

  const joinSession = async (rId, pName, pPass, isCreator) => {
    const docRef = doc(db, "rooms", rId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const d = snap.data();
      if (d.password !== pPass) return alert("Hatalı Oda Şifresi!");

      let pId = -1;
      const existingPlayer = d.players.find(p => p.name === pName);
      
      if (existingPlayer) {
        pId = existingPlayer.id;
      } else {
        if (d.players.length >= d.config.maxPlayers) return alert("Oda dolu!");
        pId = d.players.length;
        if (!isCreator) {
            await updateDoc(docRef, { players: [...d.players, { name: pName, id: pId }] });
        }
      }

      const storedKey = localStorage.getItem(`admin_${rId}`);
      if (storedKey === d.adminKey || isCreator) setIsAdmin(true);
      else setIsAdmin(false);

      setRoomId(rId);
      setMyId(pId);
      
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const roomData = doc.data();
          setData(roomData);
          setView(roomData.status);
        }
      });
    } else {
      alert("Oda bulunamadı!");
    }
  };

  // --- 2. DRAFT & SEÇİM MANTIĞI ---

  const startDraft = async () => {
    let order = [];
    for (let i = 0; i < data.config.teamsPerPlayer; i++) {
        let round = [];
        for (let p = 0; p < data.config.maxPlayers; p++) {
            round.push(p);
        }
        if (i % 2 !== 0) round.reverse();
        order = [...order, ...round];
    }

    await updateDoc(doc(db, "rooms", roomId), { 
        status: "DRAFT", 
        draftOrder: order,
        turn: 0 
    });
  };

  const submitPick = async (pickName, pickLogo) => {
    if (!pickName) return;
    
    const newTeams = [...data.teams];
    const currentOwner = data.draftOrder[data.turn];
    
    newTeams[data.turn] = {
      id: data.turn,
      name: pickName,
      ownerId: currentOwner,
      logo: pickLogo || "",
      stats: { p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 }
    };

    const nextTurn = data.turn + 1;
    let updates = { teams: newTeams, turn: nextTurn };

    if (nextTurn === newTeams.length) {
        updates.status = "LEAGUE";
        updates.fixtures = generateDynamicFixtures(newTeams, data.config);
    }

    await updateDoc(doc(db, "rooms", roomId), updates);
    setDraftInput("");
  };

  // --- 3. FİKSTÜR ALGORİTMASI ---
  
  const generateDynamicFixtures = (teams, cfg) => {
    let playerTeams = [];
    for(let i=0; i<cfg.maxPlayers; i++) {
        playerTeams.push(teams.filter(t => t.ownerId === i).map(t => t.id));
    }

    let fixtures = [];
    let matchId = 1;
    
    // HAFTA 1
    let week1Matches = [];
    if (cfg.maxPlayers === 3) {
        const p0 = playerTeams[0]; // A
        const p1 = playerTeams[1]; // B
        const p2 = playerTeams[2]; // C
        
        for(let i=0; i<cfg.teamsPerPlayer; i++) {
            week1Matches.push({ id: matchId++, home: p0[i], away: p1[i], h: "", a: "" });
            week1Matches.push({ id: matchId++, home: p1[i], away: p2[i], h: "", a: "" });
            week1Matches.push({ id: matchId++, home: p2[i], away: p0[i], h: "", a: "" });
        }
    } else {
        // Genel Döngü
        for(let i=0; i<cfg.maxPlayers; i++) {
            const currentP = playerTeams[i];
            const nextP = playerTeams[(i+1) % cfg.maxPlayers];
            for(let t=0; t<cfg.teamsPerPlayer; t++) {
                 if(currentP[t] !== undefined && nextP[t] !== undefined)
                    week1Matches.push({ id: matchId++, home: currentP[t], away: nextP[t], h: "", a: "" });
            }
        }
    }
    week1Matches.sort(() => Math.random() - 0.5);
    fixtures.push({ week: 1, matches: week1Matches });

    // HAFTA 2
    let week2Matches = [];
    if (cfg.maxPlayers === 3) {
        const p0 = playerTeams[0];
        const p1 = playerTeams[1];
        const p2 = playerTeams[2];
        for(let i=0; i<cfg.teamsPerPlayer; i++) {
            const nextIdx = (i+1) % cfg.teamsPerPlayer;
            week2Matches.push({ id: matchId++, home: p1[nextIdx], away: p0[i], h: "", a: "" });
            week2Matches.push({ id: matchId++, home: p2[nextIdx], away: p1[i], h: "", a: "" });
            week2Matches.push({ id: matchId++, home: p0[nextIdx], away: p2[i], h: "", a: "" });
        }
    } else {
        for(let i=0; i<cfg.maxPlayers; i++) {
            const currentP = playerTeams[i];
            const nextP = playerTeams[(i+1) % cfg.maxPlayers];
            for(let t=0; t<cfg.teamsPerPlayer; t++) {
                 const nextIdx = (t+1) % cfg.teamsPerPlayer; 
                 if(currentP[t] !== undefined && nextP[nextIdx] !== undefined)
                    week2Matches.push({ id: matchId++, home: nextP[nextIdx], away: currentP[t], h: "", a: "" });
            }
        }
    }
    week2Matches.sort(() => Math.random() - 0.5);
    fixtures.push({ week: 2, matches: week2Matches });

    return fixtures;
  };

  const updateScore = async (weekIdx, matchIdx, type, val) => {
    const newFixtures = [...data.fixtures];
    newFixtures[weekIdx].matches[matchIdx][type] = val;
    const newTeams = recalculateTable(data.teams, newFixtures);
    await updateDoc(doc(db, "rooms", roomId), { fixtures: newFixtures, teams: newTeams });
  };

  const recalculateTable = (currentTeams, allFixtures) => {
      let tempTeams = currentTeams.map(t => ({ ...t, stats: { p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 } }));
      allFixtures.forEach(week => {
          week.matches.forEach(m => {
              if(m.h !== "" && m.a !== "") {
                  const hS = parseInt(m.h);
                  const aS = parseInt(m.a);
                  const homeT = tempTeams.find(t => t.id === m.home);
                  const awayT = tempTeams.find(t => t.id === m.away);
                  if(homeT && awayT) {
                    homeT.stats.p++; awayT.stats.p++;
                    homeT.stats.gf += hS; homeT.stats.ga += aS;
                    awayT.stats.gf += aS; awayT.stats.ga += hS;
                    if(hS > aS) { homeT.stats.w++; homeT.stats.pts += 3; awayT.stats.l++; }
                    else if(aS > hS) { awayT.stats.w++; awayT.stats.pts += 3; homeT.stats.l++; }
                    else { homeT.stats.d++; homeT.stats.pts++; awayT.stats.d++; awayT.stats.pts++; }
                  }
              }
          });
      });
      return tempTeams.sort((a,b) => (b.stats.pts - a.stats.pts) || ((b.stats.gf - b.stats.ga) - (a.stats.gf - a.stats.ga)));
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fc26_${roomId}.json`;
    link.click();
  };
  const uploadBackup = (e) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (confirm("Mevcut oda verisi silinip bu yedek yüklenecek?")) {
          await setDoc(doc(db, "rooms", roomId), JSON.parse(ev.target.result));
          window.location.reload();
      }
    };
    if(e.target.files[0]) reader.readAsText(e.target.files[0]);
  };
  const saveLogos = async () => {
      const newTeams = data.teams.map(t => ({ ...t, logo: logoInputs[t.id] || t.logo }));
      await updateDoc(doc(db, "rooms", roomId), { teams: newTeams });
      alert("Logolar kaydedildi.");
  };

  // --- EKRAN GÖRÜNÜMLERİ ---

  if (view === "LOGIN") return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 text-white font-sans">
        <div className="w-full max-w-md bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden">
            <div className="bg-neutral-800 p-6 text-center">
                <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">FC 26</h1>
                <p className="text-neutral-400 text-sm">Turnuva & Lig Yöneticisi</p>
            </div>
            <div className="flex border-b border-neutral-800">
                <button onClick={() => setMode("CREATE")} className={`flex-1 p-4 font-bold flex items-center justify-center gap-2 transition ${mode==="CREATE" ? 'bg-emerald-600/20 text-emerald-400' : 'text-neutral-500 hover:text-white'}`}>
                    <PlusCircle size={20}/> Oda Kur
                </button>
                <button onClick={() => setMode("JOIN")} className={`flex-1 p-4 font-bold flex items-center justify-center gap-2 transition ${mode==="JOIN" ? 'bg-blue-600/20 text-blue-400' : 'text-neutral-500 hover:text-white'}`}>
                    <LogIn size={20}/> Katıl
                </button>
            </div>
            <div className="p-8 space-y-4">
                <div>
                    <label className="text-xs text-neutral-500 font-bold ml-1">KULLANICI ADI</label>
                    <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-emerald-500 transition" placeholder="Örn: Ahmet" />
                </div>
                {mode === "CREATE" ? (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs text-neutral-500 font-bold ml-1">OYUNCU SAYISI</label>
                                <select value={config.maxPlayers} onChange={e=>setConfig({...config, maxPlayers: parseInt(e.target.value)})} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none">
                                    {[2,3,4,5].map(n => <option key={n} value={n}>{n} Kişi</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="text-xs text-neutral-500 font-bold ml-1">TAKIM LİMİTİ</label>
                                <select value={config.teamsPerPlayer} onChange={e=>setConfig({...config, teamsPerPlayer: parseInt(e.target.value)})} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none">
                                    {[4,6,8].map(n => <option key={n} value={n}>{n} Takım</option>)}
                                </select>
                             </div>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 font-bold ml-1">ODA ŞİFRESİ</label>
                            <input type="text" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-emerald-500" placeholder="Örn: 1234" />
                        </div>
                        <button onClick={createRoom} className="w-full bg-emerald-600 hover:bg-emerald-500 p-4 rounded-xl font-bold transition mt-2 shadow-lg shadow-emerald-900/20">ODAYI OLUŞTUR</button>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="text-xs text-neutral-500 font-bold ml-1">ODA KODU</label>
                            <input value={roomId} onChange={e=>setRoomId(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-blue-500 uppercase" placeholder="Örn: X7B2A" />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 font-bold ml-1">ODA ŞİFRESİ</label>
                            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-white outline-none focus:border-blue-500" placeholder="••••" />
                        </div>
                        <button onClick={joinRoom} className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold transition mt-2 shadow-lg shadow-blue-900/20">GİRİŞ YAP</button>
                    </>
                )}
            </div>
        </div>
    </div>
  );

  if (view === "LOBBY") return (
      <div className="min-h-screen bg-neutral-950 text-white p-6 flex flex-col items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 w-full max-w-lg text-center relative overflow-hidden">
              {isAdmin && <div className="absolute top-0 right-0 bg-emerald-600 text-xs font-bold px-3 py-1 rounded-bl-xl">YÖNETİCİ</div>}
              <h2 className="text-xs text-neutral-500 font-bold tracking-widest mb-2">ODA KODU</h2>
              <div className="text-5xl font-black text-white tracking-widest mb-4 select-all">{roomId}</div>
              <div className="inline-block bg-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-400 mb-8 font-mono">Şifre: {data?.password}</div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      <div className="text-xs text-neutral-500 font-bold">OYUNCULAR</div>
                      <div className="text-xl font-bold text-white">{data?.players.length} / {data?.config.maxPlayers}</div>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      <div className="text-xs text-neutral-500 font-bold">KİŞİ BAŞI</div>
                      <div className="text-xl font-bold text-white">{data?.config.teamsPerPlayer} Takım</div>
                  </div>
              </div>
              <div className="space-y-3 mb-8">
                  {data?.players.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 bg-neutral-800 p-4 rounded-xl">
                          <div className={`w-3 h-3 rounded-full ${i===0?'bg-emerald-500':'bg-blue-500'}`}></div>
                          <span className="font-bold text-lg">{p.name}</span>
                          {i===0 && <Shield className="w-4 h-4 text-emerald-500" />}
                      </div>
                  ))}
                  {[...Array(data?.config.maxPlayers - (data?.players.length || 0))].map((_, i) => (
                      <div key={i} className="bg-neutral-950/50 p-4 rounded-xl text-neutral-600 border border-dashed border-neutral-800 animate-pulse">...</div>
                  ))}
              </div>
              {isAdmin ? (
                  <button disabled={data?.players.length < data?.config.maxPlayers} onClick={startDraft} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl font-bold text-lg transition">DRAFT BAŞLAT 🚀</button>
              ) : (
                  <p className="text-neutral-500 animate-pulse text-sm">Yönetici ({data?.players[0]?.name}) bekleniyor...</p>
              )}
          </div>
      </div>
  );

  // --- DRAFT EKRANI (YENİ VE GÖRSEL) ---
  if (view === "DRAFT") {
      const isMyTurn = data.draftOrder[data.turn] === myId;
      const turnPlayer = data.players[data.draftOrder[data.turn]];
      const totalPicks = data.config.maxPlayers * data.config.teamsPerPlayer;
      
      return (
          <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row overflow-hidden">
              
              {/* SOL PANEL: ÜLKELER */}
              <div className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 h-48 md:h-screen">
                  <div className="p-4 border-b border-neutral-800 font-bold text-neutral-400 text-sm flex items-center gap-2">
                     <Globe size={16}/> LİGLER / ÜLKELER
                  </div>
                  <div className="flex-1 overflow-x-auto md:overflow-y-auto flex md:flex-col">
                      {TEAMS_DATA.map((country, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelectedCountry(country)}
                            className={`flex items-center gap-3 p-4 min-w-[150px] md:min-w-0 md:w-full transition text-left border-b md:border-b-0 border-r md:border-r-0 border-neutral-800 ${selectedCountry.country === country.country ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-800/50'}`}
                          >
                              <img src={country.flag} alt={country.country} className="w-6 h-4 object-cover rounded shadow-sm" />
                              <span className="font-bold text-sm">{country.country}</span>
                          </button>
                      ))}
                  </div>
              </div>

              {/* ORTA PANEL: TAKIM SEÇİMİ */}
              <div className="flex-1 flex flex-col h-[calc(100vh-12rem)] md:h-screen overflow-hidden">
                  {/* Bilgi Barı */}
                  <div className="bg-neutral-900/80 backdrop-blur border-b border-neutral-800 p-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
                      <div>
                          <p className="text-neutral-500 text-xs font-bold mb-1">SIRADAKİ SEÇİM ({data.turn+1}/{totalPicks})</p>
                          <h2 className={`text-2xl font-black ${isMyTurn ? 'text-emerald-400 animate-pulse' : 'text-white'}`}>
                              {isMyTurn ? "SENİN SIRAN!" : `${turnPlayer.name} Seçiyor...`}
                          </h2>
                      </div>
                      
                      {/* Manuel Giriş (Her ihtimale karşı yedek) */}
                      {isMyTurn && (
                        <div className="flex gap-2">
                             <input value={draftInput} onChange={e=>setDraftInput(e.target.value)} placeholder="Listedeki yoksa buraya yaz..." className="bg-neutral-950 border border-neutral-700 p-2 rounded text-xs text-white w-48" />
                             <button onClick={()=>submitPick(draftInput, "")} className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded text-xs font-bold">EKLE</button>
                        </div>
                      )}
                  </div>

                  {/* Takım Grid */}
                  <div className="flex-1 overflow-y-auto p-6 bg-neutral-950">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <img src={selectedCountry.flag} className="w-8 h-6 rounded" /> 
                          {selectedCountry.country} Takımları
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {selectedCountry.teams.map((team, i) => {
                              // Takım alınmış mı kontrol et
                              const isTaken = data.teams.some(t => t?.name === team.name);
                              const ownerOfTaken = isTaken ? data.players[data.teams.find(t => t?.name === team.name).ownerId].name : "";

                              return (
                                  <button 
                                    key={i}
                                    disabled={!isMyTurn || isTaken}
                                    onClick={() => submitPick(team.name, team.logo)}
                                    className={`relative group p-4 rounded-xl border flex flex-col items-center gap-3 transition-all duration-200
                                        ${isTaken 
                                            ? 'bg-neutral-900 border-neutral-800 opacity-40 cursor-not-allowed grayscale' 
                                            : isMyTurn 
                                                ? 'bg-neutral-900 border-neutral-700 hover:border-emerald-500 hover:bg-neutral-800 hover:scale-105 cursor-pointer shadow-lg' 
                                                : 'bg-neutral-900 border-neutral-800 opacity-80 cursor-not-allowed'
                                        }
                                    `}
                                  >
                                      <div className="w-16 h-16 relative flex items-center justify-center">
                                          <img src={team.logo} className="max-w-full max-h-full object-contain drop-shadow-md" />
                                      </div>
                                      <span className="font-bold text-sm text-center">{team.name}</span>
                                      
                                      {/* Alınmışsa kimin aldığı yazsın */}
                                      {isTaken && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
                                              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-1 rounded rotate-[-15deg]">{ownerOfTaken} ALDI</span>
                                          </div>
                                      )}
                                  </button>
                              )
                          })}
                      </div>
                  </div>
              </div>

              {/* SAĞ PANEL: SEÇİLENLER (Masaüstü) */}
              <div className="hidden md:flex w-64 bg-neutral-900 border-l border-neutral-800 flex-col shrink-0 h-screen">
                  <div className="p-4 border-b border-neutral-800 font-bold text-neutral-400 text-sm">
                      KADROLAR
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                      {data.players.map((p, pid) => (
                          <div key={pid}>
                              <h4 className="font-bold text-emerald-400 mb-2 text-xs uppercase">{p.name}</h4>
                              <div className="space-y-2">
                                  {data.teams.map((t, i) => t && t.ownerId === pid ? (
                                      <div key={i} className="flex items-center gap-2 bg-neutral-950 p-2 rounded border border-neutral-800">
                                          {t.logo && <img src={t.logo} className="w-4 h-4 object-contain"/>}
                                          <span className="text-xs font-medium truncate">{t.name}</span>
                                      </div>
                                  ) : null)}
                                  {/* Boş slotlar */}
                                  {[...Array(data.config.teamsPerPlayer - data.teams.filter(t => t?.ownerId === pid).length)].map((_, k) => (
                                      <div key={k} className="h-8 rounded border border-dashed border-neutral-800 bg-neutral-900/50"></div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )
  }

  // LIG EKRANI (Öncekiyle Aynı)
  if (view === "LEAGUE") {
      return (
          <div className="min-h-screen bg-neutral-950 text-white pb-20">
              <div className="bg-neutral-900 border-b border-neutral-800 p-4 sticky top-0 z-20 flex justify-between items-center shadow-lg">
                  <div className="flex items-center gap-2">
                      <h1 className="font-black text-xl tracking-tighter">FC 26</h1>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-neutral-500 leading-none">ODA KODU</span>
                         <span className="text-xs font-mono">{roomId}</span>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      {isAdmin && <button onClick={downloadBackup} className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-neutral-400"><Download size={18}/></button>}
                      {isAdmin && <label className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 cursor-pointer text-neutral-400"><Upload size={18}/><input type="file" hidden onChange={uploadBackup}/></label>}
                  </div>
              </div>

              <div className="flex p-4 gap-2 max-w-4xl mx-auto">
                  <button onClick={()=>setActiveTab("FIXTURE")} className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${activeTab==="FIXTURE" ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-neutral-400'}`}><Trophy size={18}/> Fikstür</button>
                  <button onClick={()=>setActiveTab("STANDINGS")} className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${activeTab==="STANDINGS" ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400'}`}><Users size={18}/> Puan</button>
                  {isAdmin && <button onClick={()=>setActiveTab("ADMIN")} className={`px-4 py-3 rounded-xl font-bold transition ${activeTab==="ADMIN" ? 'bg-purple-600 text-white' : 'bg-neutral-900 text-neutral-400'}`}><Shield size={20}/></button>}
              </div>

              <div className="max-w-4xl mx-auto p-4">
                  {activeTab === "STANDINGS" && (
                      <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
                          <table className="w-full text-sm">
                              <thead className="bg-neutral-950 text-neutral-500 uppercase font-bold text-xs">
                                  <tr>
                                      <th className="p-3 text-left">#</th>
                                      <th className="p-3 text-left">Takım</th>
                                      <th className="p-3 text-center">O</th>
                                      <th className="p-3 text-center">Av</th>
                                      <th className="p-3 text-center">P</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {data.teams.map((t, i) => (
                                      <tr key={i} className={`border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50 transition ${i<4?'bg-emerald-900/10':''}`}>
                                          <td className="p-3 font-bold text-neutral-400">{i+1}</td>
                                          <td className="p-3">
                                              <div className="flex items-center gap-3">
                                                  {t.logo ? <img src={t.logo} className="w-6 h-6 object-contain" /> : <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] font-bold">{t.name.slice(0,1)}</div>}
                                                  <div>
                                                      <div className="font-bold text-white text-sm">{t.name}</div>
                                                      <div className="text-[10px] text-neutral-500 uppercase">{data.players[t.ownerId].name}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="p-3 text-center text-neutral-400">{t.stats.p}</td>
                                          <td className="p-3 text-center text-neutral-400">{t.stats.gf - t.stats.ga}</td>
                                          <td className="p-3 text-center font-bold text-base text-emerald-400">{t.stats.pts}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  {activeTab === "FIXTURE" && (
                      <div className="space-y-6">
                          {data.fixtures.map((week, wIdx) => (
                              <div key={wIdx}>
                                  <div className="flex items-center gap-4 mb-3">
                                      <div className="h-px bg-neutral-800 flex-1"></div>
                                      <h3 className="font-bold text-neutral-500 uppercase tracking-widest text-xs">Hafta {week.week}</h3>
                                      <div className="h-px bg-neutral-800 flex-1"></div>
                                  </div>
                                  <div className="grid gap-2">
                                      {week.matches.map((m, mIdx) => {
                                          const hTeam = data.teams.find(t=>t.id===m.home);
                                          const aTeam = data.teams.find(t=>t.id===m.away);
                                          return (
                                              <div key={mIdx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex justify-between items-center">
                                                  <div className="flex-1 flex flex-col items-end gap-0.5">
                                                      <span className="font-bold text-sm text-right">{hTeam.name}</span>
                                                      <span className="text-[9px] uppercase bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">{data.players[hTeam.ownerId].name}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2 mx-3">
                                                      <input type="number" value={m.h} onChange={e=>updateScore(wIdx, mIdx, 'h', e.target.value)} className="w-8 h-8 bg-neutral-950 border border-neutral-800 rounded text-center font-bold text-white focus:border-emerald-500 outline-none" />
                                                      <span className="text-neutral-600">-</span>
                                                      <input type="number" value={m.a} onChange={e=>updateScore(wIdx, mIdx, 'a', e.target.value)} className="w-8 h-8 bg-neutral-950 border border-neutral-800 rounded text-center font-bold text-white focus:border-emerald-500 outline-none" />
                                                  </div>
                                                  <div className="flex-1 flex flex-col items-start gap-0.5">
                                                      <span className="font-bold text-sm">{aTeam.name}</span>
                                                      <span className="text-[9px] uppercase bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">{data.players[aTeam.ownerId].name}</span>
                                                  </div>
                                              </div>
                                          )
                                      })}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {activeTab === "ADMIN" && isAdmin && (
                      <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                          <h3 className="font-bold mb-6 flex items-center gap-2 text-purple-400"><Shield size={18}/> Takım Logolarını Düzenle</h3>
                          <div className="space-y-4">
                              {data.teams.map((t, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                      <span className="w-8 text-neutral-500 text-sm">#{i+1}</span>
                                      <span className="w-32 truncate font-bold text-sm">{t.name}</span>
                                      <input type="text" placeholder="Logo URL..." className="flex-1 bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white" defaultValue={t.logo} onChange={e => setLogoInputs(prev => ({...prev, [t.id]: e.target.value}))} />
                                  </div>
                              ))}
                          </div>
                          <button onClick={saveLogos} className="mt-6 w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18}/> Kaydet</button>
                      </div>
                  )}
              </div>
          </div>
      )
  }

  return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-emerald-500 animate-pulse font-bold">Yükleniyor...</div>;
}