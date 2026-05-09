# SPINEX-PH SEO Site — 規劃提案

> 給韋瀚確認方向後再開工

## 一、整體策略

**核心目標**：用 SEO 站搶 SPINEX 品牌詞 + 通用菲律賓 casino 關鍵字流量，把訪客導到主站 spinex.fun（帶 referral 後綴 `gg60164` 追蹤代理線）。

**SEO 站性質**：**內容站**，不是落地頁
- 不直接玩遊戲（玩遊戲都導去主站）
- 多頁、多文章，給 Google + AI 搜尋抓
- 結構化資料（schema.org）強化 AI 搜尋表現

---

## 二、頁面架構（多頁 SEO）

```
spinex-ph.com/
├── /                              首頁（品牌介紹 + CTA + 熱門遊戲展示）
├── /slots/                        Slots 主頁
│   ├── /slots/jili/               JILI 遊戲商介紹頁
│   ├── /slots/pg-soft/            PG Soft 遊戲商介紹頁
│   └── /slots/fachai/             FaChai 遊戲商介紹頁
├── /live-casino/                  真人賭場主頁
│   └── /live-casino/crazy-time/   Crazy Time 攻略文
├── /promotions/                   優惠活動頁（首存 + Cashback）
├── /banking/                      存提款方式（GCash / Maya / GrabPay）
├── /how-to-register/              註冊教學文（SEO 重點長文）
├── /reviews/                      SPINEX 評測（自家寫的正面評測）
├── /blog/                         部落格首頁
│   ├── /blog/jili-slots-guide/                JILI 老虎機完整攻略
│   ├── /blog/best-pg-slots-philippines/       菲律賓最佳 PG 老虎機
│   ├── /blog/crazy-time-strategy/             Crazy Time 玩法策略
│   └── /blog/gcash-casino-guide/              GCash 賭場入金教學
└── /faq/                          常見問題（FAQ schema）
```

**第一階段（先上線）**：首頁 + JILI/PG/FaChai 三個品牌頁 + Crazy Time 頁 + Promotions + Banking + FAQ — 共 9 頁
**第二階段（之後擴充）**：Blog 文章、深度攻略

---

## 三、視覺設計

### 配色（依附圖）
- **主色**：藍色霓虹 `#00BFFF` / `#0099FF`（CTA 按鈕、強調）
- **背景**：深藍黑 `#0A1428` ~ `#000814`（漸變）
- **金屬銀**：`#C0C0C0` ~ `#E8E8E8`（標題文字、邊框）
- **點綴金**：`#FFD700`（VIP / Bonus 區塊）
- **白文字**：`#FFFFFF` / `#E0E0E0`

### 字體
- **標題**：Orbitron / Rajdhani（科技感 / 金屬感）
- **內文**：Inter / Roboto

### 視覺元素
- 藍色光暈、霓虹邊框、星空背景
- 主視覺借用附圖風格：金屬質感 + 藍光軌跡

---

## 四、CTA 按鈕策略（後綴規則）

✅ **規則**：所有導向主站的連結都帶 `?referral=gg60164`

範例：
```html
<!-- 對 ✓ -->
<a href="https://www.spinex.fun/?referral=gg60164">Play Now</a>
<a href="https://www.spinex.fun/egames?locale=en&referral=gg60164">Slots</a>
<a href="https://www.spinex.fun/bonuses/4?locale=en&referral=gg60164">Claim Bonus</a>

<!-- 錯 ✗ -->
<a href="https://www.spinex.fun/">Play Now</a>
```

**統一管理**：用 JS 變數 `const REFERRAL = 'gg60164'`，所有外連從這個基準產生

---

## 五、SEO 重點

### Title / Description / H1 範例

| 頁面 | Title | Meta Description |
|---|---|---|
| 首頁 | SPINEX Philippines: PAGCOR Online Casino with JILI, PG & Live Games | Play SPINEX, the trusted Philippine online casino. Get ₱1,000 first deposit bonus + ₱3,000 cashback. JILI slots, PG slots, Crazy Time. GCash & Maya supported. |
| /slots/jili/ | JILI Slots Philippines: Top Games, Bonuses & GCash Deposits at SPINEX | Play 100+ JILI slot games at SPINEX. Super Ace, Boxing King, Money Coming. Deposit via GCash/Maya. Get ₱1,000 first deposit bonus. |
| /promotions/ | SPINEX Promotions: ₱1,000 Welcome Bonus + ₱3,000 Cashback | Claim SPINEX's ₱1,000 first deposit bonus and unlimited ₱3,000 cashback. Plus daily promotions for Filipino players. |

