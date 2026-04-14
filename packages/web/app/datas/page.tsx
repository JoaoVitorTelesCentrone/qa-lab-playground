"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarRange,
  Timer,
  AlarmClock,
  Zap,
} from "lucide-react";

// Componentes do design system QA Lab
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-dark-green/40 rounded-2xl border border-mint/10 shadow-lg shadow-black/10 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pb-4 flex flex-col gap-2 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-base font-bold text-mint ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-off-white/60 ${className}`}>{children}</p>
);

const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "ghost" | "success";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/30 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-mint text-[#3D5454] hover:bg-[#A8C5C3] hover:-translate-y-0.5",
    destructive: "bg-coral text-[#3D5454] hover:bg-[#F4A8A3]",
    outline: "border-2 border-mint/30 bg-transparent text-mint hover:bg-mint/10 hover:border-mint/50",
    ghost: "hover:bg-off-white/10 hover:text-off-white text-off-white/70",
    success: "bg-neon text-[#3D5454] hover:bg-[#C8E85F] hover:-translate-y-0.5",
  };

  const sizes = {
    default: "h-10 px-5 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={`flex h-9 w-full rounded-lg border border-mint/20 bg-dark-green/40 text-off-white px-3 py-2 text-sm placeholder:text-off-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/30 focus-visible:border-mint/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({
  children,
  variant = "default",
  className = ""
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "success" | "warning";
  className?: string;
}) => {
  const variants = {
    default: "bg-mint/20 text-mint border-mint/30",
    destructive: "bg-coral/20 text-coral border-coral/30",
    outline: "border border-mint/30 text-mint/70",
    secondary: "bg-off-white/10 text-off-white/70 border-off-white/20",
    success: "bg-neon/20 text-neon border-neon/30",
    warning: "bg-[#F4A8A3]/20 text-[#F4A8A3] border-[#F4A8A3]/30",
  };

  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-mint/10 ${className}`} />
);

const Tabs = ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => {
  return <div className="space-y-4">{children}</div>;
};

const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex gap-2 border-b border-mint/10 ${className}`}>{children}</div>
);

const TabsTrigger = ({ children, value, activeValue, onClick }: { children: React.ReactNode; value: string; activeValue: string; onClick: () => void }) => (
  <button
    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
      activeValue === value
        ? "border-b-2 border-mint text-mint"
        : "text-off-white/40 hover:text-off-white/70"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeValue }: { children: React.ReactNode; value: string; activeValue: string }) => (
  <div className={activeValue === value ? "block" : "hidden"}>{children}</div>
);

