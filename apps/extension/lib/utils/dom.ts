const TWEET_CELL_SELECTOR = 'div[data-testid="cellInnerDiv"]';
const HIDDEN_ATTR = 'data-openscroll-hidden';

export function getTweetCells(): NodeListOf<Element> {
  return document.querySelectorAll(TWEET_CELL_SELECTOR);
}

export function hideTweet(cell: Element): void {
  (cell as HTMLElement).style.display = 'none';
  cell.setAttribute(HIDDEN_ATTR, 'true');
}

export function showTweet(cell: Element): void {
  (cell as HTMLElement).style.display = '';
  cell.removeAttribute(HIDDEN_ATTR);
}

export function isTweetHidden(cell: Element): boolean {
  return cell.hasAttribute(HIDDEN_ATTR);
}

export function createTweetObserver(onTweetsAdded: () => void): MutationObserver {
  return new MutationObserver((mutations) => {
    const hasNewTweets = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some(
        (node) =>
          node instanceof Element &&
          (node.matches(TWEET_CELL_SELECTOR) || node.querySelector(TWEET_CELL_SELECTOR))
      )
    );

    if (hasNewTweets) {
      onTweetsAdded();
    }
  });
}

export function startObserving(observer: MutationObserver): void {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function stopObserving(observer: MutationObserver): void {
  observer.disconnect();
}
