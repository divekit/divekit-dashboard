import { ReactNode } from 'react';

export default function Popup({id, content} : {id: string, content: ReactNode}) {
  return <div id={id} className="overlay">
    <div className="popup">
      <h2></h2>
      <a className="close" href="#">&times;</a>
      <div className="content">
        {content}
      </div>
    </div>
  </div>;
}