// Calendário customizado
const Calendar = ({ selected, onSelect }: { selected: Date | null; onSelect: (date: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="rounded-lg p-1.5 hover:bg-off-white/10 transition-colors">
          <ChevronLeft className="h-4 w-4 text-off-white/60" />
        </button>
        <span className="font-bold text-off-white text-sm uppercase tracking-wide">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button onClick={nextMonth} className="rounded-lg p-1.5 hover:bg-off-white/10 transition-colors">
          <ChevronRight className="h-4 w-4 text-off-white/60" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
          <div key={i} className="text-center text-xs font-bold text-off-white/40 uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={i} className="h-8" />;
          }

          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = selected &&
            date.getDate() === selected.getDate() &&
            date.getMonth() === selected.getMonth() &&
            date.getFullYear() === selected.getFullYear();

          return (
            <button
              key={i}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                isSelected ? "bg-mint text-[#3D5454] font-bold" : "text-off-white/70 hover:bg-off-white/10"
              }`}
              onClick={() => onSelect(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Bugs da página de datas
const bugs = [
  {
    id: 1,
    titulo: "Permite selecionar datas no passado para agendamento futuro",
    categoria: "Validação",
    severidade: "Alta",
  },
  {
    id: 2,
    titulo: "Cálculo de diferença entre datas ignora anos bissextos",
    categoria: "Cálculo",
    severidade: "Média",
  },
  {
    id: 3,
    titulo: "Fuso horário não é considerado ao converter datas",
    categoria: "Timezone",
    severidade: "Crítica",
  },
  {
    id: 4,
    titulo: "Dias da semana não correspondem à data real",
    categoria: "Calendário",
    severidade: "Alta",
  },
  {
    id: 5,
    titulo: "Timer continua rodando mesmo quando pausado",
    categoria: "Timer",
    severidade: "Média",
  },
  {
    id: 6,
    titulo: "Formatos de data inválidos são aceitos (31/02/2024)",
    categoria: "Validação",
    severidade: "Alta",
  },
  {
    id: 7,
    titulo: "Data de expiração calculada errada (30, 31, 28 dias)",
    categoria: "Cálculo",
    severidade: "Média",
  },
  {
    id: 8,
    titulo: "Horário de verão não é considerado em cálculos",
    categoria: "Timezone",
    severidade: "Crítica",
  },
  {
    id: 9,
    titulo: "Permite datas anteriores a 1900 ou posteriores a 2100",
    categoria: "Limite",
    severidade: "Baixa",
  },
  {
    id: 10,
    titulo: "Relógio digital e analógico mostram horas diferentes",
    categoria: "Timer",
    severidade: "Média",
  },
];

interface Evento {
  id: number;
  titulo: string;
  data: Date;
  tipo: "aniversário" | "reunião" | "feriado" | "lembrete";
}

export default function DataBugadaPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [difference, setDifference] = useState<number | null>(null);
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [expirationDays, setExpirationDays] = useState(30);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Evento[]>([
    { id: 1, titulo: "Meu Aniversário", data: new Date(2024, 2, 15), tipo: "aniversário" },
    { id: 2, titulo: "Reunião de Projeto", data: new Date(2024, 2, 20), tipo: "reunião" },
  ]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [digitalTime, setDigitalTime] = useState(new Date());
  const [analogTime, setAnalogTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendar");

  // BUG #1: Permite datas no passado
  function isDateValid(date: Date): boolean {
    // BUG: Não verifica se é data futura para agendamentos
    return true;
  }

  // BUG #2: Cálculo de diferença ignora anos bissextos
  function calculateDifference() {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // BUG: Cálculo simplificado que ignora anos bissextos
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDifference(diffDays);
  }

  // BUG #3: Conversão de timezone bugada
  function convertTimezone(date: Date, fromTz: string, toTz: string): Date {
    // BUG: Não considera diferenças reais de fuso
    const fakeOffset = Math.random() * 3;
    return new Date(date.getTime() + fakeOffset * 60 * 60 * 1000);
  }

  // BUG #5: Timer bugado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && !timerPaused) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerPaused) {
      // BUG #5: Continua rodando mesmo pausado
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 0.5);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerRunning, timerPaused]);

  // BUG #10: Relógios dessincronizados
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDigitalTime(now);
      
      // BUG: Relógio analógico atrasado 5 minutos
      const analogNow = new Date(now.getTime() - 5 * 60 * 1000);
      setAnalogTime(analogNow);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // BUG #6: Validação de data fraca
  function parseDate(input: string): Date | null {
    // BUG: Aceita formatos inválidos
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      // Tenta interpretar formato DD/MM/AAAA
      const parts = input.split(/[\/\-\.]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return null;
    }
    return date;
  }

  // BUG #7: Expiração com cálculo errado
  function calculateExpiration() {
    if (!selectedDate) return;
    
    const date = new Date(selectedDate);
    
    // BUG: Não considera meses com 31, 30 ou 28 dias
    date.setDate(date.getDate() + expirationDays);
    setExpirationDate(date);
  }

  // BUG #9: Permite datas extremas
  function isValidYearRange(date: Date): boolean {
    // BUG: Permite qualquer ano
    return true;
  }

  // Adicionar evento (BUG #4: Dia da semana errado)
  function addEvent() {
    if (!newEventTitle || !newEventDate) return;
    
    const eventDate = parseDate(newEventDate);
    if (eventDate) {
      const newEvent: Evento = {
        id: events.length + 1,
        titulo: newEventTitle,
        data: eventDate,
        tipo: "lembrete",
      };
      setEvents([...events, newEvent]);
      setNewEventTitle("");
      setNewEventDate("");
    }
  }

  function getDayOfWeek(date: Date): string {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    
    // BUG #4: Índice do dia errado (fora por 1)
    const buggedIndex = (date.getDay() + 1) % 7;
    return days[buggedIndex];
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 animate-slide-in-up">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-coral/20">
              <CalendarIcon className="size-5 text-coral" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-coral italic">
                DATAS BUGADAS
              </h1>
              <p className="text-sm text-coral/50 uppercase tracking-[0.15em]">
                Data · Hora · Timezone
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <CalendarIcon className="size-3" />
            {selectedDate?.toLocaleDateString('pt-BR')}
          </Badge>
        </div>
        <p className="text-sm text-off-white/60 max-w-xl">
          Teste funcionalidades de data, hora, fuso horário e calendário.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-mint/10">
        <button
          className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === "calendar"
              ? "border-mint text-mint"
              : "border-transparent text-off-white/40 hover:text-off-white/70"
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          <CalendarRange className="size-4" />
          Calendário
        </button>
        <button
          className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === "timer"
              ? "border-mint text-mint"
              : "border-transparent text-off-white/40 hover:text-off-white/70"
          }`}
          onClick={() => setActiveTab("timer")}
        >
          <Timer className="size-4" />
          Timer
        </button>
        <button
          className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === "timezone"
              ? "border-mint text-mint"
              : "border-transparent text-off-white/40 hover:text-off-white/70"
          }`}
          onClick={() => setActiveTab("timezone")}
        >
          <Clock className="size-4" />
          Fuso Horário
        </button>
        <button
          className={`px-5 py-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === "events"
              ? "border-mint text-mint"
              : "border-transparent text-off-white/40 hover:text-off-white/70"
          }`}
          onClick={() => setActiveTab("events")}
        >
          <Zap className="size-4" />
          Eventos
        </button>
      </div>

      <div className="space-y-6">
          {/* Tab Calendário */}
          {activeTab === "calendar" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calendário Interativo</CardTitle>
                <CardDescription>
                  Selecione datas e teste validações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Calendar
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                    
                    <div className="mt-4 p-4 bg-dark-green/30 rounded-xl">
                      <p className="text-sm font-medium mb-2">Data Selecionada:</p>
                      <p className="text-lg">
                        {selectedDate?.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-off-white/60 mt-1">
                        Dia da semana: {selectedDate && getDayOfWeek(selectedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Validação de Data Futura
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setStartDate(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => alert(isDateValid(new Date(startDate)) ? "Data válida" : "Data inválida")}
                        >
                          Validar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Diferença entre Datas
                      </label>
                      <div className="space-y-2">
                        <Input
                          type="date"
                          placeholder="Data inicial"
                          value={startDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setStartDate(e.target.value)}
                        />
                        <Input
                          type="date"
                          placeholder="Data final"
                          value={endDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setEndDate(e.target.value)}
                        />
                        <Button onClick={calculateDifference} className="w-full">
                          Calcular Diferença
                        </Button>
                        {difference !== null && (
                          <div className="p-2 bg-dark-green/30 rounded-xl text-center">
                            <span className="font-medium">{difference} dias</span>
                            </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Entrada de Data Manual
                      </label>
                      <div className="space-y-2">
                        <Input
                          placeholder="DD/MM/AAAA"
                          value={dateInput}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setDateInput(e.target.value)}
                        />
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            const date = parseDate(dateInput);
                            alert(date ? date.toLocaleDateString('pt-BR') : "Data inválida");
                          }}
                        >
                          Interpretar Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Timer */}
          {activeTab === "timer" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timer e Relógios</CardTitle>
                <CardDescription>
                  Teste cronômetro e sincronização de relógios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-dark-green/30 rounded-xl">
                      <div className="text-4xl font-mono font-bold mb-4">
                        {Math.floor(timerSeconds / 60)}:
                        {(timerSeconds % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => setTimerRunning(true)}
                          variant={timerRunning ? "default" : "outline"}
                        >
                          Iniciar
                        </Button>
                        <Button
                          onClick={() => setTimerPaused(!timerPaused)}
                          variant={timerPaused ? "default" : "outline"}
                        >
                          {timerPaused ? "Pausado" : "Pausar"}
                        </Button>
                        <Button
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerPaused(false);
                            setTimerSeconds(0);
                          }}
                          variant="destructive"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Data de Expiração
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={expirationDays}
                          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setExpirationDays(parseInt(e.target.value))}
                          min={1}
                          className="w-24"
                        />
                        <span className="text-sm py-2">dias a partir de hoje</span>
                      </div>
                      <Button onClick={calculateExpiration} className="w-full mt-2">
                        Calcular Expiração
                      </Button>
                      {expirationDate && (
                        <div className="mt-2 p-2 bg-dark-green/30 rounded-xl">
                          <p className="text-sm">
                            Expira em: {expirationDate.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-dark-green/30 rounded-xl">
                      <h4 className="font-medium mb-3">Relógio Digital</h4>
                      <div className="text-3xl font-mono text-center">
                        {digitalTime.toLocaleTimeString('pt-BR')}
                      </div>
                    </div>

                    <div className="p-4 bg-dark-green/30 rounded-xl">
                      <h4 className="font-medium mb-3">Relógio Analógico (simulado)</h4>
                      <div className="text-3xl font-mono text-center">
                        {analogTime.toLocaleTimeString('pt-BR')}
                      </div>
                    </div>

                    <div className="p-4 bg-dark-green/30 rounded-xl">
                      <h4 className="font-medium mb-3">Horário em diferentes cidades</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>São Paulo</span>
                          <span className="font-mono">
                            {new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lisboa</span>
                          <span className="font-mono">
                            {new Date().toLocaleTimeString('pt-BR', { timeZone: 'Europe/Lisbon' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tóquio</span>
                          <span className="font-mono">
                            {new Date().toLocaleTimeString('pt-BR', { timeZone: 'Asia/Tokyo' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nova York</span>
                          <span className="font-mono">
                            {new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/New_York' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Fuso Horário */}
          {activeTab === "timezone" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Teste de Fuso Horário</CardTitle>
                <CardDescription>
                  Converta datas entre diferentes fusos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Data/Hora</label>
                      <Input
                        type="datetime-local"
                        value={dateTimeInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setDateTimeInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">De</label>
                      <select
                        className="w-full h-10 rounded-md border border-mint/20 bg-dark-green/40 px-3 text-off-white"
                        value={timezone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setTimezone(e.target.value)}
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">Nova York (GMT-4)</option>
                        <option value="Europe/London">Londres (GMT+1)</option>
                        <option value="Europe/Lisbon">Lisboa (GMT+1)</option>
                        <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Para</label>
                      <select
                        className="w-full h-10 rounded-md border border-mint/20 bg-dark-green/40 px-3 text-off-white"
                        value={timezone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setTimezone(e.target.value)}
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">Nova York (GMT-4)</option>
                        <option value="Europe/London">Londres (GMT+1)</option>
                        <option value="Europe/Lisbon">Lisboa (GMT+1)</option>
                        <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                      </select>
                    </div>
                  </div>

                  <Button className="w-full">
                    Converter Data/Hora
                  </Button>

                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div className="p-4 bg-dark-green/30 rounded-xl">
                      <h4 className="font-medium mb-2">Exemplo: Horário de Verão</h4>
                      <p className="text-sm text-off-white/60">
                        Data: 15/10/2024 15:00<br />
                        São Paulo → Nova York<br />
                        <span className="font-mono block mt-2">
                          Correto: 14:00<br />
                          Bugado: 15:30
                        </span>
                      </p>
                    </div>

                    <div className="p-4 bg-dark-green/30 rounded-xl">
                      <h4 className="font-medium mb-2">Exemplo: Datas Extremas</h4>
                      <p className="text-sm text-off-white/60">
                        Data: 31/12/2024 23:59<br />
                        São Paulo → Tóquio<br />
                        <span className="font-mono block mt-2">
                          Correto: 01/01/2025 11:59<br />
                          Bugado: 31/12/2024 20:59
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Eventos */}
          {activeTab === "events" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Agenda de Eventos</CardTitle>
                <CardDescription>
                  Crie e gerencie eventos com datas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Título do evento"
                      value={newEventTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewEventTitle(e.target.value)}
                    />
                    <Input
                      type="date"
                      value={newEventDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewEventDate(e.target.value)}
                      className="w-40"
                    />
                    <Button onClick={addEvent}>
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-dark-green/30 rounded-xl"
                      >
                        <div>
                          <p className="font-medium">{event.titulo}</p>
                          <p className="text-sm text-off-white/60">
                            {event.data.toLocaleDateString('pt-BR')} - {getDayOfWeek(event.data)}
                          </p>
                        </div>
                        <Badge variant={
                          event.tipo === "aniversário" ? "success" :
                          event.tipo === "reunião" ? "default" :
                          "secondary"
                        }>
                          {event.tipo}
                        </Badge>
                      </div>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          )}
      </div>

    </div>
  );
}