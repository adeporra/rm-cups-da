/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.realmadrid.com/landings/european-cups-won/fifth-european-cup.html
 * Base Block: columns
 *
 * Handles multiple column layout patterns found on European Cup landing pages:
 * 1. Data Grid (.m_grid) - Stadium info, lineup, team rosters, goals
 * 2. Stats (.m_stats_group) - 4-column statistics display
 * 3. Trivia (.m_details) - Image + text two-column layout
 * 4. Photo Mosaic (.m_mosaic) - 3-column photo gallery
 *
 * Block Structure (from block library example):
 * - Row 1+: Content rows with N columns each
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which type of columns layout this is based on DOM classes
  // VALIDATED: All class names extracted from captured DOM

  if (element.classList.contains('m_stats_group')) {
    // === STATS LAYOUT ===
    // VALIDATED: .m_stats contains .m_stats_val and .m_stats_stat_name
    const statItems = element.querySelectorAll('.m_stats');
    const row = [];

    statItems.forEach((stat) => {
      const value = stat.querySelector('.m_stats_val');
      const label = stat.querySelector('.m_stats_stat_name');
      const cell = document.createElement('div');

      if (value) {
        const strong = document.createElement('strong');
        strong.textContent = value.textContent.trim();
        cell.appendChild(strong);
      }
      if (label) {
        const p = document.createElement('p');
        p.textContent = label.textContent.trim();
        cell.appendChild(p);
      }
      row.push(cell);
    });

    if (row.length > 0) {
      cells.push(row);
    }
  } else if (element.classList.contains('m_details')) {
    // === TRIVIA LAYOUT (image left + text right) ===
    // VALIDATED: .m_details_deco contains decorative image
    // VALIDATED: .m_details_content contains team logos, title, text
    const decoImg = element.querySelector('.m_details_deco img') ||
                    element.querySelector('.m_details_deco .img');
    const content = element.querySelector('.m_details_content');

    const leftCell = document.createElement('div');
    if (decoImg) {
      leftCell.appendChild(decoImg.cloneNode(true));
    }

    const rightCell = document.createElement('div');
    if (content) {
      // Extract team logos
      // VALIDATED: .m_details_teams > .m_details_team > img
      const teamLogos = content.querySelectorAll('.m_details_team img');
      teamLogos.forEach((logo) => {
        rightCell.appendChild(logo.cloneNode(true));
      });

      // Extract title
      // VALIDATED: <h1 class="m_details_title">Trivia</h1>
      const title = content.querySelector('.m_details_title') ||
                    content.querySelector('h1, h2');
      if (title) {
        const h2 = document.createElement('h2');
        h2.textContent = title.textContent.trim();
        rightCell.appendChild(h2);
      }

      // Extract trivia paragraphs
      // VALIDATED: .m_details_text > p
      const paragraphs = content.querySelectorAll('.m_details_text p');
      paragraphs.forEach((p) => {
        const newP = document.createElement('p');
        newP.innerHTML = p.innerHTML;
        rightCell.appendChild(newP);
      });
    }

    cells.push([leftCell, rightCell]);
  } else if (element.classList.contains('m_mosaic')) {
    // === PHOTO MOSAIC LAYOUT ===
    // VALIDATED: .m_mosaic_col1, .m_mosaic_col2, .m_mosaic_col3
    const cols = element.querySelectorAll('[class*="m_mosaic_col"]');
    const row = [];

    cols.forEach((col) => {
      const cell = document.createElement('div');
      const images = col.querySelectorAll('img');
      images.forEach((img) => {
        cell.appendChild(img.cloneNode(true));
      });
      row.push(cell);
    });

    if (row.length > 0) {
      cells.push(row);
    }
  } else if (element.classList.contains('m_grid')) {
    // === DATA GRID LAYOUT ===
    // Complex grid containing stadium, lineup, team rosters, goals
    // VALIDATED: .m_grid_content > .m_grid_col contains .m_grid_cell elements

    // --- Stadium + Spectators row ---
    // VALIDATED: .m_grid_cell_location contains stadium info
    const locationCell = element.querySelector('.m_grid_cell_location');
    // VALIDATED: .m_grid_cell_spectators contains spectator count
    const spectatorsCell = element.querySelector('.m_grid_cell_spectators');

    if (locationCell || spectatorsCell) {
      const col1 = document.createElement('div');
      if (locationCell) {
        const img = locationCell.querySelector('.m_place_image_main');
        if (img) col1.appendChild(img.cloneNode(true));
        const title = locationCell.querySelector('.m_place_title p');
        if (title) {
          const strong = document.createElement('strong');
          strong.textContent = title.textContent.trim();
          col1.appendChild(strong);
        }
        const desc = locationCell.querySelector('.m_place_description p');
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          col1.appendChild(p);
        }
        const name = locationCell.querySelector('.m_place_name');
        if (name) {
          const em = document.createElement('em');
          em.textContent = name.textContent.trim();
          col1.appendChild(em);
        }
      }

      const col2 = document.createElement('div');
      if (spectatorsCell) {
        const val = spectatorsCell.querySelector('.m_place_title p');
        if (val) {
          const strong = document.createElement('strong');
          strong.textContent = val.textContent.trim();
          col2.appendChild(strong);
        }
        const label = spectatorsCell.querySelector('.m_place_description p');
        if (label) {
          const p = document.createElement('p');
          p.textContent = label.textContent.trim();
          col2.appendChild(p);
        }
      }

      cells.push([col1, col2]);
    }

    // --- Team Rosters row ---
    // VALIDATED: .m_grid_cell_text contains team name and roster with badge
    const textCells = element.querySelectorAll('.m_grid_cell_text');
    const teamCells = [];

    textCells.forEach((tc) => {
      const badge = tc.querySelector('.m_place_badge');
      const title = tc.querySelector('.m_place_title p');
      const desc = tc.querySelector('.m_place_description p');

      // Skip the goals cell (has title "Goals")
      if (title && title.textContent.trim().toLowerCase() === 'goals') return;

      const cell = document.createElement('div');
      if (badge) cell.appendChild(badge.cloneNode(true));
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        cell.appendChild(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        cell.appendChild(p);
      }

      teamCells.push(cell);
    });

    if (teamCells.length >= 2) {
      cells.push(teamCells);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
