import type { CSSProperties } from 'react';
import type {
  ApplyStyleOptions,
  ApplyStyleResult,
  StyleItem,
  StyleValue,
} from './types';

/**
 * スタイルプロパティ（style / css / sx など）の値へスタイルを適用する。
 *
 * @param target - スタイルプロパティの値
 * @param style - 適用したいスタイル（単一 or 配列）
 * @param options - マージ動作のオプション
 */
export default function applyStyle<T extends CSSProperties | null | undefined>(
  target: T,
  style: StyleValue,
  options?: ApplyStyleOptions & { styleMergeMode?: 'merge' },
): T | CSSProperties;
export default function applyStyle<T>(
  target: T,
  style: StyleValue,
  options?: ApplyStyleOptions,
): ApplyStyleResult<T>;
export default function applyStyle(
  target: unknown,
  style: StyleValue,
  options: ApplyStyleOptions = {},
): unknown {
  if (Array.isArray(style)) {
    return style.reduce(
      (result, stl) => _applyStyle(result, stl, options),
      target,
    );
  }
  return _applyStyle(target, style, options);
}

/**
 * 単一のスタイルを target へ適用する内部関数。
 */
function _applyStyle(
  target: unknown,
  incoming: StyleItem,
  options: ApplyStyleOptions,
): unknown {
  const { styleMergeMode = 'merge', styleAsDefault = false } = options;

  // 適用するスタイルが falsy または空なら何もしない
  if (!incoming || Object.keys(incoming).length === 0) {
    return target;
  }

  if (target == null) {
    // 未設定ならそのまま返す
    return incoming;
  } else if (Array.isArray(target)) {
    // target が配列の場合は常に配列で結合する
    return _concatStyles(incoming, target, styleAsDefault);
  } else if (typeof target === 'function') {
    // target が関数の場合（sx / css の関数形式など）は配列で結合する
    return _concatStyles(incoming, target, styleAsDefault);
  } else if (typeof target === 'object') {
    if (styleMergeMode === 'append') {
      // 明示的に配列結合を指定された場合
      return _concatStyles(incoming, target, styleAsDefault);
    } else {
      // デフォルト: オブジェクトをマージ
      return _mergeStyleObjects(incoming, target, styleAsDefault);
    }
  }

  // target が予期しない型の場合は incoming で上書き
  return incoming;
}

/**
 * 2つのスタイルオブジェクトを単一のオブジェクトにマージする。
 * styleAsDefault に応じて上書き方向を決定する。
 * 値が undefined のキーは未指定として扱い、もう一方の値で補完する。
 *
 * @param incoming - 新しく適用したいスタイル
 * @param existing - すでに設定されているスタイル
 * @param styleAsDefault - true なら existing を優先する
 */
function _mergeStyleObjects(
  incoming: CSSProperties,
  existing: CSSProperties,
  styleAsDefault: boolean,
): CSSProperties {
  const [primary, secondary] = styleAsDefault
    ? [existing, incoming]
    : [incoming, existing];
  // primary を base にして、secondary の「primaryにないキー」だけを補完
  const merged = { ...primary };
  for (const key in secondary) {
    if (merged[key as keyof CSSProperties] === undefined) {
      (merged as Record<string, unknown>)[key] =
        secondary[key as keyof CSSProperties];
    }
  }
  return merged;
}

/**
 * 2つのスタイルを配列形式で結合する。
 * styleAsDefault に応じて配列の順序を決定する（後ろの要素が優先される想定）。
 *
 * @param incoming - 新しく適用したいスタイル
 * @param existing - すでに設定されているスタイル（配列 / オブジェクト / 関数）
 * @param styleAsDefault - true なら incoming を配列の先頭に置く
 */
function _concatStyles(
  incoming: CSSProperties,
  existing: unknown,
  styleAsDefault: boolean,
): unknown[] {
  const existingArray = Array.isArray(existing) ? existing : [existing];
  return styleAsDefault
    ? [incoming, ...existingArray] // existing が末尾 = 優先
    : [...existingArray, incoming]; // incoming が末尾 = 優先
}
