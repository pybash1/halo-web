import 'kleur/colors';
import { o as decodeKey } from './chunks/astro/server_YBKXH5Uu.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_B1RfLPqr.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/ritankar/halo-web/","cacheDir":"file:///Users/ritankar/halo-web/node_modules/.astro/","outDir":"file:///Users/ritankar/halo-web/dist/","srcDir":"file:///Users/ritankar/halo-web/src/","publicDir":"file:///Users/ritankar/halo-web/public/","buildClientDir":"file:///Users/ritankar/halo-web/dist/client/","buildServerDir":"file:///Users/ritankar/halo-web/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/waitlist","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/waitlist\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"waitlist","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/waitlist.ts","pathname":"/api/waitlist","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/ritankar/halo-web/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/waitlist@_@ts":"pages/api/waitlist.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_ByzQs87F.mjs","/Users/ritankar/halo-web/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BwhqYji6.mjs","/Users/ritankar/halo-web/src/components/ScrollVideoBackground":"_astro/ScrollVideoBackground.61wTG3ml.js","/Users/ritankar/halo-web/src/components/WaitlistButton":"_astro/WaitlistButton.Y_7g48Yg.js","@astrojs/react/client.js":"_astro/client.DVhZ-Sy2.js","/Users/ritankar/halo-web/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.C0L1fRg1.js","/Users/ritankar/halo-web/src/components/Footer.astro?astro&type=script&index=0&lang.ts":"_astro/Footer.astro_astro_type_script_index_0_lang.Dpis2pkE.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/ritankar/halo-web/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"astro:page-load\",()=>{s(),a()});s();a();function a(){const e=document.getElementById(\"main-nav\"),t=document.getElementById(\"nav-toggle\"),o=document.querySelectorAll(\".nav-menu-link\");e&&t&&(t.addEventListener(\"click\",()=>{const n=e.getAttribute(\"data-menu-open\")===\"true\";e.setAttribute(\"data-menu-open\",n?\"false\":\"true\")}),o.forEach(n=>{n.addEventListener(\"click\",()=>{e.setAttribute(\"data-menu-open\",\"false\")})}))}function s(){const e=document.getElementById(\"main-nav\"),t=document.getElementById(\"footer-container\")||document.querySelector(\"footer\");e&&t&&new IntersectionObserver(n=>{n.forEach(r=>{r.isIntersecting?(e.classList.add(\"-translate-y-[150%]\"),e.setAttribute(\"data-menu-open\",\"false\")):e.classList.remove(\"-translate-y-[150%]\")})},{threshold:.1}).observe(t)}"],["/Users/ritankar/halo-web/src/components/Footer.astro?astro&type=script&index=0&lang.ts","const s=document.getElementById(\"subscribe-form\"),e=document.getElementById(\"subscribe-btn\"),n=document.getElementById(\"subscribe-input\");s&&e&&n&&s.addEventListener(\"submit\",async r=>{r.preventDefault();const i=n.value;if(!i)return;const o=e.innerText;e.innerText=\"WAIT...\",e.disabled=!0;try{const t=await fetch(\"/api/waitlist\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:i})}),a=await t.json();t.ok?(e.innerText=\"SUBSCRIBED\",n.value=\"\"):(e.innerText=\"ERROR\",console.error(a.error))}catch{e.innerText=\"ERROR\"}finally{setTimeout(()=>{e.innerText!==\"SUBSCRIBED\"&&(e.innerText=o,e.disabled=!1)},3e3)}});"]],"assets":["/_astro/instrument-serif-latin-ext-400-normal.CNbCjDc5.woff2","/_astro/instrument-serif-latin-400-normal.CwvVGij3.woff2","/_astro/dm-sans-latin-ext-wght-normal.CjLIybot.woff2","/_astro/dm-sans-latin-wght-normal.RbQjuyZ0.woff2","/_astro/instrument-serif-latin-400-normal.BKYSN5O0.woff","/_astro/instrument-serif-latin-ext-400-normal.ZduzdBhS.woff","/_astro/index.UaaQZTfl.css","/cursor-default.svg","/cursor-pointer.svg","/cursor-text.svg","/favicon.png","/favicon.svg","/_astro/ScrollVideoBackground.61wTG3ml.js","/_astro/WaitlistButton.Y_7g48Yg.js","/_astro/client.DVhZ-Sy2.js","/_astro/index.RH_Wq4ov.js","/_astro/index.nqNQovPP.js","/_astro/jsx-runtime.D_zvdyIk.js","/fonts/Satoshi-Variable.woff2","/media/sky_bg.mp4","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"ScHmYqZQ8Lu0R5OmtdwFsmEeB3MMbWrPdlwgbhNtuy8="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
