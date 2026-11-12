# Command Copy Site

よく使うコマンドをワンクリックでコピーできるシンプルな静的サイト。
GitHub Pages で公開できます。

## 使い方

- 検索窓でコマンドを絞り込み
- カテゴリボタンでフィルタ
- カードをクリック(または Enter)でクリップボードにコピー

## コマンドを追加する

`commands.json` に1行追加するだけ:

```json
{ "cmd": "git pull", "desc": "プル", "category": "git" }
```

`category` が新しい値ならカテゴリボタンも自動で追加されます
(`main.js` の `CATEGORY_LABELS` に表示名を足すと日本語ラベルになります)。

## ローカルで動かす

```sh
python3 -m http.server 8000
```

→ http://localhost:8000

(クリップボード API は HTTPS または localhost でのみ動作します)

## 公開(GitHub Pages)

1. GitHub にリポジトリを作成して push
2. Settings → Pages → Source: `main` ブランチ / `/ (root)`
3. `https://<ユーザ名>.github.io/command_copy_site/` で公開される
