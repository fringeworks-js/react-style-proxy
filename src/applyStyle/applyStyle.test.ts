import type { CSSProperties } from 'react';
import applyStyle from './applyStyle';

describe('applyStyle', () => {
  const style = {
    color: '#ff0000',
    backgroundColor: '#00ff00',
  };

  describe('target', () => {
    it('undefined', () => {
      expect(applyStyle(undefined, style)).toEqual(style);
    });

    it('null', () => {
      expect(applyStyle(null, style)).toEqual(style);
    });

    it('object', () => {
      expect(applyStyle({ borderColor: '#0000ff' }, style)).toEqual({
        color: '#ff0000',
        backgroundColor: '#00ff00',
        borderColor: '#0000ff',
      });
    });

    it('array', () => {
      expect(applyStyle([{ borderColor: '#0000ff' }], style)).toEqual([
        { borderColor: '#0000ff' },
        { color: '#ff0000', backgroundColor: '#00ff00' },
      ]);
    });

    it('false', () => {
      expect(applyStyle(false, style)).toEqual(style);
    });

    it('true', () => {
      expect(applyStyle(true, style)).toEqual(style);
    });

    it('オブジェクト、配列、関数、boolean 以外', () => {
      expect(applyStyle(123, style)).toEqual([123, style]);
    });

    it('オブジェクト、配列、関数、boolean 以外 & styleAsDefault', () => {
      expect(applyStyle('abc', style, { styleAsDefault: true })).toEqual([
        style,
        'abc',
      ]);
    });

    it('target を変更しない', () => {
      const object = { borderColor: '#0000ff' };
      const array = [{ borderColor: '#0000ff' }];
      applyStyle(object, style);
      applyStyle(array, style);
      expect(object).toEqual({ borderColor: '#0000ff' });
      expect(array).toEqual([{ borderColor: '#0000ff' }]);
    });

    it('function', () => {
      const styleFn = () => ({ borderColor: '#0000ff' });
      expect(applyStyle(styleFn, style)).toEqual([styleFn, style]);
    });

    it('function & styleAsDefault', () => {
      const styleFn = () => ({ borderColor: '#0000ff' });
      expect(applyStyle(styleFn, style, { styleAsDefault: true })).toEqual([
        style,
        styleFn,
      ]);
    });

    it('function & 空のスタイル', () => {
      const styleFn = () => ({ borderColor: '#0000ff' });
      expect(applyStyle(styleFn, {})).toBe(styleFn);
    });
  });

  describe('style', () => {
    it('null', () => {
      const target = { borderColor: '#0000ff' };
      expect(applyStyle(target, null)).toBe(target);
    });

    it('false', () => {
      const target = { borderColor: '#0000ff' };
      expect(applyStyle(target, false)).toBe(target);
    });

    it('undefined', () => {
      const target = { borderColor: '#0000ff' };
      expect(applyStyle(target, undefined)).toBe(target);
    });

    it('falsy & target undefined', () => {
      expect(applyStyle(undefined, false)).toBeUndefined();
    });

    it('empty object', () => {
      const target = { borderColor: '#0000ff' };
      expect(applyStyle(target, {})).toBe(target);
    });

    it('array', () => {
      expect(
        applyStyle({ borderColor: '#0000ff' }, [
          { color: '#ff0000' },
          { backgroundColor: '#00ff00' },
        ]),
      ).toEqual({
        color: '#ff0000',
        backgroundColor: '#00ff00',
        borderColor: '#0000ff',
      });
    });

    it('empty array', () => {
      const target = { borderColor: '#0000ff' };
      expect(applyStyle(target, [])).toBe(target);
    });

    it('null array', () => {
      const target = { borderColor: '#0000ff' };
      expect(applyStyle(target, [null, null, null])).toBe(target);
    });

    it('条件付きのスタイルを含む array', () => {
      const isActive = false;
      const isDisabled = true;
      expect(
        applyStyle({ borderColor: '#0000ff' }, [
          { color: '#ff0000' },
          isActive && { backgroundColor: '#00ff00' },
          isDisabled && { opacity: 0.5 },
          null,
          undefined,
        ]),
      ).toEqual({
        color: '#ff0000',
        opacity: 0.5,
        borderColor: '#0000ff',
      });
    });
  });

  describe('styleMergeMode', () => {
    it('append & object', () => {
      expect(
        applyStyle({ borderColor: '#0000ff' }, style, {
          styleMergeMode: 'append',
        }),
      ).toEqual([
        { borderColor: '#0000ff' },
        { color: '#ff0000', backgroundColor: '#00ff00' },
      ]);
    });
  });

  describe('styleAsDefault', () => {
    const target = {
      borderColor: '#0000ff',
      backgroundColor: '#ffffff',
    };

    it('未設定', () => {
      expect(applyStyle(target, style)).toEqual({
        color: '#ff0000',
        backgroundColor: '#00ff00',
        borderColor: '#0000ff',
      });
    });

    it('true & styleMergeMode=`merge`', () => {
      expect(applyStyle(target, style, { styleAsDefault: true })).toEqual({
        color: '#ff0000',
        backgroundColor: '#ffffff',
        borderColor: '#0000ff',
      });
    });

    it('false & incoming に undefined の値', () => {
      expect(
        applyStyle(target, { color: '#ff0000', backgroundColor: undefined }),
      ).toEqual({
        color: '#ff0000',
        backgroundColor: '#ffffff',
        borderColor: '#0000ff',
      });
    });

    it('true & target に undefined の値', () => {
      expect(
        applyStyle({ ...target, color: undefined }, style, {
          styleAsDefault: true,
        }),
      ).toEqual({
        color: '#ff0000',
        backgroundColor: '#ffffff',
        borderColor: '#0000ff',
      });
    });

    it('true & styleMergeMode=`append` & object', () => {
      expect(
        applyStyle(target, style, {
          styleMergeMode: 'append',
          styleAsDefault: true,
        }),
      ).toEqual([style, target]);
    });

    it('true & array', () => {
      expect(applyStyle([target], style, { styleAsDefault: true })).toEqual([
        style,
        target,
      ]);
    });

    describe('true & style が配列', () => {
      const styles = [
        { color: '#ff0000', opacity: 0.5 },
        { color: '#00ff00', backgroundColor: '#000000' },
      ];

      it('target が undefined', () => {
        expect(applyStyle(undefined, styles, { styleAsDefault: true })).toEqual(
          {
            color: '#00ff00',
            opacity: 0.5,
            backgroundColor: '#000000',
          },
        );
      });

      it('target が object', () => {
        expect(applyStyle(target, styles, { styleAsDefault: true })).toEqual({
          color: '#00ff00',
          opacity: 0.5,
          backgroundColor: '#ffffff',
          borderColor: '#0000ff',
        });
      });

      it('target が array', () => {
        expect(applyStyle([target], styles, { styleAsDefault: true })).toEqual([
          ...styles,
          target,
        ]);
      });

      it('styleMergeMode=`append` & target が object', () => {
        expect(
          applyStyle(target, styles, {
            styleMergeMode: 'append',
            styleAsDefault: true,
          }),
        ).toEqual([...styles, target]);
      });
    });
  });

  describe('キーの並び順（merge）', () => {
    it('false: style のキーを後ろに並べる', () => {
      const result = applyStyle(
        { borderColor: 'blue', color: 'green' },
        { border: '1px solid red' },
      );
      expect(Object.keys(result)).toEqual(['borderColor', 'color', 'border']);
    });

    it('true: target のキーを後ろに並べる', () => {
      const result = applyStyle(
        { borderColor: 'blue' },
        { border: '1px solid red', color: 'green' },
        { styleAsDefault: true },
      );
      expect(Object.keys(result)).toEqual(['border', 'color', 'borderColor']);
    });

    it('両方にあるキーは優先する側の位置に並べる', () => {
      const result = applyStyle(
        { overflowY: 'hidden', overflow: 'visible' },
        { overflow: 'auto', overflowX: 'scroll' },
        { styleAsDefault: true },
      );
      expect(result).toEqual({
        overflowX: 'scroll',
        overflowY: 'hidden',
        overflow: 'visible',
      });
      expect(Object.keys(result)).toEqual([
        'overflowX',
        'overflowY',
        'overflow',
      ]);
    });

    it('優先する側の値が undefined のキーは優先しない側の位置に並べる', () => {
      const result = applyStyle(
        { overflowY: undefined, color: 'green' },
        { overflow: 'auto', overflowY: 'hidden' },
        { styleAsDefault: true },
      );
      expect(Object.keys(result)).toEqual(['overflow', 'overflowY', 'color']);
    });
  });

  describe('型', () => {
    it('merge & オブジェクトの target', () => {
      const target: CSSProperties | undefined = undefined;
      expectTypeOf(applyStyle(target, style)).toEqualTypeOf<
        CSSProperties | undefined
      >();
    });

    it('append', () => {
      expectTypeOf(
        applyStyle({ color: '#ff0000' } as CSSProperties, style, {
          styleMergeMode: 'append',
        }),
      ).toEqualTypeOf<CSSProperties | CSSProperties[]>();
    });

    it('boolean を含む target', () => {
      const target = false as CSSProperties | false;
      expectTypeOf(applyStyle(target, style)).toEqualTypeOf<
        false | CSSProperties | CSSProperties[]
      >();
    });
  });
});
