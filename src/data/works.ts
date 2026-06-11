// 公開作品のデータ。詳細ページ本文は各ページ側に持ち、ここには一覧・メタ情報だけを置く
export interface Work {
  slug: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  tags: string[];
  demo: string;
  repo: string;
  image: string;
  imageAlt: string;
  ogImage: string;
}

export const works: Work[] = [
  {
    slug: 'neural-network-playground',
    title: 'Neural Network Playground',
    year: '2026',
    type: '個人開発 / Web App',
    summary: 'ニューラルネットワークの学習過程をブラウザでリアルタイム可視化するWebアプリ。順伝播・逆伝播・勾配降下法を外部ライブラリなしでゼロから実装。',
    tags: ['JavaScript', 'Canvas API', '機械学習', 'ニューラルネットワーク', '可視化', 'No libraries', 'GitHub Pages'],
    demo: 'https://denidula.github.io/neural-network-playground/',
    repo: 'https://github.com/Denidula/neural-network-playground',
    image: '/works/neural-network-playground.webp',
    imageAlt: 'Neural Network Playground のスクリーンショット：渦巻きデータセットの決定境界ヒートマップとネットワーク図',
    ogImage: '/works/neural-network-playground-og.jpg',
  },
];
