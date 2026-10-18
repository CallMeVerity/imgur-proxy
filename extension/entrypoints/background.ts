
export default defineBackground(() => {
  const PROXY = 'https://imgur.nathan.rip';

  const { RuleActionType, ResourceType } =
    browser.declarativeNetRequest;

  browser.runtime.onInstalled.addListener(async () => {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2],
      addRules: [
        {
          id: 1,
          priority: 1,
          action: {
            type: RuleActionType.REDIRECT,
            redirect: {
              regexSubstitution: `${PROXY}/\\1`,
            },
          },
          condition: {
            regexFilter:
              '^https?://(?:www\\.)?imgur\\.com/(.*)$',
            resourceTypes: [
              ResourceType.MAIN_FRAME,
              ResourceType.SUB_FRAME,
            ],
          },
        },
        {
          id: 2,
          priority: 1,
          action: {
            type: RuleActionType.REDIRECT,
            redirect: {
              regexSubstitution: `${PROXY}/\\1`,
            },
          },
          condition: {
            regexFilter:
              '^https?://i\\.imgur\\.com/(.*)$',
            resourceTypes: [
              ResourceType.IMAGE,
              ResourceType.MEDIA,
              ResourceType.XMLHTTPREQUEST,
            ],
          },
        },
      ],
    });
  });

  browser.declarativeNetRequest.onRuleMatchedDebug?.addListener(
    (info) => {
      console.log('Redirected:', info.request.url);
    },
  );
});