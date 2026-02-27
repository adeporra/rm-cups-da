/**
 * Metadata block - no decoration needed, handled by aem.js core
 * @param {Element} block The block element
 */
export default function decorate(block) {
  block.closest('.section').style.display = 'none';
}
