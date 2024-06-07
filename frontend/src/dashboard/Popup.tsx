import { Settings } from './settings-view/Settings';

export default function Popup() {
  return <div id="settings" className="overlay">
    <div className="popup">
      <h2></h2>
      <a className="close" href="#">&times;</a>
      <div className="content">
        <Settings />
      </div>
    </div>
  </div>;
}
