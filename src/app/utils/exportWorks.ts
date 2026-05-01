import * as XLSX from 'xlsx';

const BASE_URL =
  'https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/';

interface Work {
  title: string;
  download_url: string;
}

interface Thinker {
  id: string;
  name: string;
  period: string;
  works?: Work[];
}

interface Era {
  id: string;
  label: string;
  thinkers: readonly Thinker[] | Thinker[];
}

export interface ExportOptions {
  scope: 'all' | 'read' | 'unread';
}

function applyHeaderStyle(ws: XLSX.WorkSheet, numCols: number) {
  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let col = headerRange.s.c; col <= numCols - 1; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2C3E50' }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        bottom: { style: 'medium', color: { rgb: 'AAAAAA' } },
      },
    };
  }
}

function applyDataStyle(ws: XLSX.WorkSheet, rows: number, isReadCol: number) {
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let row = 1; row <= rows; row++) {
    const isEven = row % 2 === 0;
    for (let col = range.s.c; col <= range.e.c; col++) {
      const addr = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[addr]) continue;
      const isReadRow = col === isReadCol && ws[addr].v === '✓ Sim';
      ws[addr].s = {
        fill: {
          patternType: 'solid',
          fgColor: {
            rgb: isReadRow
              ? 'D1FAE5'
              : isEven
              ? 'F9F9F7'
              : 'FFFFFF',
          },
        },
        alignment: { vertical: 'center', wrapText: col === isReadCol },
        border: {
          bottom: { style: 'thin', color: { rgb: 'E5E3DF' } },
        },
      };
    }
  }
}

