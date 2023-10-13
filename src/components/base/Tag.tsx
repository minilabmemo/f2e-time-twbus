import React from 'react';

import { SerializedStyles, Theme, css } from '@emotion/react';
import styled from '@emotion/styled';

interface TagI {
  text: string;
  tagType?: TagType;
}

interface TagWrapperI {
  theme?: Theme;
  tagType?: TagType;
}

const defaultStyle = (theme: Theme) => css`
  background-color: #848282;
  color: #ffffff;

`;

const hideStyle = (theme: Theme) => css`
  display: none; //no show
`;
//TODO color

const primaryStyle = (theme: Theme) => css`
  background-color: #5ac1f9;
  color: #ffffff;
`;
const warningStyle = (theme: Theme) => css`
  background-color: #FFBD59;
  color: #000000;
`;
const dangerStyle = (theme: Theme) => css`
  background-color: #eab0b0;
  color: #000000;
`;
const successStyle = (theme: Theme) => css`
  background-color: #4fa92e;
  color: #000000;
`;
type TagType = 'primary' | 'warning' | 'success' | 'danger' | 'default' | undefined;

const setStyle = (theme: Theme, tagType: TagType): SerializedStyles => {
  if (tagType === 'primary') {
    return primaryStyle(theme);
  }
  if (tagType === 'warning') {
    return warningStyle(theme);
  }
  if (tagType === 'success') {
    return successStyle(theme);
  }
  if (tagType === 'danger') {
    return dangerStyle(theme);
  }
  if (tagType === 'default') {
    return defaultStyle(theme);
  }
  return hideStyle(theme);
};

const TagWrapper = styled.span<TagWrapperI>`
  display: inline-block;
  border-radius: 5px;
  height: 16px;
  ${(props) => setStyle(props.theme, props.tagType)};
 
`;

const Text = styled.div`
  font-family: 'Noto Sans TC';
  font-size: .5em;
  font-weight: 700;
  text-align: left;
  padding: 1px 10px;

  line-height: 14px;
  letter-spacing: 0em;
`;

/**
 * `Tag` 是一個標籤
 */
const Tag = ({ text, tagType }: TagI) => {
  return (
    <>
      <TagWrapper tagType={tagType} className="tag">
        <Text>{text}</Text>
      </TagWrapper>
    </>
  );
};

Tag.defaultProps = {};

export default Tag;
