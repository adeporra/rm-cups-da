/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Real Madrid European Cups landing pages cleanup
 * Purpose: Remove navigation, footer, cookie consent, and non-content elements
 * Applies to: www.realmadrid.com/landings/european-cups-won/ (all pages)
 * Generated: 2026-02-27
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of fifth-european-cup.html
 * - Verified classes: .masthead, .main_nav, footer, #onetrust-consent-sdk
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove sticky navigation header
    // EXTRACTED: Found <div class="masthead sticky"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.masthead',
    ]);

    // Remove cookie consent banner
    // EXTRACTED: Found <div id="onetrust-consent-sdk"> in captured DOM (line 501)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
    ]);

    // Remove middle banner (decorative, between match result and summary)
    // EXTRACTED: Found second .m_banner inside .game_row with external image URL
    const gameRow = element.querySelector('.game_row');
    if (gameRow) {
      const banners = gameRow.querySelectorAll('.m_banner');
      if (banners.length > 0) {
        // Remove the second banner (middle decorative banner)
        const lastBanner = banners[banners.length - 1];
        lastBanner.remove();
      }
    }

    // Remove navigation arrow inside banner
    // EXTRACTED: Found <a href="#result" class="m_arrow"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.m_arrow',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove footer
    // EXTRACTED: Found <footer> with .m_footer_actions and .m_footer_social
    WebImporter.DOMUtils.remove(element, [
      'footer',
    ]);

    // Remove remaining iframes and non-content elements
    // Standard HTML elements - safe to remove
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'canvas',
    ]);

    // Clean tracking attributes found in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
