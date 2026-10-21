import type { CSSProperties } from 'react';
import styleProxy from './styleProxy';
import type { StyleProxyOptions } from './types';

describe('styleProxy', () => {
  const onChange = () => {};
  const props = {
    value: 'abc',
    onChange,
  };
  const style = {
    color: '#ff0000',
    backgroundColor: '#00ff00',
  };

  describe('default', () => {
    it('スタイル関連のプロパティ無し', () => {
      const styledProps = styleProxy(props, {});
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
      });
    });

    it('スタイルプロパティが関数 & 空のスタイル', () => {
      const styleFn = () => {
        return {
          borderColor: '#0000ff',
        };
      };
      const styledProps = styleProxy({ ...props, style: styleFn }, {});
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: styleFn,
      });
    });
  });

  describe('style', () => {
    it('null', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
          },
        },
        null,
        { styleProp: 'style' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          borderColor: '#0000ff',
        },
      });
    });

    it('array', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
          },
        },
        [{ color: '#ff0000', backgroundColor: '#00ff00' }],
        { styleProp: 'style' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('empty array', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
          },
        },
        [],
        { styleProp: 'style' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          borderColor: '#0000ff',
        },
      });
    });

    it('null array', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
          },
        },
        [null, null, null],
        { styleProp: 'style' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          borderColor: '#0000ff',
        },
      });
    });
  });

  describe('styleProp', () => {
    describe('style', () => {
      it('none', () => {
        const styledProps = styleProxy(props, style, {
          styleProp: 'style',
        });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          style: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = styleProxy(
          {
            ...props,
            style: {
              borderColor: '#0000ff',
            },
          },
          style,
          { styleProp: 'style' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          style: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });
    });

    describe('css', () => {
      it('none', () => {
        const styledProps = styleProxy(props, style, { styleProp: 'css' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          css: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = styleProxy(
          {
            ...props,
            css: {
              borderColor: '#0000ff',
            },
          },
          style,
          { styleProp: 'css' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          css: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });

      it('array', () => {
        const styledProps = styleProxy(
          {
            ...props,
            css: [
              {
                borderColor: '#0000ff',
              },
            ],
          },
          style,
          { styleProp: 'css' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          css: [
            { borderColor: '#0000ff' },
            {
              color: '#ff0000',
              backgroundColor: '#00ff00',
            },
          ],
        });
      });
    });

    describe('sx', () => {
      it('none', () => {
        const styledProps = styleProxy(props, style, { styleProp: 'sx' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          sx: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = styleProxy(
          {
            ...props,
            sx: {
              borderColor: '#0000ff',
            },
          },
          style,
          { styleProp: 'sx' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          sx: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });

      it('array', () => {
        const styledProps = styleProxy(
          {
            ...props,
            sx: [
              {
                borderColor: '#0000ff',
              },
            ],
          },
          style,
          { styleProp: 'sx' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          sx: [
            { borderColor: '#0000ff' },
            {
              color: '#ff0000',
              backgroundColor: '#00ff00',
            },
          ],
        });
      });
    });

    describe('any', () => {
      it('none', () => {
        const styledProps = styleProxy(props, style, { styleProp: 'any' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          any: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = styleProxy(
          {
            ...props,
            any: {
              borderColor: '#0000ff',
            },
          },
          style,
          { styleProp: 'any' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          any: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });
    });
  });

  describe('styleMergeMode', () => {
    it('未設定', () => {
      const styledProps = styleProxy(
        {
          ...props,
          any: {
            borderColor: '#0000ff',
          },
        },
        style,
        { styleProp: 'any' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        any: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('merge', () => {
      const styledProps = styleProxy(
        {
          ...props,
          any: {
            borderColor: '#0000ff',
          },
        },
        style,
        { styleProp: 'any', styleMergeMode: 'merge' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        any: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('append', () => {
      const styledProps = styleProxy(
        {
          ...props,
          any: {
            borderColor: '#0000ff',
          },
        },
        style,
        { styleProp: 'any', styleMergeMode: 'append' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        any: [
          {
            borderColor: '#0000ff',
          },
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        ],
      });
    });
  });

  describe('styleAsDefault', () => {
    it('未設定', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
            backgroundColor: '#ffffff',
          },
        },
        style,
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('false & styleMergeMode=`merge`', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
            backgroundColor: '#ffffff',
          },
        },
        style,
        { styleMergeMode: 'merge', styleAsDefault: false },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('true & styleMergeMode=`merge`', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
            backgroundColor: '#ffffff',
          },
        },
        style,
        { styleMergeMode: 'merge', styleAsDefault: true },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#ffffff',
          borderColor: '#0000ff',
        },
      });
    });

    it('false & styleMergeMode=`append` & object', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
          },
        },
        style,
        { styleMergeMode: 'append', styleAsDefault: false },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [
          {
            borderColor: '#0000ff',
          },
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        ],
      });
    });

    it('true & styleMergeMode=`append` & object', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: {
            borderColor: '#0000ff',
          },
        },
        style,
        { styleMergeMode: 'append', styleAsDefault: true },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
          {
            borderColor: '#0000ff',
          },
        ],
      });
    });

    it('false & styleMergeMode=`append` & array', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: [
            {
              borderColor: '#0000ff',
            },
          ],
        },
        style,
        { styleMergeMode: 'append', styleAsDefault: false },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [
          {
            borderColor: '#0000ff',
          },
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        ],
      });
    });

    it('true & styleMergeMode=`append` & array', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: [
            {
              borderColor: '#0000ff',
            },
          ],
        },
        style,
        { styleMergeMode: 'append', styleAsDefault: true },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
          {
            borderColor: '#0000ff',
          },
        ],
      });
    });
  });

  describe('fallback', () => {
    it('props[styleProp]が想定外の型', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: 123,
        },
        style,
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [123, style],
      });
    });

    it('props[styleProp]がfalse', () => {
      const styledProps = styleProxy(
        {
          ...props,
          style: false,
        },
        style,
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style,
      });
    });
  });

  describe('props', () => {
    it('スタイルプロパティが無く、適用するスタイルも空ならキーを追加しない', () => {
      const styledProps = styleProxy(props, [null, false]);
      expect(styledProps).not.toBe(props);
      expect(styledProps).not.toHaveProperty('style');
    });

    it('props を変更しない', () => {
      const original = { ...props, style: { borderColor: '#0000ff' } };
      styleProxy(original, style);
      expect(original).toEqual({ ...props, style: { borderColor: '#0000ff' } });
    });
  });

  describe('型', () => {
    type Props = { value: string; style?: CSSProperties };
    const typedProps: Props = { value: 'abc' };

    it('merge', () => {
      const result = styleProxy(typedProps, style);
      expectTypeOf(result.value).toEqualTypeOf<string>();
      expectTypeOf(result.style).toEqualTypeOf<CSSProperties | undefined>();
    });

    it('append', () => {
      const result = styleProxy(typedProps, style, {
        styleMergeMode: 'append',
      });
      expectTypeOf(result.style).toEqualTypeOf<
        CSSProperties | CSSProperties[] | undefined
      >();
    });

    it('props に無い styleProp', () => {
      const result = styleProxy(typedProps, style, { styleProp: 'sx' });
      expectTypeOf(result.sx).toEqualTypeOf<CSSProperties | undefined>();
      expectTypeOf(result.style).toEqualTypeOf<CSSProperties | undefined>();
    });

    it('styleProp が string 型', () => {
      const options: StyleProxyOptions = { styleProp: 'style' };
      expectTypeOf(
        styleProxy(typedProps, style, options),
      ).toEqualTypeOf<Props>();
    });
  });
});
