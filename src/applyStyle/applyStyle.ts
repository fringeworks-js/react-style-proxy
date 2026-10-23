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
 * @param style - 適用したいスタイル（単一 or 配列。配列は後ろの要素が優先される）
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
    const apply = (result: unknown, stl: StyleItem) =>
      _applyStyle(result, stl, options);
    // デフォルト値として扱う場合は、後ろの要素ほど target の近くに置くため逆順に適用する
    return options.styleAsDefault
      ? style.reduceRight(apply, target)
      : style.reduce(apply, target);
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

  if (target == null || typeof target === 'boolean') {
    // 未設定（`cond && style` の false を含む）ならそのまま返す
    return incoming;
  } else if (typeof target === 'object' && !Array.isArray(target)) {
    if (styleMergeMode === 'append') {
      // 明示的に配列結合を指定された場合
      return _concatStyles(incoming, target, styleAsDefault);
    } else {
      // デフォルト: オブジェクトをマージ
      return _mergeStyleObjects(incoming, target, styleAsDefault);
    }
  }

  // 配列・関数（sx / css の関数形式など）・その他の値は、失わないよう配列で結合する
  return _concatStyles(incoming, target, styleAsDefault);
}

/**
 * 2つのスタイルオブジェクトを単一のオブジェクトにマージする。
 * styleAsDefault に応じて上書き方向を決定する。
 * 値が undefined のキーは未指定として扱い、もう一方の値で補完する。
 *
 * スタイルはキーの並び順に反映されるため、優先する側のキーをすべて後ろに並べる。
 * 省略形（`border` など）と個別指定（`borderColor` など）のようにキーが異なる場合も、
 * 優先する側の指定が勝つ。
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
  const merged: Record<string, unknown> = {};
  // 優先しない側は、優先する側が指定していないキーだけを先に並べる
  for (const key of Object.keys(secondary) as (keyof CSSProperties)[]) {
    if (primary[key] === undefined) {
      merged[key] = secondary[key];
    }
  }
  // 優先する側を後ろに並べる
  for (const key of Object.keys(primary) as (keyof CSSProperties)[]) {
    if (primary[key] !== undefined) {
      merged[key] = primary[key];
    }
  }
  return merged;
}

/**
 * 2つのスタイルを配列形式で結合する。
 * styleAsDefault に応じて配列の順序を決定する（後ろの要素が優先される想定）。
 *
 * @param incoming - 新しく適用したいスタイル
 * @param existing - すでに設定されているスタイル（配列 / オブジェクト / 関数など）
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
