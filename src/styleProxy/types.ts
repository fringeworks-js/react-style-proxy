import type { CSSProperties } from 'react';
import type {
  ApplyStyleOptions,
  ApplyStyleResult,
  StyleMergeMode,
} from '../applyStyle';

/**
 * オプション
 */
export type StyleProxyOptions<K extends string = string> = ApplyStyleOptions & {
  /**
   * スタイルを適用するプロパティ名。
   *
   * @default 'style'
   */
  styleProp?: K;
};

/**
 * styleProxy の戻り値
 *
 * props の styleProp のプロパティを、スタイルを適用した結果の型に置き換える。
 * styleProp が string 型（名前が実行時に決まる）の場合は、props の型のままになる。
 */
export type StyleProxyResult<
  P,
  K extends string,
  M extends StyleMergeMode = StyleMergeMode,
> = string extends K
  ? P
  : Omit<P, K> & {
      [Q in K]: StylePropResult<K extends keyof P ? P[K] : undefined, M>;
    };

/**
 * スタイルプロパティの値へスタイルを適用した結果の型
 */
type StylePropResult<T, M extends StyleMergeMode> = M extends 'merge'
  ? [T] extends [CSSProperties | null | undefined]
    ? T | CSSProperties
    : ApplyStyleResult<T>
  : ApplyStyleResult<T>;
