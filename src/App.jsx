import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Sparkles, ShieldAlert, Layers, Route, Gauge, Building2, ClipboardCheck, FileText, Camera, Cpu, Coins, Users, Wrench, MessageSquareText } from "lucide-react";

/**
 * One-file interactive site-deck for Miro/Pitch use.
 * - Clickable navigation (slides)
 * - Role-based agents overview
 * - Requirements (why staged rollout)
 * - Roadmap 1→4
 * - Sample dialogs (Stage 1 & 2)
 *
 * Customize texts in SLIDES below.
 */

const Pill = ({ icon: Icon, label }: { icon?: any; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
    {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
    {label}
  </span>
);

const SlideShell = ({ title, subtitle, children }: any) => (
  <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6">
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Digital Twin + AI Agents for Developers</span>
      </div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-3xl text-muted-foreground">{subtitle}</p> : null}
    </div>
    {children}
  </div>
);

function KPI({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "ok" | "warn" | "bad" }) {
  const badge = tone === "ok" ? "secondary" : tone === "warn" ? "outline" : "destructive";
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
          </div>
          {delta ? <Badge variant={badge as any} className="h-fit">{delta}</Badge> : null}
        </div>
      </CardContent>
    </Card>
  );
}

const AgentCard = ({ icon: Icon, name, question, tags, onOpen }: any) => (
  <Card className="group rounded-2xl">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border p-2">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold">{name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{question}</div>
          </div>
        </div>
        <Button variant="ghost" className="opacity-70 group-hover:opacity-100" onClick={onOpen}>
          Подробнее
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(tags || []).map((t: any, i: number) => (
          <Badge key={i} variant="secondary">{t}</Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RoadmapStep = ({ step, title, duration, price, what, data }: any) => (
  <Card className="rounded-2xl">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center justify-between">
        <span className="text-base">Этап {step}. {title}</span>
        <Badge variant="outline">{duration} • {price}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="text-sm text-muted-foreground">Что делаем</div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {what.map((x: string, i: number) => <li key={i}>{x}</li>)}
      </ul>
      <div className="text-sm text-muted-foreground">Данные</div>
      <div className="flex flex-wrap gap-2">
        {data.map((x: string, i: number) => <Badge key={i} variant="secondary">{x}</Badge>)}
      </div>
    </CardContent>
  </Card>
);

const SLIDES = [
  {
    id: "intro",
    nav: "Вступление",
    title: "Управление девелопментом в реальном времени",
    subtitle: "Не новая ERP. Не ещё один отчёт. Слой управляемости: план → обязательства → факт → деньги → риск → решения.",
    render: () => (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Pill icon={Gauge} label="Единый CEO-экран" />
              <Pill icon={Layers} label="Модульно: агенты по ролям" />
              <Pill icon={Route} label="Поэтапное внедрение" />
              <Pill icon={ShieldAlert} label="Контроль потерь: деньги/сроки/риск" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <Card className="rounded-2xl">
                <CardContent className="p-5">
                  <div className="text-sm text-muted-foreground">Главная мысль</div>
                  <div className="mt-1 text-lg font-semibold">Контроль ≠ управляемость</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Контроля (камеры, журналы, BI) много. Управленческий ответ: <span className="text-foreground">куда вмешиваться и почему</span> — редкость.
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-5">
                  <div className="text-sm text-muted-foreground">Что продаём</div>
                  <div className="mt-1 text-lg font-semibold">Снижение неуправляемых потерь</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Ранние сигналы, доказательная база, приоритизация действий, прозрачность по ролям.
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Обычно болит</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              <li>Решения с планёрок не превращаются в действия</li>
              <li>Документы есть, но не связаны с реальностью проекта</li>
              <li>Факт узнают поздно → потери в сроках и деньгах</li>
              <li>Тяжело доказать «за что платим»</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "ceo",
    nav: "CEO-экран",
    title: "Главный экран директора",
    subtitle: "Один экран отвечает на вопрос: где сейчас мой бизнес под угрозой?",
    render: () => (
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Development Health Index</div>
                  <div className="mt-1 text-3xl font-semibold">72 / 100 <span className="text-base text-muted-foreground">🟡</span></div>
                  <div className="mt-2 text-sm text-muted-foreground">Не финпоказатель. Управленческий индикатор зрелости исполнения и рисков.</div>
                </div>
                <div className="w-56">
                  <Progress value={72} />
                  <div className="mt-2 text-xs text-muted-foreground">Давление: Строительство −12 • Финансы −6</div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <KPI label="Строительство" value="58 🔴" delta="↓−7 / 2н" tone="bad" />
                <KPI label="Финансы" value="70 🟡" delta="↓−2 / 2н" tone="warn" />
                <KPI label="Исполнение" value="61 🟡" delta="→" tone="warn" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Проблемные проекты</div>
                <Badge variant="outline">по индексу</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Card className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">ЖК A</div>
                      <Badge variant="destructive">55 🔴</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Причина: отставание отделки, неподтверждённые объёмы</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">ЖК B</div>
                      <Badge variant="outline">72 🟡</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Причина: рост затрат по инженерке</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><MessageSquareText className="h-4 w-4"/> AI-объяснение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border p-3">
              <div className="font-semibold">Почему упал индекс строительства?</div>
              <div className="mt-2 text-muted-foreground">
                1) Отставание отделки (−9) • 2) Неподтверждённые объёмы (−5) • 3) HSE нарушения (−2)
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="font-semibold">Если не вмешиваться</div>
              <div className="mt-2 text-muted-foreground">
                Риск сдвига ввода секций B/C на 3–4 недели. Потенциальная переплата: ~14 млн ₽.
              </div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="font-semibold">Что сделать</div>
              <div className="mt-2 text-muted-foreground">
                Заморозить оплату неподтверждённых объёмов • запросить подтверждения • усилить контроль участка.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "agents",
    nav: "Агенты",
    title: "ИИ-агенты = управленческие вопросы",
    subtitle: "Один слайд. Один вопрос на агента. Можно начинать с любого.",
    render: () => <AgentsSlide />,
  },
  {
    id: "requirements",
    nav: "Требования",
    title: "Требования к конечному продукту",
    subtitle: "Полноценный цифровой двойник требует зрелых процессов, систем и дисциплины. Поэтому идём поэтапно.",
    render: () => (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><Layers className="h-4 w-4"/> Системы и цифровизация</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">1С/ERP</Badge>
              <Badge variant="secondary">CRM</Badge>
              <Badge variant="secondary">BIM / CDE</Badge>
              <Badge variant="secondary">Документы (СЭД/DMS)</Badge>
              <Badge variant="secondary">Единые справочники</Badge>
            </div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Единая модель проектов и справочники</li>
              <li>Финансовая «правда» в 1С/ERP</li>
              <li>Версионность проектной документации</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><ClipboardCheck className="h-4 w-4"/> Процессы и дисциплина</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Регулярная фиксация факта</Badge>
              <Badge variant="secondary">Отчётность подрядчиков</Badge>
              <Badge variant="secondary">HSE контроль</Badge>
              <Badge variant="secondary">Изменения (Change control)</Badge>
            </div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Подрядчики подтверждают выполнение</li>
              <li>Решения с планёрок превращаются в задачи</li>
              <li>Факт связывается с деньгами и рисками</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-2xl md:col-span-2">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Вывод</div>
            <div className="mt-1 text-lg font-semibold">Не «волшебная кнопка», а реалистичный путь к управляемости</div>
            <div className="mt-2 text-sm text-muted-foreground">Поэтому внедрение — по этапам: сначала польза без интеграций, затем контекст проекта, затем факт, затем управленческий cockpit.</div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "roadmap",
    nav: "Roadmap",
    title: "Путь к конечному продукту",
    subtitle: "Поэтапно наращиваем данные → метрики → управленческие решения.",
    render: () => (
      <div className="grid gap-4 md:grid-cols-2">
        <RoadmapStep
          step={1}
          title="Консультационный ИИ"
          duration="4–6 недель"
          price="1.5–3 млн ₽"
          what={["Role-based агенты на знаниях рынка/нормативки", "Спец-агент по закупкам: диапазоны цен, поставщики", "Метрики использования (adoption)"]}
          data={["Интернет", "Бенчмарки", "Best practices"]}
        />
        <RoadmapStep
          step={2}
          title="Модель проекта + документы (+1С)"
          duration="6–10 недель"
          price="3–6 млн ₽"
          what={["Единая модель: проект/дом/работы/подрядчики", "Загрузка и привязка документов к сущностям", "Импорт КС/актов из 1С (если есть)", "Ранние риски: обязательства, допработы, условия оплаты"]}
          data={["Документы", "1С (КС)", "Контракты", "ТЗ"]}
        />
        <RoadmapStep
          step={3}
          title="Факт: фото/видео, камеры, датчики"
          duration="10–16 недель"
          price="6–12 млн ₽"
          what={["Мобильная фиксация факта работ", "Камеры + авто HSE/активность", "Датчики точечно (набор прочности и др.)", "Сверка: план/обязательства ↔ факт"]}
          data={["Фото/видео", "Камеры", "IoT датчики", "Статусы"]}
        />
        <RoadmapStep
          step={4}
          title="Единый cockpit + ИИ по ролям"
          duration="8–12 недель"
          price="8–15 млн ₽"
          what={["Индексы процессов и проектов", "Причина→последствие: деньги/сроки/риски", "Ответы ИИ по ролям + рекомендации", "Аудит и прозрачность решений"]}
          data={["Plan/Fact", "Деньги", "Риски", "История"]}
        />
      </div>
    ),
  },
  {
    id: "dialogs",
    nav: "Примеры",
    title: "Как выглядит общение с ИИ",
    subtitle: "Показываем разницу: Этап 1 (рынок) → Этап 2 (ваши документы и 1С).",
    render: () => (
      <Tabs defaultValue="s1" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="s1">Этап 1: консультационный</TabsTrigger>
          <TabsTrigger value="s2">Этап 2: в контексте проекта</TabsTrigger>
        </TabsList>
        <TabsContent value="s1" className="mt-4">
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="text-sm text-muted-foreground">Роль: Закупки</div>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">Пользователь</div>
                <div className="mt-1 text-sm text-muted-foreground">Где чаще всего переплачивают на бетоне и арматуре? Какие рыночные диапазоны цен?</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">ИИ</div>
                <div className="mt-1 text-sm text-muted-foreground">Типовые зоны переплаты: объёмы «с запасом», отсутствие альтернативных поставщиков, непрозрачная логистика. Даю рыночные диапазоны и чек‑лист проверки.</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="s2" className="mt-4">
          <Card className="rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="text-sm text-muted-foreground">Роль: Стройка / Финансы</div>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">Пользователь</div>
                <div className="mt-1 text-sm text-muted-foreground">Покажи риски по подрядчику «МонолитСтрой» на ЖК «Северный». Есть ли проблемы в КС?</div>
              </div>
              <div className="rounded-xl border p-4">
                <div className="font-semibold">ИИ</div>
                <div className="mt-1 text-sm text-muted-foreground">В договоре №14 и ТЗ есть неоднозначность по границам объёмов. В последних КС (из 1С) есть позиции без чёткой привязки к ТЗ → риск допработ/спора. Рекомендую уточнить формулировки до оплаты.</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    ),
  },
];

function AgentsSlide() {
  const [open, setOpen] = useState<string | null>(null);
  const agents = useMemo(
    () => [
      {
        id: "exec",
        icon: ClipboardCheck,
        name: "Execution / Management Agent",
        question: "Где решения с планёрок перестают исполняться?",
        tags: ["Дисциплина", "Поручения", "Эскалации"],
        details: [
          "Фиксирует решения и поручения → связывает с проектами/рисками",
          "Показывает просрочки и зоны потери управляемости",
          "Сводки для директора: где вмешаться лично",
        ],
      },
      {
        id: "design",
        icon: FileText,
        name: "Design Agent",
        question: "Где проектные решения приведут к переделкам и срыву сроков?",
        tags: ["Комплектность", "Версии", "Изменения"],
        details: [
          "Контроль комплектности и версий проектной документации",
          "Поиск противоречий между разделами (без BIM как обязательного условия)",
          "Риски переделок и влияния изменений на сроки/стоимость",
        ],
      },
      {
        id: "build",
        icon: Building2,
        name: "Construction Agent",
        question: "Где стройка теряет управляемость и создаёт риск по срокам?",
        tags: ["Plan vs Fact", "Подрядчики", "HSE"],
        details: [
          "Контроль готовности к этапам и темпов",
          "Выявление проблемных подрядчиков и повторяемости отклонений",
          "HSE сигналы (каски/опасные зоны) при наличии камер",
        ],
      },
      {
        id: "fin",
        icon: Coins,
        name: "Finance & Procurement Agent",
        question: "За что мы реально платим и где спрятаны будущие потери?",
        tags: ["КС/акты", "Рынок", "Допработы"],
        details: [
          "Проверка рыночности цен по SKU и поиск альтернатив",
          "Ранние риски в договорах/ТЗ (допработы, условия оплаты)",
          "Сверка актов и факта (на этапе 3+)",
        ],
      },
      {
        id: "ops",
        icon: Wrench,
        name: "Operations Agent",
        question: "После ввода объект будет активом или проблемой?",
        tags: ["Паспорта", "Гарантии", "OPEX"],
        details: [
          "Контроль передачи: паспорта, регламенты, гарантии",
          "Анализ инцидентов/заявок и причин (после ввода)",
          "Бенчмарки OPEX и точки оптимизации",
        ],
      },
      {
        id: "hr",
        icon: Users,
        name: "HR / Workforce Agent",
        question: "Где люди начинают срывать сроки и увеличивать стоимость проекта?",
        tags: ["Дефицит", "Текучесть", "Стоимость"],
        details: [
          "Обеспеченность кадрами по этапам и критическим ролям",
          "Текучесть и стоимость найма/адаптации",
          "Связь кадровых проблем с рисками сроков",
        ],
      },
    ],
    []
  );

  const current = agents.find((a) => a.id === open);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map((a) => (
          <AgentCard
            key={a.id}
            icon={a.icon}
            name={a.name}
            question={a.question}
            tags={a.tags}
            onOpen={() => setOpen(a.id)}
          />
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="sm:max-w-[640px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {current?.icon ? <current.icon className="h-5 w-5" /> : null}
              {current?.name}
            </DialogTitle>
            <DialogDescription>{current?.question}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            {(current?.details || []).map((x: string, i: number) => (
              <div key={i} className="rounded-xl border p-3 text-muted-foreground">{x}</div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function SiteDeck() {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];

  const go = (n: number) => setIdx((p) => Math.min(Math.max(n, 0), SLIDES.length - 1));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="rounded-xl border p-2"><Cpu className="h-4 w-4" /></div>
            <div>
              <div className="text-sm font-semibold leading-none">AI Product Strategist</div>
              <div className="text-xs text-muted-foreground">Interactive pitch deck</div>
            </div>
          </div>

          <div className="hidden gap-2 md:flex">
            {SLIDES.map((s, i) => (
              <Button
                key={s.id}
                variant={i === idx ? "secondary" : "ghost"}
                size="sm"
                onClick={() => go(i)}
              >
                {s.nav}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{idx + 1} / {SLIDES.length}</Badge>
            <Button variant="outline" size="icon" onClick={() => go(idx - 1)} disabled={idx === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => go(idx + 1)} disabled={idx === SLIDES.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
          <div className="flex flex-wrap gap-2">
            {SLIDES.map((s, i) => (
              <Button
                key={s.id}
                variant={i === idx ? "secondary" : "ghost"}
                size="sm"
                onClick={() => go(i)}
              >
                {s.nav}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <SlideShell title={slide.title} subtitle={slide.subtitle}>
          {slide.render()}
        </SlideShell>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          Подсказка: правьте тексты в массиве <span className="font-mono">SLIDES</span> — это однофайловая сайт‑презентация.
        </div>
      </footer>
    </div>
  );
}
