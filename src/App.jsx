import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  BrainCircuit,
  Building2,
  Camera,
  BarChart3,
  CircleDollarSign,
  Database,
  FileText,
  MessageSquareText,
  Radar,
  Save,
  Workflow,
} from "lucide-react";

const PRODUCT_STAGES = [
  {
    id: "stage-1",
    title: "1. Загружаем знания застройщика",
    subtitle: "Документы, договоры, сметы, КС/КС2/КС3, переписка, регламенты",
    output: "Структурированная база знаний для ИИ с привязкой к проектам и контрагентам",
    icon: Database,
    risks: ["Непрозрачные обязательства", "Неявные риски в договорах", "Потеря контекста между отделами"],
  },
  {
    id: "stage-2",
    title: "2. Ищем потери в бумагах",
    subtitle: "ИИ анализирует документы, оплаты, сроки и управленческие решения",
    output: "Список зон потерь с финансовой оценкой и вероятными причинами",
    icon: CircleDollarSign,
    risks: ["Переплаты", "Двойные работы", "Сдвиги сроков", "Риски допработ"],
  },
  {
    id: "stage-3",
    title: "3. Подтягиваем факт",
    subtitle: "Фото/видео, отчеты, обратная связь, датчики, CRM, производственные статусы",
    output: "Проверка реальности: подтверждаем или опровергаем гипотезы о потерях",
    icon: Camera,
    risks: ["Отчет не совпадает с фактом", "Скрытые задержки", "Неверифицированные объемы"],
  },
  {
    id: "stage-4",
    title: "4. Руководитель получает управляемость",
    subtitle: "ИИ объясняет причины, рекомендует решения и считает эффект",
    output: "Единый контур принятия решений по деньгам, срокам и рискам",
    icon: BrainCircuit,
    risks: ["Реактивное управление", "Потеря маржи", "Низкая скорость принятия решений"],
  },
];

const IMPACT_MODELS = {
  "Документы и оплаты": {
    lossRange: "8-22 млн ₽ / проект / год",
    reason: "Расхождения между договором, актами и фактическим объемом работ",
    fix: "Автопроверка условий оплаты + ранние предупреждения по сомнительным актам",
  },
  "Сроки и подрядчики": {
    lossRange: "4-15 недель задержки",
    reason: "Срыв критического пути и поздняя эскалация проблем на участке",
    fix: "Сигналы отклонений по документам + подтверждение факта по фото/видео",
  },
  "Контроль качества": {
    lossRange: "3-9% бюджета этапа",
    reason: "Переделки и гарантийные проблемы из-за неполной фиксации качества",
    fix: "Привязка чек-листов, фотофиксации и претензий к конкретным работам",
  },
};

const CHAT_SEED = [
  {
    role: "assistant",
    text: "Я демонстрационный ИИ-консультант. Спросите, где продукт помогает застройщику сократить потери.",
  },
];

const STORAGE_KEY = "developer_questions_log_v1";

function inferIntent(question) {
  const text = question.toLowerCase();

  if (text.includes("1с") || text.includes("erp") || text.includes("crm")) {
    return {
      tag: "Интеграции",
      answer:
        "Начинаем с выгрузки через API/файлы из 1С и CRM, затем нормализуем данные в единую модель проекта. На старте можно работать без тяжелой интеграции в реальном времени.",
    };
  }

  if (text.includes("датчик") || text.includes("камера") || text.includes("фото") || text.includes("видео")) {
    return {
      tag: "Фактические данные",
      answer:
        "Факт подключается как второй контур: фото/видео, датчики и выездные отчеты подтверждают или опровергают риски, найденные в документах.",
    };
  }

  if (text.includes("стоим") || text.includes("цена") || text.includes("окуп") || text.includes("roi")) {
    return {
      tag: "Экономика",
      answer:
        "Обычно пилот считают от предотвращенных переплат и снижения сдвигов сроков. В проекте фиксируются базовая потеря, эффект после внедрения и срок окупаемости.",
    };
  }

  if (text.includes("безопас") || text.includes("доступ") || text.includes("персональ")) {
    return {
      tag: "Безопасность",
      answer:
        "Доступ разграничивается по ролям, критичные данные шифруются, а каждое решение ИИ сохраняется с источниками для аудита.",
    };
  }

  return {
    tag: "Продукт",
    answer:
      "Логика продукта: сначала собираем данные застройщика, затем находим потери в бумагах, после этого подтверждаем факт и выводим причины с конкретными управленческими действиями.",
  };
}

function saveQuestionLog(nextLog) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLog));
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

