import 'piccolore';
import { n as decodeKey } from './chunks/astro/server_DJLMGM8A.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BgtkF-gM.mjs';
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

const manifest = deserializeManifest({"hrefRoot":"file:///Users/ritankar/halo-web/","cacheDir":"file:///Users/ritankar/halo-web/node_modules/.astro/","outDir":"file:///Users/ritankar/halo-web/dist/","srcDir":"file:///Users/ritankar/halo-web/src/","publicDir":"file:///Users/ritankar/halo-web/public/","buildClientDir":"file:///Users/ritankar/halo-web/dist/client/","buildServerDir":"file:///Users/ritankar/halo-web/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"mission/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/mission","isIndex":false,"type":"page","pattern":"^\\/mission\\/?$","segments":[[{"content":"mission","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/mission.astro","pathname":"/mission","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"roadmap/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/roadmap","isIndex":false,"type":"page","pattern":"^\\/roadmap\\/?$","segments":[[{"content":"roadmap","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/roadmap.astro","pathname":"/roadmap","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/waitlist","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/waitlist\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"waitlist","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/waitlist.ts","pathname":"/api/waitlist","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/ritankar/halo-web/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/ritankar/halo-web/src/pages/mission.astro",{"propagation":"none","containsHead":true}],["/Users/ritankar/halo-web/src/pages/roadmap.astro",{"propagation":"none","containsHead":true}],["/Users/ritankar/halo-web/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/waitlist@_@ts":"pages/api/waitlist.astro.mjs","\u0000@astro-page:src/pages/mission@_@astro":"pages/mission.astro.mjs","\u0000@astro-page:src/pages/roadmap@_@astro":"pages/roadmap.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_1DmoLLbK.mjs","/Users/ritankar/halo-web/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BXANYqos.mjs","/Users/ritankar/halo-web/src/components/CustomCursor":"_astro/CustomCursor.BYLrifiW.js","/Users/ritankar/halo-web/src/components/ScrollVideoBackground":"_astro/ScrollVideoBackground.B3bCmZPk.js","@astrojs/react/client.js":"_astro/client.i8_f7Fkk.js","/Users/ritankar/halo-web/src/components/WaitlistButton.tsx":"_astro/WaitlistButton.7j4pGQvv.js","/Users/ritankar/halo-web/src/components/WaitlistButton":"_astro/WaitlistButton.dRGfOTCC.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/instrument-serif-latin-400-normal.DnYpCC2O.woff2","/_astro/instrument-serif-latin-ext-400-normal.C2je3j2s.woff2","/_astro/dm-sans-latin-ext-wght-normal.BOFOeGcA.woff2","/_astro/dm-sans-latin-wght-normal.Xz1IZZA0.woff2","/_astro/instrument-serif-latin-400-normal.BVbkICAY.woff","/_astro/instrument-serif-latin-ext-400-normal.CFCUzsTy.woff","/_astro/about.4NIDi6Yt.css","/favicon.svg","/_astro/CustomCursor.BYLrifiW.js","/_astro/ScrollVideoBackground.B3bCmZPk.js","/_astro/WaitlistButton.7j4pGQvv.js","/_astro/WaitlistButton.dRGfOTCC.js","/_astro/client.i8_f7Fkk.js","/_astro/index.DiEladB3.js","/_astro/index.UCiZe19v.js","/_astro/jsx-runtime.D_zvdyIk.js","/fonts/Satoshi-Variable.woff2","/media/sky_bg.mp4","/about/index.html","/mission/index.html","/roadmap/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"JY12Lgtp78yUpIx4hAT6Wrp0/pyEHAjbW7GRYBcyvg4="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
