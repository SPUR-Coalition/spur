import "clsx";
function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="app svelte-12qhfyh"><header class="svelte-12qhfyh"><div class="logo svelte-12qhfyh">SPUR</div> <div class="title svelte-12qhfyh">Live telemetry demo</div> <div class="subtitle svelte-12qhfyh">OpenAttribution Telemetry + Guardian content</div></header> <main class="svelte-12qhfyh">`);
  children($$renderer);
  $$renderer.push(`<!----></main></div>`);
}
export {
  _layout as default
};
