import React from 'react';
import { ComponentProvider, Head } from 'mdx-go';
import { useView, Compiler, Editor, Error } from 'react-view';
import presetTypescript from '@babel/preset-typescript';

import LogRocket from 'logrocket';
LogRocket.init('kztcdf/syntaxcodes');

import Highlight, { defaultProps } from 'prism-react-renderer';

const code = (props) => {
  const code = React.Children.toArray(props.children).join('');

  const isLive = props.className.includes('language-.jsx');
  if (!isLive) {
    // return <pre {...props} className={`${props.className} language-markup`} />;
    return (
      <Highlight {...defaultProps} code={code} language="tsx" theme={undefined}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </div>
        )}
      </Highlight>
    );
  }

  const params = useView({
    initialCode: code,
    scope: {},
    onUpdate: console.log
  });

  return (
    <>
      <Editor {...params.editorProps} language="tsx" />
      <Compiler {...params.compilerProps} presets={[presetTypescript]} />
      <Error {...params.errorProps} />
    </>
  );
};

const components = {
  code
};

export const Root = (props) => {
  let pageStyle = { maxWidth: 960, margin: '0 auto', textAlign: 'center' }; // page style

  const isComparisonPage = props.location.pathname.indexOf('/compare') >= 0;
  if (isComparisonPage) {
    pageStyle = {}; // fullscreen comparison page (WIP)
  }
  return (
    <ComponentProvider components={components}>
      <Head>
        <title>Syntax.wiki</title>
      </Head>
      <div style={pageStyle}>{props.children}</div>
    </ComponentProvider>
  );
};
