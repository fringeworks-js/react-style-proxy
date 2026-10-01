import styleProxy from './styleProxy';

describe('styleProxy', () => {
  const onChange = (...args) => {
    console.log(args);
  };
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

    it('スタイルプロパティがオブジェクト、配列以外', () => {
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

      it('object (設定済み)', () => {
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
        style,
      });
    });
  });
});
