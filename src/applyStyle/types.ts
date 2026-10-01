import type { CSSProperties } from 'react';

/**
 * オプション
 */
export type ApplyStyleOptions = {
  /**
   * オブジェクト同士のマージ方法。
   * - 'merge': プロパティを展開してマージ
   * - 'append': 配列にして結合する
   * ※ 配列形式の target には影響しない
   *
   * @default 'merge'
   */
  styleMergeMode?: StyleMergeMode;

  /**
   * 引数 style をデフォルト値として扱うかどうか。
   *
   * - true: 引数 style をデフォルト値として扱い、target を優先する。
   * - false: 引数 style で target を上書きする。
   *
   * @default false
   */
  styleAsDefault?: boolean;
};

/**
 * オブジェクト同士のマージ方法
 */
export type StyleMergeMode = 'merge' | 'append';

/**
 * マージしたいスタイル
 */
export type StyleValue = StyleItem | StyleItem[];

/**
 * マージしたいスタイルの要素
 *
 * falsy な値（`false` / `null` / `undefined`）は無視される。
 * `cond && style` のような条件付きのスタイルに使用する。
 */
export type StyleItem = CSSProperties | false | null | undefined;

/**
 * applyStyle の戻り値
 *
 * 配列で結合した場合は、target の要素（target が配列でなければ target 自体）と
 * 適用したスタイルからなる配列になる。
 */
export type ApplyStyleResult<T> =
  | T
  | CSSProperties
  | Array<
      CSSProperties | (T extends readonly (infer E)[] ? E : NonNullable<T>)
    >;
