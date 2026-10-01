import type { ApplyStyleOptions } from '../applyStyle';

/**
 * オプション
 */
export type StyleProxyOptions = ApplyStyleOptions & {
  /**
   * スタイルを適用するプロパティ名。
   *
   * @default 'style'
   */
  styleProp?: string;
};
