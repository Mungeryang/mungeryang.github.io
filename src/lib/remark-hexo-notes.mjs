// Keep the original Markdown while adapting Fluid notes and public image paths.
export default function hexoNotes() {
  return tree => {
    const visit = parent => {
      if (!parent.children) return;
      parent.children = parent.children.flatMap(node => {
        if (node.type === 'image' && /^(?:\.\.?\/)+img\//.test(node.url)) node.url = node.url.replace(/^(?:\.\.?\/)+/, '/');
        if (node.type === 'image') node.data = { ...node.data, hProperties: { ...node.data?.hProperties, loading: 'lazy', decoding: 'async' } };
        if (node.type === 'html') node.value = node.value.replace(/(\bsrc=["'])(?:\.\.?\/)+img\//g, '$1/img/')
          .replace(/\{%\s*note(?:\s+(\w+))?\s*%\}/g, (_, kind) => `<aside class="note note-${kind || 'info'}">`)
          .replace(/\{%\s*endnote\s*%\}/g, '</aside>')
          .replace(/<img\b/g, '<img loading="lazy" decoding="async"');
        visit(node);
        if (node.type !== 'paragraph') return [node];
        const output = []; let pending = [];
        const flush = () => { if (pending.some(child => child.type !== 'text' || child.value.trim())) output.push({ ...node, children: pending }); pending = []; };
        for (const child of node.children) {
          if (child.type !== 'text') { pending.push(child); continue; }
          const regex = /\{%\s*(note(?:\s+(\w+))?|endnote)\s*%\}/g; let start = 0;
          for (const match of child.value.matchAll(regex)) {
            if (match.index > start) pending.push({ type: 'text', value: child.value.slice(start, match.index) });
            flush();
            output.push({ type: 'html', value: match[1] === 'endnote' ? '</aside>' : `<aside class="note note-${match[2] || 'info'}">` });
            start = match.index + match[0].length;
          }
          if (start < child.value.length) pending.push({ ...child, value: child.value.slice(start) });
        }
        flush(); return output;
      });
    };
    visit(tree);
  };
}
