# @fringeworks/react-style-proxy

`@fringeworks/react-style-proxy` は React コンポーネントのスタイルプロパティ（`style` / `css` / `sx` など）へスタイルを適用するための、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

## 概要

コンポーネントや HOC が独自のスタイルを付け加えるときは、利用者から渡されたスタイルと組み合わせる必要があります。\
このライブラリはそのための 2 つの関数を提供します。

- `applyStyle` — スタイルプロパティの値へスタイルを適用する
- `styleProxy` — props のスタイルプロパティへスタイルを適用する

素の `style` に加え、配列も受け付ける CSS-in-JS ライブラリの `css` / `sx` プロパティにも使えます。

## インストール

```sh
npm install @fringeworks/react-style-proxy
```

## 使い方

### スタイルプロパティの値へ適用する

```tsx
import { applyStyle } from '@fringeworks/react-style-proxy';

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
import { styleProxy } from '@fringeworks/react-style-proxy';

function withPadding(Component, options) {
  return (props) => (
    <Component {...styleProxy(props, { padding: 8 }, options)} />
  );
}

const PaddedBox = withPadding(Box, { styleProp: 'sx' });
```

## API

| 関数                                  | 説明                                           |
| ------------------------------------- | ---------------------------------------------- |
| `applyStyle(target, style, options?)` | スタイルプロパティの値へスタイルを適用する     |
| `styleProxy(props, style, options?)`  | props のスタイルプロパティへスタイルを適用する |

### `applyStyle`

```ts
applyStyle<T extends CSSProperties | null | undefined>(target: T, style: StyleValue, options?: ApplyStyleOptions & { styleMergeMode?: 'merge' }): T | CSSProperties
applyStyle<T>(target: T, style: StyleValue, options?: ApplyStyleOptions): ApplyStyleResult<T>
```

`target`（スタイルプロパティの値）へ `style` を適用した結果を返します。\
`target` 自体は変更しません。

| 引数       | 型                  | 説明                                                                                           |
| ---------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `target`   | `T`                 | スタイルプロパティの現在の値                                                                   |
| `style`    | `StyleValue`        | 適用するスタイル。配列の場合は要素を順に適用し、後ろの要素が優先される。falsy な要素は無視する |
| `options?` | `ApplyStyleOptions` | 下記のオプション                                                                               |

結果は `target` によって次のように決まります。

| `target`                         | 結果                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `null` / `undefined` / `boolean` | `style`                                                           |
| オブジェクト                     | 1 つのオブジェクトにマージ（`styleMergeMode: 'append'` なら配列） |
| 配列 / 関数 / その他の値         | `style` を加えた配列                                              |

`sx` の関数形式（`(theme) => ({ ... })`）や文字列・数値などの値は、配列の要素として残るので失われません。`styleMergeMode` の指定にかかわらず配列になります。\
`boolean` は `cond && style` の `false` を想定し、`style` で置き換えます。\
`style` が falsy または空の場合は、`target` をそのまま返します。

| オプション        | 型               | 説明                                                                                                                                                     |
| ----------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `styleMergeMode?` | `StyleMergeMode` | オブジェクトの `target` との組み合わせ方。`'merge'`: プロパティを 1 つのオブジェクトにマージする、`'append'`: 配列にして結合する。デフォルトは `'merge'` |
| `styleAsDefault?` | `boolean`        | `style` をデフォルト値として扱い、`target` を `style` より優先する。`style` の配列の中では、指定しない場合と同じく後ろの要素が優先される                 |

オブジェクト同士をマージするとき、値が `undefined` のプロパティは未指定として扱い、もう一方の値を使います。\
配列で結合するときは、優先される側を末尾に置きます。

### `styleProxy`

```ts
styleProxy<P extends object, K extends string = 'style'>(props: P, style: StyleValue, options?: StyleProxyOptions<K> & { styleMergeMode?: 'merge' }): StyleProxyResult<P, K, 'merge'>
styleProxy<P extends object, K extends string = 'style'>(props: P, style: StyleValue, options?: StyleProxyOptions<K>): StyleProxyResult<P, K>
```

`props[styleProp]` へ `applyStyle` で `style` を適用した新しい props を返します。\
`props` 自体は変更しません。適用するスタイルが無い場合は、`styleProp` のプロパティを追加しません。

| 引数       | 型                     | 説明                                          |
| ---------- | ---------------------- | --------------------------------------------- |
| `props`    | `P`                    | コンポーネントのプロパティ                    |
| `style`    | `StyleValue`           | 適用するスタイル（`applyStyle` と同じ）       |
| `options?` | `StyleProxyOptions<K>` | `applyStyle` のオプションと、下記のオプション |

| オプション   | 型  | 説明                                                       |
| ------------ | --- | ---------------------------------------------------------- |
| `styleProp?` | `K` | スタイルを適用するプロパティの名前。デフォルトは `'style'` |

戻り値の型は、`props` の `styleProp` のプロパティを、スタイルを適用した結果の型に置き換えたものです。`'merge'` でオブジェクトの値なら `CSSProperties` のまま、配列になりうる場合は配列を含む型になります。\
`string` 型の変数を渡した場合など、`styleProp` の名前が型の上で決まらない場合は `P` のままです。

### 型

| 型                          | 説明                                                                          |
| --------------------------- | ----------------------------------------------------------------------------- |
| `StyleValue`                | 適用するスタイル（`StyleItem \| StyleItem[]`）                                |
| `StyleItem`                 | 適用するスタイルの要素（`CSSProperties \| false \| null \| undefined`）       |
| `StyleMergeMode`            | オブジェクトの `target` との組み合わせ方（`'merge' \| 'append'`）             |
| `ApplyStyleOptions`         | `applyStyle` のオプション                                                     |
| `ApplyStyleResult<T>`       | `applyStyle` の戻り値                                                         |
| `StyleProxyOptions<K>`      | `styleProxy` のオプション                                                     |
| `StyleProxyResult<P, K, M>` | `styleProxy` の戻り値（`styleProp` のプロパティを適用した結果の型にした `P`） |

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
