# Command Copy Site

「コマンドセット(手順書)」を登録し、ステップ単位 or セット全体で一括コピーできる静的サイト。
GitHub Pages で公開: https://kotaaaaaaaa12.github.io/command_copy_site/

## 使い方

- 検索窓でセット・セクション・ステップを絞り込み
- ステップ名 / コマンドをクリックでコピー
- 「全コピー」ボタンでセット全体を番号付きテキスト形式で一括コピー

## セットを追加する

`sets.json` に追加するだけ:

```json
{
  "id": "unique-id",
  "title": "セット名",
  "sections": [
    {
      "title": "[1]みたいなセクション名",
      "steps": [
        { "desc": "ステップ名", "cmd": "command --here" },
        { "desc": "ステップ名", "note": "注記(省略可)", "cmd": "command" }
      ]
    }
  ]
}
```

## ローカルで動かす

```sh
python3 -m http.server 8000
```

→ http://localhost:8000

(クリップボード API は HTTPS または localhost でのみ動作します)

## 公開(GitHub Pages)

master ブランチ / root で公開済み。push すると自動反映されます。
