import{LitElement as U,css as D,html as $}from"lit";import{property as M,query as B,state as j,customElement as Z}from"lit/decorators.js";function C(o,e,t,n){var r=arguments.length,s=r<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,t):n,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(o,e,t,n);else for(var l=o.length-1;l>=0;l--)(c=o[l])&&(s=(r<3?c(s):r>3?c(e,t,s):c(e,t))||s);return r>3&&s&&Object.defineProperty(e,t,s),s}function i(o,e,t,n){if(t==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?o!==e||!n:!e.has(o))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?n:t==="a"?n.call(o):n?n.value:e.get(o)}function f(o,e,t,n,r){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?o!==e||!r:!e.has(o))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?r.call(o,t):r?r.value=t:e.set(o,t),t}var g,b,p,v,u;class W extends HTMLElement{constructor(){super(),g.set(this,void 0),b.set(this,void 0),p.set(this,void 0),v.set(this,void 0),u.set(this,void 0),f(this,g,null,"f"),f(this,p,!1,"f"),f(this,v,null,"f"),f(this,u,null,"f"),f(this,b,this.attachShadow({mode:"closed"}),"f"),this.render(),this.setupProtection()}static get observedAttributes(){return["expired","start-failure","license-download"]}render(){const e=`
      <style>
        :host {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          min-height: 100% !important;
          min-width: 100% !important;
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          clip-path: none !important;
          text-indent: 0 !important;          
          background-color: rgba(0, 0, 0, 0.5);          
        }
        
        .container {
          background: white;
          border-radius: 0.5rem;
          box-sizing: border-box;
          color: #3f4d62;
          font-family: "nb_international_pro","ui-sans-serif","system-ui","-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","Noto Sans","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
          font-size: 0.875rem;
          font-weight: normal;
          letter-spacing: 0.01em;
          line-height: 1.7;
          margin: auto;
          max-width: 32rem;
          padding: 1.5rem 1.5rem 1rem 1.5rem;
        }
        
        h2 {
          color: #0d1219;
          font-size: 1.5rem;
          line-height: 1.2;
          margin: 0 0 1rem 0;
        }
        
        p {
          margin: 0;
        }
        
        span.badge {
          background: #F1F5FB;
          border-radius: 4px;
          display: inline-block;
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1.7;
          padding: 0 6px 0 4px;
        }
        
        span.badge svg {
          vertical-align: sub;
        }
        
        p:has(+ ul) {
          color: #0d1219;
          font-weight: 600;
          margin-top: 1.25rem;
        }
        
        ul {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          margin: 0.5rem 0 1.5rem 0;
          padding: 0;
        }
        
        ul li {
          align-items: center;
          display: flex;
          gap: 0.25rem;
        }
        
        ul li span:first-of-type {
          color: #0d1219;
          font-weight: 600;
        }
        
        hr {
          border-color: rgb(224, 233, 244);
          border-top: 0;
          margin: 1.5rem 0 0.75rem 0;
        }
        
        button {
          align-items: center;
          background: #F1F5FB;
          border: none;
          border-radius: 8px;
          display: flex;
          color: #0368DE;
          font-family: "nb_international_promono","ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New","monospace";
          font-size: inherit;
          font-weight: 600;
          height: 2.375rem;
          justify-content: center;
          line-height: 1.7;
          padding: 0;
          width: 100%;
        }
        
        button.primary {
          background: #0368DE;
          color: white;
          flex-direction: column;
          height: 4.5rem;
        }
        
        button.primary span + span {
          font-size: 0.8125rem;
          font-weight: normal;
        }
        
        button.primary + button.secondary {
          margin-top: 0.5rem;
        }
        
        hr + p {
          font-size: 0.8125rem;
          line-height: 1.7;
          text-align: center;
        }
        
        a {
          color: #0368DE;
        }
        
        .error {
          background: #ffedee;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-top: 1.5rem;
          padding: 1rem 1.5rem;
        }
        
        .error h3 {
          color: #0d1219;
          font-size: inherit;
          line-height: inherit;
          margin: 0;
        }
        
        .error a {
          font-weight: 600;
        }
      </style>
     `;i(this,b,"f").innerHTML=`
    ${e}
    <div class='container'>
      ${i(this,p,"f")?`
        <h2>Trial expired</h2>
        <p>
          Vaadin Core is free and open-source. Sign in to keep using 
          <span class="badge">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 15.75V12C3 11.5875 3.14687 11.2344 3.44062 10.9406C3.73437 10.6469 4.0875 10.5 4.5 10.5H13.5C13.9125 10.5 14.2656 10.6469 14.5594 10.9406C14.8531 11.2344 15 11.5875 15 12V15.75H3ZM6.75 9.75C5.7125 9.75 4.82812 9.38438 4.09687 8.65313C3.36562 7.92188 3 7.0375 3 6C3 4.9625 3.36562 4.07813 4.09687 3.34688C4.82812 2.61563 5.7125 2.25 6.75 2.25H11.25C12.2875 2.25 13.1719 2.61563 13.9031 3.34688C14.6344 4.07813 15 4.9625 15 6C15 7.0375 14.6344 7.92188 13.9031 8.65313C13.1719 9.38438 12.2875 9.75 11.25 9.75H6.75ZM4.5 14.25H13.5V12H4.5V14.25ZM6.75 8.25H11.25C11.875 8.25 12.4062 8.03125 12.8437 7.59375C13.2812 7.15625 13.5 6.625 13.5 6C13.5 5.375 13.2812 4.84375 12.8437 4.40625C12.4062 3.96875 11.875 3.75 11.25 3.75H6.75C6.125 3.75 5.59375 3.96875 5.15625 4.40625C4.71875 4.84375 4.5 5.375 4.5 6C4.5 6.625 4.71875 7.15625 5.15625 7.59375C5.59375 8.03125 6.125 8.25 6.75 8.25ZM6.75 6.75C6.9625 6.75 7.14062 6.67813 7.28437 6.53438C7.42812 6.39063 7.5 6.2125 7.5 6C7.5 5.7875 7.42812 5.60938 7.28437 5.46563C7.14062 5.32188 6.9625 5.25 6.75 5.25C6.5375 5.25 6.35937 5.32188 6.21562 5.46563C6.07187 5.60938 6 5.7875 6 6C6 6.2125 6.07187 6.39063 6.21562 6.53438C6.35937 6.67813 6.5375 6.75 6.75 6.75ZM11.25 6.75C11.4625 6.75 11.6406 6.67813 11.7844 6.53438C11.9281 6.39063 12 6.2125 12 6C12 5.7875 11.9281 5.60938 11.7844 5.46563C11.6406 5.32188 11.4625 5.25 11.25 5.25C11.0375 5.25 10.8594 5.32188 10.7156 5.46563C10.5719 5.60938 10.5 5.7875 10.5 6C10.5 6.2125 10.5719 6.39063 10.7156 6.53438C10.8594 6.67813 11.0375 6.75 11.25 6.75Z" fill="url(#paint0_linear_85_182)"/>
            <defs>
              <linearGradient id="paint0_linear_85_182" x1="9" y1="2.25" x2="9" y2="15.75" gradientUnits="userSpaceOnUse">
                <stop stop-color="#1A81FA"/>
                <stop offset="1" stop-color="#8854FC"/>
              </linearGradient>
            </defs>
          </svg>
          Vaadin Copilot</span>,
          <span class="badge">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 15V9.75H15V15H12ZM7.5 15V3H10.5V15H7.5ZM3 15V6.75H6V15H3Z" fill="url(#paint0_linear_85_186)"/>
              <defs>
                <linearGradient id="paint0_linear_85_186" x1="9" y1="3" x2="9" y2="15" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#1A81FA"/>
                  <stop offset="1" stop-color="#8854FC"/>
                </linearGradient>
              </defs>
            </svg>
            Pro components
          </span> and 
          <span class="badge">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.2125 11.6625L12.45 7.425L11.3812 6.35625L8.2125 9.525L6.6375 7.95L5.56875 9.01875L8.2125 11.6625ZM9 16.5C7.2625 16.0625 5.82812 15.0656 4.69687 13.5094C3.56562 11.9531 3 10.225 3 8.325V3.75L9 1.5L15 3.75V8.325C15 10.225 14.4344 11.9531 13.3031 13.5094C12.1719 15.0656 10.7375 16.0625 9 16.5ZM9 14.925C10.3 14.5125 11.375 13.6875 12.225 12.45C13.075 11.2125 13.5 9.8375 13.5 8.325V4.78125L9 3.09375L4.5 4.78125V8.325C4.5 9.8375 4.925 11.2125 5.775 12.45C6.625 13.6875 7.7 14.5125 9 14.925Z" fill="url(#paint0_linear_85_190)"/>
              <defs>
                <linearGradient id="paint0_linear_85_190" x1="9" y1="1.5" x2="9" y2="16.5" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#1A81FA"/>
                  <stop offset="1" stop-color="#8854FC"/>
                </linearGradient>
              </defs>
            </svg>
            Team features
          </span> for 30 more days.
        </p>
        <p>Continue getting full access to:</p>
        ${this.getProductsList()}
        <button ${i(this,u,"f")==="started"?"disabled":""} class='primary'>
          <span>Extend trial 30 days</span>
          <span>Sign up ⋅ No credit card required</span>
        </button>
        `:`
        <h2>Get full access to all features</h2>
        <p>
          Vaadin Core is free and open-source. To use Pro components like <span class="badge">
          <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15V9.75h3V15h-3Zm-4.5 0V3h3v12h-3ZM3 15V6.75h3V15H3Z" fill="url(#a)"/>
          <defs>
            <linearGradient id="a" x1="9" y1="3" x2="9" y2="15" gradientUnits="userSpaceOnUse">
              <stop stop-color="#1A81FA"/>
              <stop offset="1" stop-color="#8854FC"/>
            </linearGradient>
          </defs>
        </svg>
          Charts</span> in your app, activate a free trial.
        </p>
        <p>Get full access:</p>
        ${this.getProductsList()}
        <button ${i(this,u,"f")==="started"?"disabled":""} class='primary'>
          <span>Start 7-day trial</span>
          <span>No registration or credit card required</span>
        </button>
        <button ${i(this,u,"f")==="started"?"disabled":""} class='secondary'>
          Activate your license
        </button>
        `}
      ${i(this,v,"f")?`
        <div class='error'>
          <h3>Trial failed to start</h3>
          <p>Something went wrong while starting your trial. Try again in a moment. If the issue persists, <a href="https://pages.vaadin.com/contact" target="_blank">contact our support team</a>.</p>
        </div>`:""}
      ${i(this,u,"f")==="started"?"<p><strong>Waiting for the license key to be downloaded...</strong></p>":""}
      ${i(this,u,"f")==="failed"?'<div class="error">Failed to download the license key. Please try again later.</div>':""}
      <hr>
      <p>
        By starting your trial, you agree to our <a href='https://vaadin.com/commercial-license-and-service-terms' target='_blank'>terms and conditions</a>.
      </p>
    </div>
    `;const t=i(this,b,"f").querySelector("button.primary");t==null||t.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("primary-button-click",{detail:{expired:i(this,p,"f")}}))});const n=i(this,b,"f").querySelector("button.secondary");n==null||n.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("secondary-button-click"))})}getProductsList(){return`
        <ul>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path
              d="M4 21v-5c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 6 14h12c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v5H4Zm5-8c-1.383 0-2.563-.488-3.537-1.463C4.487 10.563 4 9.383 4 8s.487-2.563 1.463-3.537C6.437 3.487 7.617 3 9 3h6c1.383 0 2.563.487 3.538 1.463C19.512 5.437 20 6.617 20 8s-.488 2.563-1.462 3.537C17.562 12.512 16.383 13 15 13H9Zm-3 6h12v-3H6v3Zm3-8h6c.833 0 1.542-.292 2.125-.875A2.893 2.893 0 0 0 18 8c0-.833-.292-1.542-.875-2.125A2.893 2.893 0 0 0 15 5H9c-.833 0-1.542.292-2.125.875A2.893 2.893 0 0 0 6 8c0 .833.292 1.542.875 2.125A2.893 2.893 0 0 0 9 11Zm0-2c.283 0 .52-.096.713-.287A.968.968 0 0 0 10 8a.968.968 0 0 0-.287-.713A.968.968 0 0 0 9 7a.968.968 0 0 0-.713.287A.968.968 0 0 0 8 8c0 .283.096.52.287.713.192.191.43.287.713.287Zm6 0c.283 0 .52-.096.713-.287A.967.967 0 0 0 16 8a.967.967 0 0 0-.287-.713A.968.968 0 0 0 15 7a.968.968 0 0 0-.713.287A.967.967 0 0 0 14 8c0 .283.096.52.287.713.192.191.43.287.713.287Z"
              fill="url(#a)"
            />
            <defs>
              <linearGradient
                id="a"
                x1="12"
                y1="3"
                x2="12"
                y2="21"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1A81FA" />
                <stop offset="1" stop-color="#8854FC" />
              </linearGradient>
            </defs>
          </svg>
            <span>Vaadin Copilot</span><span>⋅</span><span>AI-powered assistant for building UIs</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path
              d="M16 20v-7h4v7h-4Zm-6 0V4h4v16h-4Zm-6 0V9h4v11H4Z"
              fill="url(#a)"
            />
            <defs>
              <linearGradient
                id="a"
                x1="12"
                y1="4"
                x2="12"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1A81FA" />
                <stop offset="1" stop-color="#8854FC" />
              </linearGradient>
            </defs>
          </svg>
            <span>Pro components</span><span>⋅</span><span>Charts, Grid Pro, CRUD and more</span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path
              d="M10.95 15.55 16.6 9.9l-1.425-1.425L10.95 12.7l-2.1-2.1-1.425 1.425 3.525 3.525ZM12 22c-2.317-.583-4.23-1.913-5.737-3.988C4.754 15.938 4 13.633 4 11.1V5l8-3 8 3v6.1c0 2.533-.754 4.838-2.262 6.912C16.229 20.087 14.317 21.418 12 22Zm0-2.1c1.733-.55 3.167-1.65 4.3-3.3s1.7-3.483 1.7-5.5V6.375l-6-2.25-6 2.25V11.1c0 2.017.567 3.85 1.7 5.5s2.567 2.75 4.3 3.3Z"
              fill="url(#a)"
            />
            <defs>
              <linearGradient
                id="a"
                x1="12"
                y1="2"
                x2="12"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1A81FA" />
                <stop offset="1" stop-color="#8854FC" />
              </linearGradient>
            </defs></svg
          >
            <span>Team features</span><span>⋅</span><span>Acceleration Kits</span>
          </li>
        </ul>
    `}connectedCallback(){this.setupParentRemovalProtection()}disconnectedCallback(){this.cleanup()}attributeChangedCallback(e,t,n){e==="expired"?this.handleExpiredChange(n!==null&&n!=="false"):e==="start-failure"?this.handleStartFailed(n==="expired"):e==="license-download"&&this.handleLicenseDownload(n)}handleLicenseDownload(e){i(this,u,"f")!==e&&(f(this,u,e,"f"),this.render())}handleExpiredChange(e){i(this,p,"f")!==e&&(f(this,p,e,"f"),this.render())}handleStartFailed(e){(i(this,v,"f")!==e||i(this,p,"f")!==e)&&(f(this,p,e,"f"),f(this,v,!0,"f"),this.render())}setupProtection(){const e=Element.prototype.remove;this.remove=function(){console.debug("Attempt to remove vaadin-pretrial detected - restoring");const t=this.parentNode;e.apply(this,arguments),this.restoreSplashScreen(t)},this.protectStyles()}setupParentRemovalProtection(){!i(this,g,"f")&&this.parentNode&&(f(this,g,new MutationObserver(e=>{e.forEach(t=>{t.type==="childList"&&t.removedNodes.forEach(n=>{n===this&&(console.debug("vaadin-pretrial removal detected - restoring"),this.restoreSplashScreen(t.target))})})}),"f"),i(this,g,"f").observe(this.parentNode,{childList:!0,subtree:!0}))}protectStyles(){Object.defineProperty(this,"style",{get(){return{}},set(e){}})}cleanup(){i(this,g,"f")&&i(this,g,"f").disconnect()}restoreSplashScreen(e){e&&setTimeout(()=>{console.debug("Re-adding vaadin-pretrial component");const t=this.querySelector('[slot="products"]');e.contains(this)&&e.removeChild(this);const n=document.createElement("vaadin-pretrial");i(this,p,"f")&&n.setAttribute("expired","true"),i(this,v,"f")&&n.setAttribute("start-failure",i(this,p,"f")?"expired":""),t&&n.appendChild(t.cloneNode(!0)),e.appendChild(n)},0)}}g=new WeakMap,b=new WeakMap,p=new WeakMap,v=new WeakMap,u=new WeakMap;customElements.define("vaadin-pretrial",W);function z(o){o.detail.expired?H():Q()}function q(){H()}const K=(o,e)=>{var t;if(o&&!o.querySelector("vaadin-pretrial")){const n=((t=e.preTrial)==null?void 0:t.trialState)==="EXPIRED",r=document.createElement("vaadin-pretrial");n&&r.setAttribute("expired","");const s=document.createElement("div");s.setAttribute("slot","products"),s.innerHTML=`
      This application is using:
      <ul>
        <li>${e.product.name}</li>
      </ul>
    `,r.appendChild(s),r.addEventListener("secondary-button-click",q),r.addEventListener("primary-button-click",z),o.innerHTML="<slot></slot>",o.appendChild(r)}},x=(o,e)=>{if(e){const t=e.querySelector("vaadin-pretrial");t==null||t.setAttribute("start-failure",o?"expired":"")}},k=(o,e)=>{if(e){const t=e.querySelector("vaadin-pretrial");t==null||t.setAttribute("license-download",o)}},T=1e3,_=(o,e)=>{const t=Array.from(o.querySelectorAll(e.join(", "))),n=Array.from(o.querySelectorAll("*")).filter(r=>r.shadowRoot).flatMap(r=>_(r.shadowRoot,e));return[...t,...n]};let R=!1;const S=(o,e)=>{R||(window.addEventListener("message",r=>{r.data==="validate-license"&&window.location.reload()},!1),R=!0);const t=o._overlayElement;if(t){if(t.shadowRoot){const r=t.shadowRoot.querySelector("slot:not([name])");if(r&&r.assignedElements().length>0){S(r.assignedElements()[0],e);return}}S(t,e);return}const n=e.messageHtml?e.messageHtml:`${e.message} <p>Component: ${e.product.name} ${e.product.version}</p>`.replace(/https:([^ ]*)/g,"<a href='https:$1'>https:$1</a>");o.isConnected&&(o.outerHTML=`<no-license style="display:flex;align-items:center;text-align:center;justify-content:center;"><div>${n}</div></no-license>`)},y={},L={},w={},P={},m=o=>`${o.name}_${o.version}`,O=o=>{const{cvdlName:e,version:t}=o.constructor,n={name:e,version:t},r=o.tagName.toLowerCase();y[e]=y[e]??[],y[e].push(r);const s=w[m(n)];s&&setTimeout(()=>S(o,s),T),w[m(n)]||P[m(n)]||L[m(n)]||(L[m(n)]=!0,window.Vaadin.devTools.checkLicense(n))},Y=o=>{P[m(o)]=!0,console.debug("License check ok for",o)},G=o=>{const e=o.product.name;w[m(o.product)]=o,console.error("License check failed for",e);const t=y[e];(t==null?void 0:t.length)>0&&_(document,t).forEach(n=>{setTimeout(()=>S(n,w[m(o.product)]),T)})},J=o=>{const e=o.message,t=o.product.name;o.messageHtml=`No license found. <a target=_blank onclick="javascript:window.open(this.href);return false;" href="${e}">Go here to start a trial or retrieve your license.</a>`,w[m(o.product)]=o,console.error("No license found when checking",t);const n=y[t];(n==null?void 0:n.length)>0&&_(document,n).forEach(r=>{setTimeout(()=>S(r,w[m(o.product)]),T)})},X=(o,e)=>o.command==="license-check-ok"?(Y(o.data),!0):o.command==="license-check-failed"?(G(o.data),!0):o.command==="license-check-nokey"?(K(e,o.data),J(o.data),!0):o.command==="license-pretrial-started"?(console.debug("Pre-trial period started",o.data),window.location.reload(),!0):o.command==="license-pretrial-expired"?(console.debug("Pre-trial period expired",o.data),x(!0,e),!0):o.command==="license-pretrial-failed"?(console.debug("Pre-trial period start failed",o.data),x(!1,e),!0):o.command==="license-download-completed"?(console.debug("License downloaded"),window.location.reload(),!0):o.command==="license-download-started"?(k("started",e),!0):o.command==="license-download-failed"?(k("failed",e),!0):!1,Q=()=>{window.Vaadin.devTools.startPreTrial()},H=()=>{const o=Object.values(w);o.length>0&&window.Vaadin.devTools.downloadLicense(o[0].product)},ee=()=>{window.Vaadin.devTools.createdCvdlElements.forEach(o=>{O(o)}),window.Vaadin.devTools.createdCvdlElements={push:o=>{O(o)}}};var a;(function(o){o.ACTIVE="active",o.INACTIVE="inactive",o.UNAVAILABLE="unavailable",o.ERROR="error"})(a||(a={}));class E{constructor(){this.status=a.UNAVAILABLE}onHandshake(){}onConnectionError(e){}onStatusChange(e){}setActive(e){!e&&this.status===a.ACTIVE?this.setStatus(a.INACTIVE):e&&this.status===a.INACTIVE&&this.setStatus(a.ACTIVE)}setStatus(e){this.status!==e&&(this.status=e,this.onStatusChange(e))}}E.HEARTBEAT_INTERVAL=18e4;class te extends E{constructor(e){super(),this.webSocket=new WebSocket(e),this.webSocket.onmessage=t=>this.handleMessage(t),this.webSocket.onerror=t=>this.handleError(t),this.webSocket.onclose=t=>{this.status!==a.ERROR&&this.setStatus(a.UNAVAILABLE),this.webSocket=void 0},setInterval(()=>{this.webSocket&&self.status!==a.ERROR&&this.status!==a.UNAVAILABLE&&this.webSocket.send("")},E.HEARTBEAT_INTERVAL)}onReload(e){}handleMessage(e){let t;try{t=JSON.parse(e.data)}catch(n){this.handleError(`[${n.name}: ${n.message}`);return}if(t.command==="hello")this.setStatus(a.ACTIVE),this.onHandshake();else if(t.command==="reload"){if(this.status===a.ACTIVE){const n=t.strategy||"reload";this.onReload(n)}}else this.handleError(`Unknown message from the livereload server: ${e}`)}handleError(e){console.error(e),this.setStatus(a.ERROR),e instanceof Event&&this.webSocket?this.onConnectionError(`Error in WebSocket connection to ${this.webSocket.url}`):this.onConnectionError(e)}}const N=16384;class F extends E{constructor(e){if(super(),this.canSend=!1,!e)return;const t={transport:"websocket",fallbackTransport:"websocket",url:e,contentType:"application/json; charset=UTF-8",reconnectInterval:5e3,timeout:-1,maxReconnectOnClose:1e7,trackMessageLength:!0,enableProtocol:!0,handleOnlineOffline:!1,executeCallbackBeforeReconnect:!0,messageDelimiter:"|",onMessage:n=>{const r={data:n.responseBody};this.handleMessage(r)},onError:n=>{this.canSend=!1,this.handleError(n)},onOpen:()=>{this.canSend=!0},onClose:()=>{this.canSend=!1},onClientTimeout:()=>{this.canSend=!1},onReconnect:()=>{this.canSend=!1},onReopen:()=>{this.canSend=!0}};oe().then(n=>{this.socket=n.subscribe(t)})}onReload(e){}onUpdate(e,t){}onMessage(e){}handleMessage(e){let t;try{t=JSON.parse(e.data)}catch(n){this.handleError(`[${n.name}: ${n.message}`);return}if(t.command==="hello")this.setStatus(a.ACTIVE),this.onHandshake();else if(t.command==="reload"){if(this.status===a.ACTIVE){const n=t.strategy||"reload";this.onReload(n)}}else t.command==="update"?this.status===a.ACTIVE&&this.onUpdate(t.path,t.content):this.onMessage(t)}handleError(e){console.error(e),this.setStatus(a.ERROR),this.onConnectionError(e)}send(e,t){if(!this.socket||!this.canSend){I(()=>this.socket&&this.canSend,c=>this.send(e,t));return}const n=JSON.stringify({command:e,data:t});let s=n.length+"|"+n;for(;s.length;)this.socket.push(s.substring(0,N)),s=s.substring(N)}}F.HEARTBEAT_INTERVAL=18e4;function I(o,e){const t=o();t?e(t):setTimeout(()=>I(o,e),50)}function oe(){return new Promise((o,e)=>{I(()=>{var t;return(t=window==null?void 0:window.vaadinPush)==null?void 0:t.atmosphere},o)})}var h,A;(function(o){o.LOG="log",o.INFORMATION="information",o.WARNING="warning",o.ERROR="error"})(A||(A={}));const V=import.meta.hot?import.meta.hot.hmrClient:void 0;let d=h=class extends U{constructor(){super(...arguments),this.unhandledMessages=[],this.conf={enable:!1,url:"",liveReloadPort:-1},this.bodyShadowRoot=null,this.frontendStatus=a.UNAVAILABLE,this.javaStatus=a.UNAVAILABLE,this.componentPickActive=!1,this.nextMessageId=1,this.transitionDuration=0}static get styles(){return[D`
        :host {
          --dev-tools-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell,
            'Helvetica Neue', sans-serif;
          --dev-tools-font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
            monospace;

          --dev-tools-font-size: 0.8125rem;
          --dev-tools-font-size-small: 0.75rem;

          --dev-tools-text-color: rgba(255, 255, 255, 0.8);
          --dev-tools-text-color-secondary: rgba(255, 255, 255, 0.65);
          --dev-tools-text-color-emphasis: rgba(255, 255, 255, 0.95);
          --dev-tools-text-color-active: rgba(255, 255, 255, 1);

          --dev-tools-background-color-inactive: rgba(45, 45, 45, 0.25);
          --dev-tools-background-color-active: rgba(45, 45, 45, 0.98);
          --dev-tools-background-color-active-blurred: rgba(45, 45, 45, 0.85);

          --dev-tools-border-radius: 0.5rem;
          --dev-tools-box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.4);

          --dev-tools-blue-hsl: 206, 100%, 70%;
          --dev-tools-blue-color: hsl(var(--dev-tools-blue-hsl));
          --dev-tools-green-hsl: 145, 80%, 42%;
          --dev-tools-green-color: hsl(var(--dev-tools-green-hsl));
          --dev-tools-grey-hsl: 0, 0%, 50%;
          --dev-tools-grey-color: hsl(var(--dev-tools-grey-hsl));
          --dev-tools-yellow-hsl: 38, 98%, 64%;
          --dev-tools-yellow-color: hsl(var(--dev-tools-yellow-hsl));
          --dev-tools-red-hsl: 355, 100%, 68%;
          --dev-tools-red-color: hsl(var(--dev-tools-red-hsl));

          /* Needs to be in ms, used in JavaScript as well */
          --dev-tools-transition-duration: 180ms;

          all: initial;

          direction: ltr;
          cursor: default;
          font: normal 400 var(--dev-tools-font-size) / 1.125rem var(--dev-tools-font-family);
          color: var(--dev-tools-text-color);
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          color-scheme: dark;

          position: fixed;
          z-index: 20000;
          pointer-events: none;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
        }

        .dev-tools {
          pointer-events: auto;
          display: flex;
          align-items: center;
          position: fixed;
          z-index: inherit;
          right: 0.5rem;
          bottom: 0.5rem;
          min-width: 1.75rem;
          height: 1.75rem;
          max-width: 1.75rem;
          border-radius: 0.5rem;
          padding: 0.375rem;
          box-sizing: border-box;
          background-color: var(--dev-tools-background-color-inactive);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
          color: var(--dev-tools-text-color);
          transition: var(--dev-tools-transition-duration);
          white-space: nowrap;
          line-height: 1rem;
        }

        .dev-tools:hover,
        .dev-tools.active {
          background-color: var(--dev-tools-background-color-active);
          box-shadow: var(--dev-tools-box-shadow);
        }

        .dev-tools.active {
          max-width: calc(100% - 1rem);
        }

        .dev-tools .status-description {
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 0.25rem;
        }

        .dev-tools.error {
          background-color: hsla(var(--dev-tools-red-hsl), 0.15);
          animation: bounce 0.5s;
          animation-iteration-count: 2;
        }

        .window.hidden {
          opacity: 0;
          transform: scale(0);
          position: absolute;
        }

        .window.visible {
          transform: none;
          opacity: 1;
          pointer-events: auto;
        }

        .window.visible ~ .dev-tools {
          opacity: 0;
          pointer-events: none;
        }

        .window.visible ~ .dev-tools .dev-tools-icon,
        .window.visible ~ .dev-tools .status-blip {
          transition: none;
          opacity: 0;
        }

        .window {
          border-radius: var(--dev-tools-border-radius);
          overflow: auto;
          margin: 0.5rem;
          min-width: 30rem;
          max-width: calc(100% - 1rem);
          max-height: calc(100vh - 1rem);
          flex-shrink: 1;
          background-color: var(--dev-tools-background-color-active);
          color: var(--dev-tools-text-color);
          transition: var(--dev-tools-transition-duration);
          transform-origin: bottom right;
          display: flex;
          flex-direction: column;
          box-shadow: var(--dev-tools-box-shadow);
          outline: none;
        }

        .window-toolbar {
          display: flex;
          flex: none;
          align-items: center;
          padding: 0.375rem;
          white-space: nowrap;
          order: 1;
          background-color: rgba(0, 0, 0, 0.2);
          gap: 0.5rem;
        }

        .ahreflike {
          font-weight: 500;
          color: var(--dev-tools-text-color-secondary);
          text-decoration: underline;
          cursor: pointer;
        }

        .ahreflike:hover {
          color: var(--dev-tools-text-color-emphasis);
        }

        .button {
          all: initial;
          font-family: inherit;
          font-size: var(--dev-tools-font-size-small);
          line-height: 1;
          white-space: nowrap;
          background-color: rgba(0, 0, 0, 0.2);
          color: inherit;
          font-weight: 600;
          padding: 0.25rem 0.375rem;
          border-radius: 0.25rem;
        }

        .button:focus,
        .button:hover {
          color: var(--dev-tools-text-color-emphasis);
        }

        .message.information {
          --dev-tools-notification-color: var(--dev-tools-blue-color);
        }

        .message.warning {
          --dev-tools-notification-color: var(--dev-tools-yellow-color);
        }

        .message.error {
          --dev-tools-notification-color: var(--dev-tools-red-color);
        }

        .message {
          display: flex;
          padding: 0.1875rem 0.75rem 0.1875rem 2rem;
          background-clip: padding-box;
        }

        .message.log {
          padding-left: 0.75rem;
        }

        .message-content {
          margin-right: 0.5rem;
          -webkit-user-select: text;
          -moz-user-select: text;
          user-select: text;
        }

        .message-heading {
          position: relative;
          display: flex;
          align-items: center;
          margin: 0.125rem 0;
        }

        .message.log {
          color: var(--dev-tools-text-color-secondary);
        }

        .message:not(.log) .message-heading {
          font-weight: 500;
        }

        .message.has-details .message-heading {
          color: var(--dev-tools-text-color-emphasis);
          font-weight: 600;
        }

        .message-heading::before {
          position: absolute;
          margin-left: -1.5rem;
          display: inline-block;
          text-align: center;
          font-size: 0.875em;
          font-weight: 600;
          line-height: calc(1.25em - 2px);
          width: 14px;
          height: 14px;
          box-sizing: border-box;
          border: 1px solid transparent;
          border-radius: 50%;
        }

        .message.information .message-heading::before {
          content: 'i';
          border-color: currentColor;
          color: var(--dev-tools-notification-color);
        }

        .message.warning .message-heading::before,
        .message.error .message-heading::before {
          content: '!';
          color: var(--dev-tools-background-color-active);
          background-color: var(--dev-tools-notification-color);
        }

        .features-tray {
          padding: 0.75rem;
          flex: auto;
          overflow: auto;
          animation: fade-in var(--dev-tools-transition-duration) ease-in;
          user-select: text;
        }

        .features-tray p {
          margin-top: 0;
          color: var(--dev-tools-text-color-secondary);
        }

        .features-tray .feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 0.5em;
        }

        .message .message-details {
          font-weight: 400;
          color: var(--dev-tools-text-color-secondary);
          margin: 0.25rem 0;
        }

        .message .message-details[hidden] {
          display: none;
        }

        .message .message-details p {
          display: inline;
          margin: 0;
          margin-right: 0.375em;
          word-break: break-word;
        }

        .message .persist {
          color: var(--dev-tools-text-color-secondary);
          white-space: nowrap;
          margin: 0.375rem 0;
          display: flex;
          align-items: center;
          position: relative;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }

        .message .persist::before {
          content: '';
          width: 1em;
          height: 1em;
          border-radius: 0.2em;
          margin-right: 0.375em;
          background-color: rgba(255, 255, 255, 0.3);
        }

        .message .persist:hover::before {
          background-color: rgba(255, 255, 255, 0.4);
        }

        .message .persist.on::before {
          background-color: rgba(255, 255, 255, 0.9);
        }

        .message .persist.on::after {
          content: '';
          order: -1;
          position: absolute;
          width: 0.75em;
          height: 0.25em;
          border: 2px solid var(--dev-tools-background-color-active);
          border-width: 0 0 2px 2px;
          transform: translate(0.05em, -0.05em) rotate(-45deg) scale(0.8, 0.9);
        }

        .message .dismiss-message {
          font-weight: 600;
          align-self: stretch;
          display: flex;
          align-items: center;
          padding: 0 0.25rem;
          margin-left: 0.5rem;
          color: var(--dev-tools-text-color-secondary);
        }

        .message .dismiss-message:hover {
          color: var(--dev-tools-text-color);
        }

        .notification-tray {
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
          margin: 0.5rem;
          flex: none;
        }

        .window.hidden + .notification-tray {
          margin-bottom: 3rem;
        }

        .notification-tray .message {
          pointer-events: auto;
          background-color: var(--dev-tools-background-color-active);
          color: var(--dev-tools-text-color);
          max-width: 30rem;
          box-sizing: border-box;
          border-radius: var(--dev-tools-border-radius);
          margin-top: 0.5rem;
          transition: var(--dev-tools-transition-duration);
          transform-origin: bottom right;
          animation: slideIn var(--dev-tools-transition-duration);
          box-shadow: var(--dev-tools-box-shadow);
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }

        .notification-tray .message.animate-out {
          animation: slideOut forwards var(--dev-tools-transition-duration);
        }

        .notification-tray .message .message-details {
          max-height: 10em;
          overflow: hidden;
        }

        .message-tray {
          flex: auto;
          overflow: auto;
          max-height: 20rem;
          user-select: text;
        }

        .message-tray .message {
          animation: fade-in var(--dev-tools-transition-duration) ease-in;
          padding-left: 2.25rem;
        }

        .message-tray .message.warning {
          background-color: hsla(var(--dev-tools-yellow-hsl), 0.09);
        }

        .message-tray .message.error {
          background-color: hsla(var(--dev-tools-red-hsl), 0.09);
        }

        .message-tray .message.error .message-heading {
          color: hsl(var(--dev-tools-red-hsl));
        }

        .message-tray .message.warning .message-heading {
          color: hsl(var(--dev-tools-yellow-hsl));
        }

        .message-tray .message + .message {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .message-tray .dismiss-message,
        .message-tray .persist {
          display: none;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0%);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0%);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
        }

        @keyframes bounce {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.5);
            background-color: hsla(var(--dev-tools-red-hsl), 1);
          }
          100% {
            transform: scale(1);
          }
        }

        @supports (backdrop-filter: blur(1px)) {
          .dev-tools,
          .window,
          .notification-tray .message {
            backdrop-filter: blur(8px);
          }
          .dev-tools:hover,
          .dev-tools.active,
          .window,
          .notification-tray .message {
            background-color: var(--dev-tools-background-color-active-blurred);
          }
        }
      `]}static get isActive(){const e=window.sessionStorage.getItem(h.ACTIVE_KEY_IN_SESSION_STORAGE);return e===null||e!=="false"}elementTelemetry(){let e={};try{const t=localStorage.getItem("vaadin.statistics.basket");if(!t)return;e=JSON.parse(t)}catch{return}this.frontendConnection&&this.frontendConnection.send("reportTelemetry",{browserData:e})}openWebSocketConnection(){if(this.frontendStatus=a.UNAVAILABLE,this.javaStatus=a.UNAVAILABLE,!this.conf.token){console.error("Dev tools functionality denied for this host."),this.log(A.LOG,"See Vaadin documentation on how to configure devmode.hostsAllowed property.",void 0,"https://vaadin.com/docs/latest/configuration/properties#properties",void 0);return}const e=s=>console.error(s),t=(s="reload")=>{if(s==="refresh"||s==="full-refresh"){const c=window.Vaadin;Object.keys(c.Flow.clients).filter(l=>l!=="TypeScript").map(l=>c.Flow.clients[l]).forEach(l=>{l.sendEventMessage?l.sendEventMessage(1,"ui-refresh",{fullRefresh:s==="full-refresh"}):console.warn("Ignoring ui-refresh event for application ",id)})}else{const c=window.sessionStorage.getItem(h.TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE),l=c?parseInt(c,10)+1:1;window.sessionStorage.setItem(h.TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE,l.toString()),window.sessionStorage.setItem(h.TRIGGERED_KEY_IN_SESSION_STORAGE,"true"),window.location.reload()}},n=(s,c)=>{let l=document.head.querySelector(`style[data-file-path='${s}']`);l?(l.textContent=c,document.dispatchEvent(new CustomEvent("vaadin-theme-updated"))):t()},r=new F(this.getDedicatedWebSocketUrl());r.onHandshake=()=>{h.isActive||r.setActive(!1),this.elementTelemetry()},r.onConnectionError=e,r.onReload=t,r.onUpdate=n,r.onStatusChange=s=>{this.frontendStatus=s},r.onMessage=s=>this.handleFrontendMessage(s),this.frontendConnection=r,this.conf.backend===h.SPRING_BOOT_DEVTOOLS&&(this.javaConnection=new te(this.getSpringBootWebSocketUrl(window.location)),this.javaConnection.onHandshake=()=>{h.isActive||this.javaConnection.setActive(!1)},this.javaConnection.onReload=t,this.javaConnection.onConnectionError=e,this.javaConnection.onStatusChange=s=>{this.javaStatus=s})}tabHandleMessage(e,t){const n=e;return n.handleMessage&&n.handleMessage.call(e,t)}handleFrontendMessage(e){e.command==="featureFlags"||X(e,this.bodyShadowRoot)||this.handleHmrMessage(e)||this.unhandledMessages.push(e)}handleHmrMessage(e){return e.command!=="hmr"?!1:(V&&V.notifyListeners(e.data.event,e.data.eventData),!0)}getDedicatedWebSocketUrl(){function e(n){const r=document.createElement("div");return r.innerHTML=`<a href="${n}"/>`,r.firstChild.href}if(this.conf.url===void 0)return;const t=e(this.conf.url);if(!t.startsWith("http://")&&!t.startsWith("https://")){console.error("The protocol of the url should be http or https for live reload to work.");return}return`${t}?v-r=push&debug_window&token=${this.conf.token}`}getSpringBootWebSocketUrl(e){const{hostname:t}=e,n=e.protocol==="https:"?"wss":"ws";if(t.endsWith("gitpod.io")){const r=t.replace(/.*?-/,"");return`${n}://${this.conf.liveReloadPort}-${r}`}else return`${n}://${t}:${this.conf.liveReloadPort}`}connectedCallback(){if(super.connectedCallback(),this.bodyShadowRoot=document.body.attachShadow({mode:"closed"}),this.bodyShadowRoot.innerHTML="<slot></slot>",this.conf=window.Vaadin.devToolsConf||this.conf,window.sessionStorage.getItem(h.TRIGGERED_KEY_IN_SESSION_STORAGE)){const r=new Date;`${`0${r.getHours()}`.slice(-2)}${`0${r.getMinutes()}`.slice(-2)}${`0${r.getSeconds()}`.slice(-2)}`,window.sessionStorage.removeItem(h.TRIGGERED_KEY_IN_SESSION_STORAGE)}this.transitionDuration=parseInt(window.getComputedStyle(this).getPropertyValue("--dev-tools-transition-duration"),10);const t=window;t.Vaadin=t.Vaadin||{},t.Vaadin.devTools=Object.assign(this,t.Vaadin.devTools);const n=window.Vaadin;n.devToolsPlugins&&(Array.from(n.devToolsPlugins).forEach(r=>this.initPlugin(r)),n.devToolsPlugins={push:r=>this.initPlugin(r)}),this.openWebSocketConnection(),ee()}async initPlugin(e){const t=this;e.init({send:function(n,r){t.frontendConnection.send(n,r)}})}format(e){return e.toString()}checkLicense(e){this.frontendConnection?this.frontendConnection.send("checkLicense",e):G({message:"Internal error: no connection",product:e})}startPreTrial(){this.frontendConnection?this.frontendConnection.send("startPreTrialLicense",{}):(console.error("Cannot start pre-trial: no connection"),x(!1,this.bodyShadowRoot))}downloadLicense(e){this.frontendConnection?this.frontendConnection.send("downloadLicense",e):k("failed",this.bodyShadowRoot)}setActive(e){var t,n;(t=this.frontendConnection)==null||t.setActive(e),(n=this.javaConnection)==null||n.setActive(e),window.sessionStorage.setItem(h.ACTIVE_KEY_IN_SESSION_STORAGE,e?"true":"false")}render(){return $` 
      <div
        style="display: none"
        class="dev-tools"
      >
      </div>`}setJavaLiveReloadActive(e){var t;this.javaConnection?this.javaConnection.setActive(e):(t=this.frontendConnection)==null||t.setActive(e)}};d.DISMISSED_NOTIFICATIONS_IN_LOCAL_STORAGE="vaadin.live-reload.dismissedNotifications";d.ACTIVE_KEY_IN_SESSION_STORAGE="vaadin.live-reload.active";d.TRIGGERED_KEY_IN_SESSION_STORAGE="vaadin.live-reload.triggered";d.TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE="vaadin.live-reload.triggeredCount";d.AUTO_DEMOTE_NOTIFICATION_DELAY=5e3;d.HOTSWAP_AGENT="HOTSWAP_AGENT";d.JREBEL="JREBEL";d.SPRING_BOOT_DEVTOOLS="SPRING_BOOT_DEVTOOLS";d.BACKEND_DISPLAY_NAME={HOTSWAP_AGENT:"HotswapAgent",JREBEL:"JRebel",SPRING_BOOT_DEVTOOLS:"Spring Boot Devtools"};C([M({type:String,attribute:!1})],d.prototype,"frontendStatus",void 0);C([M({type:String,attribute:!1})],d.prototype,"javaStatus",void 0);C([B(".window")],d.prototype,"root",void 0);C([j()],d.prototype,"componentPickActive",void 0);d=h=C([Z("vaadin-dev-tools")],d);
