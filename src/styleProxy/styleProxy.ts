import type { StyleValue } from '../applyStyle';
import applyStyle from '../applyStyle';
import type { StyleProxyOptions } from './types';

/**
 * スタイル関連のプロパティをスタイルプロパティ（style / css / sx など）へ適用する。
 *
 * @param props - コンポーネントのプロパティ
 * @param style - 適用したいスタイル（単一 or 配列）
 * @param options - マージ動作のオプション
 */
export default function styleProxy<P extends object>(
  props: P,
  style: StyleValue,
  options: StyleProxyOptions = {},
): P {
  const { styleProp = 'style', ...applyStyleOptions } = options;
  const target = (props as Record<string, unknown>)[styleProp];
  const applied = applyStyle(target, style, applyStyleOptions);

  // 適用するスタイルが無かった場合はプロパティを追加しない
  if (applied === target) {
    return { ...props };
  }
  return { ...props, [styleProp]: applied };
}
