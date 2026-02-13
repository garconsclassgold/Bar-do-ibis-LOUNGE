
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
  Info
} from 'lucide-react';
import { ShiftType, ChecklistState, OperationalReport } from './types';
import { OPENING_CHECKLIST, CLOSING_CHECKLIST } from './constants';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Custom SVG Logo component for Ibis Styles (Green Pillow Identity)
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
  const [observations, setObservations] = useState('');
  const [signature, setSignature] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [reports, setReports] = useState<OperationalReport[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    opening: true,
    closing: true
  });

  useEffect(() => {
    const savedReports = localStorage.getItem('ibis_bar_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Erro ao carregar relatórios", e);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateProgress = () => {
    const allItems = [
      ...Object.values(OPENING_CHECKLIST).flat(),
      ...Object.values(CLOSING_CHECKLIST).flat()
    ];
    const total = allItems.length;
    const completed = allItems.filter(item => checkedItems[item.id]).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const generatePDF = (report: OperationalReport) => {
    const doc = new jsPDF();
    
    doc.setFillColor(113, 178, 22); // Ibis Styles Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Ibis Styles - Checklist Operacional Bar', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Relatório de Turno - ${report.date}`, 105, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Barman: ${report.bartenderName}`, 14, 50);
    doc.text(`Turno: ${report.shift}`, 14, 56);
    doc.text(`Cocos Cortados: ${report.coconutCount}`, 14, 62);
    doc.text(`Progresso: ${Math.round((report.completedItems.length / report.totalItems) * 100)}%`, 14, 68);

    const tableData = [
      ...Object.values(OPENING_CHECKLIST).flat(),
      ...Object.values(CLOSING_CHECKLIST).flat()
    ].map(item => [
      item.label,
      report.completedItems.includes(item.id) ? 'CONCLUÍDO' : 'NÃO CONCLUÍDO'
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Tarefa', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [113, 178, 22] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 150;
    doc.setFontSize(12);
    doc.text('Observações:', 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(report.observations || 'Nenhuma observação registrada.', 14, finalY + 17, { maxWidth: 180 });

    doc.text(`Assinatura Digital: ${report.signature}`, 14, finalY + 40);
    doc.text(`Desenvolvido por Miqueias Bartender PL`, 14, 285);

    doc.save(`checklist_bar_${report.date.replace(/\//g, '-')}_${report.shift}.pdf`);
  };

  const handleFinish = () => {
    if (!bartenderName) {
      alert('⚠️ Atenção: Por favor, insira o nome do Barman.');
      return;
    }
    if (!signature) {
      alert('⚠️ Atenção: A assinatura digital é obrigatória.');
      return;
    }

    const allItems = [
      ...Object.values(OPENING_CHECKLIST).flat(),
      ...Object.values(CLOSING_CHECKLIST).flat()
    ];
    
    const newReport: OperationalReport = {
      id: Date.now().toString(),
      date: format(new Date(), 'dd/MM/yyyy HH:mm'),
      bartenderName,
      shift,
      completedItems: allItems.filter(item => checkedItems[item.id]).map(i => i.id),
      totalItems: allItems.length,
      coconutCount,
      observations,
      signature
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('ibis_bar_reports', JSON.stringify(updatedReports));

    generatePDF(newReport);
    setBartenderName('');
    setShift(ShiftType.MORNING);
    setCheckedItems({});
    setCoconutCount(0);
    setObservations('');
    setSignature('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert('✅ Sucesso! Relatório salvo e sistema reiniciado.');
  };

  const deleteReport = (id: string) => {
    if (confirm('Deseja excluir este relatório?')) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem('ibis_bar_reports', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col selection:bg-[#71b216] selection:text-white">
      {/* Dynamic Reminder Alert */}
      {!showHistory && bartenderName && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-bounce">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center justify-between border border-gray-700 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#71b216] rounded-full">
                <BellRing className="w-5 h-5 text-white" />
              </div>
              <p className="font-black text-sm uppercase tracking-wider">não esqueça de marcar e enviar</p>
            </div>
            <span className="text-xs font-bold text-gray-400">{calculateProgress()}%</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`bg-white sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-lg py-2' : 'shadow-sm py-4'}`}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IbisLogo />
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight">BAR INTERNO</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#71b216] animate-pulse"></div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Padrão Styles 2.0</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl transition-all font-bold shadow-lg active:scale-95"
          >
            {showHistory ? <ClipboardCheck className="w-5 h-5" /> : <History className="w-5 h-5" />}
            <span className="hidden sm:inline uppercase text-xs tracking-widest">{showHistory ? 'Checklist' : 'Histórico'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        {!showHistory ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* User Details Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    <User className="w-4 h-4 text-[#71b216]" /> Responsável pelo Turno
                  </label>
                  <input 
                    type="text" 
                    value={bartenderName}
                    onChange={(e) => setBartenderName(e.target.value)}
                    placeholder="Seu Nome Completo"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none font-bold text-lg shadow-inner"
                  />
                </div>
                <div className="w-full md:w-56 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    <Clock className="w-4 h-4 text-[#71b216]" /> Período
                  </label>
                  <select 
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ShiftType)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none appearance-none cursor-pointer font-black text-lg text-gray-700 shadow-inner"
                  >
                    <option value={ShiftType.MORNING}>🌅 MANHÃ</option>
                    <option value={ShiftType.AFTERNOON}>☀️ TARDE</option>
                    <option value={ShiftType.NIGHT}>🌙 NOITE</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Calendar className="w-4 h-4 text-[#71b216]" />
                  Hoje: {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
                </div>
                <div className="text-[10px] font-black text-gray-300 uppercase italic">
                  * Preencha todos os campos obrigatórios
                </div>
              </div>
            </section>

            {/* Sticky Progress Bar */}
            <div className="sticky top-[100px] z-30 py-4 pointer-events-none">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl h-14 w-full shadow-2xl relative overflow-hidden flex items-center px-6 border border-white pointer-events-auto">
                <div 
                  className="absolute left-0 top-0 h-full bg-[#71b216] transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(113,178,22,0.5)]"
                  style={{ width: `${calculateProgress()}%` }}
                />
                <div className="relative z-10 w-full flex justify-between items-center">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase mix-blend-difference" style={{ color: calculateProgress() > 40 ? '#fff' : '#4b5563' }}>
                    Status da Operação
                  </span>
                  <span className="text-xl font-black italic mix-blend-difference" style={{ color: calculateProgress() > 90 ? '#fff' : '#4b5563' }}>
                    {calculateProgress()}%
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Blocks */}
            {[
              { id: 'opening', title: '1. Abertura e Preparação', data: OPENING_CHECKLIST, color: '#71b216', bg: 'bg-[#71b216]/5' },
              { id: 'closing', title: '2. Fechamento e Higiene', data: CLOSING_CHECKLIST, color: '#111827', bg: 'bg-gray-100' }
            ].map(section => (
              <section key={section.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
                <button 
                  onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                  className={`w-full px-8 py-7 flex items-center justify-between transition-colors ${section.bg}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: section.color }}>
                      <ChevronDown className={`w-7 h-7 transform transition-transform duration-500 ${expandedSections[section.id] ? 'rotate-180' : ''}`} />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{section.title}</h2>
                  </div>
                </button>

                {expandedSections[section.id] && (
                  <div className="p-8 space-y-10 animate-in fade-in duration-500">
                    {Object.entries(section.data).map(([subcat, items]) => (
                      <div key={subcat} className="space-y-5">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                          <span className="w-8 h-px bg-gray-200"></span>
                          {subcat}
                        </h3>
                        <div className="grid gap-4">
                          {items.map(item => (
                            <div 
                              key={item.id}
                              onClick={() => toggleItem(item.id)}
                              className={`group flex items-center gap-5 p-5 rounded-3xl cursor-pointer border-2 transition-all duration-300 active:scale-[0.99] ${
                                checkedItems[item.id] 
                                  ? 'bg-green-50/50 border-[#71b216]/20' 
                                  : 'bg-white border-gray-50 hover:border-gray-200 hover:shadow-md'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                                checkedItems[item.id] ? 'bg-[#71b216] border-[#71b216] scale-110 shadow-lg' : 'bg-white border-gray-200'
                              }`}>
                                {checkedItems[item.id] && <CheckCircle className="w-5 h-5 text-white" />}
                              </div>
                              <div className="flex-1">
                                <span className={`font-bold text-base block leading-tight transition-all ${checkedItems[item.id] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                  {item.label}
                                </span>
                                {item.critical && (
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-600 uppercase mt-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                                    <AlertTriangle className="w-3 h-3" /> Item Prioritário
                                  </span>
                                )}
                              </div>
                              {item.id === 'prod_coconut_cut' && (
                                <div className="flex flex-col items-center gap-1 bg-gray-100 p-2 rounded-2xl shadow-inner min-w-[80px]" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    type="number" 
                                    value={coconutCount}
                                    onChange={(e) => setCoconutCount(parseInt(e.target.value) || 0)}
                                    className="w-12 bg-white border-none text-center rounded-lg focus:ring-0 text-lg font-black h-10 shadow-sm"
                                  />
                                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Unidades</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Signature Block */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Observações e Perdas</label>
                <textarea 
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: 3 cocos perdidos, reposição de vodka necessária..."
                  className="w-full px-6 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none min-h-[160px] font-medium text-gray-700 shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Assinatura de Validação</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Nome Completo para Assinatura Digital"
                    className="w-full px-6 py-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#71b216] transition-all outline-none font-serif italic text-2xl text-gray-900 shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                    <IbisLogo />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">Ao assinar, você assume a responsabilidade total pela conformidade deste turno.</p>
                </div>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full py-10 rounded-[2.5rem] bg-[#71b216] hover:bg-[#5e9512] active:scale-[0.97] transition-all text-white font-black text-3xl flex flex-col items-center justify-center gap-2 shadow-2xl shadow-[#71b216]/40 mt-6 group uppercase tracking-widest"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 group-hover:rotate-12 transition-transform" />
                  ✅ TUDO FINALIZADO
                </div>
                <span className="text-[10px] font-bold opacity-60">Enviar relatório e reiniciar sistema</span>
              </button>
            </section>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">REGISTROS</h2>
              <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                {reports.length} Total
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-24 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center shadow-inner">
                  <FileText className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                    <p className="text-gray-400 font-black text-xl uppercase tracking-widest">Base de Dados Vazia</p>
                    <p className="text-gray-300 text-sm font-bold uppercase tracking-tighter">Inicie um novo turno para popular o histórico</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {reports.map(report => (
                  <div key={report.id} className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-[#71b216] hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="font-black text-gray-900 uppercase tracking-tighter text-2xl">{report.bartenderName}</span>
                        <span className="text-[10px] bg-gray-900 text-white px-4 py-1 rounded-full font-black uppercase tracking-widest shadow-md">{report.shift}</span>
                      </div>
                      <div className="flex items-center gap-6 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#71b216]" /> {report.date}</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#71b216]" /> {Math.round((report.completedItems.length / report.totalItems) * 100)}% OK</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <button 
                        onClick={() => generatePDF(report)}
                        className="p-5 text-white bg-gray-900 hover:bg-black rounded-3xl transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
                      >
                        <FileText className="w-6 h-6" />
                        PDF
                      </button>
                      <button 
                        onClick={() => deleteReport(report.id)}
                        className="p-5 text-red-500 bg-red-50 hover:bg-red-100 rounded-3xl transition-all shadow-sm"
                        title="Excluir"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Corporate Footer */}
      <footer className="mt-auto py-16 bg-white border-t border-gray-50 text-center px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 grayscale opacity-30">
             <IbisLogo />
             <div className="h-10 w-px bg-gray-300"></div>
             <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em]">Global Standards</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">
              SISTEMA OPERACIONAL DESENVOLVIDO POR <span className="text-gray-900">MIQUEIAS BARTENDER PL</span>
            </p>
            <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">Bar Interno Ibis Styles © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