export function exportWorksToExcel(
  eras: readonly Era[],
  isWorkRead: (thinkerId: string, workTitle: string) => boolean,
  eraLabels: Record<string, string>,
  options: ExportOptions = { scope: 'all' }
) {
  // ── Sheet 1: Obras ────────────────────────────────────────────────────────
  type WorkRow = {
    Era: string;
    Pensador: string;
    'Período': string;
    'Título da Obra': string;
    Lida: string;
    'Disponível para Download': string;
    'Link de Download': string;
  };

  const allWorkRows: WorkRow[] = eras.flatMap(era =>
    (era.thinkers as Thinker[]).flatMap(thinker =>
      (thinker.works || [])
        .filter(work => {
          const read = isWorkRead(thinker.id, work.title);
          if (options.scope === 'read') return read;
          if (options.scope === 'unread') return !read;
          return true;
        })
        .map(work => ({
          Era: eraLabels[era.id] || era.label,
          Pensador: thinker.name,
          'Período': thinker.period,
          'Título da Obra': work.title,
          Lida: isWorkRead(thinker.id, work.title) ? '✓ Sim' : '✗ Não',
          'Disponível para Download':
            work.download_url && work.download_url.trim() !== '' ? 'Sim' : 'Não',
          'Link de Download':
            work.download_url && work.download_url.trim() !== ''
              ? `${BASE_URL}${work.download_url}`
              : '',
        }))
    )
  );

  const wsWorks = XLSX.utils.json_to_sheet(allWorkRows);
  wsWorks['!cols'] = [
    { wch: 26 }, // Era
    { wch: 22 }, // Pensador
    { wch: 20 }, // Período
    { wch: 46 }, // Título
    { wch: 8  }, // Lida
    { wch: 24 }, // Disponível
    { wch: 64 }, // Link
  ];
  wsWorks['!rows'] = [{ hpt: 22 }]; // header row height
  // Freeze header row
  (wsWorks as any)['!freeze'] = { xSplit: 0, ySplit: 1 };
  applyHeaderStyle(wsWorks, 7);
  applyDataStyle(wsWorks, allWorkRows.length, 4); // col index 4 = "Lida"

  // ── Sheet 2: Por Pensador ─────────────────────────────────────────────────
  type ThinkerRow = {
    Era: string;
    Pensador: string;
    'Período': string;
    'Total de Obras': number;
    'Obras Lidas': number;
    'Obras Pendentes': number;
    '% Concluído': string;
    Tags: string;
  };

  const thinkerRows: ThinkerRow[] = eras.flatMap(era =>
    (era.thinkers as Thinker[]).map(thinker => {
      const total = thinker.works?.length || 0;
      const read = thinker.works?.filter(w => isWorkRead(thinker.id, w.title)).length || 0;
      return {
        Era: eraLabels[era.id] || era.label,
        Pensador: thinker.name,
        'Período': thinker.period,
        'Total de Obras': total,
        'Obras Lidas': read,
        'Obras Pendentes': total - read,
        '% Concluído': total > 0 ? `${Math.round((read / total) * 100)}%` : '0%',
        Tags: ((thinker as any).tags || []).join(', '),
      };
    })
  );

  const wsThinkers = XLSX.utils.json_to_sheet(thinkerRows);
  wsThinkers['!cols'] = [
    { wch: 26 }, // Era
    { wch: 22 }, // Pensador
    { wch: 20 }, // Período
    { wch: 14 }, // Total
    { wch: 13 }, // Lidas
    { wch: 16 }, // Pendentes
    { wch: 14 }, // %
    { wch: 60 }, // Tags
  ];
  wsThinkers['!rows'] = [{ hpt: 22 }];
  (wsThinkers as any)['!freeze'] = { xSplit: 0, ySplit: 1 };
  applyHeaderStyle(wsThinkers, 8);

  // ── Sheet 3: Progresso por Era ────────────────────────────────────────────
  type EraRow = {
    Era: string;
    Pensadores: number;
    'Total de Obras': number;
    'Obras Lidas': number;
    'Obras Pendentes': number;
    '% Concluído': string;
  };

  const eraRows: EraRow[] = eras.map(era => {
    const thinkerList = era.thinkers as Thinker[];
    const total = thinkerList.reduce((s, t) => s + (t.works?.length || 0), 0);
    const read = thinkerList.reduce(
      (s, t) => s + (t.works?.filter(w => isWorkRead(t.id, w.title)).length || 0),
      0
    );
    return {
      Era: eraLabels[era.id] || era.label,
      Pensadores: thinkerList.length,
      'Total de Obras': total,
      'Obras Lidas': read,
      'Obras Pendentes': total - read,
      '% Concluído': total > 0 ? `${Math.round((read / total) * 100)}%` : '0%',
    };
  });

  // Totals row
  const grandTotal = eraRows.reduce((s, r) => s + r['Total de Obras'], 0);
  const grandRead  = eraRows.reduce((s, r) => s + r['Obras Lidas'], 0);
  eraRows.push({
    Era: '— TOTAL —',
    Pensadores: eraRows.reduce((s, r) => s + r.Pensadores, 0),
    'Total de Obras': grandTotal,
    'Obras Lidas': grandRead,
    'Obras Pendentes': grandTotal - grandRead,
    '% Concluído': grandTotal > 0 ? `${Math.round((grandRead / grandTotal) * 100)}%` : '0%',
  });

  const wsEras = XLSX.utils.json_to_sheet(eraRows);
  wsEras['!cols'] = [
    { wch: 30 }, // Era
    { wch: 12 }, // Pensadores
    { wch: 14 }, // Total
    { wch: 13 }, // Lidas
    { wch: 16 }, // Pendentes
    { wch: 14 }, // %
  ];
  wsEras['!rows'] = [{ hpt: 22 }];
  applyHeaderStyle(wsEras, 6);

  // ── Assemble workbook ──────────────────────────────────────────────────────
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: 'Lumen — Obras',
    Author: 'Lumen',
    CreatedDate: new Date(),
  };
  XLSX.utils.book_append_sheet(wb, wsWorks,    'Obras');
  XLSX.utils.book_append_sheet(wb, wsThinkers, 'Por Pensador');
  XLSX.utils.book_append_sheet(wb, wsEras,     'Progresso por Era');

  const scopeSuffix =
    options.scope === 'read' ? '-lidas' : options.scope === 'unread' ? '-pendentes' : '';
  const filename = `lumen-obras${scopeSuffix}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
