import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FacebookChat = () => {
  useEffect(() => {
    // Load the Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        xfbml: true,
        version: 'v13.0' // Use the latest version
      });
    };

    (function(d, s, id) {
      var js: HTMLScriptElement;
      var fjs = d.getElementsByTagName(s)[0] as HTMLScriptElement;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s) as HTMLScriptElement; js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  return (
    <>
      {/* <Helmet> */}
        <div id="fb-root"></div>
      {/* </Helmet> */}

      <div id="fb-customer-chat" className="fb-customerchat">
        </div>

      <div className="fb-customerchat"
        data-attribution="setup_tool"
        data-page_id="113488837096368">
      </div>
    </>
  );
};

export default FacebookChat;
