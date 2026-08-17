import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, X, Star, Shirt, Camera, Pencil, Trash2, Check, Users, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

const THEMES = {
  natural: { name: "ナチュラル", fontDisplay: "'Shippori Mincho', serif", fontBody: "'Zen Kaku Gothic New', sans-serif", stone: "#E8ECE1", paper: "#FBFAF5", ink: "#262420", inkSoft: "#6B6A62", accent: "#3D5A80", accentSoft: "#DCE5EE", mustard: "#C68E17", danger: "#B5541E", line: "#D8D9CE", radius: "10px", cardRadius: "10px" },
  mono: { name: "モダン", fontDisplay: "'Space Grotesk', sans-serif", fontBody: "'Noto Sans JP', sans-serif", stone: "#F2F2F0", paper: "#FFFFFF", ink: "#141414", inkSoft: "#6E6E6E", accent: "#141414", accentSoft: "#E7E7E4", mustard: "#E0B400", danger: "#C93B32", line: "#DCDCD9", radius: "2px", cardRadius: "2px" },
  gal: { name: "ギャル", fontDisplay: "'Rampart One', sans-serif", fontBody: "'Zen Maru Gothic', sans-serif", stone: "#FFE6F2", paper: "#FFFFFF", ink: "#4A1030", inkSoft: "#9C5C7D", accent: "#FF2D95", accentSoft: "#FFD1EA", mustard: "#FFC800", danger: "#FF4757", line: "#FFC2E0", radius: "20px", cardRadius: "18px" },
  mens: { name: "メンズ", fontDisplay: "'Zen Kaku Gothic New', sans-serif", fontBody: "'Noto Sans JP', sans-serif", stone: "#E4E0D3", paper: "#FAF9F5", ink: "#1C1C1A", inkSoft: "#6B675C", accent: "#4B5842", accentSoft: "#D9DECE", mustard: "#C1652B", danger: "#A62C2C", line: "#C9C4B6", radius: "2px", cardRadius: "2px" },
  korean: { name: "韓国風ミニマル", fontDisplay: "'Zen Old Mincho', serif", fontBody: "'Noto Sans JP', sans-serif", stone: "#F5F1EC", paper: "#FFFFFF", ink: "#3A3733", inkSoft: "#8C877E", accent: "#A87C77", accentSoft: "#EFE2DE", mustard: "#C9A66B", danger: "#B5541E", line: "#E5DED5", radius: "6px", cardRadius: "6px" },
  kawaii: { name: "かわいい", fontDisplay: "'Mochiy Pop One', sans-serif", fontBody: "'Zen Maru Gothic', sans-serif", stone: "#F0EAFB", paper: "#FFFFFF", ink: "#5B4B6B", inkSoft: "#9A8CAE", accent: "#FF9EB5", accentSoft: "#FDE6ED", mustard: "#FFC857", danger: "#FF6B81", line: "#F0D9E4", radius: "18px", cardRadius: "16px" },
};

const CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "top", label: "トップス" },
  { id: "bottom", label: "ボトムス" },
  { id: "outer", label: "アウター" },
  { id: "onepiece", label: "ワンピース" },
  { id: "shoes", label: "靴" },
  { id: "accessory", label: "小物" },
];

