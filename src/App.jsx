import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  Camera,
  ChevronRight,
  CircleDollarSign,
  Coins,
  Cpu,
  Database,
  FileText,
  Gauge,
  Layers,
  MessageSquareText,
  Radar,
  Route,
  ShieldAlert,
  Workflow,
} from "lucide-react";

const STORY_STEPS = [
  {
    id: "data",
    title: "1. Собираем данные застройщика",
    subtitle: "Загружаем документы, договоры, акты, переписку, отчеты и статусы в единую ИИ-базу.",
    bullets: [
      "Единая модель: проект -> дом -> подрядчик -> работы -> деньги",
      "Привязка документов и обязательств к сущностям проекта",
      "Сохранение источников для аудита каждого вывода ИИ",
    ],
  },
  {
    id: "loss",
    title: "2. Находим возможные потери по бумагам",
    subtitle: "ИИ ищет расхождения между планом, договором, актами и оплатами до появления кассовых потерь.",
    bullets: [
      "Риски переплат и не подтвержденных объемов",
      "Неоднозначные условия в ТЗ и контрактах",
      "Сигналы срыва сроков по документному контуру",
    ],
  },
  {
    id: "reasons",
    title: "3. Разбираем причины",
    subtitle: "Система объясняет: почему возник риск, что будет при бездействии и где вмешиваться в первую очередь.",
    bullets: [
      "Причина -> последствие -> денежный эффект",
      "Приоритизация по критичности и сроку реакции",
      "Рекомендации по управленческому действию",
    ],
  },
  {
    id: "fact",
    title: "4. Подключаем фактические данные",
    subtitle: "Подтягиваем фото/видео, полевые отчеты, обратную связь, CRM и датчики для проверки гипотез.",
    bullets: [
      "План/документы сверяются с фактом",
      "Раннее подтверждение отклонений на площадке",
      "Формирование доказательной базы по спорным оплатам",
    ],
  },
  {
    id: "cockpit",
    title: "5. Управленческий ИИ-контур",
    subtitle: "Руководитель получает главный экран: где риски, сколько стоят и какие решения дадут эффект.",
    bullets: [
      "Единый проектный радар по срокам, деньгам и рискам",
      "Диалог с ИИ по ролям: директор, стройка, финансы",
      "Накопление вопросов застройщика как backlog продуктовых идей",
    ],
  },
];

const PROJECT_CARD = {
  name: "ЖК Северный Квартал",
  phase: "Монолит + инженерные сети",
  health: 72,
  riskLevel: "Средний",
  potentialLoss: "14.6 млн ₽",
  scheduleRisk: "3-4 недели",
  hotspots: ["Неподтвержденные объемы по актам", "Рост затрат по инженерке", "Отставание отделки секции B"],
};

const FACT_CHANNELS = [
  { icon: Camera, label: "Фотофиксация" },
  { icon: Cpu, label: "Датчики" },
  { icon: MessageSquareText, label: "Обратная связь" },
  { icon: Database, label: "CRM / 1C" },
];

const CHAT_SEED = [
  {
    role: "assistant",
    text: "Спросите про ваш проект: я покажу, где продукт находит потери и как подтверждает их фактом.",
  },
];

const STORAGE_KEY = "developer_questions_log_v1";

function inferIntent(question) {
  const text = question.toLowerCase();

  if (text.includes("1с") || text.includes("erp") || text.includes("crm")) {
    return {
      tag: "Интеграции",
      answer:
        "Подключаем 1С/CRM через API или регламентные выгрузки. На первом этапе достаточно пакетной синхронизации, затем можно перейти к near real-time.",
    };
  }

  if (text.includes("фото") || text.includes("видео") || text.includes("датчик") || text.includes("камера")) {
    return {
      tag: "Факт",
      answer:
        "Фактический контур подтверждает бумажные риски: фото/видео, отчеты и датчики связываются с конкретными работами и оплатами.",
    };
  }

  if (text.includes("окуп") || text.includes("roi") || text.includes("стоим") || text.includes("цена")) {
    return {
      tag: "Экономика",
      answer:
        "Эффект считаем от предотвращенных переплат, сокращения переделок и снижения сдвигов сроков. Обычно пилот оценивают на одном проекте и одной зоне риска.",
    };
  }

  if (text.includes("безопас") || text.includes("доступ") || text.includes("персонал")) {
    return {
      tag: "Безопасность",
      answer:
        "Ролевая модель доступа, журнал действий и хранение ссылок на источник для каждого вывода ИИ. Это снижает риск недоверия к рекомендациям.",
    };
  }

  return {
    tag: "Продукт",
    answer:
      "Последовательность внедрения: данные -> потери по бумагам -> причины -> факт -> управленческий экран и ИИ-диалог.",
  };
}

function loadQuestionLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQuestionLog(nextLog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLog));
}

