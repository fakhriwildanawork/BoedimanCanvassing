const fs = require('fs');
let file = fs.readFileSync('database/schema.sql', 'utf8');

file = file.replace(
  `    status TEXT DEFAULT 'NEGOTIATE'
);`,
  `    status TEXT DEFAULT 'NEGOTIATE',
    files_url JSONB DEFAULT '[]'::jsonb
);`
);

fs.writeFileSync('database/schema.sql', file);
