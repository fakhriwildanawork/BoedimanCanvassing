const fs = require('fs');
let file = fs.readFileSync('src/modules/canvassing/components/CanvasForm.tsx', 'utf8');

file = file.replace(
  `  const [status, setStatus] = useState<'DEAL' | 'NEGOTIATE' | 'FAIL'>(pin?.status || 'NEGOTIATE');`,
  `  const [status, setStatus] = useState<'DEAL' | 'NEGOTIATE' | 'FAIL'>(pin?.status || 'NEGOTIATE');
  const [namaTitik, setNamaTitik] = useState(pin?.namaTitik || '');
  const [patokanLokasi, setPatokanLokasi] = useState(pin?.patokanLokasi || '');
  const [namaPIC, setNamaPIC] = useState(pin?.namaPIC || '');
  const [noHP, setNoHP] = useState(pin?.noHP || '');
  const [keterangan, setKeterangan] = useState(pin?.keterangan || '');
  const [kuotaPenjualan, setKuotaPenjualan] = useState(pin?.kuotaPenjualan || 0);
  const [persentaseKomisi, setPersentaseKomisi] = useState(pin?.persentaseKomisi || 0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptPhotos, setKeptPhotos] = useState<string[]>(pin?.photos || []);
  const [submitting, setSubmitting] = useState(false);`
);

file = file.replace(
  `      <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onSave({}); }}>`,
  `      <form className="flex flex-col gap-6" onSubmit={async (e) => { 
        e.preventDefault(); 
        setSubmitting(true);
        try {
          const uploadedUrls = [];
          for (const f of newFiles) {
            const reader = new FileReader();
            const base64 = await new Promise((resolve) => {
              reader.onloadend = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                resolve(base64Data);
              };
              reader.readAsDataURL(f);
            });
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: f.name,
                contentType: f.type,
                base64Data: base64
              })
            });
            if (res.ok) {
              const data = await res.json();
              uploadedUrls.push(data.url);
            }
          }
          
          const finalPhotos = [...keptPhotos, ...uploadedUrls];
          
          const payload = {
            status,
            namaTitik,
            lokasi: coords || { lat: -6.2088, lng: 106.8456 },
            patokanLokasi,
            alamat: address,
            namaPIC,
            noHP,
            keterangan,
            kuotaPenjualan: Number(kuotaPenjualan),
            persentaseKomisi: Number(persentaseKomisi),
            bukaTiapHari: true,
            jamBuka: '08:00 - 20:00',
            photos: finalPhotos
          };
          
          if (mode === 'create') {
            await fetch('/api/canvassing', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } else if (mode === 'edit' && pin?.id) {
            await fetch(\`/api/canvassing/\${pin.id}\`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
          onSave(payload);
        } catch (err) {
          console.error(err);
          alert('Terjadi kesalahan saat menyimpan');
        } finally {
          setSubmitting(false);
        }
      }}>`
);

file = file.replace(
  `            <input type="text" className={INPUT_FIELD} placeholder="Contoh: Warung Kopi Jaya" defaultValue={pin?.namaTitik} required readOnly={isReadOnly} />`,
  `            <input type="text" className={INPUT_FIELD} placeholder="Contoh: Warung Kopi Jaya" value={namaTitik} onChange={e => setNamaTitik(e.target.value)} required readOnly={isReadOnly} />`
);

file = file.replace(
  `            <input type="text" className={INPUT_FIELD} placeholder="Contoh: Depan Indomaret" defaultValue={pin?.patokanLokasi} required readOnly={isReadOnly} />`,
  `            <input type="text" className={INPUT_FIELD} placeholder="Contoh: Depan Indomaret" value={patokanLokasi} onChange={e => setPatokanLokasi(e.target.value)} required readOnly={isReadOnly} />`
);

file = file.replace(
  `            <input type="text" className={INPUT_FIELD} placeholder="Nama penanggung jawab" defaultValue={pin?.namaPIC} required readOnly={isReadOnly} />`,
  `            <input type="text" className={INPUT_FIELD} placeholder="Nama penanggung jawab" value={namaPIC} onChange={e => setNamaPIC(e.target.value)} required readOnly={isReadOnly} />`
);

file = file.replace(
  `            <PhoneInput placeholder="0812..." defaultValue={pin?.noHP} required readOnly={isReadOnly} />`,
  `            <PhoneInput placeholder="0812..." value={noHP} onChange={(val: any) => setNoHP(val.target ? val.target.value : val)} required readOnly={isReadOnly} />`
);

file = file.replace(
  `            {/* @ts-ignore */}
            <FileUpload />`,
  `            {/* @ts-ignore */}
            <FileUpload initialPhotos={pin?.photos || []} onFilesChange={(f, k) => { setNewFiles(f); setKeptPhotos(k); }} />`
);

file = file.replace(
  `          <LongText rows={2} placeholder="Catatan tambahan..." defaultValue={pin?.keterangan} readOnly={isReadOnly} />`,
  `          <LongText rows={2} placeholder="Catatan tambahan..." value={keterangan} onChange={(e: any) => setKeterangan(e.target.value)} readOnly={isReadOnly} />`
);

file = file.replace(
  `            <NumberInput placeholder="0" defaultValue={pin?.kuotaPenjualan} min={0} required readOnly={isReadOnly} />`,
  `            <NumberInput placeholder="0" value={kuotaPenjualan} onChange={(e: any) => setKuotaPenjualan(e.target.value)} min={0} required readOnly={isReadOnly} />`
);

file = file.replace(
  `            <NumberInput placeholder="0" defaultValue={pin?.persentaseKomisi} min={0} max={100} required readOnly={isReadOnly} />`,
  `            <NumberInput placeholder="0" value={persentaseKomisi} onChange={(e: any) => setPersentaseKomisi(e.target.value)} min={0} max={100} required readOnly={isReadOnly} />`
);

file = file.replace(
  `            <button type="submit" className={"flex-1 " + PRIMARY_BUTTON}>
              Simpan Data
            </button>`,
  `            <button type="submit" className={"flex-1 " + PRIMARY_BUTTON} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Data'}
            </button>`
);

fs.writeFileSync('src/modules/canvassing/components/CanvasForm.tsx', file);
