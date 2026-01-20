export const STREAM_KEYWORDS = [
    "PROFILE",
    "WORKS",
    "SERVICES",
    "COMPANY",
    "CONTACT"
];

export const COLORS = {
    bg: '#F4F4F4',
    text: '#1A1A1A',
    accent: '#0044CC', // Architectural Blue
    danger: '#FF3300'  // Alert Red
};

export interface KeywordDetail {
    role: string;
    context: string;
    description: string;
    date?: string;
    clearance?: string;
    origin?: string;
    layout?: 'standard' | 'poem';
    images?: string[];
    logo?: string;
}

export const KEYWORD_DATA: Record<string, KeywordDetail> = {
    "PROFILE": {
        role: "Representative / Strategist",
        context: "KAMINO TAKAHIRO",
        description: `[ CORE DEFINITION ]
ビジネスモデルの構築、ブランド戦略、そしてAI実装まで。
論理（Logic）と感性（Instinct）を往復しながら、事業の「勝ち筋」を描く戦略家。

[ CAREER ]
株式会社Bloom Road 取締役会長
// 政治×テクノロジー (Political Tech) の新規事業統括。

西神珈竰 (West God Curry) Founder
// 独自のレシピ開発とブランドアーキテクチャの構築。

株式会社PLAT FARMER 代表取締役
// 「思考法DX」メソッドの開発と企業導入支援。

[ STANCE ]
「混沌を愛し、秩序を実装せよ。」
複雑な課題をシンプルに解きほぐし、美しい構造へと再編集する。`,
        date: "1978 - NOW",
        clearance: "Representative",
        origin: "NARA"
    },

    "WORKS": {
        role: "Portfolio / Archive",
        context: "PROJECTS",
        description: `[ WEST GOD CURRY ]
神戸発、スパイスカレーブランドの開発と展開。
レシピの数値化による味の再現性確保と、ブランド世界観の構築。

[ AX-2026 ]
政治活動におけるDX支援プラットフォーム。
有権者データの分析から、戦略立案までをAIでサポート。

[ LEGAL TRIP ]
「合法的にトリップする」をコンセプトとしたスイーツブランド。
常識の枠を超える味覚体験のデザイン。

[ BRAIN OS ]
思考プロセスの可視化と最適化を行うメソッド開発。
企業の意思決定スピードを加速させる組織OSのアップデート。`,
        date: "ARCHIVE",
        clearance: "PUBLIC",
        origin: "Design K",
        // images: ["/artworks/uploaded_image_0_1768911332524.png"] // Optional: Add showcase images if available
    },

    "SERVICES": {
        role: "Solutions",
        context: "OFFERINGS",
        description: `01. STRATEGY
経営戦略、新規事業立案、ブランド戦略の策定。
市場分析に基づき、競争優位性のあるビジネスモデルを構築します。

02. DESIGN
CI/VI開発、Webデザイン、UI/UXデザイン。
戦略を視覚言語へと翻訳し、ユーザーの感性に響く体験を創出します。

03. ENGINEERING
Webアプリケーション開発、AI導入支援、DX推進。
最新のテクノロジーを活用し、ビジネスプロセスを効率化・自動化します。

04. PRODUCING
飲食事業、プロダクト開発、空間プロデュース。
リアルとデジタルを横断した、包括的な事業プロデュースを行います。`,
        date: "AVAILABLE",
        clearance: "SERVICE",
        origin: "Design K"
    },

    "COMPANY": {
        role: "Corporate Profile",
        context: "Design K",
        description: `[ OUTLINE ]
屋号：Design K (デザインケー)
代表：神野 貴弘
設立：2012年
拠点：奈良県奈良市学園南2丁目12 (NARA BASE)

[ MISSION ]
"RE:EDITING REALITY"
現実を再編集し、新たな価値を創造する。

[ DOMAIN ]
Creative Direction / Web Design / System Development
Business Consulting / Food Producing`,
        date: "EST. 2012",
        clearance: "CORPORATE",
        origin: "NARA"
    },

    "CONTACT": {
        role: "Get in touch",
        context: "CONTACT",
        description: `プロジェクトのご相談、講演依頼、協業のご提案など、
下記メールアドレスよりお気軽にお問い合わせください。
内容を確認の上、担当者よりご連絡させていただきます。

[ E-MAIL ]
go.kamino@me.com

[ SOCIAL ]
Project updates and thoughts are archived in the digital ether.`,
        date: "OPEN",
        clearance: "PUBLIC",
        origin: "MAIL"
    },

    // 00. PHILOSOPHY (Mapped from MESSAGE)
    "MESSAGE": {
        role: "Philosophy",
        context: "The Re-Editor",
        description: `最初に断っておくと、 僕は自分のことを一言で説明できるタイプではない。

デザイン、料理、アート、そしてAI。
一見バラバラに見えるこれらの活動は、僕の中ではすべて繋がっている。

それは「複雑なものを、美しく機能するように再編集する」こと。

言葉にならないブランドの熱を拾い上げ、誰かに届く形にする。
食材のポテンシャルを引き出し、記憶に残る味にする。
組織の混沌とした課題を整理し、走れる仕組みにする。

僕はずっと、この「再編集（Re-Editing）」という作業を続けている。

このサイトは、そんな僕の思考と実績のアーカイブであり、
Design K という実験室の記録でもある。

すべてを語る必要はない。
余白の中にこそ、真実は宿るのだから。`,
        date: "NOW",
        clearance: "PUBLIC",
        origin: "MIND",
        layout: 'poem'
    }
};

export const DEFAULT_PROFILE: KeywordDetail = {
    role: "Strategist / Creator",
    context: "神野 貴弘 (Takahiro Kamino)",
    description: "Design K 代表 / 株式会社Bloom Road 取締役会長 / 株式会社PLAT FARMER 代表取締役。\n「論理と感性の交差点で、事業を設計する」。",
    date: "TODAY",
    clearance: "MASTER",
    origin: "SYSTEM"
};
