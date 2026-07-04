const fs = require('fs');
const path = require('path');
const glob = require('glob');

const columns = glob.sync('apps/admin/app/*/columns.tsx');
columns.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/<DropdownMenuTrigger asChild>/g, '<DropdownMenuTrigger>');
  fs.writeFileSync(f, c);
});

const pages = glob.sync('apps/admin/app/*/page.tsx');
pages.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/@workspace\/shared\/schemas\/admin/g, '@workspace/shared/schemas');
  fs.writeFileSync(f, c);
});
