
import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  History, 
  User, 
  Clock, 
  Calendar, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Trash2,
  BellRing,
  Info,
  Droplets,
  Container
} from 'lucide-react';
import { ShiftType, ChecklistState, OperationalReport } from './types';
import { OPENING_CHECKLIST, CLOSING_CHECKLIST } from './constants';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const IbisLogo = () => (
  <svg viewBox="0 0 100 100" className="h-14 w-14 drop-shadow-md">
    <path 
      d="M15 20 Q50 10 85 20 Q95 50 85 80 Q50 90 15 80 Q5 50 15 20 Z" 
      fill="#71b216" 
    />
    <text x="50" y="52" fontFamily="Arial Black, sans-serif" fontSize="22" fill="white" textAnchor="middle">ibis</text>
    <text x="50" y="70" fontFamily="Arial, sans-serif" fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">STYLES</text>
  </svg>
);

const App: React.FC = () => {
  const [bartenderName, setBartenderName] = useState('');
  const [shift, setShift] = useState<ShiftType>(ShiftType.MORNING);
  const [checkedItems, setCheckedItems] = useState<ChecklistState>({});
  const [coconutCount, setCoconutCount] = useState<number>(0);
  const [coconutAvailable, setCoconutAvailable] = useState<number>(0);
  const [freezerObs, setFreezerObs] = useState('');
  const [abastecimentoObs, setAbastecimentoObs] = useState('');
  const [observations, setObservations] = useState('');
  const [signature, setSignature] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [reports, setReports] = useState<OperationalReport[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastWashDate, setLastWashDate] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    opening: true,
    closing: true
  });

  useEffect(() => {
    const savedReports = localStorage.getItem('ibis_bar_reports');
    if (savedReports) {
      try { setReports(JSON.parse(savedReports)); } catch (e) { console.error(e); }
    }
    const savedWash = localStorage.getItem('ibis_last_freezer_wash');
    if (savedWash) setLastWashDate(savedWash);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWeeklyWashRequired = () => {
    if (!lastWashDate) return true;
    const diff = differenceInDays(new Date(), new Date(lastWashDate));
    return diff >= 7;
  };

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateProgress = () => {
    const allItems = [
      ...Object.values(OPENING_CHECKLIST).flat(),
      ...Object.values(CLOSING_CHECKLIST).flat()
    ];
    const total = allItems.length + (isWeeklyWashRequired() ? 1 : 0);
    const completed = allItems.filter(item => checkedItems[item.id]).length + (checkedItems['weekly_wash'] ? 1 : 0);
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const generatePDF = (report: OperationalReport) => {
    const doc = new jsPDF();
    doc.setFillColor(113, 178, 22);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Ibis Styles - Checklist Operacional Bar', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Relatório Gerado em: ${report.date}`, 105, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Barman: ${report.bartenderName}`, 14, 50);
    doc.text(`Turno: ${report.shift}`, 14, 56);
    doc.text(`Cocos (Início): ${report.coconutAvailable} | Média Cocos: ${report.coconutCount}`, 14, 62);
    doc.text(`Lavagem Semanal Freezer: ${report.isWeeklyWashDay ? 'CONCLUÍDA' : 'NÃO REALIZADA'}`, 14, 68);

    const tableData = [
      ...Object.values(OPENING_CHECKLIST).flat(),
      ...Object.values(CLOSING_CHECKLIST).flat()
    ].map(item => [
      item.label,
      report.completedItems.includes(item.id) ? 'OK' : '-'
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Item de Checklist', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [113, 178, 22] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    
    doc.setFontSize(12);
    doc.text('Observações Freezer:', 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(report.freezerObs || 'Nenhuma.', 14, finalY + 17, { maxWidth: 180 });

    doc.setFontSize(12);
    doc.text('Observações Abastecimento:', 14, finalY + 35);
    doc.setFontSize(10);
    doc.text(report.abastecimentoObs || 'Nenhuma.', 14, finalY + 42, { maxWidth: 180 });

    doc.setFontSize(12);
    doc.text('Observações Gerais:', 14, finalY + 60);
    doc.setFontSize(10);
    doc.text(report.observations || 'Nenhuma.', 14, finalY + 67, { maxWidth: 180 });

    doc.text(`Responsável: ${report.signature}`, 14, finalY + 90);
    doc.save(`checklist_${report.date.replace(/\//g, '-')}.pdf`);
  };

  const handleFinish = () => {
    if (!bartenderName || !signature) {
      alert('⚠️ Informe o nome e assine para enviar!');
      return;
    }
    
    if (isWeeklyWashRequired() && !checkedItems['weekly_wash']) {
      if(!confirm('A lavagem de freezer de 7 em 7 dias é OBRIGATORIO. Deseja finalizar sem marcar?')) {
          return;
      }
    }

    const allItems = [
      ...Object.values(OPENING_CHECKLIST).flat(),
      ...Object.values(CLOSING_CHECKLIST).flat()
    ];
    
    const washDone = !!checkedItems['weekly_wash'];
    if (washDone) {
        const today = new Date().toISOString();
        localStorage.setItem('ibis_last_freezer_wash', today);
        setLastWashDate(today);
    }

    const newReport: OperationalReport = {
      id: Date.now().toString(),
      date: format(new Date(), 'dd/MM/yyyy HH:mm'),
      bartenderName,
      shift,
      completedItems: [...allItems.filter(item => checkedItems[item.id]).map(i => i.id), ...(washDone ? ['weekly_wash'] : [])],
      totalItems: allItems.length + (isWeeklyWashRequired() ? 1 : 0),
      coconutCount,
      coconutAvailable,
      freezerObs,
      abastecimentoObs,
      observations,
      signature,
      isWeeklyWashDay: washDone
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('ibis_bar_reports', JSON.stringify(updated));
    generatePDF(newReport);

    setBartenderName('');
    setCheckedItems({});
    setCoconutCount(0);
    setCoconutAvailable(0);
    setFreezerObs('');
    setAbastecimentoObs('');
    setObservations('');
    setSignature('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert('✅ Relatório enviado com sucesso!');
  };

  const deleteReport = (id: string) => {
    if (confirm('Excluir este registro?')) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem('ibis_bar_reports', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50 flex flex-col selection:bg-[#71b216] selection:text-white font-sans">
      {/* Dynamic Reminder Alert */}
      {!showHistory && bartenderName && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-bounce">
          <div className="bg-gray-900 text-white px-6 py-5 rounded-[2rem] shadow-2xl flex items-center justify-between border border-gray-700 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#71b216] rounded-full shadow-[0_0_15px_rgba(113,178,22,0.6)]">
                <BellRing className="w-5 h-5 text-white" />
              </div>
              <p className="font-black text-xs uppercase tracking-widest">não esqueça de marcar e enviar</p>
            </div>
            <span className="text-sm font-black text-[#71b216]">{calculateProgress()}%</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`bg-white sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-xl py-3' : 'shadow-sm py-5'}`}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IbisLogo />
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight tracking-tighter italic">BAR INTERNO</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#71b216] animate-pulse"></div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Operação Styles</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl transition-all font-bold shadow-lg active:scale-95"
          >
            {showHistory ? <ClipboardCheck className="w-5 h-5" /> : <History className="w-5 h-5" />}
            <span className="hidden sm:inline uppercase text-[10px] tracking-widest">{showHistory ? 'Checklist' : 'Histórico'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        {!showHistory ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Weekly Alert */}
            {isWeeklyWashRequired() && (
              <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 shadow-sm animate-pulse">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Droplets className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-black text-amber-900 uppercase tracking-tighter">lavagem de freezer de 7 em 7 dias, obrigatorio</h3>
                  <p className="text-sm text-amber-700 font-bold italic">Tarefa essencial para manter o padrão de higiene. Realize a limpeza profunda hoje.</p>
                </div>
              </div>
            )}

            {/* User Details */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Responsável Turno</label>
                  <input 
                    type="text" 
                    value={bartenderName}
                    onChange={(e) => setBartenderName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none font-bold text-lg"
                  />
                </div>
                <div className="w-full md:w-56 space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Turno</label>
                  <select 
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ShiftType)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none font-black text-lg text-gray-700"
                  >
                    <option value={ShiftType.MORNING}>🌅 MANHÃ</option>
                    <option value={ShiftType.AFTERNOON}>☀️ TARDE</option>
                    <option value={ShiftType.NIGHT}>🌙 NOITE</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Progress */}
            <div className="sticky top-[100px] z-30 py-2">
              <div className="bg-white/90 backdrop-blur rounded-[2rem] h-12 w-full shadow-2xl relative overflow-hidden flex items-center px-8 border border-white">
                <div className="absolute left-0 top-0 h-full bg-[#71b216] transition-all duration-1000 shadow-[0_0_20px_rgba(113,178,22,0.4)]" style={{ width: `${calculateProgress()}%` }} />
                <div className="relative z-10 w-full flex justify-between items-center">
                  <span className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-800 mix-blend-difference">CONFORMIDADE</span>
                  <span className="text-xl font-black italic text-gray-800 mix-blend-difference">{calculateProgress()}%</span>
                </div>
              </div>
            </div>

            {/* Checklist Loop */}
            {Object.entries({
              'Abertura': { data: OPENING_CHECKLIST, color: '#71b216' },
              'Fechamento': { data: CLOSING_CHECKLIST, color: '#111827' }
            }).map(([key, config]) => (
              <section key={key} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
                <div className="px-8 py-7 bg-gray-50/50 border-b border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: config.color }}>
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter italic">{key === 'Abertura' ? '1. Abertura do Bar' : '2. Finalização'}</h2>
                </div>
                
                <div className="p-8 space-y-10">
                  {Object.entries(config.data).map(([subcat, items]) => (
                    <div key={subcat} className="space-y-5">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-4">
                        <span className="w-12 h-px bg-gray-200"></span>
                        {subcat}
                      </h3>
                      
                      {/* Weekly wash logic check */}
                      {subcat === 'Freezers e Conservação' && isWeeklyWashRequired() && (
                          <div 
                            onClick={() => toggleItem('weekly_wash')}
                            className={`group flex items-center gap-5 p-6 rounded-[2rem] cursor-pointer border-4 transition-all duration-500 ${
                                checkedItems['weekly_wash'] ? 'bg-[#71b216]/10 border-[#71b216]' : 'bg-amber-50 border-amber-400 shadow-lg scale-[1.02]'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${checkedItems['weekly_wash'] ? 'bg-[#71b216] border-[#71b216]' : 'bg-white border-amber-400 animate-pulse'}`}>
                                {checkedItems['weekly_wash'] && <CheckCircle className="w-6 h-6 text-white" />}
                            </div>
                            <div className="flex-1">
                                <span className="font-black text-lg block leading-none uppercase text-amber-900">lavagem de freezer de 7 em 7 dias, obrigatorio</span>
                                <span className="text-[10px] font-bold text-amber-600">Tarefa obrigatória hoje.</span>
                            </div>
                          </div>
                      )}

                      <div className="grid gap-4">
                        {items.map(item => (
                          <div 
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`group flex items-center gap-5 p-5 rounded-[2rem] cursor-pointer border-2 transition-all ${
                              checkedItems[item.id] ? 'bg-green-50 border-[#71b216]/20' : 'bg-white border-gray-50 hover:border-gray-200 shadow-sm'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                              checkedItems[item.id] ? 'bg-[#71b216] border-[#71b216] scale-110' : 'bg-white border-gray-200'
                            }`}>
                              {checkedItems[item.id] && <CheckCircle className="w-5 h-5 text-white" />}
                            </div>
                            <div className="flex-1">
                                <span className={`font-bold text-base block leading-tight ${checkedItems[item.id] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                {item.label}
                                </span>
                            </div>

                            {/* Conditional inputs for Coconuts */}
                            {item.id === 'prod_coconut_check' && (
                                <div className="flex flex-col items-center gap-1 bg-gray-100 p-2 rounded-2xl min-w-[90px]" onClick={e => e.stopPropagation()}>
                                    <input type="number" value={coconutAvailable} onChange={e => setCoconutAvailable(parseInt(e.target.value)||0)} className="w-14 bg-white border-none text-center rounded-lg font-black h-9 shadow-inner" />
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Tinha</span>
                                </div>
                            )}
                            {(item.id === 'prod_coconut_cut' || item.id === 'cl_coconut_update') && (
                                <div className="flex flex-col items-center gap-1 bg-gray-100 p-2 rounded-2xl min-w-[90px]" onClick={e => e.stopPropagation()}>
                                    <input type="number" value={coconutCount} onChange={e => setCoconutCount(parseInt(e.target.value)||0)} className="w-14 bg-white border-none text-center rounded-lg font-black h-9 shadow-inner" />
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Média</span>
                                </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Observations for specific sections */}
                      {(subcat === 'Freezers e Conservação') && (
                        <div className="mt-4 space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">OBSERVAÇÕES FREEZERS</label>
                           <textarea value={freezerObs} onChange={e => setFreezerObs(e.target.value)} placeholder="Estado do freezer, temperatura, problemas..." className="w-full p-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#71b216] transition-all outline-none font-medium text-sm min-h-[100px]" />
                        </div>
                      )}
                      {(subcat === 'Abastecimento Geral') && (
                        <div className="mt-4 space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">OBSERVAÇÕES ABASTECIMENTO (O que está em falta?)</label>
                           <textarea value={abastecimentoObs} onChange={e => setAbastecimentoObs(e.target.value)} placeholder="Relate se falta Coca KS, Corona, Heineken, etc..." className="w-full p-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-[#71b216] transition-all outline-none font-medium text-sm min-h-[100px]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Final Signature */}
            <section className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Obs Gerais / Quebras / Manutenção</label>
                <textarea value={observations} onChange={e => setObservations(e.target.value)} placeholder="Relate algo relevante do seu turno..." className="w-full p-8 rounded-[2.5rem] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none min-h-[180px] font-medium" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Assinatura Digital</label>
                <div className="relative">
                  <input type="text" value={signature} onChange={e => setSignature(e.target.value)} placeholder="Seu nome para assinar" className="w-full p-8 rounded-[2.5rem] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none font-serif italic text-3xl text-gray-900 shadow-inner" />
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none"><IbisLogo /></div>
                </div>
              </div>

              <button onClick={handleFinish} className="w-full py-12 rounded-[3rem] bg-[#71b216] hover:bg-[#5e9512] active:scale-95 transition-all text-white font-black text-4xl flex flex-col items-center gap-3 shadow-[0_20px_50px_rgba(113,178,22,0.4)] group uppercase tracking-tighter">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-14 h-14" />
                  ENVIAR RELATÓRIO
                </div>
                <span className="text-[10px] font-bold opacity-60 tracking-[0.5em]">Gerar PDF e finalizar turno</span>
              </button>
            </section>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <h2 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase px-2">Histórico de Turnos</h2>
             <div className="grid gap-6">
                {reports.map(report => (
                  <div key={report.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-[#71b216] transition-all group">
                    <div className="space-y-2 text-center sm:text-left">
                       <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{report.bartenderName}</p>
                       <div className="flex items-center justify-center sm:justify-start gap-4 text-[10px] font-black uppercase text-gray-400">
                          <span className="bg-gray-900 text-white px-3 py-1 rounded-full">{report.shift}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#71b216]" /> {report.date}</span>
                          {report.isWeeklyWashDay && <span className="text-[#71b216] flex items-center gap-1"><Droplets className="w-4 h-4" /> LIMPEZA 7 DIAS OK</span>}
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => generatePDF(report)} className="bg-gray-100 hover:bg-gray-900 hover:text-white p-5 rounded-3xl transition-all shadow-sm"><FileText className="w-6 h-6" /></button>
                      <button onClick={() => deleteReport(report.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-5 rounded-3xl transition-all shadow-sm"><Trash2 className="w-6 h-6" /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      <footer className="py-20 text-center bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <IbisLogo />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500">Desenvolvido por Miqueias Bartender PL</p>
          </div>
      </footer>
    </div>
  );
};

export default App;
