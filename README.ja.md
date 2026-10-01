# @niche-works/react-style-proxy

`@niche-works/react-style-proxy` は React コンポーネントのスタイルプロパティ（`style` / `css` / `sx` など）へスタイルを適用するためのニッチなライブラリです。

**[English README is available here](./README.md)**

## 概要

コンポーネントや HOC が独自のスタイルを付け加えるときは、利用者から渡されたスタイルと組み合わせる必要があります。\
このライブラリはそのための 2 つの関数を提供します。

- `applyStyle` — スタイルプロパティの値へスタイルを適用する
- `styleProxy` — props のスタイルプロパティへスタイルを適用する

素の `style` に加え、配列も受け付ける CSS-in-JS ライブラリの `css` / `sx` プロパティにも使えます。

## インストール

```sh
npm install @niche-works/react-style-proxy
```

## 使い方

### スタイルプロパティの値へ適用する

```tsx
import { applyStyle } from '@niche-works/react-style-proxy';

function Box(props: BoxProps) {
  return <div {...props} style={applyStyle(props.style, { padding: 8 })} />;
}
```

falsy な値は無視されるため、条件付きのスタイルをそのまま書けます。

```tsx
<div
  style={applyStyle(props.style, [
    { padding: 8 },
    isActive && { color: 'red' },
  ])}
/>
```

### props へ適用する

HOC などでスタイルプロパティの名前が実行時に決まる場合は `styleProxy` を使います。

```tsx
import { styleProxy } from '@niche-works/react-style-proxy';

function withPadding(Component, options) {
  return (props) => (
    <Component {...styleProxy(props, { padding: 8 }, options)} />
  );
}

const PaddedBox = withPadding(Box, { styleProp: 'sx' });
```

## API

### `applyStyle(target, style, options?)`

`target`（スタイルプロパティの値）へ `style` を適用した結果を返します。\
`target` 自体は変更しません。

| 引数      | 型                                        | 説明                         |
| --------- | ----------------------------------------- | ---------------------------- |
| `target`  | 任意                                      | スタイルプロパティの現在の値 |
| `style`   | `StyleItem \| StyleItem[]`                | 適用するスタイル             |
| `options` | [`ApplyStyleOptions`](#applystyleoptions) | オプション                   |

`StyleItem` は `CSSProperties | false | null | undefined` です。\
配列を渡した場合は、要素を順に適用します。

結果は `target` によって次のように決まります。

| `target`             | 結果                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `null` / `undefined` | `style`                                                           |
| 配列 / 関数          | `style` を加えた配列                                              |
| オブジェクト         | 1 つのオブジェクトにマージ（`styleMergeMode: 'append'` なら配列） |
| その他               | `style` で置き換え                                                |

`sx` の関数形式（`(theme) => ({ ... })`）のような関数の `target` は、配列の要素として残るので失われません。`styleMergeMode` の指定にかかわらず配列になります。\
`style` が falsy または空の場合は、`target` をそのまま返します。

### `styleProxy(props, style, options?)`

`props[styleProp]` へ `applyStyle` で `style` を適用した新しい props を返します。\
`props` 自体は変更しません。

| 引数      | 型                                        | 説明                       |
| --------- | ----------------------------------------- | -------------------------- |
| `props`   | オブジェクト                              | コンポーネントのプロパティ |
| `style`   | `StyleItem \| StyleItem[]`                | 適用するスタイル           |
| `options` | [`StyleProxyOptions`](#styleproxyoptions) | オプション                 |

### `ApplyStyleOptions`

| オプション       | 型                    | デフォルト | 説明                                                                                                                                   |
| ---------------- | --------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `styleMergeMode` | `'merge' \| 'append'` | `'merge'`  | オブジェクトの `target` との組み合わせ方。<br>`'merge'`: プロパティを 1 つのオブジェクトにマージする<br>`'append'`: 配列にして結合する |
| `styleAsDefault` | `boolean`             | `false`    | `style` をデフォルト値として扱うかどうか。<br>`false`: `style` で `target` を上書きする<br>`true`: `target` を `style` より優先する    |

オブジェクト同士をマージするとき、値が `undefined` のプロパティは未指定として扱い、もう一方の値を使います。\
配列で結合するときは、優先される側を末尾に置きます。

### `StyleProxyOptions`

`ApplyStyleOptions` のすべてのオプションに加え、次のオプションがあります。

| オプション  | 型       | デフォルト | 説明                               |
| ----------- | -------- | ---------- | ---------------------------------- |
| `styleProp` | `string` | `'style'`  | スタイルを適用するプロパティの名前 |

## 注意事項

### emotion の `css` 関数で作った値

emotion の `css` プロパティには、`css` 関数で作った値（`SerializedStyles`）も渡せます。\
この値はふつうのオブジェクトなので、`styleMergeMode: 'merge'` ではスタイルとしてマージされます。emotion はこの値の変換済みの部分以外のプロパティを無視するため、適用した `style` がエラーもなく失われます。

このような値が渡される可能性がある場合は、`styleMergeMode: 'append'` を指定してください。

```tsx
<div
  css={applyStyle(props.css, { padding: 8 }, { styleMergeMode: 'append' })}
/>
```

## ライセンス

MIT