// hue: null は無彩色。warmCool: パーソナルカラー簡易分類(warm=イエベ向き / cool=ブルベ向き / neutral=どちらでも)
const COLOR_OPTIONS = [
  { id: "white", label: "白", hex: "#FFFFFF", hue: null, group: "neutral", warmCool: "neutral" },
  { id: "black", label: "黒", hex: "#2B2B2B", hue: null, group: "neutral", warmCool: "neutral" },
  { id: "gray", label: "グレー", hex: "#9A9A93", hue: null, group: "neutral", warmCool: "cool" },
  { id: "beige", label: "ベージュ", hex: "#D8C6A8", hue: null, group: "neutral", warmCool: "warm" },
  { id: "brown", label: "ブラウン", hex: "#7A5638", hue: null, group: "neutral", warmCool: "warm" },
  { id: "navy", label: "ネイビー", hex: "#2C3E58", hue: 220, group: "blue", warmCool: "cool" },
  { id: "blue", label: "ブルー", hex: "#4E7FB5", hue: 210, group: "blue", warmCool: "cool" },
  { id: "green", label: "グリーン", hex: "#5C7A52", hue: 120, group: "green", warmCool: "neutral" },
  { id: "red", label: "レッド", hex: "#A93B33", hue: 0, group: "red", warmCool: "warm" },
  { id: "pink", label: "ピンク", hex: "#D89AA6", hue: 330, group: "red", warmCool: "cool" },
  { id: "yellow", label: "イエロー", hex: "#D8B84A", hue: 50, group: "yellow", warmCool: "warm" },
  { id: "purple", label: "パープル", hex: "#7D6690", hue: 270, group: "purple", warmCool: "cool" },
];
const COLOR_GROUP_LABEL = { red: "赤・ピンク系", yellow: "黄系", green: "グリーン系", blue: "ブルー系", purple: "パープル系" };
const PERSONAL_COLOR_OPTIONS = [
  { id: "none", label: "未設定" },
  { id: "warm", label: "イエベ" },
  { id: "cool", label: "ブルベ" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "登録が新しい順" },
  { id: "favorite", label: "お気に入り度順" },
  { id: "dateNew", label: "購入日が新しい順" },
  { id: "dateOld", label: "購入日が古い順" },
  { id: "wornMost", label: "着用回数が多い順" },
];

const DEFAULT_MEMBERS = [{ id: "me", name: "自分", personalColor: "none" }];

const FORTUNE_MESSAGES = [
  "今日はこの色を身につけると気分が上がりそう",
  "小物だけでも取り入れると運気アップ",
  "この色のアイテムがあれば迷わず選んで◎",
  "初対面の人と会う日にぴったりの色",
  "リラックスしたい日はこの色が似合う",
  "決断力が欲しい日はこの色を意識して",
  "この色を差し色にすると印象アップ",
  "今日はこの色に助けられる予感",
];

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yearsUsed(dateStr) {
  if (!dateStr) return null;
  const purchase = new Date(dateStr);
  const now = new Date();
  let years = now.getFullYear() - purchase.getFullYear();
  const months = now.getMonth() - purchase.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < purchase.getDate())) years -= 1;
  if (years < 1) {
    const diffDays = Math.floor((now - purchase) / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 1) return "1ヶ月未満";
    return `${diffMonths}ヶ月`;
  }
  return `${years}年`;
}
function colorMeta(id) { return COLOR_OPTIONS.find((c) => c.id === id); }
function colorHex(id) { return colorMeta(id)?.hex || "#CCCCCC"; }
function colorLabel(id) { return colorMeta(id)?.label || ""; }
function categoryLabel(id) { return CATEGORIES.find((c) => c.id === id)?.label || ""; }
function personalColorLabel(id) { return PERSONAL_COLOR_OPTIONS.find((p) => p.id === id)?.label || "未設定"; }
function yen(n) { return `¥${Number(n).toLocaleString()}`; }

function hueDistance(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
function isCompatible(colorIdA, colorIdB) {
  const a = colorMeta(colorIdA), b = colorMeta(colorIdB);
  if (!a || !b) return { ok: false };
  if (a.hue === null || b.hue === null) return { ok: true, type: "neutral" };
  const d = hueDistance(a.hue, b.hue);
  if (d <= 45) return { ok: true, type: "analogous" };
  if (d >= 150) return { ok: true, type: "complementary" };
  return { ok: false };
}
// パーソナルカラーとの相性(neutralはどちらとも合う扱い)
function suitsPersonalColor(colorId, personalColor) {
  if (!personalColor || personalColor === "none") return true;
  const c = colorMeta(colorId);
  if (!c) return false;
  return c.warmCool === "neutral" || c.warmCool === personalColor;
}
function seedNumber(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function sortItems(items, sortBy) {
  const copy = [...items];
  if (sortBy === "favorite") return copy.sort((a, b) => b.favorite - a.favorite);
  if (sortBy === "dateNew") return copy.sort((a, b) => new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0));
  if (sortBy === "dateOld") return copy.sort((a, b) => new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0));
  if (sortBy === "wornMost") return copy.sort((a, b) => (b.wearLog?.length || 0) - (a.wearLog?.length || 0));
  return copy.sort((a, b) => b.id - a.id);
}

