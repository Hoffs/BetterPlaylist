import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BetterPlaylist from './BetterPlaylist';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BetterPlaylist />, document.getElementById('root'));
registerServiceWorker();