### 必含關鍵字（散布全站）
- SPINEX
- Philippines online casino
- PAGCOR licensed *(注意：spinex 沒有 PAGCOR 牌照，這裡寫的話可能有風險，韋瀚確認)*
- JILI / JILI Slots / JILI Super Ace
- PG Soft / PG Slots
- FaChai
- Evolution / Crazy Time
- GCash casino / Maya casino
- ₱1,000 first deposit bonus
- ₱3,000 cashback

### 結構化資料（schema.org）
- `Organization` schema（首頁）
- `FAQPage` schema（FAQ 頁）
- `Article` schema（Blog 文章）
- `BreadcrumbList`（每頁麵包屑）
- `Review` / `AggregateRating`（評測頁，假評分）

### 技術 SEO
- Sitemap.xml + robots.txt
- Open Graph + Twitter Card meta
- Canonical URL（防重複）
- Mobile responsive（菲律賓手機流量為主）
- LCP < 2.5s（壓縮圖片、CDN、CSS inline 關鍵樣式）
- Lazy load 所有 below-fold 圖片

---

## 六、遊戲商 / 遊戲 Logo 與圖片

⚠️ **規則：用官方版本，絕對不自己生成**

需要蒐集：
- [ ] **JILI** logo（從 JILI 官網或 game lobby）
- [ ] **PG Soft** logo（pgsoft.com 或 game lobby）
- [ ] **FaChai** logo
- [ ] **Evolution Gaming** logo
- [ ] **Crazy Time** 遊戲 banner（Evolution 官方素材）
- [ ] JILI 熱門遊戲 banner：Super Ace, Boxing King, Money Coming, Fortune Gems
- [ ] PG 熱門遊戲 banner：Mahjong Ways 2, Treasures of Aztec, Wild Bandito
- [ ] FaChai 熱門遊戲 banner

**Banking logos**（也用官方）：
- GCash、Maya、GrabPay 官方 logo

蒐集策略：先用瀏覽器去主站 spinex.fun 抓 game lobby 的圖（既然是同集團，可直接用），不行再去各遊戲商官網扒。

---

## 七、技術選型

- **靜態 HTML**（不用框架，快、SEO 好、易維護）
- 共用 header/footer 用 SSI 或部署前 build 步驟
- CSS：手寫 + Tailwind play CDN（開發用）→ 上線壓 CSS
- JS：minimal vanilla（只做 mobile menu、CTA referral 注入）

---

## 八、部署

- **VPS**：174.138.26.149（Arcade Wheel 主機）
- **目錄**：`/var/www/spinex-ph-seo/`
- **網址**：spinex-ph.com（Cloudflare proxy 開）
- **Caddy 設定**：新增一條 site block
- **CF SSL Mode**：Full（不用 strict）
- **HTTPS**：Caddy 自動拿 LE / 用 CF Origin Cert

---

## 九、開發里程碑

### Phase 1 — 基礎站（目標 1-2 天）
- [ ] 蒐集所有官方 logo / 遊戲圖
- [ ] 設計主視覺 + banner（GPT-IMAGE-2，**只做裝飾，不做遊戲**）
- [ ] 寫共用 header / footer / nav
- [ ] 首頁
- [ ] Slots 主頁 + JILI / PG / FaChai 三品牌頁
- [ ] Live Casino + Crazy Time
- [ ] Promotions / Banking / FAQ
- [ ] Schema.org 標記
- [ ] Sitemap + robots.txt
- [ ] 部署 + DNS + Caddy + SSL

### Phase 2 — 內容擴充（之後）
- [ ] Blog 文章 5-10 篇
- [ ] Reviews 頁（自家評測）
- [ ] How-to 系列文章
- [ ] 提交 Google Search Console

---

## ❓ 等你確認的問題

1. **PAGCOR 牌照**：SPINEX 有沒有 PAGCOR 牌照？SEO 上寫 "PAGCOR licensed" 是流量金鑰但有合規風險
2. **Bonus 金額**：首存 ₱1,000 / Cashback ₱3,000 從主站抓的，這些金額對外能寫嗎？
3. **VPS Caddy 設定**：spinex-ph.com 我直接加進現有 Caddyfile 還是另外開？
4. **CF Origin Cert / LE**：spinex-ph.com 要不要用 CF Origin Cert（15 年）？
5. **遊戲 logo 來源**：可以直接從 spinex.fun 抓圖（既然是同集團）嗎？還是要去各官網扒？

---

確認方向後我就開工。
