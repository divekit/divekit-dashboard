import { ReactNode, useState } from "react";
import Collapsible from "react-collapsible";

export function BtnCollapsible(
  {text, className = "collapsible", btnClassName = "collapsible-button", children = <></>} 
  : {text: string, className?: string, openedClassName?: string, btnClassName?: string, children?: ReactNode}
) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return <Collapsible
    className={className}
    openedClassName={className}
    trigger={<button className={btnClassName} onClick={() => setIsCollapsed(!isCollapsed)}>
      {isCollapsed ? "🞃" : "🞂"}&nbsp; {text}
    </button>
    }
    transitionTime={100}
  >
    {children}
  </Collapsible>
}