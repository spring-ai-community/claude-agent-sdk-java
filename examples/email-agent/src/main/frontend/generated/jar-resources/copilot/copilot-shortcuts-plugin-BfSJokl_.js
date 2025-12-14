import { r as f, b as c, E as g, B as l, v as b, a2 as m, Z as t, G as $ } from "./copilot-BLh5wx96.js";
import { B as v } from "./base-panel-CfEmfEkB.js";
import { i as e } from "./icons-JiiuKfcS.js";
const y = 'copilot-shortcuts-panel{display:flex;flex-direction:column;padding:var(--space-150)}copilot-shortcuts-panel h3{font:var(--font-xsmall-semibold);margin-bottom:var(--space-100);margin-top:0}copilot-shortcuts-panel h3:not(:first-of-type){margin-top:var(--space-200)}copilot-shortcuts-panel ul{display:flex;flex-direction:column;list-style:none;margin:0;padding:0}copilot-shortcuts-panel ul li{display:flex;align-items:center;gap:var(--space-50);position:relative}copilot-shortcuts-panel ul li:not(:last-of-type):before{border-bottom:1px dashed var(--border-color);content:"";inset:auto 0 0 calc(var(--size-m) + var(--space-50));position:absolute}copilot-shortcuts-panel ul li span:has(svg){align-items:center;display:flex;height:var(--size-m);justify-content:center;width:var(--size-m)}copilot-shortcuts-panel .kbds{margin-inline-start:auto}copilot-shortcuts-panel kbd{align-items:center;border:1px solid var(--border-color);border-radius:var(--radius-2);box-sizing:border-box;display:inline-flex;font-family:var(--font-family);font-size:var(--font-size-1);line-height:var(--line-height-1);padding:0 var(--space-50)}', u = window.Vaadin.copilot.tree;
if (!u)
  throw new Error("Tried to access copilot tree before it was initialized.");
var w = Object.getOwnPropertyDescriptor, x = (s, i, h, p) => {
  for (var o = p > 1 ? void 0 : p ? w(i, h) : i, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = r(o) || o);
  return o;
};
let d = class extends v {
  constructor() {
    super(), this.onTreeUpdated = () => {
      this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), c.on("copilot-tree-created", this.onTreeUpdated);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), c.off("copilot-tree-created", this.onTreeUpdated);
  }
  render() {
    const s = u.hasFlowComponents();
    return l`<style>
        ${y}
      </style>
      <h3>Global</h3>
      <ul>
        <li>
          <span>${e.vaadinLogo}</span>
          <span>Copilot</span>
          ${a(t.toggleCopilot)}
        </li>
        <li>
          <span>${e.terminal}</span>
          <span>Command window</span>
          ${a(t.toggleCommandWindow)}
        </li>
        <li>
          <span>${e.flipBack}</span>
          <span>Undo</span>
          ${a(t.undo)}
        </li>
        <li>
          <span>${e.flipForward}</span>
          <span>Redo</span>
          ${a(t.redo)}
        </li>
      </ul>
      <h3>Selected component</h3>
      <ul>
        <li>
          <span>${e.fileCodeAlt}</span>
          <span>Go to source</span>
          ${a(t.goToSource)}
        </li>
        ${s ? l`<li>
              <span>${e.code}</span>
              <span>Go to attach source</span>
              ${a(t.goToAttachSource)}
            </li>` : g}
        <li>
          <span>${e.copy}</span>
          <span>Copy</span>
          ${a(t.copy)}
        </li>
        <li>
          <span>${e.clipboard}</span>
          <span>Paste</span>
          ${a(t.paste)}
        </li>
        <li>
          <span>${e.copyAlt}</span>
          <span>Duplicate</span>
          ${a(t.duplicate)}
        </li>
        <li>
          <span>${e.userUp}</span>
          <span>Select parent</span>
          ${a(t.selectParent)}
        </li>
        <li>
          <span>${e.userLeft}</span>
          <span>Select previous sibling</span>
          ${a(t.selectPreviousSibling)}
        </li>
        <li>
          <span>${e.userRight}</span>
          <span>Select first child / next sibling</span>
          ${a(t.selectNextSibling)}
        </li>
        <li>
          <span>${e.trash}</span>
          <span>Delete</span>
          ${a(t.delete)}
        </li>
        <li>
          <span>${e.zap}</span>
          <span>Quick add from palette</span>
          ${a("<kbd>A ... Z</kbd>")}
        </li>
      </ul>`;
  }
  /**
   * Closes the panel. Used from shortcuts
   */
  close() {
    b.updatePanel("copilot-shortcuts-panel", {
      floating: !1
    });
  }
};
d = x([
  f("copilot-shortcuts-panel")
], d);
function a(s) {
  return l`<span class="kbds">${m(s)}</span>`;
}
const C = $({
  header: "Keyboard Shortcuts",
  tag: "copilot-shortcuts-panel",
  width: 400,
  height: 550,
  floatingPosition: {
    top: 50,
    left: 50
  }
}), P = {
  init(s) {
    s.addPanel(C);
  }
};
window.Vaadin.copilot.plugins.push(P);