const selectStyle = (theme) => ({ padding: "7px 10px", borderRadius: 6, border: `1px solid ${theme.line}`, fontFamily: theme.fontBody, fontSize: 13, color: theme.ink, background: "#FFFFFF" });

function Tag({ theme, children }) {
  return <span style={{ fontSize: 12, color: theme.accent, background: theme.accentSoft, padding: "3px 10px", borderRadius: 999, fontFamily: theme.fontBody, whiteSpace: "nowrap" }}>{children}</span>;
}
function Swatch({ theme, colorId, size = 14 }) {
  return <span style={{ width: size, height: size, borderRadius: "50%", background: colorHex(colorId), border: `1px solid ${theme.line}`, display: "inline-block" }} />;
}
function StarRow({ theme, value, onChange, size = 16, interactive = false }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} onClick={interactive ? () => onChange(n) : undefined}
          style={{ cursor: interactive ? "pointer" : "default", color: n <= value ? theme.mustard : theme.line }}
          fill={n <= value ? theme.mustard : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
}

function ConfirmModal({ theme, message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.paper, borderRadius: theme.radius, padding: 24, maxWidth: 320, width: "100%", fontFamily: theme.fontBody }}>
        <p style={{ fontSize: 14, color: theme.ink, margin: "0 0 20px", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: 6, border: `1px solid ${theme.line}`, background: "#FFFFFF", color: theme.inkSoft, fontFamily: theme.fontBody, fontSize: 13, cursor: "pointer" }}>キャンセル</button>
          <button onClick={onConfirm} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: theme.danger, color: "#FFFFFF", fontFamily: theme.fontBody, fontSize: 13, cursor: "pointer" }}>削除する</button>
        </div>
      </div>
    </div>
  );
}

