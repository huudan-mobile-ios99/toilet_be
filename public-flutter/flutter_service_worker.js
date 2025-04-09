'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "e32475cbba6463a95aacdac0aef6ec3b",
"version.json": "694f8d5f10f73d3e988a0eb8920a74d3",
"splash/img/wc%20(1).png": "930dd3a914c6c561a264db1eb716affa",
"splash/img/dark-4x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"splash/img/dark-3x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"splash/img/ligh-1x.png": "e5758bb9a828f2179b3ca46e78d99f81",
"splash/img/dark-2x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"splash/img/ligh-2x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"splash/img/dark-1x.png": "e5758bb9a828f2179b3ca46e78d99f81",
"splash/img/ligh-3x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"splash/img/wc.png": "9f27847ea39afec4a8f5733635653d6a",
"splash/img/ligh-4x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"splash/img/wc%20(2).png": "c2ea845dd859a674772a5addd9274675",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "f4d803db23961f98c9e4206793bd0752",
"index.html": "f6c663ea38c6c7fb2d37b1d4724275bd",
"/": "f6c663ea38c6c7fb2d37b1d4724275bd",
"main.dart.js": "425b5f459eccdd17cc882c318bdde3e3",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "0092bd9bb63713d39a52789c3c0d19d2",
"icons/Icon-192.png": "02ac0ee3ea8639d69b51eae210194d79",
"icons/Icon-maskable-192.png": "02ac0ee3ea8639d69b51eae210194d79",
"icons/Icon-maskable-512.png": "5cd6e5f04bcfeea7d8538c8b11b575b8",
"icons/Icon-512.png": "5cd6e5f04bcfeea7d8538c8b11b575b8",
"manifest.json": "abbb9ea5d372c4f730b072021db3e0e6",
"assets/AssetManifest.json": "54dff6575487f2b6fc698279e9fa785f",
"assets/NOTICES": "46fa1c868f16c2944d179a77ea5759ca",
"assets/FontManifest.json": "0930e33f3a0243f7a3d91592335ff9f4",
"assets/AssetManifest.bin.json": "c455729c1565300fc09f250930f4a5d0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "1e17b1ec3152f29bf783bd42db8b6023",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "093d2cde7075fcffb24ab215668d0da2",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "5ac99533bd9dc46227434b4853c3e532",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "6cdf80a00f6b4d73f426eefad359cf7f",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/images/bg2.jpg": "e72d4aa66f297d8df8eddecaa792be85",
"assets/assets/icons/user_profile.png": "4dfbf19f8a36f2dc426c3258ca8455b5",
"assets/assets/icons/datetime.png": "153774e0df84502d971b3a385fc1edb2",
"assets/assets/icons/launcher/sorayomi_icon.ico": "40833923db3ba9fb49feb0c784ed9662",
"assets/assets/icons/launcher/from_suwayomi.png": "322d246b4780e447ad411e9ccfcc6a93",
"assets/assets/icons/launcher/sorayomi_preview_icon.png": "35d2f7aba2761306336d04d4ef414032",
"assets/assets/icons/launcher/sorayomi_icon.png": "8fe0d1d0fb3d54bd44c909e2818b70e2",
"assets/assets/icons/dark_icon.png": "c2ea845dd859a674772a5addd9274675",
"assets/assets/icons/dark-4x.png": "0092bd9bb63713d39a52789c3c0d19d2",
"assets/assets/icons/light_icon.png": "c2ea845dd859a674772a5addd9274675",
"assets/assets/icons/tasks.png": "cf56967b223407a27f075c0bd3046a72",
"assets/assets/icons/checker.png": "f60dfb03d23820f8bcb97959ebd63fd3",
"assets/assets/icons/user.png": "56529c701fdc4c7574588bfde2778410",
"assets/assets/icons/folder.png": "71c5b14189c5ddce86ccde84b106b13e",
"assets/assets/icons/calendar.png": "1c62b0cc73160b1fd52f5824650e9e10",
"assets/assets/icons/previous_done.png": "cff60670ab97b59d72be60ab7201d5cc",
"assets/assets/fonts/Poppins-Regular.ttf": "093ee89be9ede30383f39a899c485a82",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "3f19809190a2866b6849ce17d97f26cc",
"canvaskit/canvaskit.js.symbols": "4e057eda12866a5b55673b200c2ca372",
"canvaskit/skwasm.wasm": "b32a9969e65a7f573044b758f53ce3cf",
"canvaskit/chromium/canvaskit.js.symbols": "1a402b5f22e7bf3062421e850d025c3b",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "85712bbf9dc9b01ec7be9a001e834c7c",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "59fddb8ae82f2156f987d6fce4584928",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
