import { useEffect } from 'react';
import ReactDOM from 'react-dom';

//TODO Fixed by ts , need to know how, debug how
type PortalProps = {
  children: React.ReactNode,
  customRootId: string
}

const Portal = ({ children, customRootId }: PortalProps) => {
  let portalRoot: HTMLElement   /*不知道為什麼 HTMLElement 可以對上 Element | DocumentFragment, key?: string | null | undefined): React.ReactPortal*/

  const rootId: string = customRootId || 'portal-root';

  if (document.getElementById(rootId)) {
    // portalRoot = document.getElementById(rootId);
    const input = document.getElementById(rootId) as HTMLElement;  /*不知道為什麼是 HTMLElement*/
    portalRoot = input;
  } else {
    const divDOM = document.createElement('div');
    divDOM.id = rootId;
    document.body.appendChild(divDOM);
    portalRoot = divDOM;
  }

  useEffect(() => () => {
    portalRoot?.parentElement?.removeChild(portalRoot);
  }, [portalRoot]);

  // function createPortal(children: React.ReactNode, container: Element | DocumentFragment, key?: string | null | undefined): React.ReactPortal
  return ReactDOM.createPortal(
    children,
    portalRoot,
  );
};

export default Portal;