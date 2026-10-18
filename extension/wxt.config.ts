import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Imgur Proxy',
    description: 'Redirects imgur image requests through a proxy',
    permissions: ['declarativeNetRequest', 'declarativeNetRequestFeedback'],
    host_permissions: ['<all_urls>'],
  },
});