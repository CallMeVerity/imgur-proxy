export default defineBackground(() => {
  const PROXY = 'http://localhost:8080';

  const { RuleActionType, ResourceType } = browser.declarativeNetRequest;

  browser.runtime.onInstalled.addListener(async () => {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: RuleActionType.REDIRECT,
            redirect: { regexSubstitution: `${PROXY}/\\1` },
          },
          condition: {
            regexFilter: '^https?://i\\.imgur\\.com/(.*)$',
            resourceTypes: [
              ResourceType.IMAGE,
              ResourceType.MEDIA,
              ResourceType.XMLHTTPREQUEST,
              ResourceType.SUB_FRAME,
              ResourceType.MAIN_FRAME,
            ],
          },
        },
      ],
    });
  });

  browser.declarativeNetRequest.onRuleMatchedDebug?.addListener((info) => {
    console.log('Redirected:', info.request.url);
  });
});