const fs = require('fs');
let file = fs.readFileSync('src/modules/canvassing/CanvassingModule.tsx', 'utf8');

file = file.replace(
  `import CanvasForm from './components/CanvasForm';`,
  `import CanvasForm from './components/CanvasForm';\nimport CanvassingDetail from './components/CanvassingDetail';`
);

file = file.replace(
  `      {(view === 'FORM' || view === 'DETAIL') && (
        <CanvasForm 
          mode={view === 'FORM' ? (selectedPin ? 'edit' : 'create') : 'view'}
          pin={selectedPin}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}`,
  `      {view === 'FORM' && (
        <CanvasForm 
          mode={selectedPin ? 'edit' : 'create'}
          pin={selectedPin}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
      
      {view === 'DETAIL' && selectedPin && (
        <CanvassingDetail 
          pin={selectedPin}
          onClose={handleClose}
        />
      )}`
);

fs.writeFileSync('src/modules/canvassing/CanvassingModule.tsx', file);
