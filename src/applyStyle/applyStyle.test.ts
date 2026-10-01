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

    it('オブジェクト、配列以外', () => {
      expect(applyStyle(123, style)).toEqual(style);
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
  });
});
