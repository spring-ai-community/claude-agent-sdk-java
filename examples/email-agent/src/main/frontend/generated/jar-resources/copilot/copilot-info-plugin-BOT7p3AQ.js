import { j as p, I as c, v as y, B as a, J as g, E as k, an as u, R as $, Y as I, W as V, X as C, M as S, b as D, r as w } from "./copilot-BLh5wx96.js";
import { B as E } from "./base-panel-CfEmfEkB.js";
import { i as d } from "./icons-JiiuKfcS.js";
import { c as P } from "./index-D5wBGfNx.js";
const A = 'copilot-info-panel{--dev-tools-red-color: red;--dev-tools-grey-color: gray;--dev-tools-green-color: green;position:relative}copilot-info-panel dl{margin:0;width:100%}copilot-info-panel dl>div{align-items:center;display:flex;gap:var(--space-50);height:var(--size-m);padding:0 var(--space-150);position:relative}copilot-info-panel dl>div:after{border-bottom:1px solid var(--divider-secondary-color);content:"";inset:auto var(--space-150) 0;position:absolute}copilot-info-panel dl dt{color:var(--secondary-text-color)}copilot-info-panel dl dd{align-items:center;display:flex;font-weight:var(--font-weight-medium);gap:var(--space-50);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}copilot-info-panel dl dd span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}copilot-info-panel dl dd span.icon{display:inline-flex;vertical-align:bottom}copilot-info-panel dd.live-reload-status>span{overflow:hidden;text-overflow:ellipsis;display:block;color:var(--status-color)}copilot-info-panel dd span.hidden{display:none}copilot-info-panel code{white-space:nowrap;-webkit-user-select:all;user-select:all}copilot-info-panel .checks{display:inline-grid;grid-template-columns:auto 1fr;gap:var(--space-50)}copilot-info-panel span.hint{font-size:var(--font-size-0);background:var(--gray-50);padding:var(--space-75);border-radius:var(--radius-2)}';
var H = Object.getOwnPropertyDescriptor, h = (e, t, i, o) => {
  for (var s = o > 1 ? void 0 : o ? H(t, i) : t, n = e.length - 1, l; n >= 0; n--)
    (l = e[n]) && (s = l(s) || s);
  return s;
};
let m = class extends E {
  connectedCallback() {
    super.connectedCallback(), this.onEventBus("system-info-with-callback", (e) => {
      e.detail.callback(this.getInfoForClipboard(e.detail.notify));
    }), this.reaction(
      () => p.idePluginState,
      () => {
        this.requestUpdate("serverInfo");
      }
    );
  }
  getIndex(e) {
    return c.serverVersions.findIndex((t) => t.name === e);
  }
  render() {
    const e = p.newVaadinVersionState?.versions !== void 0 && p.newVaadinVersionState.versions.length > 0, t = [];
    p.userInfo?.vaadiner && t.push({
      name: "Vaadin Employee",
      version: "true"
    });
    const i = [
      ...c.serverVersions,
      ...t,
      ...c.clientVersions
    ].map((s) => {
      const n = { ...s };
      return n.name === "Vaadin" && (n.more = a` <button
          aria-label="Edit Vaadin Version"
          class="icon relative"
          id="new-vaadin-version-btn"
          title="Edit Vaadin Version"
          @click="${(l) => {
        l.stopPropagation(), y.updatePanel("copilot-vaadin-versions", { floating: !0 });
      }}">
          ${d.editAlt}
          ${e ? a`<span aria-hidden="true" class="absolute bg-error end-0 h-75 rounded-full top-0 w-75"></span>` : ""}
        </button>`), n;
    });
    let o = this.getIndex("Spring") + 1;
    return o === 0 && (o = i.length), c.springSecurityEnabled && (i.splice(o, 0, { name: "Spring Security", version: "true" }), o++), c.springJpaDataEnabled && (i.splice(o, 0, { name: "Spring Data JPA", version: "true" }), o++), a` <style>
        ${A}
      </style>
      <div class="flex flex-col gap-150 items-start">
        <dl>
          ${i.map(
      (s) => a`
              <div>
                <dt>${s.name}</dt>
                <dd title="${s.version}">
                  <span> ${this.renderValue(s.version)} </span>
                  ${s.more}
                </dd>
              </div>
            `
    )}
          ${this.renderDevWorkflowSection()} ${this.renderDevelopmentWorkflowButton()}
        </dl>
      </div>`;
  }
  renderDevWorkflowSection() {
    const e = g(), t = this.getIdePluginLabelText(p.idePluginState), i = this.getHotswapAgentLabelText(e);
    return a`
      <div>
        <dt>Java Hotswap</dt>
        <dd>
          ${f(e === "success", e === "success" ? "Enabled" : "Disabled")} ${i}
        </dd>
      </div>
      ${u() !== "unsupported" ? a` <div>
            <dt>IDE Plugin</dt>
            <dd>
              ${f(
      u() === "success",
      u() === "success" ? "Installed" : "Not Installed"
    )}
              ${t}
            </dd>
          </div>` : k}
    `;
  }
  renderDevelopmentWorkflowButton() {
    const e = $();
    let t = "", i = null, o = "";
    return e.status === "success" ? (t = "success", i = d.check, o = "IDE Plugin and Java Hotswap are in use.") : e.status === "warning" ? (t = "warning", i = d.lightning, o = "Improve Development Workflow") : e.status === "error" && (t = "error", i = d.alertCircle, o = "Fix Development Workflow"), a`
      <div>
        <dt>Development Workflow</dt>
        <dd>
          <span class="${t}-text icon" id="development-status-value">${i}</span>
          <vaadin-tooltip for="development-status-value" text="${o}"></vaadin-tooltip>
          <button
            id="development-workflow-status-detail"
            class="link-button"
            @click=${() => {
      I();
    }}>
            Show details
          </button>
        </dd>
      </div>
    `;
  }
  getHotswapAgentLabelText(e) {
    return e === "success" ? "Java Hotswap is enabled" : e === "error" ? "Hotswap is partially enabled" : "Hotswap is disabled";
  }
  getIdePluginLabelText(e) {
    if (u() !== "success")
      return "Not installed";
    if (e?.version) {
      let t = null;
      return e?.ide && (e?.ide === "intellij" ? t = "IntelliJ" : e?.ide === "vscode" ? t = "VS Code" : e?.ide === "eclipse" && (t = "Eclipse")), t ? `${e?.version} ${t}` : e?.version;
    }
    return "Not installed";
  }
  renderValue(e) {
    return e === "false" ? f(!1, "False") : e === "true" ? f(!0, "True") : e;
  }
  getInfoForClipboard(e) {
    const t = this.renderRoot.querySelectorAll(".items-start dt"), s = Array.from(t).map((n) => ({
      key: n.textContent.trim(),
      value: n.nextElementSibling.textContent.trim()
    })).filter((n) => n.key !== "Live reload").filter((n) => !n.key.startsWith("Vaadin Emplo")).filter((n) => n.key !== "Development Workflow").map((n) => {
      const { key: l } = n;
      let { value: r } = n;
      if (l === "IDE Plugin")
        r = this.getIdePluginLabelText(p.idePluginState) ?? "false";
      else if (l === "Java Hotswap") {
        const x = c.jdkInfo?.jrebel, v = g();
        x && v === "success" ? r = "JRebel is in use" : r = this.getHotswapAgentLabelText(v);
      } else l === "Vaadin" && r.indexOf(`
`) !== -1 && (r = r.substring(0, r.indexOf(`
`)));
      return `${l}: ${r}`;
    }).join(`
`);
    return e && V({
      type: C.INFORMATION,
      message: "Environment information copied to clipboard",
      dismissId: "versionInfoCopied"
    }), s.trim();
  }
};
m = h([
  w("copilot-info-panel")
], m);
let b = class extends S {
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.style.display = "flex";
  }
  render() {
    return a` <button
      @click=${() => {
      D.emit("system-info-with-callback", {
        callback: P,
        notify: !0
      });
    }}
      aria-label="Copy to Clipboard"
      class="icon"
      title="Copy to Clipboard">
      <span>${d.copy}</span>
    </button>`;
  }
};
b = h([
  w("copilot-info-actions")
], b);
const T = {
  header: "Info",
  expanded: !1,
  panelOrder: 15,
  panel: "right",
  floating: !1,
  tag: "copilot-info-panel",
  actionsTag: "copilot-info-actions",
  eager: !0
  // Render even when collapsed as error handling depends on this
}, W = {
  init(e) {
    e.addPanel(T);
  }
};
window.Vaadin.copilot.plugins.push(W);
function f(e, t) {
  return e ? a`<span aria-label=${t} class="icon success-text" title=${t}>${d.check}</span>` : a`<span aria-label=${t} class="icon error-text" title=${t}>${d.x}</span>`;
}
export {
  b as Actions,
  m as CopilotInfoPanel
};
