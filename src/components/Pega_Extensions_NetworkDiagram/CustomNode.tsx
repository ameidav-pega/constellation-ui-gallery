import { useMemo, type MouseEvent } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import styled, { css } from 'styled-components';
import { Link, Icon, registerIcon } from '@pega/cosmos-react-core';
import * as userIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/user.icon';
import * as storeIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/store.icon';

registerIcon(userIcon, storeIcon);
const Node = styled.div(({ theme }: { theme: any }) => {
  return css`
    padding: 0.25rem;
    color: ${theme.base.palette['foreground-color']};
    background: ${theme.base.palette['primary-background']};
    display: flex;
    flex-flow: column;
    align-items: center;

    svg {
      height: 3rem;
      width: 3rem;
    }
    button,
    label {
      max-width: 8rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-spacing: normal;
      overflow: hidden;
    }
    .react-flow__handle.react-flow__handle-top,
    .react-flow__handle.react-flow__handle-bottom {
      background: ${theme.base.palette['primary-background']};
    }
    div.react-flow__handle.connectionindicator {
      pointer-events: none;
      cursor: none;
    }
  `;
});

interface renderNodeProps {
  type?: string;
  key?: string;
  objClass?: string;
  id: string;
  label: string;
  getPConnect?: () => typeof PConnect;
  theme: any;
}

const renderNode = (props: renderNodeProps) => {
  const { type, key, objClass, id, label, getPConnect, theme } = props;
  let icon = 'user';
  if (type === 'Corporation') icon = 'store';
  const linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
    PCore.getSemanticUrlUtils().getActions().ACTION_OPENWORKBYHANDLE,
    { caseClassName: objClass },
    { workID: id }
  );
  const linkEl =
    objClass && key && linkURL ? (
      <Link
        href={linkURL}
        previewable
        onPreview={() => {
          getPConnect().getActionsApi().showCasePreview(encodeURI(key), {
            caseClassName: objClass
          });
        }}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          /* for links - need to set onClick for spa to avoid full reload - (cmd | ctrl) + click for opening in new tab */
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            getPConnect().getActionsApi().openWorkByHandle(key, objClass);
          }
        }}
      >
        {label}
      </Link>
    ) : (
      <label>{label}</label>
    );

  return (
    <Node theme={theme}>
      <Handle type='target' position={Position.Top} />
      <Icon name={icon} />
      {linkEl}
      <Handle type='source' position={Position.Bottom} />
    </Node>
  );
};

const CustomNode = (props: NodeProps) => {
  const nodeEl = useMemo(() => renderNode(props.data), [props.data]);
  return nodeEl;
};
export default CustomNode;
