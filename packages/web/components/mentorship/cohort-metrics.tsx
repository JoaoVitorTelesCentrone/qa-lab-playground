type CohortMetric = {
  cohortId: string;
  cohortName: string;
  activeStudents: number;
  progressPercent: number;
  lessonPercent: number;
  attendancePercent: number | null;
  pendingOverSla: number;
  recentEvents: number;
};

export function CohortMetrics({ metrics, emailQueue }: { metrics: CohortMetric[]; emailQueue: { queued: number; failed: number } }) {
  return <section className="mt-8 rounded-2xl border border-white/10 bg-[#171B21] p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-mint">Últimos 30 dias</p><h2 className="mt-2 text-2xl font-black text-off-white">Sinais de acompanhamento por turma</h2></div><p className="text-xs text-[#8B949E]">A presença considera encontros encerrados.</p></div>{metrics.length === 0 ? <p className="mt-5 text-sm text-[#AAB2BC]">Crie uma turma para começar a acompanhar os indicadores.</p> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b border-white/10 text-[10px] uppercase tracking-[.12em] text-[#8B949E]"><tr><th className="pb-3 pr-4">Turma</th><th className="pb-3 pr-4">Alunos ativos</th><th className="pb-3 pr-4">Entregas aprovadas</th><th className="pb-3 pr-4">Aulas concluídas</th><th className="pb-3 pr-4">Presença</th><th className="pb-3 pr-4">Revisões &gt;72h</th><th className="pb-3">Eventos</th></tr></thead><tbody>{metrics.map((item) => <tr key={item.cohortId} className="border-b border-white/[.06] last:border-0"><th scope="row" className="py-4 pr-4 font-bold text-off-white">{item.cohortName}</th><td className="py-4 pr-4 text-[#C8CFD7]">{item.activeStudents}</td><td className="py-4 pr-4 text-[#C8CFD7]">{item.progressPercent}%</td><td className="py-4 pr-4 text-[#C8CFD7]">{item.lessonPercent}%</td><td className="py-4 pr-4 text-[#C8CFD7]">{item.attendancePercent === null ? "Sem encontro encerrado" : `${item.attendancePercent}%`}</td><td className={`py-4 pr-4 font-bold ${item.pendingOverSla ? "text-coral" : "text-mint"}`}>{item.pendingOverSla}</td><td className="py-4 text-[#C8CFD7]">{item.recentEvents}</td></tr>)}</tbody></table></div>}<div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 pt-4 text-sm"><p className="text-[#AAB2BC]">E-mails aguardando envio: <strong className="text-off-white">{emailQueue.queued}</strong></p><p className="text-[#AAB2BC]">E-mails com falha definitiva: <strong className={emailQueue.failed ? "text-coral" : "text-mint"}>{emailQueue.failed}</strong></p></div></section>;
}