function formatDateTime(isoDate) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export default function App() {
  const [activeStage, setActiveStage] = useState(PRODUCT_STAGES[0].id);
  const [impactFocus, setImpactFocus] = useState("Документы и оплаты");

  const [messages, setMessages] = useState(CHAT_SEED);
  const [input, setInput] = useState("");
  const [questionLog, setQuestionLog] = useState([]);

  const currentStage = useMemo(
    () => PRODUCT_STAGES.find((stage) => stage.id === activeStage) || PRODUCT_STAGES[0],
    [activeStage]
  );

  useEffect(() => {
    setQuestionLog(loadQuestionLog());
  }, []);

  const intentStats = useMemo(() => {
    const stats = {};
    for (const entry of questionLog) {
      stats[entry.tag] = (stats[entry.tag] || 0) + 1;
    }
    return stats;
  }, [questionLog]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;

    const intent = inferIntent(text);
    const userMessage = { role: "user", text };
    const assistantMessage = { role: "assistant", text: intent.answer };

    const logItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      tag: intent.tag,
      createdAt: new Date().toISOString(),
    };

    const nextLog = [logItem, ...questionLog];
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
    <div className="page-shell">
      <div className="hero-background" aria-hidden="true" />

      <header className="top-nav">
        <div className="brand">
          <div className="brand-icon">
            <Building2 size={18} />
          </div>
          <div>
            <strong>DIWAY</strong>
            <p>Платформа управляемости девелопмента</p>
          </div>
        </div>
        <Badge variant="outline">Интерактивная демо-версия</Badge>
      </header>

      <main className="layout-grid">
        <section className="main-column">
          <Card className="hero-card">
            <CardContent>
              <p className="eyebrow">Цифровой контур для застройщика</p>
              <h1>Где теряются деньги, сроки и управляемость</h1>
              <p className="lead">
                Этот сайт показывает путь продукта: собираем данные, находим потери в бумагах,
                подтверждаем факт и даем руководителю объяснимые решения.
              </p>
              <div className="hero-tags">
                <Badge variant="secondary">Документы + 1С/CRM</Badge>
                <Badge variant="secondary">Факт: фото/видео/датчики</Badge>
                <Badge variant="secondary">ИИ-диалог по ролям</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                <Workflow size={18} />
                Кликабельный путь внедрения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stage-grid">
                {PRODUCT_STAGES.map((stage) => {
                  const Icon = stage.icon;
                  const isActive = stage.id === currentStage.id;
                  return (
                    <button
                      key={stage.id}
                      className={`stage-chip ${isActive ? "active" : ""}`}
                      onClick={() => setActiveStage(stage.id)}
                    >
                      <Icon size={16} />
                      <span>{stage.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="stage-details">
                <h3>{currentStage.title}</h3>
                <p>{currentStage.subtitle}</p>
                <div className="result-box">
                  <strong>Результат этапа:</strong>
                  <span>{currentStage.output}</span>
                </div>
                <div className="risk-list">
                  {currentStage.risks.map((risk) => (
                    <Badge key={risk} variant="outline">
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                <Radar size={18} />
                Симулятор эффекта
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="impact-buttons">
                {Object.keys(IMPACT_MODELS).map((name) => (
                  <Button
                    key={name}
                    variant={impactFocus === name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImpactFocus(name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>
              <div className="impact-panel">
                <div>
                  <p className="impact-label">Потенциальные потери</p>
                  <p className="impact-value">{IMPACT_MODELS[impactFocus].lossRange}</p>
                </div>
                <div>
                  <p className="impact-label">Основная причина</p>
                  <p>{IMPACT_MODELS[impactFocus].reason}</p>
                </div>
                <div>
                  <p className="impact-label">Что внедряем</p>
                  <p>{IMPACT_MODELS[impactFocus].fix}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="section-title">
                <Save size={18} />
                Накопленные вопросы застройщика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="question-header">
                <p>
                  В базе: <strong>{questionLog.length}</strong> вопросов
                </p>
                <Button variant="secondary" size="sm" onClick={exportQuestions} disabled={!questionLog.length}>
                  Экспорт JSON
                </Button>
              </div>

              <div className="stats-line">
                {Object.entries(intentStats).length ? (
                  Object.entries(intentStats).map(([tag, count]) => (
                    <Badge key={tag} variant="secondary">
                      {tag}: {count}
                    </Badge>
                  ))
                ) : (
                  <span className="empty-state">Пока нет вопросов. Задайте их в чате справа.</span>
                )}
              </div>

              <div className="question-list">
                {questionLog.slice(0, 8).map((entry) => (
                  <article key={entry.id} className="question-item">
                    <p>{entry.text}</p>
                    <div>
                      <Badge variant="outline">{entry.tag}</Badge>
                      <span>{formatDateTime(entry.createdAt)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="chat-column">
          <Card className="chat-card">
            <CardHeader>
              <CardTitle className="section-title">
                <MessageSquareText size={18} />
                ИИ-чат для диалога с застройщиком
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chat-body">
                {messages.map((message, index) => (
                  <div key={index} className={`bubble ${message.role}`}>
                    <div className="bubble-head">
                      {message.role === "assistant" ? <Bot size={14} /> : <FileText size={14} />}
                      <strong>{message.role === "assistant" ? "ИИ" : "Пользователь"}</strong>
                    </div>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>

              <div className="chat-input-wrap">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Например: Как вы подключаетесь к 1С и CRM?"
                  rows={3}
                />
                <Button onClick={onSend}>Отправить и сохранить вопрос</Button>
              </div>

              <p className="chat-note">
                Каждый ваш вопрос автоматически сохраняется в накопитель идей и доступен для дальнейшего анализа.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="mini-title">
                <BarChart3 size={16} /> Что дальше после демо
              </p>
              <ul className="next-steps">
                <li>Пилот на одном проекте и одном блоке потерь</li>
                <li>Подключение источников факта (фото/видео/датчики)</li>
                <li>Dashboard для директора и руководителей направлений</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
