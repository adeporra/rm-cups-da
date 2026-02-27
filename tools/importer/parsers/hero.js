/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.realmadrid.com/landings/european-cups-won/fifth-european-cup.html
 * Base Block: hero
 *
 * Block Structure (from block library example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, subheading)
 *
 * Source HTML Pattern (verified from captured DOM):
 * <div class="m_banner m_banner_ready">
 *   <img class="m_banner_image" src="...">
 *   <div class="m_banner_title">
 *     <h1 class="m_banner_title_year"><span>1959 · 1960</span></h1>
 *     <h2 class="m_banner_title_subtitle">5th European Cup<br>Five-time European champions</h2>
 *     <a href="#result" class="m_arrow">...</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: <img class="m_banner_image"> found in captured DOM
  const bgImage = element.querySelector('.m_banner_image') ||
                  element.querySelector('img');

  // Extract main heading (year)
  // VALIDATED: <h1 class="m_banner_title_year"> found in captured DOM
  const heading = element.querySelector('.m_banner_title_year') ||
                  element.querySelector('h1');

  // Extract subtitle
  // VALIDATED: <h2 class="m_banner_title_subtitle"> found in captured DOM
  const subtitle = element.querySelector('.m_banner_title_subtitle') ||
                   element.querySelector('h2');

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading + subtitle)
  const contentCell = [];
  if (heading) {
    // Ensure heading uses h1 tag for hero
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  if (subtitle) {
    // Preserve subtitle text including line breaks
    const p = document.createElement('p');
    p.innerHTML = subtitle.innerHTML;
    contentCell.push(p);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