function MemberManageModal({ theme, members, onAdd, onDelete, onUpdatePersonalColor, onClose }) {
  const [name, setName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.paper, borderRadius: theme.radius, padding: 24, maxWidth: 400, width: "100%", fontFamily: theme.fontBody }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: theme.fontDisplay, fontSize: 17, color: theme.ink, margin: 0 }}>家族を管理</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.inkSoft }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {members.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", border: `1px solid ${theme.line}`, borderRadius: 6, gap: 8 }}>
              <span style={{ fontSize: 13, color: theme.ink, flex: 1 }}>{m.name}</span>
              <select
                value={m.personalColor || "none"}
                onChange={(e) => onUpdatePersonalColor(m.id, e.target.value)}
                style={{ fontSize: 12, padding: "4px 6px", borderRadius: 6, border: `1px solid ${theme.line}`, fontFamily: theme.fontBody, background: "#FFFFFF" }}
              >
                {PERSONAL_COLOR_OPTIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              {members.length > 1 && <button onClick={() => onDelete(m.id)} aria-label="削除" style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.inkSoft }}><Trash2 size={14} /></button>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="名前を入力" style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${theme.line}`, fontFamily: theme.fontBody, fontSize: 13, boxSizing: "border-box" }} />
          <button onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(""); } }} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: theme.accent, color: "#FFFFFF", fontFamily: theme.fontBody, fontSize: 13, cursor: "pointer" }}>追加</button>
        </div>
      </div>
    </div>
  );
}

function InsightsPanel({ theme, items, members, scopeMemberId }) {
  const scopeMember = scopeMemberId === "all" ? null : members.find((m) => m.id === scopeMemberId);
  const scopeLabel = scopeMemberId === "all" ? "全員" : scopeMember?.name || "";
  const personalColor = scopeMember?.personalColor && scopeMember.personalColor !== "none" ? scopeMember.personalColor : null;
  const scopeItems = scopeMemberId === "all" ? items : items.filter((i) => i.memberId === scopeMemberId);

  const fortune = useMemo(() => {
    const pool = COLOR_OPTIONS.filter((c) => c.hue !== null && suitsPersonalColor(c.id, personalColor));
    const usePool = pool.length > 0 ? pool : COLOR_OPTIONS.filter((c) => c.hue !== null);
    const seed = seedNumber(todayStr() + scopeMemberId);
    const color = usePool[seed % usePool.length];
    const message = FORTUNE_MESSAGES[seed % FORTUNE_MESSAGES.length];
    const owns = scopeItems.some((i) => i.color === color.id);
    return { color, message, owns };
  }, [scopeMemberId, scopeItems, personalColor]);

  const essential = ["top", "bottom", "outer", "shoes"];
  const missingCategories = essential.map((cat) => ({ cat, count: scopeItems.filter((i) => i.category === cat).length })).filter((c) => c.count <= 1);

  const ownedColorIds = new Set(scopeItems.map((i) => i.color));
  const ownedGroups = new Set([...ownedColorIds].map((id) => colorMeta(id)?.group).filter((g) => g && g !== "neutral"));
  const allGroups = Object.keys(COLOR_GROUP_LABEL);
  const missingGroups = allGroups.filter((g) => !ownedGroups.has(g));

  const combos = useMemo(() => {
    const tops = scopeItems.filter((i) => i.category === "top");
    const bottoms = scopeItems.filter((i) => i.category === "bottom");
    const result = [];
    for (const top of tops) {
      const match = bottoms.find((b) => isCompatible(top.color, b.color).ok);
      if (match) result.push({ top, bottom: match, type: isCompatible(top.color, match.color).type });
      if (result.length >= 5) break;
    }
    return result;
  }, [scopeItems]);

  const buySuggestions = useMemo(() => {
    const ownedNonNeutral = [...ownedColorIds].map(colorMeta).filter((c) => c && c.hue !== null);
    let candidates = COLOR_OPTIONS.filter((c) => c.hue !== null && !ownedColorIds.has(c.id));
    const personalMatches = candidates.filter((c) => suitsPersonalColor(c.id, personalColor));
    if (personalMatches.length > 0) candidates = personalMatches;
    const scored = candidates.map((c) => {
      let score = ownedNonNeutral.filter((o) => isCompatible(c.id, o.id).ok).length;
      if (missingGroups.includes(c.group)) score += 2;
      return { color: c, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 2);
  }, [ownedColorIds, missingGroups, personalColor]);

  const sectionTitle = { fontFamily: theme.fontDisplay, fontSize: 15, color: theme.ink, margin: "0 0 8px" };
  const sectionBox = { background: theme.paper, border: `1px solid ${theme.line}`, borderRadius: theme.radius, padding: 16, marginBottom: 14 };
  const smallText = { fontSize: 12.5, color: theme.inkSoft, fontFamily: theme.fontBody, lineHeight: 1.7 };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 10 }}>
        {scopeLabel}のコーデ提案{personalColor && `(${personalColorLabel(personalColor)}向けに調整中)`}
      </div>

      <div style={sectionBox}>
        <h3 style={sectionTitle}>今日の運勢カラー</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <Swatch theme={theme} colorId={fortune.color.id} size={28} />
          <div>
            <div style={{ fontFamily: theme.fontBody, fontSize: 14, color: theme.ink, fontWeight: 500 }}>{fortune.color.label}</div>
            <div style={smallText}>{fortune.message}</div>
          </div>
        </div>
        <div style={smallText}>{fortune.owns ? "この色のアイテム、すでに持っています。" : "この色のアイテムはまだ持っていないかも。"}</div>
      </div>

      <div style={sectionBox}>
        <h3 style={sectionTitle}>服の偏りチェック</h3>
        {missingCategories.length === 0 && missingGroups.length === 0 ? (
          <div style={smallText}>バランス良く揃っています。</div>
        ) : (
          <div style={smallText}>
            {missingCategories.map((c) => <div key={c.cat}>・{categoryLabel(c.cat)}が{c.count === 0 ? "まだ登録されていません" : "1着のみで少なめです"}</div>)}
            {missingGroups.length > 0 && <div>・{missingGroups.map((g) => COLOR_GROUP_LABEL[g]).join("、")}の色が手持ちにありません</div>}
          </div>
        )}
      </div>

      <div style={sectionBox}>
        <h3 style={sectionTitle}>コーディネート提案</h3>
        {combos.length === 0 ? (
          <div style={smallText}>トップスとボトムスをもう少し登録すると、組み合わせを提案できます。</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {combos.map((c, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: idx < combos.length - 1 ? `1px solid ${theme.line}` : "none" }}>
                <Swatch theme={theme} colorId={c.top.color} size={18} />
                <span style={smallText}>{colorLabel(c.top.color)}のトップス</span>
                <span style={{ color: theme.inkSoft, fontSize: 12 }}>×</span>
                <Swatch theme={theme} colorId={c.bottom.color} size={18} />
                <span style={smallText}>{colorLabel(c.bottom.color)}のボトムス</span>
                <Tag theme={theme}>{c.type === "neutral" ? "定番" : c.type === "analogous" ? "同系色" : "差し色"}</Tag>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={sectionBox}>
        <h3 style={sectionTitle}>購入のヒント</h3>
        {buySuggestions.length === 0 ? (
          <div style={smallText}>もう十分な色のバリエーションがあります。</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {buySuggestions.map((s) => (
              <div key={s.color.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Swatch theme={theme} colorId={s.color.id} size={18} />
                <span style={smallText}>{s.color.label}を追加すると、手持ちの服との組み合わせが増えそうです</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClothCard({ theme, item, members, onDelete, onEdit, onWear }) {
  const [expanded, setExpanded] = useState(false);
  const wearCount = item.wearLog?.length || 0;
  const lastWorn = wearCount > 0 ? item.wearLog[item.wearLog.length - 1] : null;
  const costPerWear = item.purchasePrice && wearCount > 0 ? Math.round(item.purchasePrice / wearCount) : null;
  const memberName = members.find((m) => m.id === item.memberId)?.name;
  const wornToday = lastWorn === todayStr();

  return (
    <div style={{ position: "relative", background: theme.paper, border: `1px solid ${theme.line}`, borderRadius: theme.cardRadius, paddingTop: 22, marginTop: 14 }}>
      <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", width: 1, height: 14, background: theme.inkSoft }} />
      <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", width: 9, height: 9, borderRadius: "50%", border: `1.5px solid ${theme.inkSoft}`, background: theme.stone }} />
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
        <button onClick={() => onEdit(item)} aria-label="編集" style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.inkSoft, padding: 4 }}><Pencil size={15} /></button>
        <button onClick={() => onDelete(item.id)} aria-label="削除" style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.inkSoft, padding: 4 }}><Trash2 size={15} /></button>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <button onClick={() => setExpanded((v) => !v)} style={{ display: "block", width: "100%", padding: 0, border: "none", background: "transparent", cursor: "pointer" }} aria-label={expanded ? "詳細を閉じる" : "詳細を見る"}>
          <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: theme.radius, overflow: "hidden", background: theme.stone, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, border: item.photo ? "none" : `1px dashed ${theme.line}` }}>
            {item.photo ? <img src={item.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Shirt size={32} color={theme.inkSoft} strokeWidth={1.3} />
                <span style={{ fontSize: 11, color: theme.inkSoft, fontFamily: theme.fontBody }}>写真なし</span>
              </div>
            )}
          </div>
        </button>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" }}>
          <Tag theme={theme}>{categoryLabel(item.category)}</Tag>
          {memberName && <Tag theme={theme}>{memberName}</Tag>}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: theme.inkSoft, fontFamily: theme.fontBody }}>
            <Swatch theme={theme} colorId={item.color} />
            {colorLabel(item.color)}
          </span>
        </div>

        {item.brand && <div style={{ fontSize: 12, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 8 }}>{item.brand}</div>}

        <button onClick={() => setExpanded((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", color: theme.accent, fontFamily: theme.fontBody, fontSize: 12.5, padding: 0 }}>
          {expanded ? "閉じる" : "詳細を見る"}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontFamily: theme.fontDisplay, fontSize: 15, color: theme.ink, marginBottom: 4 }}>使用年数 {yearsUsed(item.purchaseDate) ?? "―"}</div>
            <div style={{ fontSize: 12, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 8 }}>購入日 {item.purchaseDate || "未設定"}{item.purchasePrice ? ` ・ ${yen(item.purchasePrice)}` : ""}</div>
            <StarRow theme={theme} value={item.favorite} onChange={() => {}} interactive={false} />
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.line}` }}>
              <div style={{ fontSize: 12, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 8, lineHeight: 1.7 }}>
                着用回数 {wearCount}回{lastWorn ? ` ・ 最終 ${lastWorn}` : ""}
                {costPerWear !== null && (<><br />1回あたり {yen(costPerWear)}</>)}
              </div>
              <button onClick={() => onWear(item.id)} disabled={wornToday}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "7px 0", borderRadius: 6, border: `1px solid ${wornToday ? theme.line : theme.accent}`, background: wornToday ? theme.stone : theme.accentSoft, color: wornToday ? theme.inkSoft : theme.accent, fontFamily: theme.fontBody, fontSize: 12.5, cursor: wornToday ? "default" : "pointer" }}>
                <Check size={14} />
                {wornToday ? "今日は記録済み" : "今日着た"}
              </button>
            </div>
            {item.note && <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${theme.line}`, fontSize: 12.5, color: theme.inkSoft, fontFamily: theme.fontBody, lineHeight: 1.6 }}>{item.note}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemForm({ theme, initial, members, onSave, onClose }) {
  const [category, setCategory] = useState(initial?.category || "top");
  const [color, setColor] = useState(initial?.color || "white");
  const [brand, setBrand] = useState(initial?.brand || "");
  const [purchaseDate, setPurchaseDate] = useState(initial?.purchaseDate || "");
  const [purchasePrice, setPurchasePrice] = useState(initial?.purchasePrice || "");
  const [memberId, setMemberId] = useState(initial?.memberId || members[0]?.id || "");
  const [favorite, setFavorite] = useState(initial?.favorite || 3);
  const [note, setNote] = useState(initial?.note || "");
  const [photo, setPhoto] = useState(initial?.photo || null);
  const fileRef = useRef(null);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }
  function submit() {
    onSave({ id: initial?.id || Date.now(), category, color, brand, purchaseDate, purchasePrice: purchasePrice ? Number(purchasePrice) : null, memberId, favorite, note, photo, wearLog: initial?.wearLog || [] });
    onClose();
  }

  const labelStyle = { fontSize: 12, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 6, display: "block" };
  const fieldStyle = { width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${theme.line}`, fontFamily: theme.fontBody, fontSize: 14, color: theme.ink, background: "#FFFFFF", boxSizing: "border-box" };

  return (
    <div style={{ background: theme.paper, border: `1px solid ${theme.line}`, borderRadius: theme.radius, padding: 20, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontFamily: theme.fontDisplay, fontSize: 18, color: theme.ink, margin: 0 }}>{initial ? "服を編集" : "服を登録"}</h2>
        <button onClick={onClose} aria-label="閉じる" style={{ background: "transparent", border: "none", cursor: "pointer", color: theme.inkSoft }}><X size={18} /></button>
      </div>
      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>持ち主</label>
          <select style={fieldStyle} value={memberId} onChange={(e) => setMemberId(e.target.value)}>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
        </div>
        <div>
          <label style={labelStyle}>種類</label>
          <select style={fieldStyle} value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
        </div>
        <div>
          <label style={labelStyle}>色</label>
          <select style={fieldStyle} value={color} onChange={(e) => setColor(e.target.value)}>{COLOR_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
        </div>
        <div>
          <label style={labelStyle}>ブランド</label>
          <input type="text" style={fieldStyle} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="例:ユニクロ" />
        </div>
        <div>
          <label style={labelStyle}>購入日</label>
          <input type="date" style={fieldStyle} value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>購入金額(円)</label>
          <input type="number" style={fieldStyle} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="例:5000" min="0" />
        </div>
        <div>
          <label style={labelStyle}>お気に入り度</label>
          <div style={{ paddingTop: 8 }}><StarRow theme={theme} value={favorite} onChange={setFavorite} interactive size={20} /></div>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>写真</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 6, border: `1px solid ${theme.line}`, background: "#FFFFFF", fontFamily: theme.fontBody, fontSize: 13, color: theme.inkSoft, cursor: "pointer" }}>
          <Camera size={15} />{photo ? "写真を変更" : "写真を選ぶ"}
        </button>
        {photo && <img src={photo} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, marginTop: 8 }} />}
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>備考</label>
        <textarea style={{ ...fieldStyle, resize: "vertical", minHeight: 60 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="購入場所やお手入れのメモなど" />
      </div>
      <button onClick={submit} style={{ width: "100%", padding: "10px 0", borderRadius: 6, border: "none", background: theme.accent, color: "#FFFFFF", fontFamily: theme.fontBody, fontSize: 14, cursor: "pointer" }}>{initial ? "更新する" : "登録する"}</button>
    </div>
  );
}