function formatDateTime(isoDate) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default function App() {
  const [activeStep, setActiveStep] = useState(STORY_STEPS[0].id);
  const [messages, setMessages] = useState(CHAT_SEED);
  const [input, setInput] = useState("");
  const [questionLog, setQuestionLog] = useState([]);

  const currentStep = useMemo(
    () => STORY_STEPS.find((step) => step.id === activeStep) || STORY_STEPS[0],
    [activeStep]
  );

  useEffect(() => {
    setQuestionLog(loadQuestionLog());
  }, []);

  const intentStats = useMemo(() => {
    const stats = {};
    for (const item of questionLog) {
      stats[item.tag] = (stats[item.tag] || 0) + 1;
    }
    return stats;
  }, [questionLog]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;

    const intent = inferIntent(text);
    const userMessage = { role: "user", text };
    const assistantMessage = { role: "assistant", text: intent.answer };

    const item = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      tag: intent.tag,
      createdAt: new Date().toISOString(),
    };

    const nextLog = [item, ...questionLog];

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestionLog(nextLog);
    saveQuestionLog(nextLog);
    setInput("");
  };

  const exportQuestions = () => {
    const payload = JSON.stringify(questionLog, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `developer-questions-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="deck-page">
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-curves" aria-hidden="true" />

      <header className="deck-header">
        <div className="deck-brand">
          <Building2 size={18} />
          <div>
            <strong>DIWAY</strong>
            <p>ИИ-контур управления девелопментом</p>
          </div>
        </div>
        <Badge variant="outline">Интерактивная презентация</Badge>
      </header>

      <main className="deck-main">
        <section className="cover-screen">
          <p className="cover-mark">От слепых зон к управляемой реальности</p>
          <h1>ИИ-КОНТУР УПРАВЛЕНИЯ ДЕВЕЛОПЕРСКИМ ПРОЕКТОМ</h1>
          <p className="cover-subtitle">
            Сначала собираем данные застройщика, затем находим потери в бумагах и подтверждаем их фактом,
            чтобы руководитель видел причины и действия, а не только отчеты.
          </p>
          <div className="cover-pills">
            <Badge variant="secondary">
              <Layers size={13} /> Данные проекта
            </Badge>
            <Badge variant="secondary">
              <Route size={13} /> Логика внедрения
            </Badge>
            <Badge variant="secondary">
              <Gauge size={13} /> Управленческий экран
            </Badge>
          </div>
        </section>

        <section className="project-card-wrap">
          <Card className="project-card">
            <CardHeader>
              <CardTitle className="project-title">
                <Radar size={18} /> Карточка проекта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="project-head">
                <div>
                  <p className="project-name">{PROJECT_CARD.name}</p>
                  <p className="project-phase">{PROJECT_CARD.phase}</p>
                </div>
                <Badge variant="outline">Риск: {PROJECT_CARD.riskLevel}</Badge>
              </div>

              <div className="metrics-grid">
                <article>
                  <p>Health Index</p>
                  <strong>{PROJECT_CARD.health}/100</strong>
                </article>
                <article>
                  <p>Потенциальные потери</p>
                  <strong>{PROJECT_CARD.potentialLoss}</strong>
                </article>
                <article>
                  <p>Риск сдвига срока</p>
                  <strong>{PROJECT_CARD.scheduleRisk}</strong>
                </article>
              </div>

              <div className="hotspots">
                {PROJECT_CARD.hotspots.map((point) => (
                  <div key={point} className="hotspot-item">
                    <ShieldAlert size={14} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="story-layout">
          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                <Workflow size={18} /> Последовательность донесения ценности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="step-tabs">
                {STORY_STEPS.map((step) => (
                  <button
                    key={step.id}
                    className={`step-tab ${activeStep === step.id ? "active" : ""}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    {step.title}
                  </button>
                ))}
              </div>

              <div className="step-detail">
                <h3>{currentStep.title}</h3>
                <p>{currentStep.subtitle}</p>
                <div className="bullet-grid">
                  {currentStep.bullets.map((bullet) => (
                    <div key={bullet} className="bullet-item">
                      <ChevronRight size={14} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                <Database size={18} /> Каналы фактических данных
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="channels-grid">
                {FACT_CHANNELS.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.label} className="channel-card">
                      <Icon size={16} />
                      <span>{channel.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="result-note">
                <CircleDollarSign size={16} />
                <p>
                  На выходе не просто аналитика, а объясненные решения: где теряем, почему и какое действие
                  даст максимальный финансовый эффект.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="chat-layout">
          <Card className="chat-card">
            <CardHeader>
              <CardTitle className="section-title">
                <MessageSquareText size={18} /> ИИ-чат для застройщика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chat-list">
                {messages.map((message, index) => (
                  <article key={index} className={`chat-bubble ${message.role}`}>
                    <p className="chat-role">
                      {message.role === "assistant" ? <Bot size={13} /> : <FileText size={13} />}
                      {message.role === "assistant" ? "ИИ" : "Пользователь"}
                    </p>
                    <p>{message.text}</p>
                  </article>
                ))}
              </div>

              <div className="chat-form">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={3}
                  placeholder="Например: как быстро подключить 1С и фотофиксацию для пилота?"
                />
                <Button onClick={onSend}>Отправить</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                <BarChart3 size={18} /> Накопление вопросов и идей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="log-top">
                <p>
                  Сохранено вопросов: <strong>{questionLog.length}</strong>
                </p>
                <Button variant="secondary" size="sm" onClick={exportQuestions} disabled={!questionLog.length}>
                  Экспорт JSON
                </Button>
              </div>

              <div className="tags-row">
                {Object.entries(intentStats).length ? (
                  Object.entries(intentStats).map(([tag, count]) => (
                    <Badge key={tag} variant="secondary">
                      {tag}: {count}
                    </Badge>
                  ))
                ) : (
                  <span className="placeholder-text">Вопросы появятся после первого диалога в чате.</span>
                )}
              </div>

              <div className="log-list">
                {questionLog.slice(0, 7).map((item) => (
                  <article key={item.id} className="log-item">
                    <p>{item.text}</p>
                    <div>
                      <Badge variant="outline">{item.tag}</Badge>
                      <span>{formatDateTime(item.createdAt)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="deck-footer">
        <p>
          Логика страницы повторяет последовательность презентации: данные → потери → причины → факт →
          управленческий контур.
        </p>
        <p className="footer-icons">
          <Coins size={14} /> Деньги <ChevronRight size={14} /> <Gauge size={14} /> Управляемость
        </p>
      </footer>
    </div>
  );
}
