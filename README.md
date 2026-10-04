# @fringeworks/react-style-proxy

`@fringeworks/react-style-proxy` is a niche library for applying styles to the style property of React components, whether it is `style`, `css` or `sx`.

**[日本語のREADMEはこちら](./README.ja.md)**

## Overview

When a component or a HOC adds its own styles, it has to combine them with the styles given by the user.\
This library provides two functions for that.

- `applyStyle` — applies styles to the value of a style property
- `styleProxy` — applies styles to the style property in props

Both work with plain `style` as well as with the `css` / `sx` props of CSS-in-JS libraries, which also accept arrays.

## Installation

```sh
npm install @fringeworks/react-style-proxy
```

## Usage

### Applying to the value of a style property

```tsx
import { applyStyle } from '@fringeworks/react-style-proxy';

function Box(props: BoxProps) {
  return <div {...props} style={applyStyle(props.style, { padding: 8 })} />;
}
```

Falsy values are ignored, so conditional styles can be written as they are.

```tsx
<div
  style={applyStyle(props.style, [
    { padding: 8 },
    isActive && { color: 'red' },
  ])}
/>
```

### Applying to props

Use `styleProxy` when the name of the style property is decided at runtime, such as in a HOC.

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

### `applyStyle(target, style, options?)`

Applies `style` to `target` (the value of a style property) and returns the result.\
`target` itself is not modified.

| Parameter | Type                                      | Description                       |
| --------- | ----------------------------------------- | --------------------------------- |
| `target`  | any                                       | The current value of the property |
| `style`   | `StyleItem \| StyleItem[]`                | The styles to apply               |
| `options` | [`ApplyStyleOptions`](#applystyleoptions) | Options                           |

`StyleItem` is `CSSProperties | false | null | undefined`.\
When an array is given, its elements are applied in order.

The result depends on `target`.

| `target`             | Result                                                              |
| -------------------- | ------------------------------------------------------------------- |
| `null` / `undefined` | `style`                                                             |
| Array / Function     | An array with `style` added                                         |
| Object               | Merged into an object (or an array with `styleMergeMode: 'append'`) |
| Others               | Replaced with `style`                                               |

A function `target`, such as the function form of `sx` (`(theme) => ({ ... })`), is kept as an element of the array, so it is not lost. The array is created regardless of `styleMergeMode`.\
When `style` is falsy or empty, `target` is returned as it is.

### `styleProxy(props, style, options?)`

Applies `style` to `props[styleProp]` with `applyStyle` and returns new props.\
`props` itself is not modified.

| Parameter | Type                                      | Description         |
| --------- | ----------------------------------------- | ------------------- |
| `props`   | object                                    | Component props     |
| `style`   | `StyleItem \| StyleItem[]`                | The styles to apply |
| `options` | [`StyleProxyOptions`](#styleproxyoptions) | Options             |

### `ApplyStyleOptions`

| Option           | Type                  | Default   | Description                                                                                                                          |
| ---------------- | --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `styleMergeMode` | `'merge' \| 'append'` | `'merge'` | How to combine with an object `target`.<br>`'merge'`: merge the properties into one object<br>`'append'`: combine them into an array |
| `styleAsDefault` | `boolean`             | `false`   | Treats `style` as default values.<br>`false`: `style` overrides `target`<br>`true`: `target` takes precedence over `style`           |

When merging objects, properties whose value is `undefined` are treated as not specified, and the value on the other side is used.\
When combining into an array, the element with precedence is placed last.

### `StyleProxyOptions`

All options of `ApplyStyleOptions`, and the following.

| Option      | Type     | Default   | Description                          |
| ----------- | -------- | --------- | ------------------------------------ |
| `styleProp` | `string` | `'style'` | The name of the property to apply to |

## Notes

### Values created with emotion's `css` function

The `css` prop of emotion also accepts values created with the `css` function (`SerializedStyles`).\
They are plain objects, so with `styleMergeMode: 'merge'` they are merged as styles, and emotion ignores every property other than the serialized ones. As a result, the applied `style` is silently lost.

If such values may be given, specify `styleMergeMode: 'append'`.

```tsx
<div
  css={applyStyle(props.css, { padding: 8 }, { styleMergeMode: 'append' })}
/>
```

## License

MIT