export default function ClosetApp() {
  const [themeId, setThemeId] = useState(() => localStorage.getItem("closet-app-theme") || "natural");
  const theme = THEMES[themeId] || THEMES.natural;

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("closet-app-members");
    if (!saved) return DEFAULT_MEMBERS;
    const parsed = JSON.parse(saved);
    return parsed.map((m) => ({ personalColor: "none", ...m }));
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("closet-app-items");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, category: "top", color: "navy", brand: "", purchaseDate: "2023-04-10", purchasePrice: 4500, memberId: "me", favorite: 4, note: "仕事用の定番シャツ", photo: null, wearLog: [] },
      { id: 2, category: "outer", color: "beige", brand: "", purchaseDate: "2021-11-02", purchasePrice: 18000, memberId: "me", favorite: 5, note: "冬の主力コート", photo: null, wearLog: [] },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [filter, setFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => { localStorage.setItem("closet-app-items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("closet-app-theme", themeId); }, [themeId]);
  useEffect(() => { localStorage.setItem("closet-app-members", JSON.stringify(members)); }, [members]);

  const byMember = memberFilter === "all" ? items : items.filter((i) => i.memberId === memberFilter);
  const filtered = filter === "all" ? byMember : byMember.filter((i) => i.category === filter);
  const sorted = sortItems(filtered, sortBy);

  function saveItem(item) {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) return prev.map((i) => (i.id === item.id ? item : i));
      return [item, ...prev];
    });
  }
  function requestDelete(id) { setConfirmDeleteId(id); }
  function confirmDelete() { setItems((prev) => prev.filter((i) => i.id !== confirmDeleteId)); setConfirmDeleteId(null); }
  function openEdit(item) { setEditingItem(item); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingItem(null); }
  function markWorn(id) {
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const log = i.wearLog || [];
      if (log[log.length - 1] === todayStr()) return i;
      return { ...i, wearLog: [...log, todayStr()] };
    }));
  }
  function addMember(name) { setMembers((prev) => [...prev, { id: `m${Date.now()}`, name, personalColor: "none" }]); }
  function deleteMember(id) {
    setMembers((prev) => {
      const rest = prev.filter((m) => m.id !== id);
      const fallback = rest[0]?.id;
      setItems((items2) => items2.map((i) => (i.memberId === id ? { ...i, memberId: fallback } : i)));
      if (memberFilter === id) setMemberFilter("all");
      return rest;
    });
  }
  function updateMemberPersonalColor(id, personalColor) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, personalColor } : m)));
  }

  return (
    <div style={{ background: theme.stone, minHeight: "100vh", padding: "32px 16px 60px", fontFamily: theme.fontBody }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: theme.inkSoft, letterSpacing: 2, marginBottom: 4 }}>CLOSET RECORD</div>
          <h1 style={{ fontFamily: theme.fontDisplay, fontSize: 26, color: theme.ink, margin: 0 }}>わたしの洋服帳</h1>
        </div>

        <div style={{ borderTop: `2px dashed ${theme.line}`, marginBottom: 18 }} />

        <div className="filter-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 4, display: "block" }}>テイスト</label>
            <select value={themeId} onChange={(e) => setThemeId(e.target.value)} style={{ ...selectStyle(theme), width: "100%" }}>{Object.entries(THEMES).map(([id, t]) => <option key={id} value={id}>{t.name}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 4, display: "block" }}>持ち主</label>
            <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)} style={{ ...selectStyle(theme), width: "100%" }}>
              <option value="all">全員</option>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 4, display: "block" }}>種類</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...selectStyle(theme), width: "100%" }}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: theme.inkSoft, fontFamily: theme.fontBody, marginBottom: 4, display: "block" }}>並び替え</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ ...selectStyle(theme), width: "100%" }}>{SORT_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button onClick={() => setShowInsights((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, border: `1px solid ${showInsights ? theme.accent : theme.line}`, background: showInsights ? theme.accent : "#FFFFFF", color: showInsights ? "#FFFFFF" : theme.inkSoft, cursor: "pointer", fontFamily: theme.fontBody, fontSize: 12 }}>
            <Sparkles size={13} />
            コーデ提案
          </button>
          <button onClick={() => setShowMemberModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, border: `1px solid ${theme.line}`, background: "#FFFFFF", color: theme.inkSoft, cursor: "pointer", fontFamily: theme.fontBody, fontSize: 12 }}>
            <Users size={13} />
            家族を管理
          </button>
          <button onClick={() => { setEditingItem(null); setShowForm((s) => !s); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 6, border: "none", background: theme.ink, color: "#FFFFFF", cursor: "pointer", fontFamily: theme.fontBody, fontSize: 13, whiteSpace: "nowrap" }}>
            <Plus size={16} />
            服を追加
          </button>
        </div>

        {showInsights && <InsightsPanel theme={theme} items={items} members={members} scopeMemberId={memberFilter} />}

        {showForm && <ItemForm theme={theme} initial={editingItem} members={members} onSave={saveItem} onClose={closeForm} />}

        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: theme.inkSoft, fontSize: 13 }}>
            <Shirt size={28} color={theme.inkSoft} strokeWidth={1.2} style={{ marginBottom: 10 }} />
            <div>まだ登録された服がありません。</div>
          </div>
        ) : (
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 18 }}>
            {sorted.map((item) => <ClothCard key={item.id} theme={theme} item={item} members={members} onDelete={requestDelete} onEdit={openEdit} onWear={markWorn} />)}
          </div>
        )}

        <div style={{ marginTop: 40, fontSize: 11.5, color: theme.inkSoft, textAlign: "center" }}>登録したデータはこのブラウザに保存されます。</div>
      </div>

      {confirmDeleteId && <ConfirmModal theme={theme} message="この服を削除します。よろしいですか？" onConfirm={confirmDelete} onCancel={() => setConfirmDeleteId(null)} />}
      {showMemberModal && <MemberManageModal theme={theme} members={members} onAdd={addMember} onDelete={deleteMember} onUpdatePersonalColor={updateMemberPersonalColor} onClose={() => setShowMemberModal(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=Noto+Sans+JP:wght@400;500&family=Rampart+One&family=Zen+Maru+Gothic:wght@400;500;700&family=Mochiy+Pop+One&family=Zen+Old+Mincho&display=swap');
        @media (max-width: 600px) { .filter-row { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .cards-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}