/* =====================================================================
   F1 Glory · Team Owner & CEO Mode (Режим Владельца и CEO команды F1)
   Управление купленной конюшней, кадровая политика, увольнение инженеров,
   совет директоров, моторы, спонсоры и борьба за Кубок Конструкторов
   ===================================================================== */

(function(){
  // --- Initial Default CEO State ---
  const DEFAULT_TECH_DIRECTORS = [
    { id: "td_vandenberg", name: "Маркус Ванденберг", skill: 72, salary: 6500000, trait: "Консервативная аэродинамика", desc: "Опытный, но осторожный конструктор старой школы. Редко ошибается с надежностью, но не дает прорывов в прижимной силе." },
    { id: "td_newmann", name: "Эдриан Нойманн", skill: 96, salary: 22000000, trait: "Гений граунд-эффекта", desc: "Легендарный аэродинамик мирового уровня. Разработал 12 чемпионских болидов. Дает взрывной прирост темпа машины (+15 perf)." },
    { id: "td_elliott", name: "Джеймс Эллиотт", skill: 88, salary: 14000000, trait: "Мастер инноваций CFD", desc: "Экс-шеф аэродинамики топ-конюшни. Превосходный баланс между максимальной скоростью в поворотах и надежностью подвески (+10 perf)." },
    { id: "td_mariani", name: "Лука Мариани", skill: 81, salary: 9500000, trait: "Шеф-дизайнер из Маранелло", desc: "Итальянский специалист по компоновке шасси и охлаждению. Агрессивный дизайн понтонов (+7 perf)." },
    { id: "td_sokolov", name: "Виктор Соколов", skill: 76, salary: 4500000, trait: "Молодой визионер симуляций", desc: "Восходящая звезда университетских программ аэродинамики. Доступный оклад и высокий потенциал долгосрочного роста (+5 perf)." }
  ];

  const DEFAULT_TEAM_PRINCIPALS = [
    { id: "tp_dorn", name: "Алекс Дорн", skill: 77, salary: 5000000, trait: "Прагматичный менеджер", desc: "Держит железную дисциплину на пит-лейн и контролирует операционные расходы." },
    { id: "tp_horner_type", name: "Кристиан Вольфрам", skill: 93, salary: 16000000, trait: "Акула паддока и FIA", desc: "Умеет продавливать любые регламентные директивы в FIA и привлекать звездных инженеров." },
    { id: "tp_steiner_type", name: "Гюнтер Бауэр", skill: 80, salary: 6000000, trait: "Любимец прессы и шоу", desc: "Прямолинейный харизматик. Поднимает медийность команды на 300% и держит гараж в тонусе." },
    { id: "tp_ex_champ", name: "Мика Салонен", skill: 84, salary: 9000000, trait: "Бывший чемпион мира", desc: "Превосходно понимает психологию пилотов и знает, как наладить обратную связь с инженерами." }
  ];

  const ENGINE_SUPPLIERS = [
    { id: "eng_mercedes", name: "Mercedes-AMG HPP V6 Turbo", cost: 22000000, power: 94, rel: 95, tag: "Эталон надежности" },
    { id: "eng_ferrari", name: "Ferrari 066/12 Power Unit", cost: 21000000, power: 96, rel: 88, tag: "Максимальная пиковая мощность" },
    { id: "eng_rbpt", name: "Red Bull Powertrains - Ford", cost: 23000000, power: 95, rel: 92, tag: "Передовая ERS-гибридизация" },
    { id: "eng_honda", name: "Honda HRC Hybrid", cost: 19000000, power: 92, rel: 94, tag: "Высокая энергоэффективность" },
    { id: "eng_audi", name: "Audi Works Turbo Hybrid", cost: 17000000, power: 88, rel: 86, tag: "Заводской дебютант" }
  ];

  const TITLE_SPONSORS = [
    { id: "sp_tech", name: "Apex Global Cloud Systems", payout: 42000000, tag: "Технологический гигант", reqPos: 6 },
    { id: "sp_oil", name: "PetroDyn Energy International", payout: 48000000, tag: "Нефтегазовый конгломерат", reqPos: 4 },
    { id: "sp_crypto", name: "Nexus Web3 Exchange", payout: 34000000, tag: "Крипто-биржа", reqPos: 8 },
    { id: "sp_telecom", name: "Velox Telecom 5G", payout: 28000000, tag: "Телекоммуникации", reqPos: 10 }
  ];

  const DRIVER_CANDIDATES = [
    { id: "drv_bearman", name: "Оливер Берман", ovr: 84, salary: 11000000, isPay: false, tag: "Звездный молодой талант" },
    { id: "drv_norris_tier", name: "Ландо Вудринг", ovr: 92, salary: 26000000, isPay: false, tag: "Претендент на чемпионский титул" },
    { id: "drv_piastri_tier", name: "Оскар Ванден", ovr: 89, salary: 18000000, isPay: false, tag: "Хладнокровный победитель Гран-при" },
    { id: "drv_rookie_fast", name: "Артур Леклерк", ovr: 78, salary: 5000000, isPay: false, tag: "Выпускник академии" },
    { id: "drv_pay_latifi", name: "Николас Ричмонд", ovr: 68, salary: -24000000, isPay: true, tag: "Рента-драйвер (+ $24M спонсоров)" },
    { id: "drv_pay_zhou", name: "Чжоу Тянь", ovr: 74, salary: -18000000, isPay: true, tag: "Коммерческий пилот (+ $18M)" }
  ];

  const HQ_LOCATIONS = [
    { id: "silverstone", name: "Сильверстоун", country: "Великобритания", flag: "🇬🇧", desc: "Сердце Моторспорт-долины, доступ к лучшим инженерам F1" },
    { id: "maranello", name: "Болонья / Фаэнца", country: "Италия", flag: "🇮🇹", desc: "Итальянские традиции, страсть и аэродинамический дизайн" },
    { id: "stuttgart", name: "Штутгарт / Кёльн", country: "Германия", flag: "🇩🇪", desc: "Немецкие заводские технологии, автоклавы и педантичность" },
    { id: "charlotte", name: "Шарлотт / Остин", country: "США", flag: "🇺🇸", desc: "Американский капитал, медийный размах и цифровые симуляторы" },
    { id: "hinwil", name: "Хинвил", country: "Швейцария", flag: "🇨🇭", desc: "Швейцарская точность и одна из лучших в мире аэродинамических труб" },
    { id: "viry", name: "Вири-Шатийон / Ницца", country: "Франция", flag: "🇫🇷", desc: "Французская школа моторостроения и композитов" }
  ];

  const LIVERY_PALETTES = [
    { id: "teal", name: "Petronas Teal", primary: "#00d2be", preview: "linear-gradient(135deg, #00d2be 0%, #0f172a 75%)" },
    { id: "red", name: "Corsa Rosso", primary: "#e10600", preview: "linear-gradient(135deg, #e10600 0%, #1e1b18 75%)" },
    { id: "papaya", name: "Papaya Orange", primary: "#ff8700", preview: "linear-gradient(135deg, #ff8700 0%, #0369a1 75%)" },
    { id: "green", name: "British Racing Green", primary: "#00593b", preview: "linear-gradient(135deg, #00593b 0%, #022c22 75%)" },
    { id: "gulf", name: "Gulf Sky Blue", primary: "#38bdf8", preview: "linear-gradient(135deg, #38bdf8 0%, #ea580c 75%)" },
    { id: "gold", name: "Carbon & Midnight Gold", primary: "#d4af37", preview: "linear-gradient(135deg, #d4af37 0%, #09090b 75%)" },
    { id: "purple", name: "Ultraviolet Purple", primary: "#a855f7", preview: "linear-gradient(135deg, #a855f7 0%, #1e1b4b 75%)" },
    { id: "white", name: "Alpine Blue & White", primary: "#0090ff", preview: "linear-gradient(135deg, #0090ff 0%, #f8fafc 75%)" }
  ];

  const ORIGIN_STORIES = [
    { id: "buyout", title: "Выкуп команды-аутсайдера", tag: "Сделка поглощения", desc: "Поглощение существующей конюшни с её базой, лицензией FIA и долгами. Полный ребрендинг и перезапуск концепции." },
    { id: "new_team", title: "Создание новой 11-й команды", tag: "Новая франшиза FIA", desc: "Официальное внесение вступительного взноса ($200M) и регистрация нового конструктора Формулы-1 с чистого листа." },
    { id: "revival", title: "Возрождение культового бренда", tag: "Историческое наследие", desc: "Выкуп прав на легендарное историческое имя из золотой эпохи автоспорта (Brabham, Tyrrell, Lotus) и возвращение в паддок." }
  ];

  // =====================================================================
  // 🏛️ FIA DIRECTIVES, DILEMMAS, R&D SPECS & F1 CALENDAR DATA
  // =====================================================================
  const FIA_DIRECTIVES_POOL = [
    {
      id: "td_flex_wings",
      code: "TD-039 / AERO",
      title: "Директива TD-039: Ужесточение тестов на гибкость антикрыльев",
      desc: "Комиссия FIA расследует упругую деформацию передних антикрыльев на скоростях свыше 290 км/ч. Запрет снизит аэродинамическую эффективность ведущих машин пелотона.",
      proImpact: "Запрет ослабит лидеров пелотона (соперники теряют темп, но если ваш болид >85 OVR, вы теряете -2 к темпу).",
      contraImpact: "Сохранение регламента. Полная свобода инженерных инноваций.",
      aiVotesFor: 5,
      aiVotesAgainst: 4,
      costLobby: 4000000
    },
    {
      id: "td_cost_cap_lift",
      code: "TD-044 / FIN",
      title: "Директива TD-044: Индексация лимита расходов на инфляцию (+ $15M)",
      desc: "Крупные заводские команды требуют поднять планку Financial Regulations со $135M до $150M из-за роста цен на карбоновые композиты и мировую авиалогистику.",
      proImpact: "Лимит расходов вырастет на $15M. Команда получит больше пространства для инвестиций в R&D.",
      contraImpact: "Лимит остается $135M. Финансовый паритет в пелотоне сохраняется.",
      aiVotesFor: 4,
      aiVotesAgainst: 5,
      costLobby: 5000000
    },
    {
      id: "td_engine_rel",
      code: "TD-052 / PU",
      title: "Директива TD-052: Амнистия на доработку надежности силовых установок",
      desc: "Разрешить поставщикам моторов доработку компонентов MGU-K и турбокомпрессора в рамках действующего моратория исключительно под предлогом надёжности.",
      proImpact: "Все команды получают +5% к механической надежности силовой установки (Reliability).",
      contraImpact: "Мораторий на моторы сохраняется без исключений.",
      aiVotesFor: 6,
      aiVotesAgainst: 3,
      costLobby: 3500000
    },
    {
      id: "td_sprint_expansion",
      code: "TD-018 / SPORT",
      title: "Директива TD-018: Увеличение количества субботних спринтов до 8",
      desc: "FOM и глобальные телевещатели предлагают расширить формат спринт-уик-эндов. Это принесет дополнительные призовые выплаты, но увеличит аварийность.",
      proImpact: "+$8M призовых от FOM за сезон, но +10% к риску поломок и инцидентов на трассе.",
      contraImpact: "Классический формат из 6 спринтов сохраняется.",
      aiVotesFor: 5,
      aiVotesAgainst: 4,
      costLobby: 3000000
    },
    {
      id: "td_active_aero",
      code: "TD-060 / INNOV",
      title: "Директива TD-060: Внедрение активной аэродинамики на прямых",
      desc: "Ранняя омологация элементов управляемой аэродинамики переднего крыла для облегчения обгонов в «грязном воздухе».",
      proImpact: "+5 к Car Performance для команд с развитым CFD-суперкомпьютером (Tier 3+).",
      contraImpact: "Отклонить нововведение до глобальной смены регламента.",
      aiVotesFor: 3,
      aiVotesAgainst: 6,
      costLobby: 6000000
    }
  ];

  const EXECUTIVE_DILEMMAS_POOL = [
    {
      id: "dil_civil_war",
      title: "💥 Гражданская война пилотов в повороте Сенны",
      icon: "⚔️",
      desc: "Пилот №1 и Пилот №2 вступили в контакт в борьбе за позицию, повредив диффузор и переднее антикрыло. На пит-уолл вспыхнула перепалка по радио, а пресса раздувает скандал.",
      options: [
        {
          title: "Ввести жёсткую командную субординацию (Team Orders)",
          desc: "Пилот №1 объявляется безоговорочным первым номером. Пилот №2 теряет мотивацию (-3 OVR), но гараж защищен от столкновений (+4% к надежности).",
          cost: 0,
          effectType: "team_orders"
        },
        {
          title: "Разрешить свободную борьбу: «Пусть гоняются!»",
          desc: "Агрессивный маркетинг и восторг болельщиков (+5% к одобрению совета, +$15M к капитализации), но повышен риск сходов.",
          cost: 0,
          effectType: "free_fight"
        },
        {
          title: "Оштрафовать обоих гонщиков на $1.5M в фонд команды",
          desc: "Оба пилота недовольны, но бюджет команды пополняется на $3,000,000 для компенсации повреждений.",
          cost: 0,
          effectType: "fine_drivers"
        }
      ]
    },
    {
      id: "dil_porpoising",
      title: "🌊 Кризис корреляции: Дельфинирование и тряска шасси",
      icon: "🌪️",
      desc: "На скоростной трассе машина столкнулась с эффектом «porpoising». Данные аэротрубы разошлись с поведением на асфальте. Пилоты жалуются на боли в спине и потерю темпа.",
      options: [
        {
          title: "Экстренный пакет модификации днища ($8M)",
          desc: "Установить титановые стяжки и перепроектировать туннели Вентури. Дает +5 к Car Performance.",
          cost: 8000000,
          effectType: "floor_fix"
        },
        {
          title: "Принудительно поднять клиренс шасси на 15 мм",
          desc: "Бесплатное оперативное решение, но потеря прижимной силы (-4 к Car Performance).",
          cost: 0,
          effectType: "raise_ride"
        },
        {
          title: "Объявить выговор шефу аэродинамики",
          desc: "Снижает мораль в конструкторском бюро (-6% к одобрению совета), но экономит средства.",
          cost: 0,
          effectType: "reprimand_aero"
        }
      ]
    },
    {
      id: "dil_cost_cap_audit",
      title: "🔍 Аудит FIA: Подозрение на превышение Cost Cap",
      icon: "⚖️",
      desc: "Финансовая комиссия FIA направила запрос о $2.4M затрат на питание базы и авиаперелеты руководства. Грозят штрафы и урезание времени в аэротрубе.",
      options: [
        {
          title: "Нанять спортивных адвокатов Королевского суда ($3M)",
          desc: "Полное юридическое оправдание перед трибуналом FIA без последствий для команды.",
          cost: 3000000,
          effectType: "legal_defense"
        },
        {
          title: "Заключить сделку ABA с FIA (Штраф $4M и -10% часов трубы)",
          desc: "Признать процедурное нарушение без риска спортивной дисквалификации.",
          cost: 4000000,
          effectType: "aba_settlement"
        },
        {
          title: "Отрицать всё и вступить в открытый конфликт с FIA",
          desc: "50% шанс победы, либо репутационный урон и штраф $6M от FIA.",
          cost: 0,
          effectType: "gamble_tribunal"
        }
      ]
    },
    {
      id: "dil_headhunt",
      title: "🕵️ Атака хедхантеров: Топ-конюшня переманивает шеф-инженера",
      icon: "💼",
      desc: "Конкуренты предложили вашему главному техническому директору удвоенный оклад и личный самолет.",
      options: [
        {
          title: "Повысить оклад на 35% и продлить контракт",
          desc: "Инженер остаётся во главе проекта, дав дополнительный прирост темпа (+3 perf).",
          cost: 0,
          effectType: "counter_offer"
        },
        {
          title: "Отпустить в 12-месячный «садовый отпуск» (Gardening Leave)",
          desc: "Получить отступные $7,000,000, но назначить временного и.о. главного конструктора.",
          cost: 0,
          effectType: "gardening_leave"
        }
      ]
    }
  ];

  const RD_SPEC_PACKAGES = [
    {
      id: "pkg_floor_v2",
      spec: "Spec B",
      name: "Днище с вихревыми каналами Вентури 3D",
      desc: "Глубокая оптимизация краевых вихрей и диффузора. Резко увеличивает граунд-эффект в скоростных виражах (+7 perf, +3 rel).",
      cost: 16000000,
      perfBonus: 7,
      relBonus: 3,
      reqFac: null
    },
    {
      id: "pkg_sidepods",
      spec: "Spec C",
      name: "Экстремальный подрез понтонов Undercut & Cannon Deck",
      desc: "Агрессивный аэродинамический канал для направления потока к бим-крылу (+9 perf). Требует аэротрубу Tier 3+.",
      cost: 22000000,
      perfBonus: 9,
      relBonus: 0,
      reqFac: { key: "windTunnel", min: 3, label: "Аэротруба Tier 3+" }
    },
    {
      id: "pkg_monocoque",
      spec: "Chassis Upgrade",
      name: "Облегченный углепластиковый монокок T1000 Carbon",
      desc: "Снижение сухого веса на 14 кг и рост жесткости на кручение (+6 perf, +8 rel). Требует композитный цех Tier 3+.",
      cost: 18000000,
      perfBonus: 6,
      relBonus: 8,
      reqFac: { key: "compositeFactory", min: 3, label: "Композиты Tier 3+" }
    }
  ];

  const F1_CALENDAR_ROUNDS = [
    { round: 1, name: "Гран-при Бахрейна", track: "Сахир", flag: "🇧🇭", laps: 57, type: "Ночной старт сезона" },
    { round: 2, name: "Гран-при Саудовской Аравии", track: "Джидда", flag: "🇸🇦", laps: 50, type: "Скоростной городской трек" },
    { round: 3, name: "Гран-при Австралии", track: "Альберт-Парк", flag: "🇦🇺", laps: 58, type: "Парковый асфальт" },
    { round: 4, name: "Гран-при Японии", track: "Сузука", flag: "🇯🇵", laps: 53, type: "Легендарные эски «S-Curves»" },
    { round: 5, name: "Гран-при Китая", track: "Шанхай", flag: "🇨🇳", laps: 56, type: "Спринт-уик-энд" },
    { round: 6, name: "Гран-при Майами", track: "Майами-Гарденс", flag: "🇺🇸", laps: 57, type: "Спринт / Голливудское шоу" },
    { round: 7, name: "Гран-при Эмилии-Романьи", track: "Имола", flag: "🇮🇹", laps: 63, type: "Классическая старая школа" },
    { round: 8, name: "Гран-при Монако", track: "Монте-Карло", flag: "🇲🇨", laps: 78, type: "Жемчужина мирового автоспорта" },
    { round: 9, name: "Гран-при Канады", track: "Монреаль, автодром Вильнёва", flag: "🇨🇦", laps: 70, type: "Стена чемпионов" },
    { round: 10, name: "Гран-при Испании", track: "Барселона-Каталония", flag: "🇪🇸", laps: 66, type: "Аэродинамический бенчмарк" },
    { round: 11, name: "Гран-при Австрии", track: "Ред Булл Ринг, Шпильберг", flag: "🇦🇹", laps: 71, type: "Спринт в Альпах" },
    { round: 12, name: "Гран-при Великобритании", track: "Сильверстоун", flag: "🇬🇧", laps: 52, type: "Колыбель Формулы-1" },
    { round: 13, name: "Гран-при Венгрии", track: "Хунгароринг", flag: "🇭🇺", laps: 70, type: "Картодром без права на ошибку" },
    { round: 14, name: "Гран-при Бельгии", track: "Спа-Франкоршам", flag: "🇧🇪", laps: 44, type: "Красная вода / Спринт" },
    { round: 15, name: "Гран-при Нидерландов", track: "Зандворт", flag: "🇳🇱", laps: 72, type: "Крутые бэнкинги в дюнах" },
    { round: 16, name: "Гран-при Италии", track: "Монца", flag: "🇮🇹", laps: 53, type: "Храм абсолютной скорости" },
    { round: 17, name: "Гран-при Азербайджана", track: "Баку", flag: "🇦🇿", laps: 51, type: "Замковый поворот" },
    { round: 18, name: "Гран-при Сингапура", track: "Марина-Бэй", flag: "🇸🇬", laps: 62, type: "Тропическая ночная жара" },
    { round: 19, name: "Гран-при США", track: "COTA, Остин", flag: "🇺🇸", laps: 56, type: "Спринт COTA" },
    { round: 20, name: "Гран-при Мехико", track: "Автодром Эрманос Родригес", flag: "🇲🇽", laps: 71, type: "Разреженная высота 2200м" },
    { round: 21, name: "Гран-при Сан-Паулу", track: "Интерлагос", flag: "🇧🇷", laps: 71, type: "Спринт / Дождевой триллер" },
    { round: 22, name: "Гран-при Лас-Вегаса", track: "Лас-Вегас Стрип", flag: "🇺🇸", laps: 50, type: "Неоновый гламур бульвара" },
    { round: 23, name: "Гран-при Катара", track: "Лусаил", flag: "🇶🇦", laps: 57, type: "Спринт в пустыне" },
    { round: 24, name: "Гран-при Абу-Даби", track: "Яс-Марина", flag: "🇦🇪", laps: 58, type: "Гранд-финал под софитами" }
  ];

  function generateAcademyCandidates() {
    return [
      { id: "c_bernard_" + Math.random().toString(36).substr(2,4), name: "Тео Бернар", flag: "🇫🇷", age: 17, ovr: 72, pot: 93, cost: 1800000, tag: "Чемпион Французской F4" },
      { id: "c_sato_" + Math.random().toString(36).substr(2,4), name: "Хироши Сато", flag: "🇯🇵", age: 18, ovr: 75, pot: 90, cost: 2400000, tag: "Призер Super Formula Lights" },
      { id: "c_silva_" + Math.random().toString(36).substr(2,4), name: "Лукас Силва", flag: "🇧🇷", age: 16, ovr: 69, pot: 95, cost: 1500000, tag: "Чемпион мира по картингу CIK-FIA" }
    ];
  }

  function generateInitialJuniors() {
    return [
      { id: "j_rossi", name: "Матео Росси", flag: "🇮🇹", age: 18, ovr: 75, pot: 92, salary: 1800000, status: "training", tag: "Академия F3" },
      { id: "j_lindberg", name: "Каспер Линдберг", flag: "🇸🇪", age: 19, ovr: 79, pot: 89, salary: 2500000, status: "loaned", loanTeam: "Williams Racing", loanFee: 10000000, tag: "В аренде в F1" }
    ];
  }

  function getDefaultRdState() {
    return {
      focus: "balanced", // "current" (+5 now), "balanced" (+2.5 now, +3 next yr), "next" (+7 next yr)
      installedPackages: [],
      nextYearBonus: 0
    };
  }

  function getDefaultPoliticsState() {
    return {
      activeDirective: Object.assign({}, FIA_DIRECTIVES_POOL[0]),
      directiveVoted: false,
      voteResult: null,
      activeDilemma: null
    };
  }

  function getDefaultAcademyState() {
    return {
      level: 1, // 1..5
      juniors: generateInitialJuniors(),
      candidates: generateAcademyCandidates()
    };
  }

  function getDefaultInvestorsState() {
    return {
      equitySold: 0, // percentage e.g. 0, 10, 25
      deals: [],
      ipoDone: false,
      annualDividendPaid: 0
    };
  }

  function getDefaultTeamName() {
    let base = "Shelby";
    if(typeof pName === "function" && pName()) {
      const parts = pName().trim().split(/\s+/);
      base = parts[parts.length - 1];
    } else if(typeof S !== "undefined" && S && S.name) {
      const parts = S.name.trim().split(/\s+/);
      base = parts[parts.length - 1];
    }
    return base + " F1 Team";
  }

  function getTeamNamePresets() {
    let sn = "Shelby";
    if(typeof pName === "function" && pName()) {
      const parts = pName().trim().split(/\s+/);
      sn = parts[parts.length - 1];
    } else if(typeof S !== "undefined" && S && S.name) {
      const parts = S.name.trim().split(/\s+/);
      sn = parts[parts.length - 1];
    }
    return [
      `${sn} F1 Team`,
      `Scuderia ${sn}`,
      `${sn} Grand Prix`,
      `Apex Formula Racing`,
      `Andretti Global`,
      `Brabham Racing`,
      `Audi Sport F1`
    ];
  }

  let CEO_STATE = null;

  function initCeoState() {
    let teamName = getDefaultTeamName();
    if(typeof S !== "undefined" && S && S.team && S.team.name) {
      teamName = S.team.name + " Racing";
    }

    CEO_STATE = {
      teamName: teamName,
      teamHq: "Сильверстоун (Великобритания)",
      teamFlag: "🇬🇧",
      teamColor: "#00d2be",
      teamLivery: "teal",
      teamStory: "Выкуп команды-аутсайдера",
      year: (typeof yearNow === "function" ? yearNow() : 2026),
      seasonNum: 1,
      budget: 85000000,
      marketCap: 920000000,
      boardApproval: 82, // 0 - 100%
      carPerf: 74,
      carRel: 86,
      techDirector: Object.assign({}, DEFAULT_TECH_DIRECTORS[0]),
      teamPrincipal: Object.assign({}, DEFAULT_TEAM_PRINCIPALS[0]),
      engine: Object.assign({}, ENGINE_SUPPLIERS[0]),
      sponsor: Object.assign({}, TITLE_SPONSORS[3]),
      driver1: Object.assign({}, DRIVER_CANDIDATES[0]),
      driver2: Object.assign({}, DRIVER_CANDIDATES[5]), // pay driver by default for financial balance
      facilities: {
        windTunnel: 2, // 1..5
        cfdSupercomputer: 2,
        simulator: 2,
        compositeFactory: 2
      },
      rd: getDefaultRdState(),
      politics: getDefaultPoliticsState(),
      academy: getDefaultAcademyState(),
      investors: getDefaultInvestorsState(),
      simMode: "calendar",
      calendarProgress: null,
      history: [],
      lastSeasonSummary: null
    };

    saveCeoState();
  }

  function saveCeoState() {
    try {
      if(CEO_STATE && CEO_STATE.history && CEO_STATE.history.length > 25) {
        CEO_STATE.history.length = 25;
      }
      if(CEO_STATE && CEO_STATE.calendarProgress && CEO_STATE.calendarProgress.results && CEO_STATE.calendarProgress.results.length > 24) {
        CEO_STATE.calendarProgress.results.length = 24;
      }
      localStorage.setItem("f1g_ceo_state", JSON.stringify(CEO_STATE));
    } catch(e) {}
  }

  function loadCeoState() {
    try {
      const saved = localStorage.getItem("f1g_ceo_state");
      if(saved) {
        CEO_STATE = JSON.parse(saved);
      }
    } catch(e){}
    if(!CEO_STATE) {
      initCeoState();
    } else {
      if(!CEO_STATE.rd) CEO_STATE.rd = getDefaultRdState();
      if(!CEO_STATE.politics) CEO_STATE.politics = getDefaultPoliticsState();
      if(!CEO_STATE.academy) CEO_STATE.academy = getDefaultAcademyState();
      if(!CEO_STATE.investors) CEO_STATE.investors = getDefaultInvestorsState();
      if(!CEO_STATE.simMode) CEO_STATE.simMode = "calendar";
    }
  }

  function formatMoney(num) {
    if(Math.abs(num) >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if(Math.abs(num) >= 1000) return `$${Math.round(num / 1000)}K`;
    return `$${num}`;
  }

  // =====================================================================
  // ACTIONS: FIRE / HIRE TECH DIRECTORS, PRINCIPALS & UPGRADES
  // =====================================================================

  function fireTechDirector() {
    if(!CEO_STATE) loadCeoState();
    const oldName = CEO_STATE.techDirector ? CEO_STATE.techDirector.name : "Главный инженер";

    // Show candidate picker
    openStaffMarketModal("tech_director", oldName);
  }

  function fireTeamPrincipal() {
    if(!CEO_STATE) loadCeoState();
    const oldName = CEO_STATE.teamPrincipal ? CEO_STATE.teamPrincipal.name : "Руководитель команды";
    openStaffMarketModal("team_principal", oldName);
  }

  window.closeCeoStaffMarketModal = function() {
    const m = document.getElementById("ceoStaffMarketModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openStaffMarketModal(type, firedName) {
    let m = document.getElementById("ceoStaffMarketModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoStaffMarketModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoStaffMarketModal(); });
      document.body.appendChild(m);
    }

    const isTD = (type === "tech_director");
    const title = isTD ? "⚠️ ОТСТАВКА И ВЫБОР ГЛАВНОГО ТЕХНИЧЕСКОГО ДИРЕКТОРА" : "⚠️ СМЕНА РУКОВОДИТЕЛЯ КОМАНДЫ (TEAM PRINCIPAL)";
    const list = isTD ? DEFAULT_TECH_DIRECTORS : DEFAULT_TEAM_PRINCIPALS;

    m.innerHTML = `
      <div class="f1-modal-card ceo-market-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">BOARD OF DIRECTORS EXECUTIVE DECISION</span>
            <h2>${title}</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoStaffMarketModal()">✕</button>
        </div>

        <div class="ceo-market-banner">
          <div class="cmb-alert">
            <span class="cmb-icon">🏛️</span>
            <div>
              <div class="cmb-title">РЕШЕНИЕ СОВЕТА ДИРЕКТОРОВ // КАДРОВАЯ РОТАЦИЯ</div>
              <div class="cmb-sub">Специалист <b>${firedName}</b> отправлен в отставку. Выберите преемника для подписания контракта:</div>
            </div>
          </div>
        </div>

        <div class="ceo-candidates-grid">
          ${list.map(cand => {
            const isCurrent = (isTD ? CEO_STATE.techDirector.id === cand.id : CEO_STATE.teamPrincipal.id === cand.id);
            const canAfford = CEO_STATE.budget >= cand.salary;
            return `
              <div class="ceo-candidate-card ${isCurrent ? 'current' : ''}">
                <div class="cc-head">
                  <span class="cc-trait">${cand.trait}</span>
                  <span class="cc-skill">Рейтинг: <b>${cand.skill}</b>/100</span>
                </div>
                <div class="cc-name">${cand.name}</div>
                <div class="cc-desc">${cand.desc}</div>
                <div class="cc-salary">Оклад: <b>${formatMoney(cand.salary)} / сезон</b></div>
                <div class="cc-actions">
                  ${isCurrent ? `
                    <div class="cc-active-badge">ДЕЙСТВУЮЩИЙ КОНТРАКТ</div>
                  ` : `
                    <button class="btn s-btn ${canAfford ? 'sc-buy' : 'sc-locked'}" onclick="window.hireStaffCandidate('${type}', '${cand.id}')" ${!canAfford ? 'disabled' : ''}>
                      ${canAfford ? 'Подписать контракт' : 'Превышает бюджет'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    m.style.display = "flex";
  }

  window.hireStaffCandidate = function(type, id) {
    if(!CEO_STATE) loadCeoState();
    if(type === "tech_director") {
      const cand = DEFAULT_TECH_DIRECTORS.find(c => c.id === id);
      if(!cand) return;
      CEO_STATE.techDirector = Object.assign({}, cand);
      // Recalculate car perf bump based on skill
      CEO_STATE.carPerf = Math.min(99, Math.max(65, Math.round(60 + (cand.skill - 65) * 0.9 + (CEO_STATE.facilities.windTunnel * 2.5))));
      if(window.showF1Toast) window.showF1Toast(`🏛️ ${cand.name} назначен главным техническим директором! Конструкторское бюро переходит под его руководство!`, "success");
    } else {
      const cand = DEFAULT_TEAM_PRINCIPALS.find(c => c.id === id);
      if(!cand) return;
      CEO_STATE.teamPrincipal = Object.assign({}, cand);
      CEO_STATE.boardApproval = Math.min(100, CEO_STATE.boardApproval + 6);
      if(window.showF1Toast) window.showF1Toast(`👔 ${cand.name} возглавил командный мостик в роли Team Principal!`, "success");
    }

    saveCeoState();
    window.closeCeoStaffMarketModal();
    renderCeoModal();
  };

  window.closeCeoDriverMarketModal = function() {
    const m = document.getElementById("ceoDriverMarketModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openDriverMarketModal(seatIndex) {
    let m = document.getElementById("ceoDriverMarketModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDriverMarketModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoDriverMarketModal(); });
      document.body.appendChild(m);
    }

    const currentDriver = (seatIndex === 1 ? CEO_STATE.driver1 : CEO_STATE.driver2);
    m.innerHTML = `
      <div class="f1-modal-card ceo-market-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">DRIVER LINEUP MANAGEMENT</span>
            <h2>🏎️ СМЕНА ПИЛОТА КОКПИТА #${seatIndex}</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoDriverMarketModal()">✕</button>
        </div>

        <div class="ceo-market-banner">
          <div class="cmb-alert">
            <span class="cmb-icon">🏎️</span>
            <div>
              <div class="cmb-title">ТРАНСФЕРНЫЙ РЫНОК // КОКПИТ #${seatIndex}</div>
              <div class="cmb-sub">Текущий пилот: <b>${currentDriver.name}</b> (${currentDriver.ovr} OVR, ${currentDriver.isPay ? `Рента-спонсоры: +${formatMoney(Math.abs(currentDriver.salary))}` : `Оклад: ${formatMoney(currentDriver.salary)}`}). Выберите контракт:</div>
            </div>
          </div>
        </div>

        <div class="ceo-candidates-grid">
          ${DRIVER_CANDIDATES.map(cand => {
            const isCurrent = (currentDriver.id === cand.id);
            const isPay = cand.isPay;
            return `
              <div class="ceo-candidate-card ${isCurrent ? 'current' : ''}">
                <div class="cc-head">
                  <span class="cc-trait ${isPay ? 'pay-trait' : ''}">${cand.tag}</span>
                  <span class="cc-skill">OVR: <b>${cand.ovr}</b></span>
                </div>
                <div class="cc-name">${cand.name}</div>
                <div class="cc-salary ${isPay ? 'pay-money' : ''}">
                  ${isPay ? `💰 Приносит команде: <b>+${formatMoney(Math.abs(cand.salary))}</b> / сезон` : `Оклад пилота: <b>${formatMoney(cand.salary)}</b> / сезон`}
                </div>
                <div class="cc-actions">
                  ${isCurrent ? `
                    <div class="cc-active-badge">ДЕЙСТВУЮЩИЙ ПИЛОТ</div>
                  ` : `
                    <button class="btn s-btn ${isPay ? 'asset-buy' : 'sc-buy'}" onclick="window.signDriverToSeat(${seatIndex}, '${cand.id}')">
                      Подписать в кокпит #${seatIndex}
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    m.style.display = "flex";
  }

  window.signDriverToSeat = function(seatIndex, drvId) {
    if(!CEO_STATE) loadCeoState();
    const cand = DRIVER_CANDIDATES.find(c => c.id === drvId);
    if(!cand) return;

    if(seatIndex === 1) CEO_STATE.driver1 = Object.assign({}, cand);
    else CEO_STATE.driver2 = Object.assign({}, cand);

    saveCeoState();
    window.closeCeoDriverMarketModal();
    if(window.showF1Toast) window.showF1Toast(`🏁 ${cand.name} подписан в кокпит #${seatIndex}!`, "success");
    renderCeoModal();
  };

  // Facility Upgrades
  function upgradeFacility(facKey) {
    if(!CEO_STATE) loadCeoState();
    const currentLvl = CEO_STATE.facilities[facKey] || 1;
    if(currentLvl >= 5) {
      if(window.showF1Toast) window.showF1Toast("Данный объект модернизирован до максимального уровня (Tier 5)!", "info");
      return;
    }

    const cost = (currentLvl + 1) * 12000000;
    if(CEO_STATE.budget < cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно средств для модернизации! Требуется ${formatMoney(cost)}.`, "error");
      return;
    }

    CEO_STATE.budget -= cost;
    CEO_STATE.facilities[facKey] = currentLvl + 1;
    CEO_STATE.marketCap += Math.round(cost * 1.5); // Infrastructure directly increases enterprise value

    if(facKey === "windTunnel" || facKey === "cfdSupercomputer") {
      CEO_STATE.carPerf = Math.min(99, CEO_STATE.carPerf + 4);
    } else {
      CEO_STATE.carRel = Math.min(99, CEO_STATE.carRel + 4);
    }

    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🏗️ Модернизация завершена! Уровень поднят до Tier ${CEO_STATE.facilities[facKey]}!`, "success");
    renderCeoModal();
  }

  // =====================================================================
  // 🏁 SIMULATION ENGINE: 24 GP CALENDAR & EXPRESS SIMULATION
  // =====================================================================
  function finalizeSeasonProgression(wccPos, wccPoints, wins, podiums, dnfs) {
    // 1. FOM Prize Money based on WCC Position
    // P1 = $140M, P2 = $130M, P3 = $120M, P4 = $110M, P5 = $100M, P6 = $90M, P7 = $80M, P8 = $75M, P9 = $70M, P10 = $65M
    const fomPrize = 145000000 - (wccPos * 8000000);
    const sponsorPayout = (CEO_STATE.sponsor && CEO_STATE.sponsor.payout) || 30000000;
    const payDriverMoney = (CEO_STATE.driver2 && CEO_STATE.driver2.isPay ? Math.abs(CEO_STATE.driver2.salary) : 0);

    // Academy loan income: each loaned junior brings $10M
    let academyLoanIncome = 0;
    let academyLoanCount = 0;
    if(CEO_STATE.academy && CEO_STATE.academy.juniors) {
      CEO_STATE.academy.juniors.forEach(j => {
        if(j.status === "loaned") {
          academyLoanIncome += (j.loanFee || 10000000);
          academyLoanCount++;
          j.ovr = Math.min(j.pot, j.ovr + 2); // real F1 championship experience
        } else if(j.status === "training") {
          if(Math.random() < 0.6) j.ovr = Math.min(j.pot, j.ovr + 1);
        }
      });
    }

    // US Capital commercial boost
    let usCapitalBoost = 0;
    if(CEO_STATE.investors && CEO_STATE.investors.deals && CEO_STATE.investors.deals.includes("us_capital")) {
      usCapitalBoost = 12000000;
    }

    // Sprint directive bonus
    let sprintBonus = 0;
    if(CEO_STATE.politics && CEO_STATE.politics.passedDirectives && CEO_STATE.politics.passedDirectives.includes("td_sprint_expansion")) {
      sprintBonus = 8000000;
    }

    const totalIncome = fomPrize + sponsorPayout + payDriverMoney + academyLoanIncome + usCapitalBoost + sprintBonus;

    // Expenses
    const engCost = (CEO_STATE.engine && CEO_STATE.engine.cost) || 20000000;
    const tdSalary = (CEO_STATE.techDirector && CEO_STATE.techDirector.salary) || 6000000;
    const tpSalary = (CEO_STATE.teamPrincipal && CEO_STATE.teamPrincipal.salary) || 5000000;
    const d1Salary = (CEO_STATE.driver1 && !CEO_STATE.driver1.isPay ? CEO_STATE.driver1.salary : 0);
    const d2Salary = (CEO_STATE.driver2 && !CEO_STATE.driver2.isPay ? CEO_STATE.driver2.salary : 0);
    const factoryOps = 32000000; // Base factory operation within $135M cost cap

    const totalExpenses = engCost + tdSalary + tpSalary + d1Salary + d2Salary + factoryOps;
    const netProfit = totalIncome - totalExpenses;

    CEO_STATE.budget += netProfit;

    // 2. Personal Dividends payout if NYSE IPO completed
    let personalDividend = 0;
    if(CEO_STATE.investors && CEO_STATE.investors.ipoDone) {
      personalDividend = 20000000;
      if(typeof S !== "undefined" && S) {
        S.bankAccount = (S.bankAccount || 0) + personalDividend;
      }
      CEO_STATE.investors.annualDividendPaid = (CEO_STATE.investors.annualDividendPaid || 0) + personalDividend;
    }

    // 3. Board of Directors Evaluation
    let boardDelta = 0;
    let boardComment = "";
    if(wccPos === 1) {
      boardDelta = +18;
      boardComment = "🏆 ЧЕМПИОНЫ МИРА! Совет директоров единогласно выражает вам безусловное доверие и выписывает рекордный премиальный бонус!";
      CEO_STATE.marketCap += 280000000;
    } else if(wccPos <= 3) {
      boardDelta = +12;
      boardComment = "🍾 Подиумный финиш в Кубке Конструкторов! Акционеры в восторге от спортивных результатов и капитализации бренда.";
      CEO_STATE.marketCap += 140000000;
    } else if(wccPos <= 5) {
      boardDelta = +4;
      boardComment = "Плотная борьба в топ-5. Бюджет соблюден, спонсоры удовлетворены эфирным временем.";
      CEO_STATE.marketCap += 40000000;
    } else if(wccPos <= 8) {
      boardDelta = -8;
      boardComment = "⚠️ Результат ниже ожиданий инвесторов. Акционеры требуют немедленно разобраться с темпом обновлений машины!";
      CEO_STATE.marketCap -= 20000000;
    } else {
      boardDelta = -18;
      boardComment = "🚨 КАТАСТРОФА В КУБКЕ КОНСТРУКТОРОВ! Худший результат в пелотоне. Совет директоров требует немедленной отставки главного инженера!";
      CEO_STATE.marketCap -= 70000000;
    }

    if(netProfit < -10000000) {
      boardDelta -= 8;
      boardComment += " Также совет обеспокоен финансовым дефицитом сезона.";
    }

    CEO_STATE.boardApproval = Math.max(10, Math.min(100, CEO_STATE.boardApproval + boardDelta));

    // 4. R&D Carryover to Next Year
    let nextYearBonus = 0;
    if(CEO_STATE.rd) {
      if(CEO_STATE.rd.focus === "next") nextYearBonus = 7;
      else if(CEO_STATE.rd.focus === "balanced") nextYearBonus = 3;
      else nextYearBonus = 0;

      // Reset R&D focus for next year to balanced
      CEO_STATE.rd.focus = "balanced";
      // Natural regulatory baseline evolution for next season
      const tdSkill = (CEO_STATE.techDirector && CEO_STATE.techDirector.skill) || 75;
      const facBonus = (CEO_STATE.facilities.windTunnel + CEO_STATE.facilities.cfdSupercomputer) * 1.5;
      CEO_STATE.carPerf = Math.min(99, Math.max(65, Math.round(62 + (tdSkill - 65) * 0.7 + facBonus + nextYearBonus)));
    }

    // 5. Refresh Academy candidates
    if(CEO_STATE.academy) {
      CEO_STATE.academy.candidates = generateAcademyCandidates();
    }

    // 6. Generate next season's FIA Directive proposal
    if(CEO_STATE.politics) {
      const nextDirIdx = (CEO_STATE.seasonNum) % FIA_DIRECTIVES_POOL.length;
      CEO_STATE.politics.activeDirective = Object.assign({}, FIA_DIRECTIVES_POOL[nextDirIdx]);
      CEO_STATE.politics.directiveVoted = false;
      CEO_STATE.politics.voteResult = null;
      CEO_STATE.politics.activeDilemma = null;
    }

    // Season summary object
    const summary = {
      seasonNum: CEO_STATE.seasonNum,
      year: CEO_STATE.year,
      wccPos: wccPos,
      wccPoints: wccPoints,
      wins: wins,
      podiums: podiums,
      dnfs: dnfs,
      income: totalIncome,
      expenses: totalExpenses,
      profit: netProfit,
      fomPrize: fomPrize,
      sponsorPayout: sponsorPayout,
      payDriverMoney: payDriverMoney,
      academyLoanIncome: academyLoanIncome,
      usCapitalBoost: usCapitalBoost,
      sprintBonus: sprintBonus,
      personalDividend: personalDividend,
      boardApproval: CEO_STATE.boardApproval,
      boardComment: boardComment,
      recommendedFiring: (wccPos >= 8)
    };

    CEO_STATE.history.unshift(summary);
    if(CEO_STATE.history.length > 25) {
      CEO_STATE.history.length = 25;
    }
    CEO_STATE.lastSeasonSummary = summary;
    CEO_STATE.seasonNum += 1;
    CEO_STATE.year += 1;
    CEO_STATE.calendarProgress = null;

    saveCeoState();
    renderCeoModal();
    openSeasonDebriefModal(summary);
  }

  function simulateCeoSeason() {
    if(!CEO_STATE) loadCeoState();

    // 1. Calculate final team pace index
    const tdSkill = (CEO_STATE.techDirector && CEO_STATE.techDirector.skill) || 75;
    const engPower = (CEO_STATE.engine && CEO_STATE.engine.power) || 90;
    const engRel = (CEO_STATE.engine && CEO_STATE.engine.rel) || 90;
    const facBonus = (CEO_STATE.facilities.windTunnel + CEO_STATE.facilities.cfdSupercomputer) * 2;
    const rdBonus = (CEO_STATE.rd && CEO_STATE.rd.focus === "current" ? 5 : (CEO_STATE.rd && CEO_STATE.rd.focus === "balanced" ? 2.5 : 0));

    const basePace = (tdSkill * 0.35) + (engPower * 0.35) + facBonus + (CEO_STATE.carPerf * 0.2) + rdBonus;
    
    // Drivers influence
    const d1Skill = (CEO_STATE.driver1 && CEO_STATE.driver1.ovr) || 80;
    const d2Skill = (CEO_STATE.driver2 && CEO_STATE.driver2.ovr) || 75;
    const teamOvrPace = (basePace * 0.7) + (((d1Skill + d2Skill) / 2) * 0.3);

    // 2. Determine WCC Position (1 to 10)
    let wccPos = 10;
    if(teamOvrPace >= 93) wccPos = Math.random() < 0.6 ? 1 : 2;
    else if(teamOvrPace >= 88) wccPos = Math.random() < 0.5 ? 3 : 4;
    else if(teamOvrPace >= 83) wccPos = Math.random() < 0.5 ? 5 : 6;
    else if(teamOvrPace >= 78) wccPos = Math.random() < 0.5 ? 7 : 8;
    else wccPos = Math.random() < 0.5 ? 9 : 10;

    // Reliability penalties
    const totalRel = (engRel * 0.5) + (CEO_STATE.carRel * 0.5);
    const dnfs = Math.max(1, Math.round((100 - totalRel) / 4) + Math.floor(Math.random() * 3));

    // Points, wins, podiums
    let wccPoints = 0;
    let wins = 0;
    let podiums = 0;

    if(wccPos === 1) { wccPoints = 580 + Math.floor(Math.random() * 80); wins = 12 + Math.floor(Math.random() * 6); podiums = 28 + Math.floor(Math.random() * 8); }
    else if(wccPos === 2) { wccPoints = 460 + Math.floor(Math.random() * 70); wins = 6 + Math.floor(Math.random() * 5); podiums = 20 + Math.floor(Math.random() * 6); }
    else if(wccPos === 3) { wccPoints = 350 + Math.floor(Math.random() * 60); wins = 2 + Math.floor(Math.random() * 4); podiums = 14 + Math.floor(Math.random() * 5); }
    else if(wccPos === 4) { wccPoints = 260 + Math.floor(Math.random() * 50); wins = Math.floor(Math.random() * 2); podiums = 8 + Math.floor(Math.random() * 4); }
    else if(wccPos === 5) { wccPoints = 170 + Math.floor(Math.random() * 40); podiums = Math.floor(Math.random() * 3); }
    else if(wccPos === 6) { wccPoints = 110 + Math.floor(Math.random() * 30); podiums = Math.floor(Math.random() * 2); }
    else if(wccPos === 7) { wccPoints = 65 + Math.floor(Math.random() * 25); }
    else if(wccPos === 8) { wccPoints = 35 + Math.floor(Math.random() * 15); }
    else if(wccPos === 9) { wccPoints = 14 + Math.floor(Math.random() * 10); }
    else { wccPoints = 2 + Math.floor(Math.random() * 6); }

    finalizeSeasonProgression(wccPos, wccPoints, wins, podiums, dnfs);
  }

  // =====================================================================
  // 🗓️ INTERACTIVE CALENDAR RACE WEEKEND SIMULATION
  // =====================================================================
  function initCalendarSeason() {
    if(!CEO_STATE) loadCeoState();
    CEO_STATE.calendarProgress = {
      currentRound: 1, // 1..24
      results: [],
      totalPoints: 0,
      wins: 0,
      podiums: 0,
      dnfs: 0,
      dilemmaTriggeredR8: false,
      dilemmaTriggeredR16: false
    };
    saveCeoState();
  }

  function simulateSingleRound() {
    if(!CEO_STATE.calendarProgress) initCalendarSeason();
    const cp = CEO_STATE.calendarProgress;
    if(cp.currentRound > 24) return;

    const roundIdx = cp.currentRound;
    const rndInfo = F1_CALENDAR_ROUNDS[roundIdx - 1];

    // Compute pace
    const tdSkill = (CEO_STATE.techDirector && CEO_STATE.techDirector.skill) || 75;
    const engPower = (CEO_STATE.engine && CEO_STATE.engine.power) || 90;
    const engRel = (CEO_STATE.engine && CEO_STATE.engine.rel) || 90;
    const facBonus = (CEO_STATE.facilities.windTunnel + CEO_STATE.facilities.cfdSupercomputer) * 1.5;
    const rdBonus = (CEO_STATE.rd && CEO_STATE.rd.focus === "current" ? 5 : (CEO_STATE.rd && CEO_STATE.rd.focus === "balanced" ? 2.5 : 0));
    const effPace = (tdSkill * 0.25) + (engPower * 0.25) + facBonus + (CEO_STATE.carPerf * 0.25) + rdBonus;

    // Reliability check
    const totalRel = (engRel * 0.5) + (CEO_STATE.carRel * 0.5);
    const c1Fail = (Math.random() * 100 > totalRel);
    const c2Fail = (Math.random() * 100 > totalRel);

    const ptsMap = { 1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1 };

    // Car 1
    let c1Pos = 12;
    let c1Pts = 0;
    if(c1Fail) {
      c1Pos = "DNF";
    } else {
      const d1Ovr = (CEO_STATE.driver1 && CEO_STATE.driver1.ovr) || 80;
      const score = (effPace * 0.5) + (d1Ovr * 0.4) + ((Math.random() - 0.5) * 10);
      if(score >= 95) c1Pos = 1;
      else if(score >= 92) c1Pos = 2;
      else if(score >= 89) c1Pos = 3;
      else if(score >= 86) c1Pos = 4;
      else if(score >= 83) c1Pos = 5;
      else if(score >= 80) c1Pos = 6;
      else if(score >= 77) c1Pos = 7;
      else if(score >= 74) c1Pos = 8;
      else if(score >= 71) c1Pos = 9;
      else if(score >= 68) c1Pos = 10;
      else c1Pos = 10 + Math.floor(Math.random() * 8);

      c1Pts = ptsMap[c1Pos] || 0;
    }

    // Car 2
    let c2Pos = 14;
    let c2Pts = 0;
    if(c2Fail) {
      c2Pos = "DNF";
    } else {
      const d2Ovr = (CEO_STATE.driver2 && CEO_STATE.driver2.ovr) || 75;
      const score = (effPace * 0.5) + (d2Ovr * 0.4) + ((Math.random() - 0.5) * 10);
      if(score >= 95) c2Pos = 1;
      else if(score >= 92) c2Pos = 2;
      else if(score >= 89) c2Pos = 3;
      else if(score >= 86) c2Pos = 4;
      else if(score >= 83) c2Pos = 5;
      else if(score >= 80) c2Pos = 6;
      else if(score >= 77) c2Pos = 7;
      else if(score >= 74) c2Pos = 8;
      else if(score >= 71) c2Pos = 9;
      else if(score >= 68) c2Pos = 10;
      else c2Pos = 10 + Math.floor(Math.random() * 8);

      c2Pts = ptsMap[c2Pos] || 0;
    }

    const roundPts = c1Pts + c2Pts;
    cp.totalPoints += roundPts;
    if(c1Pos === 1) cp.wins++;
    if(c2Pos === 1) cp.wins++;
    if(typeof c1Pos === "number" && c1Pos <= 3) cp.podiums++;
    if(typeof c2Pos === "number" && c2Pos <= 3) cp.podiums++;
    if(c1Pos === "DNF") cp.dnfs++;
    if(c2Pos === "DNF") cp.dnfs++;

    cp.results.push({
      round: roundIdx,
      name: rndInfo.name,
      flag: rndInfo.flag,
      track: rndInfo.track,
      type: rndInfo.type,
      c1Pos: c1Pos,
      c1Pts: c1Pts,
      c2Pos: c2Pos,
      c2Pts: c2Pts,
      roundPts: roundPts
    });

    cp.currentRound++;
    saveCeoState();
  }

  window.closeCeoCalendarModal = function() {
    const m = document.getElementById("ceoCalendarModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  window.openCeoCalendarModal = function() {
    if(!CEO_STATE) loadCeoState();
    if(!CEO_STATE.calendarProgress || CEO_STATE.calendarProgress.currentRound > 24) {
      initCalendarSeason();
    }

    let m = document.getElementById("ceoCalendarModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoCalendarModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoCalendarModal(); });
      document.body.appendChild(m);
    }

    renderCalendarModalContent();
    m.style.display = "flex";
  };

  function renderCalendarModalContent() {
    const m = document.getElementById("ceoCalendarModal");
    if(!m || !CEO_STATE || !CEO_STATE.calendarProgress) return;

    const cp = CEO_STATE.calendarProgress;
    const curRnd = cp.currentRound;
    const isCompleted = (curRnd > 24);

    let estWcc = "P10";
    if(cp.totalPoints >= 500) estWcc = "P1 🏆";
    else if(cp.totalPoints >= 400) estWcc = "P2 🥈";
    else if(cp.totalPoints >= 300) estWcc = "P3 🥉";
    else if(cp.totalPoints >= 220) estWcc = "P4";
    else if(cp.totalPoints >= 150) estWcc = "P5";
    else if(cp.totalPoints >= 90) estWcc = "P6";
    else if(cp.totalPoints >= 50) estWcc = "P7";
    else if(cp.totalPoints >= 25) estWcc = "P8";
    else if(cp.totalPoints >= 10) estWcc = "P9";

    m.innerHTML = `
      <div class="f1-modal-card ceo-calendar-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">FIA FORMULA 1 WORLD CHAMPIONSHIP CALENDAR</span>
            <h2>🗓️ СЕЗОН ${CEO_STATE.seasonNum} (${CEO_STATE.year}) · 24 ГРАН-ПРИ</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoCalendarModal()">✕</button>
        </div>

        <div class="ceo-cal-status-hero">
          <div class="csh-left">
            <span class="csh-label">ПРОГРЕСС ЧЕМПИОНАТА</span>
            <div class="csh-round-val">${isCompleted ? 'ФИНАЛ СЕЗОНА' : `ЭТАП ${curRnd} / 24`}</div>
            <div class="csh-sub">${isCompleted ? 'Все 24 Гран-при сезона завершены!' : `Следующий старт: ${F1_CALENDAR_ROUNDS[curRnd - 1].flag} ${F1_CALENDAR_ROUNDS[curRnd - 1].name}`}</div>
          </div>
          <div class="csh-stats-grid">
            <div class="csh-stat">
              <span class="csh-s-lbl">ОЧКИ КК</span>
              <span class="csh-s-val gold">${cp.totalPoints}</span>
            </div>
            <div class="csh-stat">
              <span class="csh-s-lbl">ОРИЕНТИР В КК</span>
              <span class="csh-s-val">${estWcc}</span>
            </div>
            <div class="csh-stat">
              <span class="csh-s-lbl">ПОБЕДЫ / ПОДИУМЫ</span>
              <span class="csh-s-val">${cp.wins} / ${cp.podiums}</span>
            </div>
            <div class="csh-stat">
              <span class="csh-s-lbl">СХОДЫ (DNF)</span>
              <span class="csh-s-val red">${cp.dnfs}</span>
            </div>
          </div>
        </div>

        <div class="ceo-cal-rounds-scroll">
          ${F1_CALENDAR_ROUNDS.map(r => {
            const res = cp.results.find(x => x.round === r.round);
            const isDone = !!res;
            const isCurrent = (cp.currentRound === r.round);
            return `
              <div class="ceo-cal-row ${isDone ? 'done' : isCurrent ? 'current' : 'future'}">
                <div class="ccr-num">#${r.round}</div>
                <div class="ccr-flag">${r.flag}</div>
                <div class="ccr-info">
                  <div class="ccr-name">${r.name}</div>
                  <div class="ccr-track">${r.track} · ${r.laps} кругов (${r.type})</div>
                </div>
                <div class="ccr-result">
                  ${isDone ? `
                    <div class="ccr-badge done">
                      <span>Кар 1: <b>${res.c1Pos === 'DNF' ? 'Сход' : 'P' + res.c1Pos}</b> (+${res.c1Pts})</span> · 
                      <span>Кар 2: <b>${res.c2Pos === 'DNF' ? 'Сход' : 'P' + res.c2Pos}</b> (+${res.c2Pts})</span>
                      <span class="ccr-pts-sum">+${res.roundPts} pts</span>
                    </div>
                  ` : isCurrent ? `
                    <div class="ccr-badge current">ГОТОВ К СТАРТУ</div>
                  ` : `
                    <div class="ccr-badge future">Ожидание</div>
                  `}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="ceo-cal-footer">
          ${!isCompleted ? `
            <button class="btn s-btn btn-sim-step" onclick="window.simulateCalendarStep(1)">
              🏎️ <b>ПРОВЕСТИ ЭТАП #${curRnd}</b>
            </button>
            <button class="btn s-btn btn-sim-batch" onclick="window.simulateCalendarStep(4)">
              ⏩ <b>СЕРИЯ (4 ГРАН-ПРИ)</b>
            </button>
            <button class="btn s-btn btn-sim-all" onclick="window.simulateCalendarStep(24)">
              🏁 <b>ДОСИМУЛИРОВАТЬ СЕЗОН ДО ФИНАЛА</b>
            </button>
          ` : `
            <button class="btn s-btn sc-buy btn-sim-finish" onclick="window.finishCalendarSeason()">
              🏆 <b>ПОДВЕСТИ ОФИЦИАЛЬНЫЕ ИТОГИ СЕЗОНА (СОВЕТ ДИРЕКТОРОВ)</b>
            </button>
          `}
        </div>
      </div>
    `;
  }

  window.simulateCalendarStep = function(count) {
    if(!CEO_STATE || !CEO_STATE.calendarProgress) return;
    const cp = CEO_STATE.calendarProgress;

    for(let i = 0; i < count; i++) {
      if(cp.currentRound > 24) break;

      simulateSingleRound();

      // Mid-season dilemmas triggers
      if(cp.currentRound === 9 && !cp.dilemmaTriggeredR8) {
        cp.dilemmaTriggeredR8 = true;
        saveCeoState();
        renderCalendarModalContent();
        window.openCeoDilemmaModal(EXECUTIVE_DILEMMAS_POOL[0]); // Driver civil war
        return;
      }
      if(cp.currentRound === 17 && !cp.dilemmaTriggeredR16) {
        cp.dilemmaTriggeredR16 = true;
        saveCeoState();
        renderCalendarModalContent();
        window.openCeoDilemmaModal(EXECUTIVE_DILEMMAS_POOL[1]); // Porpoising crisis
        return;
      }
    }

    renderCalendarModalContent();
  };

  window.finishCalendarSeason = function() {
    if(!CEO_STATE || !CEO_STATE.calendarProgress) return;
    const cp = CEO_STATE.calendarProgress;

    let wccPos = 10;
    if(cp.totalPoints >= 520) wccPos = 1;
    else if(cp.totalPoints >= 420) wccPos = 2;
    else if(cp.totalPoints >= 320) wccPos = 3;
    else if(cp.totalPoints >= 230) wccPos = 4;
    else if(cp.totalPoints >= 150) wccPos = 5;
    else if(cp.totalPoints >= 95)  wccPos = 6;
    else if(cp.totalPoints >= 55)  wccPos = 7;
    else if(cp.totalPoints >= 25)  wccPos = 8;
    else if(cp.totalPoints >= 10)  wccPos = 9;
    else wccPos = 10;

    window.closeCeoCalendarModal();
    finalizeSeasonProgression(wccPos, cp.totalPoints, cp.wins, cp.podiums, cp.dnfs);
  };

  // =====================================================================
  // ⚡ EXECUTIVE DILEMMAS & CRISIS MANAGEMENT MODAL
  // =====================================================================
  window.closeCeoDilemmaModal = function() {
    const m = document.getElementById("ceoDilemmaModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  window.openCeoDilemmaModal = function(dilemma) {
    if(!dilemma) return;
    let m = document.getElementById("ceoDilemmaModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDilemmaModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoDilemmaModal(); });
      document.body.appendChild(m);
    }

    m.innerHTML = `
      <div class="f1-modal-card ceo-dilemma-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">EXECUTIVE CRISIS MANAGEMENT // PADDOCK ALERT</span>
            <h2>${dilemma.icon} ${dilemma.title}</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoDilemmaModal()">✕</button>
        </div>

        <div class="ceo-dilemma-banner">
          <div class="cdb-desc">${dilemma.desc}</div>
        </div>

        <div class="ceo-dilemma-options">
          ${dilemma.options.map((opt, idx) => `
            <div class="ceo-dilemma-opt-box">
              <div class="cdo-info">
                <div class="cdo-title">${opt.title}</div>
                <div class="cdo-desc">${opt.desc}</div>
                ${opt.cost > 0 ? `<div class="cdo-cost">Затраты из бюджета: <b>-${formatMoney(opt.cost)}</b></div>` : ''}
              </div>
              <button class="btn s-btn cdo-btn" onclick="window.resolveCeoDilemma('${opt.effectType}', ${opt.cost || 0})">
                УТВЕРДИТЬ РЕШЕНИЕ
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    m.style.display = "flex";
  };

  window.resolveCeoDilemma = function(effectType, cost) {
    if(!CEO_STATE) loadCeoState();
    if(cost > 0 && CEO_STATE.budget < cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно средств в бюджете! Требуется ${formatMoney(cost)}.`, "error");
      return;
    }
    if(cost > 0) CEO_STATE.budget -= cost;

    let toastMsg = "Решение совета директоров приведено в исполнение!";
    if(effectType === "team_orders") {
      if(CEO_STATE.driver2) CEO_STATE.driver2.ovr = Math.max(65, CEO_STATE.driver2.ovr - 3);
      CEO_STATE.carRel = Math.min(99, CEO_STATE.carRel + 4);
      toastMsg = "Командная субординация введена! Надежность гаража повышена (+4%).";
    } else if(effectType === "free_fight") {
      CEO_STATE.boardApproval = Math.min(100, CEO_STATE.boardApproval + 5);
      CEO_STATE.marketCap += 15000000;
      toastMsg = "Пилотам разрешена свободная дуэль! Медийность конюшни выросла!";
    } else if(effectType === "fine_drivers") {
      CEO_STATE.budget += 3000000;
      toastMsg = "Пилоты оштрафованы на $1.5M каждый. В бюджет команды поступило $3,000,000.";
    } else if(effectType === "floor_fix") {
      CEO_STATE.carPerf = Math.min(99, CEO_STATE.carPerf + 5);
      toastMsg = "Днище модернизировано! Дельфинирование устранено (+5 к темпу машины)!";
    } else if(effectType === "raise_ride") {
      CEO_STATE.carPerf = Math.max(50, CEO_STATE.carPerf - 4);
      toastMsg = "Клиренс увеличен. Подпрыгивание ушло, но прижимная сила снижена (-4 perf).";
    } else if(effectType === "reprimand_aero") {
      CEO_STATE.boardApproval = Math.max(10, CEO_STATE.boardApproval - 6);
      toastMsg = "Шеф аэродинамики получил официальный выговор.";
    } else if(effectType === "legal_defense") {
      CEO_STATE.boardApproval = Math.min(100, CEO_STATE.boardApproval + 4);
      toastMsg = "Юристы выиграли дело в FIA! Репутация команды кристально чиста!";
    } else if(effectType === "aba_settlement") {
      CEO_STATE.carPerf = Math.max(50, CEO_STATE.carPerf - 2);
      toastMsg = "Сделка ABA заключена с FIA. Часы в трубе урезаны на 10%.";
    } else if(effectType === "gamble_tribunal") {
      if(Math.random() < 0.5) {
        CEO_STATE.boardApproval = Math.min(100, CEO_STATE.boardApproval + 8);
        toastMsg = "Трибунал FIA полностью оправдал конюшню без единого штрафа!";
      } else {
        CEO_STATE.boardApproval = Math.max(10, CEO_STATE.boardApproval - 12);
        CEO_STATE.marketCap -= 40000000;
        toastMsg = "Трибунал FIA признал нарушение! Наложен репутационный штраф.";
      }
    } else if(effectType === "counter_offer") {
      if(CEO_STATE.techDirector) CEO_STATE.techDirector.salary = Math.round(CEO_STATE.techDirector.salary * 1.35);
      CEO_STATE.carPerf = Math.min(99, CEO_STATE.carPerf + 3);
      toastMsg = "Главный инженер подписал новый контракт с повышенным окладом (+3 perf)!";
    } else if(effectType === "gardening_leave") {
      CEO_STATE.budget += 7000000;
      CEO_STATE.techDirector = Object.assign({}, DEFAULT_TECH_DIRECTORS[4]);
      toastMsg = "Получено $7,000,000 компенсации! Назначен временный главный инженер.";
    }

    if(CEO_STATE.politics) CEO_STATE.politics.activeDilemma = null;
    saveCeoState();
    window.closeCeoDilemmaModal();
    if(window.showF1Toast) window.showF1Toast(toastMsg, "success");
    renderCeoModal();
    if(document.getElementById("ceoCalendarModal") && document.getElementById("ceoCalendarModal").style.display === "flex") {
      renderCalendarModalContent();
    }
  };

  window.triggerRandomCeoDilemma = function() {
    const d = EXECUTIVE_DILEMMAS_POOL[Math.floor(Math.random() * EXECUTIVE_DILEMMAS_POOL.length)];
    if(CEO_STATE && CEO_STATE.politics) {
      CEO_STATE.politics.activeDilemma = d;
      saveCeoState();
    }
    window.openCeoDilemmaModal(d);
  };

  // =====================================================================
  // 🔬 R&D, ACADEMY, POLITICS & INVESTORS ACTION HANDLERS
  // =====================================================================
  window.setCeoRdFocus = function(focus) {
    if(!CEO_STATE) loadCeoState();
    CEO_STATE.rd.focus = focus;
    saveCeoState();
    renderCeoModal();
    const lblMap = {
      current: "🚀 Агрессивный пуш текущего сезона (+5 к темпу сейчас)",
      balanced: "⚖️ Сбалансированный фокус 50/50 (+2.5 сейчас, +3 база на будущий год)",
      next: "🔮 Переход на болид будущего года (+7 стартовая база следующего сезона)"
    };
    if(window.showF1Toast) window.showF1Toast(`Стратегия R&D: ${lblMap[focus]}`, "info");
  };

  window.installCeoPackage = function(pkgId) {
    if(!CEO_STATE) loadCeoState();
    const pkg = RD_SPEC_PACKAGES.find(p => p.id === pkgId);
    if(!pkg) return;

    if(CEO_STATE.rd.installedPackages.includes(pkgId)) {
      if(window.showF1Toast) window.showF1Toast("Данный аэродинамический пакет уже установлен на болид!", "info");
      return;
    }

    if(pkg.reqFac) {
      const curLvl = CEO_STATE.facilities[pkg.reqFac.key] || 1;
      if(curLvl < pkg.reqFac.min) {
        if(window.showF1Toast) window.showF1Toast(`Требуется модернизация базы: ${pkg.reqFac.label}!`, "error");
        return;
      }
    }

    if(CEO_STATE.budget < pkg.cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно бюджета! Требуется ${formatMoney(pkg.cost)}.`, "error");
      return;
    }

    CEO_STATE.budget -= pkg.cost;
    CEO_STATE.rd.installedPackages.push(pkgId);
    CEO_STATE.carPerf = Math.min(99, CEO_STATE.carPerf + pkg.perfBonus);
    CEO_STATE.carRel = Math.min(99, CEO_STATE.carRel + pkg.relBonus);
    CEO_STATE.marketCap += Math.round(pkg.cost * 1.4);

    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🔬 ${pkg.name} успешно изготовлен и омологирован FIA (+${pkg.perfBonus} к темпу)!`, "success");
    renderCeoModal();
  };

  window.upgradeCeoAcademyFacility = function() {
    if(!CEO_STATE) loadCeoState();
    const cur = (CEO_STATE.academy && CEO_STATE.academy.level) || 1;
    if(cur >= 5) {
      if(window.showF1Toast) window.showF1Toast("Академия пилотов модернизирована до максимального уровня (Tier 5)!", "info");
      return;
    }
    const costMap = { 1: 6000000, 2: 12000000, 3: 18000000, 4: 25000000 };
    const cost = costMap[cur] || 10000000;
    if(CEO_STATE.budget < cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно средств для модернизации академии! Требуется ${formatMoney(cost)}.`, "error");
      return;
    }

    CEO_STATE.budget -= cost;
    CEO_STATE.academy.level = cur + 1;
    CEO_STATE.marketCap += Math.round(cost * 1.5);
    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🎓 Академия пилотов модернизирована до Tier ${CEO_STATE.academy.level}! Качество подготовки юниоров выросло!`, "success");
    renderCeoModal();
  };

  window.trainJunior = function(juniorId) {
    if(!CEO_STATE) loadCeoState();
    const j = CEO_STATE.academy.juniors.find(x => x.id === juniorId);
    if(!j) return;
    const cost = 2500000;
    if(CEO_STATE.budget < cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно средств для тестов TPC! Требуется ${formatMoney(cost)}.`, "error");
      return;
    }
    if(j.ovr >= j.pot) {
      if(window.showF1Toast) window.showF1Toast(`${j.name} достиг своего максимального потенциала (${j.pot} OVR)!`, "info");
      return;
    }

    CEO_STATE.budget -= cost;
    const boost = Math.min(j.pot - j.ovr, 3 + Math.floor(Math.random() * 3));
    j.ovr += boost;
    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🏎️ Юниор ${j.name} провел 400 км тестов TPC в Сильверстоуне (+${boost} OVR -> ${j.ovr})!`, "success");
    renderCeoModal();
  };

  window.loanJunior = function(juniorId) {
    if(!CEO_STATE) loadCeoState();
    const j = CEO_STATE.academy.juniors.find(x => x.id === juniorId);
    if(!j) return;
    j.status = "loaned";
    j.loanTeam = "Williams Racing";
    j.loanFee = 10000000;
    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🤝 ${j.name} отправлен в аренду в Williams Racing! Конюшня будет получать +$10,000,000 / сезон.`, "success");
    renderCeoModal();
  };

  window.recallJunior = function(juniorId) {
    if(!CEO_STATE) loadCeoState();
    const j = CEO_STATE.academy.juniors.find(x => x.id === juniorId);
    if(!j) return;
    j.status = "training";
    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`↩️ ${j.name} отозван из аренды в расположение молодежной академии.`, "info");
    renderCeoModal();
  };

  window.promoteJuniorToCockpit = function(juniorId, seatIndex) {
    if(!CEO_STATE) loadCeoState();
    const j = CEO_STATE.academy.juniors.find(x => x.id === juniorId);
    if(!j) return;

    const promotedDriver = {
      id: "promoted_" + j.id,
      name: j.name,
      ovr: j.ovr,
      salary: 3500000,
      isPay: false,
      tag: "Выпускник Академии (Свой воспитанник)"
    };

    if(seatIndex === 1) CEO_STATE.driver1 = promotedDriver;
    else CEO_STATE.driver2 = promotedDriver;

    CEO_STATE.academy.juniors = CEO_STATE.academy.juniors.filter(x => x.id !== juniorId);
    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🍾 ВОСПИТАННИК АКАДЕМИИ В F1! ${j.name} подписал контракт боевого пилота в кокпит #${seatIndex}!`, "success");
    renderCeoModal();
  };

  window.releaseJunior = function(juniorId) {
    if(!CEO_STATE) loadCeoState();
    CEO_STATE.academy.juniors = CEO_STATE.academy.juniors.filter(x => x.id !== juniorId);
    saveCeoState();
    if(window.showF1Toast) window.showF1Toast("Контракт с юниором расторгнут.", "info");
    renderCeoModal();
  };

  window.signAcademyCandidate = function(candId) {
    if(!CEO_STATE) loadCeoState();
    const c = CEO_STATE.academy.candidates.find(x => x.id === candId);
    if(!c) return;

    if(CEO_STATE.academy.juniors.length >= 4) {
      if(window.showF1Toast) window.showF1Toast("Академия заполнена (максимум 4 места для юниоров)! Освободите место.", "error");
      return;
    }

    if(CEO_STATE.budget < c.cost) {
      if(window.showF1Toast) window.showF1Toast(`Недостаточно средств для подписания! Требуется ${formatMoney(c.cost)}.`, "error");
      return;
    }

    CEO_STATE.budget -= c.cost;
    const newJunior = {
      id: "j_" + c.id,
      name: c.name,
      flag: c.flag,
      age: c.age,
      ovr: c.ovr,
      pot: c.pot,
      salary: 1500000,
      status: "training",
      tag: c.tag
    };
    CEO_STATE.academy.juniors.push(newJunior);
    CEO_STATE.academy.candidates = CEO_STATE.academy.candidates.filter(x => x.id !== candId);

    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`✍️ Перспективный талант ${c.name} подписан в Молодежную Академию!`, "success");
    renderCeoModal();
  };

  window.voteCeoDirective = function(vote) {
    if(!CEO_STATE) loadCeoState();
    const pol = CEO_STATE.politics;
    if(!pol || !pol.activeDirective) return;
    if(pol.directiveVoted) return;

    const dir = pol.activeDirective;
    let votesFor = dir.aiVotesFor;
    let votesAgainst = dir.aiVotesAgainst;

    if(vote === "pro") {
      votesFor += 1;
    } else if(vote === "contra") {
      votesAgainst += 1;
    } else if(vote === "lobby") {
      if(CEO_STATE.budget < dir.costLobby) {
        if(window.showF1Toast) window.showF1Toast(`Недостаточно средств для лоббирования! Требуется ${formatMoney(dir.costLobby)}.`, "error");
        return;
      }
      CEO_STATE.budget -= dir.costLobby;
      votesFor += 3;
    }

    const passed = (votesFor > votesAgainst);
    pol.directiveVoted = true;
    pol.voteResult = {
      passed: passed,
      votesFor: votesFor,
      votesAgainst: votesAgainst
    };

    if(passed) {
      if(!pol.passedDirectives) pol.passedDirectives = [];
      pol.passedDirectives.push(dir.id);

      if(dir.id === "td_flex_wings") {
        if(CEO_STATE.carPerf > 85) CEO_STATE.carPerf -= 2;
      } else if(dir.id === "td_engine_rel") {
        CEO_STATE.carRel = Math.min(99, CEO_STATE.carRel + 5);
      } else if(dir.id === "td_active_aero") {
        if(CEO_STATE.facilities.cfdSupercomputer >= 3) {
          CEO_STATE.carPerf = Math.min(99, CEO_STATE.carPerf + 5);
        }
      }
    }

    saveCeoState();
    const msg = passed ? `🏛️ Директива «${dir.code}» ПРИНЯТА Комиссией F1 (${votesFor} ЗА против ${votesAgainst} ПРОТИВ)!` : `🏛️ Директива «${dir.code}» ОТКЛОНЕНА Комиссией F1 (${votesFor} ЗА против ${votesAgainst} ПРОТИВ)!`;
    if(window.showF1Toast) window.showF1Toast(msg, passed ? "success" : "info");
    renderCeoModal();
  };

  window.sellMinorityEquity = function(dealId) {
    if(!CEO_STATE) loadCeoState();
    const inv = CEO_STATE.investors;
    if(inv.deals && inv.deals.includes(dealId)) {
      if(window.showF1Toast) window.showF1Toast("Эта инвестиционная сделка уже была реализована!", "info");
      return;
    }

    if(dealId === "swo_fund") {
      CEO_STATE.budget += 95000000;
      inv.equitySold = (inv.equitySold || 0) + 10;
      inv.deals.push("swo_fund");
      CEO_STATE.marketCap += 110000000;
      CEO_STATE.boardApproval = Math.max(10, CEO_STATE.boardApproval - 4);
      if(window.showF1Toast) window.showF1Toast("💰 Сделка закрыта: Суверенный фонд инвестировал $95,000,000 за 10% акций конюшни!", "success");
    } else if(dealId === "us_capital") {
      CEO_STATE.budget += 140000000;
      inv.equitySold = (inv.equitySold || 0) + 15;
      inv.deals.push("us_capital");
      CEO_STATE.marketCap += 180000000;
      if(window.showF1Toast) window.showF1Toast("💰 Консорциум из США выкупил 15% за $140,000,000 и обеспечил +$12M ежегодных спонсорских прав!", "success");
    }

    saveCeoState();
    renderCeoModal();
  };

  window.launchWallStreetIpo = function() {
    if(!CEO_STATE) loadCeoState();
    const inv = CEO_STATE.investors;
    if(inv.ipoDone) {
      if(window.showF1Toast) window.showF1Toast("Конюшня уже публично торгуется на New York Stock Exchange!", "info");
      return;
    }

    if(CEO_STATE.marketCap < 1500000000) {
      if(window.showF1Toast) window.showF1Toast("Оценка франшизы должна быть не менее $1.5B (Миллиардов)!", "error");
      return;
    }
    if(CEO_STATE.boardApproval < 75) {
      if(window.showF1Toast) window.showF1Toast("Совет директоров требует доверия не менее 75% для выхода на биржу!", "error");
      return;
    }

    inv.ipoDone = true;
    CEO_STATE.budget += 250000000;
    CEO_STATE.marketCap += 350000000;

    const personalPayout = 50000000;
    if(typeof S !== "undefined" && S) {
      S.bankAccount = (S.bankAccount || 0) + personalPayout;
    }

    saveCeoState();
    if(window.showF1Toast) window.showF1Toast(`🔔 ИСТОРИЧЕСКИЙ ЗВОНОК НА NYSE! Команда провела IPO ($GLRY)! На ваш личный счет поступило $50,000,000!`, "success");
    renderCeoModal();
  };

  window.setCeoSimMode = function(mode) {
    if(!CEO_STATE) loadCeoState();
    CEO_STATE.simMode = mode;
    saveCeoState();
    renderCeoPage();
  };

  window.closeCeoDebriefModal = function() {
    const m = document.getElementById("ceoDebriefModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openSeasonDebriefModal(summary) {
    let m = document.getElementById("ceoDebriefModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "ceoDebriefModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeCeoDebriefModal(); });
      document.body.appendChild(m);
    }

    const isSuccess = (summary.wccPos <= 3);
    const isCrisis = (summary.wccPos >= 8);

    m.innerHTML = `
      <div class="f1-modal-card ceo-debrief-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">ANNUAL FIA CONSTRUCTORS CHAMPIONSHIP REVIEW</span>
            <h2>🏁 ИТОГИ СЕЗОНА ${summary.year - 1} · СОВЕТ ДИРЕКТОРОВ</h2>
          </div>
          <button class="rank-x" onclick="window.closeCeoDebriefModal()">✕</button>
        </div>

        <div class="ceo-debrief-hero ${isSuccess ? 'hero-gold' : isCrisis ? 'hero-crisis' : ''}">
          <div class="cdh-pos">P${summary.wccPos}</div>
          <div class="cdh-details">
            <div class="cdh-wcc">Кубок Конструкторов FIA Formula 1</div>
            <div class="cdh-stats">
              <span>Очки: <b>${summary.wccPoints}</b></span> · 
              <span>Победы: <b>${summary.wins}</b></span> · 
              <span>Подиумы: <b>${summary.podiums}</b></span> · 
              <span>Сходы: <b>${summary.dnfs}</b></span>
            </div>
          </div>
        </div>

        <div class="ceo-finance-breakdown">
          <div class="cfb-box">
            <span class="cfb-lbl">ПРИЗОВЫЕ FOM + СПОНСОРЫ</span>
            <div class="cfb-val cfb-green">+${formatMoney(summary.income)}</div>
          </div>
          <div class="cfb-box">
            <span class="cfb-lbl">РАСХОДЫ (ОКЛАДЫ, МОТОР, ЗАВОД)</span>
            <div class="cfb-val cfb-red">-${formatMoney(summary.expenses)}</div>
          </div>
          <div class="cfb-box">
            <span class="cfb-lbl">ЧИСТАЯ ПРИБЫЛЬ / УБЫТОК</span>
            <div class="cfb-val ${summary.profit >= 0 ? 'cfb-gold' : 'cfb-red'}">${summary.profit >= 0 ? '+' : ''}${formatMoney(summary.profit)}</div>
          </div>
        </div>

        ${summary.academyLoanIncome > 0 || summary.usCapitalBoost > 0 || summary.personalDividend > 0 ? `
          <div class="ceo-special-payouts-box">
            ${summary.academyLoanIncome > 0 ? `<div class="csp-item">🎓 Аренда юниоров академии: <b>+${formatMoney(summary.academyLoanIncome)}</b></div>` : ''}
            ${summary.usCapitalBoost > 0 ? `<div class="csp-item">🇺🇸 Медиа-права US Capital: <b>+${formatMoney(summary.usCapitalBoost)}</b></div>` : ''}
            ${summary.personalDividend > 0 ? `<div class="csp-item gold">🏛️ Личные дивиденды основателя на счёт: <b>+${formatMoney(summary.personalDividend)}</b></div>` : ''}
          </div>
        ` : ''}

        <div class="ceo-board-verdict-box ${isCrisis ? 'crisis' : ''}">
          <div class="cbv-title">🏛️ РЕЗОЛЮЦИЯ СОВЕТА АКЦИОНЕРОВ (Одобрение: ${summary.boardApproval}%)</div>
          <div class="cbv-text">${summary.boardComment}</div>
        </div>

        <div class="ceo-debrief-actions">
          ${summary.recommendedFiring ? `
            <button class="btn s-btn ceo-fire-btn" onclick="window.closeCeoDebriefModal(); window.fireCeoTechDirector();">
              ⚠️ УВОЛИТЬ ГЛАВНОГО ИНЖЕНЕРА (СОВЕТ НАСТАИВАЕТ)
            </button>
          ` : ''}
          <button class="btn s-btn sc-buy" onclick="window.closeCeoDebriefModal()">
            ПРОДОЛЖИТЬ В КАБИНЕТ CEO
          </button>
        </div>
      </div>
    `;

    m.style.display = "flex";
  }

  // =====================================================================
  // TEAM CREATION & REBRANDING MODAL
  // =====================================================================
  let tempTeamData = {
    name: "",
    hqId: "silverstone",
    liveryId: "teal",
    storyId: "buyout"
  };

  window.closeTeamCreationModal = function() {
    const m = document.getElementById("teamCreationModal");
    if(m) {
      m.style.display = "none";
      m.innerHTML = "";
    }
  };

  function openTeamCreationModal(isEditing) {
    if(!CEO_STATE) loadCeoState();

    tempTeamData = {
      name: CEO_STATE.teamName || getDefaultTeamName(),
      hqId: (HQ_LOCATIONS.find(h => (CEO_STATE.teamHq || '').includes(h.name)) || HQ_LOCATIONS[0]).id,
      liveryId: CEO_STATE.teamLivery || "teal",
      storyId: (ORIGIN_STORIES.find(s => s.title === CEO_STATE.teamStory) || ORIGIN_STORIES[0]).id
    };

    let m = document.getElementById("teamCreationModal");
    if(!m) {
      m = document.createElement("div");
      m.id = "teamCreationModal";
      m.className = "f1-modal-overlay";
      m.addEventListener("click", e => { if(e.target === m) window.closeTeamCreationModal(); });
      document.body.appendChild(m);
    }

    renderTeamCreationModal(isEditing);
    m.style.display = "flex";
  }

  function renderTeamCreationModal(isEditing) {
    const m = document.getElementById("teamCreationModal");
    if(!m) return;

    const hq = HQ_LOCATIONS.find(h => h.id === tempTeamData.hqId) || HQ_LOCATIONS[0];
    const livery = LIVERY_PALETTES.find(l => l.id === tempTeamData.liveryId) || LIVERY_PALETTES[0];
    const story = ORIGIN_STORIES.find(s => s.id === tempTeamData.storyId) || ORIGIN_STORIES[0];
    const presets = getTeamNamePresets();

    m.innerHTML = `
      <div class="f1-modal-card team-creation-card">
        <div class="wealth-head">
          <div>
            <span class="f1-mono-sub">FIA CONSTRUCTOR ENTRY & BRAND IDENTITY</span>
            <h2>${isEditing ? '✏️ РЕБРЕНДИНГ И НАСТРОЙКА КОМАНДЫ' : '🏛️ УЧРЕЖДЕНИЕ И БРЕНДИНГ КОМАНДЫ ФОРМУЛЫ-1'}</h2>
          </div>
          <button class="rank-x" onclick="window.closeTeamCreationModal()">✕</button>
        </div>

        <div class="tc-modal-body">
          <!-- Live Preview Banner -->
          <div class="tc-preview-card" style="background: ${livery.preview};">
            <div class="tcp-top">
              <span class="tcp-lic">FIA SUPER ENTRY // LICENSED CONSTRUCTOR</span>
              <span class="tcp-flag">${hq.flag}</span>
            </div>
            <div class="tcp-name">${tempTeamData.name || 'Shelby F1 Team'}</div>
            <div class="tcp-bottom">
              <span class="tcp-hq">📍 ${hq.name} (${hq.country})</span>
              <span class="tcp-story">${story.title}</span>
            </div>
          </div>

          <!-- Section 1: Team Name & Presets -->
          <div class="tc-section">
            <label class="tc-label">НАЗВАНИЕ КОНЮШНИ (TEAM NAME)</label>
            <input type="text" id="tcInputName" class="f1-text-input tc-name-input" maxlength="32" value="${tempTeamData.name}" oninput="window.updateTcName(this.value)" placeholder="Например: Shelby F1 Team">
            <div class="tc-presets-label">БЫСТРЫЕ ВАРИАНТЫ:</div>
            <div class="tc-presets-strip">
              ${presets.map(p => `
                <button type="button" class="tc-preset-chip" onclick="window.applyTcPreset('${p}')">${p}</button>
              `).join("")}
            </div>
          </div>

          <!-- Section 2: Headquarters & Country -->
          <div class="tc-section">
            <label class="tc-label">ШТАБ-КВАРТИРА И СТРАНА РЕГИСТРАЦИИ (HQ & LICENSE)</label>
            <div class="tc-hq-grid">
              ${HQ_LOCATIONS.map(h => {
                const isSel = (h.id === tempTeamData.hqId);
                return `
                  <div class="tc-hq-card ${isSel ? 'selected' : ''}" onclick="window.setTcHq('${h.id}')">
                    <div class="thc-head">
                      <span class="thc-flag">${h.flag}</span>
                      <span class="thc-name">${h.name}</span>
                    </div>
                    <div class="thc-country">${h.country}</div>
                    <div class="thc-desc">${h.desc}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Section 3: Livery Palette -->
          <div class="tc-section">
            <label class="tc-label">ФИРМЕННАЯ РАСЦВЕТКА И ЛИВРЕЯ БОЛИДА</label>
            <div class="tc-livery-strip">
              ${LIVERY_PALETTES.map(l => {
                const isSel = (l.id === tempTeamData.liveryId);
                return `
                  <div class="tc-livery-chip ${isSel ? 'selected' : ''}" onclick="window.setTcLivery('${l.id}')">
                    <span class="tc-color-dot" style="background: ${l.primary};"></span>
                    <span class="tc-color-name">${l.name}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Section 4: Origin Story -->
          <div class="tc-section">
            <label class="tc-label">ИСТОРИЯ ПРИХОДА В ЧЕМПИОНАТ (TEAM ORIGIN)</label>
            <div class="tc-story-grid">
              ${ORIGIN_STORIES.map(s => {
                const isSel = (s.id === tempTeamData.storyId);
                return `
                  <div class="tc-story-card ${isSel ? 'selected' : ''}" onclick="window.setTcStory('${s.id}')">
                    <div class="tsc-tag">${s.tag}</div>
                    <div class="tsc-title">${s.title}</div>
                    <div class="tsc-desc">${s.desc}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="tc-modal-footer">
          <button class="btn btn-ceo-confirm" onclick="window.confirmTeamCreation(${isEditing})">
            🏛️ ${isEditing ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ И ВЕРНУТЬСЯ' : 'УТВЕРДИТЬ В FIA И ПРИНЯТЬ УПРАВЛЕНИЕ КОМАНДОЙ'}
          </button>
        </div>
      </div>
    `;
  }

  // =====================================================================
  // MAIN CEO DASHBOARD MODAL
  // =====================================================================
  // =====================================================================
  // STANDALONE FULLSCREEN CEO PAGE
  // =====================================================================
  let activeCeoTab = "overview"; // "overview", "factory", "politics", "academy", "board", "legacy"

  function createCeoPageDOM() {
    let page = document.getElementById("ceoPage");
    if(!page) {
      page = document.createElement("section");
      page.id = "ceoPage";
      page.className = "ceo-fullscreen-page";
      page.style.display = "none";
      const carSec = document.getElementById("career");
      if(carSec && carSec.parentNode) {
        carSec.parentNode.insertBefore(page, carSec.nextSibling);
      } else {
        document.body.appendChild(page);
      }
    }

    let container = document.getElementById("ceoPageContainer");
    if(!container) {
      container = document.createElement("div");
      container.id = "ceoPageContainer";
      container.className = "ceo-page-container";
      page.appendChild(container);
    }

    if(container.querySelector(".ceo-page-header")) return;

    container.innerHTML = `
      <div class="ceo-page-header">
        <div class="ceo-brand-identity">
          <div class="ceo-flag-badge" id="ceoTeamFlagVal">🇬🇧</div>
          <div class="ceo-brand-info">
            <div class="ceo-fia-status">
              <span>FIA FORMULA 1 CONSTRUCTOR · CHAIR OF THE BOARD & CEO</span>
              <span id="ceoIpoHeaderBadge"></span>
            </div>
            <div class="ceo-title-row">
              <h1 class="ceo-team-title" id="ceoTeamNameVal">Shelby F1 Team</h1>
              <button class="ceo-edit-brand-btn" onclick="window.openTeamCreationModal(true)" title="Ребрендинг команды, смена названия и ливреи">✏️ Настроить бренд</button>
            </div>
            <div class="ceo-hq-sub" id="ceoTeamHqVal">📍 База: Сильверстоун (Великобритания) · Ливрея: Petronas Teal</div>
          </div>
        </div>
        <div class="ceo-top-actions">
          <button class="btn ceo-top-btn" onclick="window.switchCeoTab('legacy')" title="Послужной список и трофеи завершенной карьеры пилота">🏆 Зал славы пилота</button>
          <button class="btn ceo-top-btn ghost" onclick="window.exitCeoToMenu()" title="Сохранить и выйти в главное меню">🚪 В главное меню</button>
        </div>
      </div>

      <!-- Metric KPI Cards -->
      <div class="ceo-kpi-banner">
        <div class="ceo-kpi-box">
          <span class="wb-lbl">БЮДЖЕТ КОМАНДЫ (CAPEX & OPEX)</span>
          <div class="wb-val" id="ceoBudgetVal">$0</div>
          <span class="ceo-kpi-sub">Лимит расходов FIA $135M</span>
        </div>
        <div class="ceo-kpi-box">
          <span class="wb-lbl">КАПИТАЛИЗАЦИЯ ФРАНШИЗЫ</span>
          <div class="wb-val val-blue" id="ceoMarketCapVal">$0</div>
          <span class="ceo-kpi-sub">Оценка Forbes / Wall Street</span>
        </div>
        <div class="ceo-kpi-box">
          <span class="wb-lbl">ДОВЕРИЕ СОВЕТА ДИРЕКТОРОВ</span>
          <div class="wb-val val-gold" id="ceoApprovalVal">80%</div>
          <span class="ceo-kpi-sub">Резолюция акционеров</span>
        </div>
        <div class="ceo-kpi-box">
          <span class="wb-lbl">СЕЗОН ЧЕМПИОНАТА</span>
          <div class="wb-val" id="ceoSeasonVal">Сезон 1 · 2026</div>
          <span class="ceo-kpi-sub">Календарь из 24 Гран-при</span>
        </div>
      </div>

      <!-- Tabs Navigation (6 Fullscreen Modules) -->
      <div class="wealth-nav-tabs ceo-nav-tabs">
        <button class="wealth-tab-btn active" id="tabCeoOverview" onclick="window.switchCeoTab('overview')">🏎️ Штаб и Болид</button>
        <button class="wealth-tab-btn" id="tabCeoFactory" onclick="window.switchCeoTab('factory')">🏭 База и R&D</button>
        <button class="wealth-tab-btn" id="tabCeoPolitics" onclick="window.switchCeoTab('politics')">🏛️ Политика FIA</button>
        <button class="wealth-tab-btn" id="tabCeoAcademy" onclick="window.switchCeoTab('academy')">🎓 Академия пилотов</button>
        <button class="wealth-tab-btn" id="tabCeoBoard" onclick="window.switchCeoTab('board')">📈 Совет и Инвесторы</button>
        <button class="wealth-tab-btn" id="tabCeoLegacy" onclick="window.switchCeoTab('legacy')">🏆 Наследие</button>
      </div>

      <div class="ceo-page-body" id="ceoTabContent"></div>

      <!-- Footer Control Bar with Simulation Mode Switcher -->
      <div class="ceo-page-footer">
        <div class="ceo-footer-flex">
          <div class="ceo-mode-switch">
            <span class="ceo-mode-lbl">СИМУЛЯЦИЯ:</span>
            <div class="ceo-mode-btns">
              <button class="ceo-mode-pill" id="ceoSimModeExpress" onclick="window.setCeoSimMode('express')">⚡ Экспресс (1 клик)</button>
              <button class="ceo-mode-pill active" id="ceoSimModeCalendar" onclick="window.setCeoSimMode('calendar')">🗓️ Календарь (24 этапа)</button>
            </div>
          </div>
          <button class="btn s-btn btn-ceo-sim" id="ceoSimMainBtn" onclick="window.runCeoSeasonSimulation()">
            🏁 <b>СИМУЛИРОВАТЬ СЕЗОН ЧЕМПИОНАТА</b>
          </button>
        </div>
      </div>
    `;
  }

  function renderCeoPage() {
    createCeoPageDOM();
    if(!CEO_STATE) loadCeoState();

    const flagEl = document.getElementById("ceoTeamFlagVal");
    if(flagEl) flagEl.textContent = CEO_STATE.teamFlag || "🇬🇧";
    const nameEl = document.getElementById("ceoTeamNameVal");
    if(nameEl) nameEl.textContent = CEO_STATE.teamName;
    const liveryObj = LIVERY_PALETTES.find(l => l.id === CEO_STATE.teamLivery) || LIVERY_PALETTES[0];
    const hqEl = document.getElementById("ceoTeamHqVal");
    if(hqEl) hqEl.textContent = `📍 База: ${CEO_STATE.teamHq || 'Сильверстоун (Великобритания)'} · Ливрея: ${liveryObj.name}`;

    const bVal = document.getElementById("ceoBudgetVal");
    if(bVal) bVal.textContent = formatMoney(CEO_STATE.budget);
    const mVal = document.getElementById("ceoMarketCapVal");
    if(mVal) mVal.textContent = formatMoney(CEO_STATE.marketCap);
    const aVal = document.getElementById("ceoApprovalVal");
    if(aVal) aVal.textContent = `${CEO_STATE.boardApproval}%`;
    const sVal = document.getElementById("ceoSeasonVal");
    if(sVal) sVal.textContent = `Сезон ${CEO_STATE.seasonNum} · ${CEO_STATE.year}`;

    // IPO badge in header
    const ipoBadgeEl = document.getElementById("ceoIpoHeaderBadge");
    if(ipoBadgeEl) {
      if(CEO_STATE.investors && CEO_STATE.investors.ipoDone) {
        ipoBadgeEl.innerHTML = `<span class="ceo-ipo-pill">🏛️ NYSE: $GLRY</span>`;
      } else {
        ipoBadgeEl.innerHTML = "";
      }
    }

    // Simulation mode toggle buttons
    const expressBtn = document.getElementById("ceoSimModeExpress");
    const calBtn = document.getElementById("ceoSimModeCalendar");
    const mainSimBtn = document.getElementById("ceoSimMainBtn");
    const isExpress = (CEO_STATE.simMode === "express");

    if(expressBtn && calBtn) {
      if(isExpress) {
        expressBtn.classList.add("active");
        calBtn.classList.remove("active");
      } else {
        expressBtn.classList.remove("active");
        calBtn.classList.add("active");
      }
    }
    if(mainSimBtn) {
      mainSimBtn.innerHTML = isExpress ? 
        `⚡ <b>ЭКСПРЕСС-СИМУЛЯЦИЯ СЕЗОНА ${CEO_STATE.year}</b>` : 
        `🗓️ <b>ОТКРЫТЬ КАЛЕНДАРЬ ЧЕМПИОНАТА (24 ЭТАПА)</b>`;
    }

    // Update tab buttons
    ["overview", "factory", "politics", "academy", "board", "legacy"].forEach(t => {
      const btn = document.getElementById("tabCeo" + t.charAt(0).toUpperCase() + t.slice(1));
      if(btn) {
        if(t === activeCeoTab) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });

    const body = document.getElementById("ceoTabContent");
    if(!body) return;

    body.textContent = "";

    if(activeCeoTab === "overview") {
      renderOverviewTab(body);
    } else if(activeCeoTab === "factory") {
      renderFactoryTab(body);
    } else if(activeCeoTab === "politics") {
      renderPoliticsTab(body);
    } else if(activeCeoTab === "academy") {
      renderAcademyTab(body);
    } else if(activeCeoTab === "board") {
      renderBoardTab(body);
    } else {
      renderLegacyTab(body);
    }
  }

  window.renderCeoModal = renderCeoPage; // backward compatibility

  function renderOverviewTab(container) {
    const td = CEO_STATE.techDirector;
    const tp = CEO_STATE.teamPrincipal;
    const d1 = CEO_STATE.driver1;
    const d2 = CEO_STATE.driver2;

    let specBadge = "Spec A (Базовая)";
    if(CEO_STATE.rd && CEO_STATE.rd.installedPackages) {
      if(CEO_STATE.rd.installedPackages.includes("pkg_sidepods")) {
        specBadge = "Spec C (Undercut Aero)";
      } else if(CEO_STATE.rd.installedPackages.includes("pkg_floor_v2")) {
        specBadge = "Spec B (Venturi Ground Effect)";
      }
    }

    container.innerHTML = `
      <div class="ceo-content-stack">
        <!-- Car Telemetry Card -->
        <div class="ceo-car-hero">
          <div class="cch-head">
            <div class="cch-title-wrap">
              <span class="f1-mono-sub">CHASSIS & AERODYNAMICS TELEMETRY</span>
              <div class="cch-title">🏎️ БОЛИД ЧЕМПИОНАТА // ТЕМП И НАДЕЖНОСТЬ</div>
            </div>
            <div class="cch-quick-tags">
              <span class="cch-tag cch-tag-spec">Пакет: <b>${specBadge}</b></span>
              <span class="cch-tag">Мотор: <b>${CEO_STATE.engine ? CEO_STATE.engine.name.split(' ')[0] : 'F1'}</b></span>
              <span class="cch-tag">Труба: <b>Tier ${CEO_STATE.facilities.windTunnel}/5</b></span>
              <span class="cch-tag">CFD: <b>Tier ${CEO_STATE.facilities.cfdSupercomputer}/5</b></span>
            </div>
          </div>

          <div class="cch-meters">
            <div class="cch-meter-item">
              <div class="cch-lbl-row">
                <span>Скорость в поворотах и прижимная сила (Car Performance)</span>
                <b>${CEO_STATE.carPerf} <small>/ 100</small></b>
              </div>
              <div class="cch-bar-track">
                <div class="cch-bar-fill cch-fill-teal" style="width: ${CEO_STATE.carPerf}%;"></div>
              </div>
            </div>

            <div class="cch-meter-item">
              <div class="cch-lbl-row">
                <span>Механическая надежность шасси и силовой установки (Reliability)</span>
                <b>${CEO_STATE.carRel}%</b>
              </div>
              <div class="cch-bar-track">
                <div class="cch-bar-fill cch-fill-green" style="width: ${CEO_STATE.carRel}%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2x2 Executive Suite -->
        <div class="ceo-exec-grid">
          <!-- 1. Chief Technical Officer (CTO) -->
          <div class="ceo-exec-card staff-cto ${td.skill >= 90 ? 'elite' : ''}">
            <div class="cec-top">
              <span class="cec-role-badge badge-cto">🛠️ ГЛАВНЫЙ ИНЖЕНЕР (CTO)</span>
              <span class="cec-salary">${formatMoney(td.salary)}/год</span>
            </div>
            <div class="cec-name">${td.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Рейтинг: <b>${td.skill}/100</b></span>
              <span class="cec-pill trait-pill">${td.trait}</span>
            </div>
            <div class="cec-desc">${td.desc || "Руководит конструкторским бюро и отвечает за аэродинамический пакет болида."}</div>
            <div class="cec-footer">
              <button class="btn ceo-fire-btn" onclick="window.fireCeoTechDirector()">
                ⚠️ УВОЛИТЬ ГЛАВНОГО ИНЖЕНЕРА
              </button>
            </div>
          </div>

          <!-- 2. Team Principal (TP) -->
          <div class="ceo-exec-card staff-tp">
            <div class="cec-top">
              <span class="cec-role-badge badge-tp">👔 РУКОВОДИТЕЛЬ КОМАНДЫ (TP)</span>
              <span class="cec-salary">${formatMoney(tp.salary)}/год</span>
            </div>
            <div class="cec-name">${tp.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Авторитет в FIA: <b>${tp.skill}/100</b></span>
              <span class="cec-pill trait-pill">${tp.trait}</span>
            </div>
            <div class="cec-desc">${tp.desc || "Контролирует пит-лейн, политику в паддоке и операционную работу гаража."}</div>
            <div class="cec-footer">
              <button class="btn ceo-neutral-btn" onclick="window.fireCeoTeamPrincipal()">
                Сменить Team Principal
              </button>
            </div>
          </div>

          <!-- 3. Driver 1 (Lead Driver) -->
          <div class="ceo-exec-card driver-lead">
            <div class="cec-top">
              <span class="cec-role-badge badge-d1">🏁 ПИЛОТ №1 (ЛИДЕР)</span>
              <span class="cec-salary">${formatMoney(d1.salary)}/год</span>
            </div>
            <div class="cec-name">${d1.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Мастерство: <b>${d1.ovr} OVR</b></span>
              <span class="cec-pill trait-pill">${d1.tag}</span>
            </div>
            <div class="cec-desc">Главная ударная сила команды в борьбе за победы и очки в Личном зачёте.</div>
            <div class="cec-footer">
              <button class="btn ceo-neutral-btn" onclick="window.openCeoDriverMarket(1)">
                Сменить пилота №1
              </button>
            </div>
          </div>

          <!-- 4. Driver 2 (Second Driver / Pay Driver) -->
          <div class="ceo-exec-card driver-second ${d2.isPay ? 'pay-card' : ''}">
            <div class="cec-top">
              <span class="cec-role-badge ${d2.isPay ? 'badge-pay' : 'badge-d2'}">
                ${d2.isPay ? '💰 ПИЛОТ №2 (PAY DRIVER)' : '🏁 ПИЛОТ №2 (ВТОРОЙ НОМЕР)'}
              </span>
              <span class="cec-salary ${d2.isPay ? 'pay-green' : ''}">
                ${d2.isPay ? `+${formatMoney(Math.abs(d2.salary))}/год` : `${formatMoney(d2.salary)}/год`}
              </span>
            </div>
            <div class="cec-name">${d2.name}</div>
            <div class="cec-pills">
              <span class="cec-pill">Мастерство: <b>${d2.ovr} OVR</b></span>
              <span class="cec-pill trait-pill">${d2.tag}</span>
            </div>
            <div class="cec-desc">
              ${d2.isPay ? 'Приносит спонсорские миллионы в бюджет конюшни, помогая компенсировать лимит расходов.' : 'Надежный второй пилот для набора очков в Кубок Конструкторов.'}
            </div>
            <div class="cec-footer">
              <button class="btn ${d2.isPay ? 'ceo-pay-btn' : 'ceo-neutral-btn'}" onclick="window.openCeoDriverMarket(2)">
                Сменить пилота №2
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderFactoryTab(container) {
    const currentEng = CEO_STATE.engine;
    const currentSp = CEO_STATE.sponsor;
    const fac = CEO_STATE.facilities;
    const rd = CEO_STATE.rd || { focus: "balanced", installedPackages: [] };

    const renderPips = (lvl) => {
      let pips = '';
      for(let i = 1; i <= 5; i++) {
        pips += `<span class="fac-pip ${i <= lvl ? 'filled' : ''}"></span>`;
      }
      return pips;
    };

    container.innerHTML = `
      <div class="ceo-factory-layout">
        <!-- Section: Engine Partners -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">POWER UNIT ALLIANCE</span>
              <h3>🔧 ПОСТАВЩИК СИЛОВОЙ УСТАНОВКИ V6 TURBO HYBRID</h3>
            </div>
          </div>
          <div class="ceo-engines-strip">
            ${ENGINE_SUPPLIERS.map(e => {
              const isSelected = (currentEng.id === e.id);
              return `
                <div class="ceo-engine-box ${isSelected ? 'active' : ''}">
                  <div class="ceb-top">
                    <span class="ceb-tag">${e.tag}</span>
                    <span class="ceb-cost">${formatMoney(e.cost)}/год</span>
                  </div>
                  <div class="ceb-name">${e.name}</div>
                  <div class="ceb-stats">
                    <span>Мощность ERS/ICE: <b>${e.power}/100</b></span> · 
                    <span>Надежность: <b>${e.rel}%</b></span>
                  </div>
                  <button class="btn ${isSelected ? 'ceb-btn-active' : 'ceb-btn-pick'}" onclick="window.selectEngineSupplier('${e.id}')" ${isSelected ? 'disabled' : ''}>
                    ${isSelected ? '✅ ТЕКУЩИЙ КОНТРАКТ' : 'ЗАКЛЮЧИТЬ КОНТРАКТ'}
                  </button>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Section: Title Sponsors -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">COMMERCIAL TITLE PARTNERS</span>
              <h3>💼 ГЕНЕРАЛЬНЫЙ ТИТУЛЬНЫЙ СПОНСОР</h3>
            </div>
          </div>
          <div class="ceo-sponsors-strip">
            ${TITLE_SPONSORS.map(s => {
              const isSelected = (currentSp.id === s.id);
              return `
                <div class="ceo-sponsor-box ${isSelected ? 'active' : ''}">
                  <div class="ceb-top">
                    <span class="ceb-tag">${s.tag}</span>
                    <span class="ceb-cost pay-green">+${formatMoney(s.payout)}/год</span>
                  </div>
                  <div class="ceb-name">${s.name}</div>
                  <div class="ceb-stats">
                    Требование акционеров: <b>Топ-${s.reqPos} в Кубке Конструкторов</b>
                  </div>
                  <button class="btn ${isSelected ? 'ceb-btn-active' : 'ceb-btn-pick'}" onclick="window.selectTitleSponsor('${s.id}')" ${isSelected ? 'disabled' : ''}>
                    ${isSelected ? '✅ ГЕНЕРАЛЬНЫЙ СПОНСОР' : 'ПОДПИСАТЬ СОГЛАШЕНИЕ'}
                  </button>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Section: In-Season R&D Development Race (Packages & Focus) -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">IN-SEASON R&D DEVELOPMENT RACE</span>
              <h3>🔬 ГОНКА ОБНОВЛЕНИЙ ШАССИ И АЭРОДИНАМИЧЕСКИЕ ПАКЕТЫ</h3>
            </div>
          </div>

          <!-- R&D Focus Strategy Switcher -->
          <div class="ceo-rd-focus-box">
            <div class="crf-title">СТРАТЕГИЯ РАСПРЕДЕЛЕНИЯ ВРЕМЕНИ В АЭРОДИНАМИЧЕСКОЙ ТРУБЕ (CFD/WTT):</div>
            <div class="crf-btns">
              <button class="crf-btn ${rd.focus === 'current' ? 'active' : ''}" onclick="window.setCeoRdFocus('current')">
                <span class="crf-b-title">🚀 Пуш текущего сезона</span>
                <span class="crf-b-desc">+5 к темпу в этом году, 0 бонус на будущий болид</span>
              </button>
              <button class="crf-btn ${rd.focus === 'balanced' ? 'active' : ''}" onclick="window.setCeoRdFocus('balanced')">
                <span class="crf-b-title">⚖️ Сбалансированный 50/50</span>
                <span class="crf-b-desc">+2.5 к темпу сейчас, +3 база на будущий сезон</span>
              </button>
              <button class="crf-btn ${rd.focus === 'next' ? 'active' : ''}" onclick="window.setCeoRdFocus('next')">
                <span class="crf-b-title">🔮 Машина следующего года</span>
                <span class="crf-b-desc">0 к темпу сейчас, +7 мощная стартовая база в новом сезоне</span>
              </button>
            </div>
          </div>

          <!-- Spec Major Packages -->
          <div class="ceo-packages-grid">
            ${RD_SPEC_PACKAGES.map(pkg => {
              const isInstalled = rd.installedPackages && rd.installedPackages.includes(pkg.id);
              const canAfford = CEO_STATE.budget >= pkg.cost;
              let reqMet = true;
              if(pkg.reqFac) {
                const cur = CEO_STATE.facilities[pkg.reqFac.key] || 1;
                if(cur < pkg.reqFac.min) reqMet = false;
              }
              return `
                <div class="ceo-pkg-card ${isInstalled ? 'installed' : ''}">
                  <div class="cpc-top">
                    <span class="cpc-spec">${pkg.spec}</span>
                    <span class="cpc-cost">${formatMoney(pkg.cost)}</span>
                  </div>
                  <div class="cpc-name">${pkg.name}</div>
                  <div class="cpc-desc">${pkg.desc}</div>
                  <div class="cpc-bonuses">
                    <span>Темп: <b>+${pkg.perfBonus}</b></span> · 
                    <span>Надежность: <b>+${pkg.relBonus}%</b></span>
                    ${pkg.reqFac ? `<div class="cpc-req ${reqMet ? 'req-ok' : 'req-fail'}">Требование: ${pkg.reqFac.label} ${reqMet ? '✅' : '🔒'}</div>` : ''}
                  </div>
                  <div class="cpc-action">
                    ${isInstalled ? `
                      <div class="cpc-badge-installed">✅ УСТАНОВЛЕН И ОМОЛОГИРОВАН</div>
                    ` : `
                      <button class="btn s-btn ${canAfford && reqMet ? 'sc-buy' : 'sc-locked'}" onclick="window.installCeoPackage('${pkg.id}')" ${!canAfford || !reqMet ? 'disabled' : ''}>
                        ${!reqMet ? 'База не соответствует' : canAfford ? 'Изготовить и установить' : 'Недостаточно бюджета'}
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Section: Factory Facilities Upgrades -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">HQ & R&D INFRASTRUCTURE (COST CAP EXCLUDED)</span>
              <h3>🏗️ МОДЕРНИЗАЦИЯ БАЗЫ И ТЕХНОЛОГИЙ</h3>
            </div>
          </div>
          <div class="ceo-facilities-strip">
            <!-- Facility 1: Wind Tunnel -->
            <div class="ceo-fac-box">
              <div class="cfb-top">
                <span class="cfb-title">АЭРОДИНАМИЧЕСКАЯ ТРУБА 60%</span>
                <span class="cfb-lvl">Tier ${fac.windTunnel}/5</span>
              </div>
              <div class="cfb-pips">${renderPips(fac.windTunnel)}</div>
              <div class="cfb-desc">Высокоточная калибровка прижимной силы и диффузора (+4 к Car Performance).</div>
              <button class="btn cfb-btn ${fac.windTunnel >= 5 ? 'maxed' : ''}" onclick="window.upgradeCeoFacility('windTunnel')" ${fac.windTunnel >= 5 ? 'disabled' : ''}>
                ${fac.windTunnel >= 5 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `МОДЕРНИЗИРОВАТЬ (${formatMoney((fac.windTunnel + 1) * 12000000)})`}
              </button>
            </div>

            <!-- Facility 2: CFD Supercomputer -->
            <div class="ceo-fac-box">
              <div class="cfb-top">
                <span class="cfb-title">СУПЕРКОМПЬЮТЕРНЫЙ CFD КЛАСТЕР</span>
                <span class="cfb-lvl">Tier ${fac.cfdSupercomputer}/5</span>
              </div>
              <div class="cfb-pips">${renderPips(fac.cfdSupercomputer)}</div>
              <div class="cfb-desc">Гидродинамическое 3D-моделирование вихрей переднего крыла (+4 к Car Performance).</div>
              <button class="btn cfb-btn ${fac.cfdSupercomputer >= 5 ? 'maxed' : ''}" onclick="window.upgradeCeoFacility('cfdSupercomputer')" ${fac.cfdSupercomputer >= 5 ? 'disabled' : ''}>
                ${fac.cfdSupercomputer >= 5 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `МОДЕРНИЗИРОВАТЬ (${formatMoney((fac.cfdSupercomputer + 1) * 12000000)})`}
              </button>
            </div>

            <!-- Facility 3: Composites Autoclaves -->
            <div class="ceo-fac-box">
              <div class="cfb-top">
                <span class="cfb-title">КОМПОЗИТНОЕ ПРОИЗВОДСТВО</span>
                <span class="cfb-lvl">Tier ${fac.compositeFactory}/5</span>
              </div>
              <div class="cfb-pips">${renderPips(fac.compositeFactory)}</div>
              <div class="cfb-desc">Углеволоконные автоклавы: облегчение шасси и снижение сходов (+4% к надежности).</div>
              <button class="btn cfb-btn ${fac.compositeFactory >= 5 ? 'maxed' : ''}" onclick="window.upgradeCeoFacility('compositeFactory')" ${fac.compositeFactory >= 5 ? 'disabled' : ''}>
                ${fac.compositeFactory >= 5 ? 'МАКСИМАЛЬНЫЙ УРОВЕНЬ' : `МОДЕРНИЗИРОВАТЬ (${formatMoney((fac.compositeFactory + 1) * 12000000)})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPoliticsTab(container) {
    const pol = CEO_STATE.politics || { activeDirective: null, directiveVoted: false, voteResult: null, activeDilemma: null };
    const dir = pol.activeDirective;

    container.innerHTML = `
      <div class="ceo-politics-layout">
        <!-- Block 1: FIA Formula 1 Commission & Technical Directives -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">FIA FORMULA 1 COMMISSION & PADDOCK POLITICS</span>
              <h3>🏛️ КОМИССИЯ FIA И РЕГЛАМЕНТНЫЕ ГОЛОСОВАНИЯ</h3>
            </div>
          </div>

          ${dir ? `
            <div class="ceo-directive-card">
              <div class="cdc-head">
                <span class="cdc-code">${dir.code}</span>
                <span class="cdc-status ${pol.directiveVoted ? (pol.voteResult && pol.voteResult.passed ? 'passed' : 'rejected') : 'pending'}">
                  ${pol.directiveVoted ? (pol.voteResult && pol.voteResult.passed ? '✅ ПРИНЯТО' : '❌ ОТКЛОНЕНО') : '⏳ ГОЛОСОВАНИЕ ОТКРЫТО'}
                </span>
              </div>
              <div class="cdc-title">${dir.title}</div>
              <div class="cdc-desc">${dir.desc}</div>

              <div class="cdc-impact-grid">
                <div class="cdc-impact-box pro">
                  <span class="cib-lbl">ЕСЛИ ПРИНЯТО (ЗА):</span>
                  <div class="cib-text">${dir.proImpact}</div>
                </div>
                <div class="cdc-impact-box contra">
                  <span class="cib-lbl">ЕСЛИ ОТКЛОНЕНО (ПРОТИВ):</span>
                  <div class="cib-text">${dir.contraImpact}</div>
                </div>
              </div>

              ${!pol.directiveVoted ? `
                <div class="cdc-actions">
                  <button class="btn s-btn cdc-btn-vote pro" onclick="window.voteCeoDirective('pro')">
                    ✅ ГОЛОСОВАТЬ «ЗА» (1 ГОЛОС)
                  </button>
                  <button class="btn s-btn cdc-btn-vote contra" onclick="window.voteCeoDirective('contra')">
                    ❌ ГОЛОСОВАТЬ «ПРОТИВ» (1 ГОЛОС)
                  </button>
                  <button class="btn s-btn cdc-btn-vote lobby" onclick="window.voteCeoDirective('lobby')">
                    💼 ЛОББИРОВАТЬ И ПОДКУПИТЬ СОЮЗНИКОВ (${formatMoney(dir.costLobby)}, +3 ГОЛОСА)
                  </button>
                </div>
              ` : `
                <div class="cdc-result-banner ${pol.voteResult && pol.voteResult.passed ? 'res-passed' : 'res-rejected'}">
                  <span>ИТОГИ ГОЛОСОВАНИЯ ПАДДОКА: <b>${pol.voteResult.votesFor} ЗА</b> против <b>${pol.voteResult.votesAgainst} ПРОТИВ</b>. ${pol.voteResult.passed ? 'Директива вступила в силу.' : 'Регламент оставлен без изменений.'}</span>
                </div>
              `}
            </div>
          ` : `
            <div class="ceo-empty-history">В текущем сезоне заседаний комиссии FIA не запланировано.</div>
          `}
        </div>

        <!-- Block 2: Executive Dilemmas & Crisis Management -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">EXECUTIVE CRISIS MANAGEMENT & PADDOCK ALERTS</span>
              <h3>⚡ АНТИКРИЗИСНЫЙ МЕНЕДЖМЕНТ И ДИЛЕММЫ СОВЕТА</h3>
            </div>
          </div>

          ${pol.activeDilemma ? `
            <div class="ceo-active-dilemma-strip">
              <div class="cad-head">
                <span class="cad-icon">${pol.activeDilemma.icon}</span>
                <span class="cad-title">${pol.activeDilemma.title}</span>
              </div>
              <div class="cad-desc">${pol.activeDilemma.desc}</div>
              <button class="btn s-btn sc-buy" onclick="window.openCeoDilemmaModal(CEO_STATE.politics.activeDilemma)">
                🚨 РАССМОТРЕТЬ КРИЗИС В КАБИНЕТЕ CEO
              </button>
            </div>
          ` : `
            <div class="ceo-calm-box">
              <div class="ccb-text">В паддоке соблюдается спортивная дисциплина. Серьезных скандалов и судебных исков не зафиксировано.</div>
              <button class="btn s-btn ceo-neutral-btn" onclick="window.triggerRandomCeoDilemma()">
                ⚡ СМОДЕЛИРОВАТЬ ВНЕШТАТНУЮ КРИЗИСНУЮ СИТУАЦИЮ
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  function renderAcademyTab(container) {
    const ac = CEO_STATE.academy || { level: 1, juniors: [], candidates: [] };
    const juniors = ac.juniors || [];
    const candidates = ac.candidates || [];

    const tierDesc = {
      1: "Базовая картинговая секция CIK-FIA",
      2: "Скаутинг в национальных чемпионатах Formula 4 & Formula 3",
      3: "Академический динамический симулятор уровня Formula 2",
      4: "Полноценная программа тестов TPC (Testing of Previous Cars) на болидах F1",
      5: "Элитный инкубатор чемпионов мира Формулы-1"
    };

    const costMap = { 1: 6000000, 2: 12000000, 3: 18000000, 4: 25000000 };
    const nextCost = costMap[ac.level] || 10000000;

    container.innerHTML = `
      <div class="ceo-academy-layout">
        <!-- Academy HQ Facility Banner -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">YOUNG DRIVER DEVELOPMENT PROGRAM</span>
              <h3>🎓 МОЛОДЁЖНАЯ ГОНОЧНАЯ АКАДЕМИЯ (TIER ${ac.level}/5)</h3>
            </div>
            ${ac.level < 5 ? `
              <button class="btn s-btn sc-buy" onclick="window.upgradeCeoAcademyFacility()">
                МОДЕРНИЗИРОВАТЬ АКАДЕМИЮ (${formatMoney(nextCost)})
              </button>
            ` : `
              <span class="badge-maxed">ЭЛИТНЫЙ СТАТУС TIER 5</span>
            `}
          </div>
          <div class="ceo-acad-desc-box">
            <b>Текущая инфраструктура:</b> ${tierDesc[ac.level] || 'Гоночная академия'}. 
            Позволяет развивать молодых гонщиков через тесты TPC, сдавать их в платную аренду в клиентские команды (+$10M/год) или продвигать в основной состав F1.
          </div>
        </div>

        <!-- Signed Academy Juniors -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">ACTIVE ROSTER (СЛОТЫ: ${juniors.length}/4)</span>
              <h3>🏎️ ВОСПИТАННИКИ АКАДЕМИИ НА КОНТРАКТЕ</h3>
            </div>
          </div>

          ${juniors.length === 0 ? `
            <div class="ceo-empty-history">В академии пока нет подписанных юниоров. Подпишите перспективных талантов из скаутинг-пула ниже!</div>
          ` : `
            <div class="ceo-juniors-grid">
              ${juniors.map(j => {
                const isLoaned = (j.status === "loaned");
                return `
                  <div class="ceo-junior-card ${isLoaned ? 'loaned' : ''}">
                    <div class="cjc-head">
                      <span class="cjc-flag">${j.flag}</span>
                      <span class="cjc-status ${isLoaned ? 'loaned' : 'training'}">
                        ${isLoaned ? `🤝 В аренде в ${j.loanTeam || 'F1'}` : '🧪 В академии'}
                      </span>
                    </div>
                    <div class="cjc-name">${j.name} (${j.age} лет)</div>
                    <div class="cjc-stats-row">
                      <span>Мастерство: <b>${j.ovr} OVR</b></span> · 
                      <span>Потенциал: <b class="gold">${j.pot} OVR</b></span>
                    </div>
                    <div class="cjc-bar">
                      <div class="cjc-bar-fill" style="width: ${(j.ovr / 100) * 100}%;"></div>
                    </div>
                    <div class="cjc-sub-info">
                      ${isLoaned ? `
                        <div class="cjc-profit-pill">💰 Приносит +$10,000,000 / сезон</div>
                      ` : `
                        <div class="cjc-tag-pill">${j.tag || 'Академик'} · Оклад: ${formatMoney(j.salary)}/год</div>
                      `}
                    </div>

                    <div class="cjc-actions">
                      ${!isLoaned ? `
                        <button class="btn s-btn cjc-btn" onclick="window.trainJunior('${j.id}')" title="Провести интенсивные тесты TPC на болиде F1">
                          🧪 Тесты TPC ($2.5M)
                        </button>
                        <button class="btn s-btn cjc-btn loan" onclick="window.loanJunior('${j.id}')" title="Сдать в аренду команде F1 за $10M в год">
                          🤝 В аренду (+$10M)
                        </button>
                      ` : `
                        <button class="btn s-btn cjc-btn recall" onclick="window.recallJunior('${j.id}')">
                          ↩️ Отозвать в базу
                        </button>
                      `}
                      <button class="btn s-btn cjc-btn promote" onclick="window.promoteJuniorToCockpit('${j.id}', 1)" title="Назначить в кокпит №1 боевым пилотом">
                        🏁 В Кокпит #1
                      </button>
                      <button class="btn s-btn cjc-btn promote" onclick="window.promoteJuniorToCockpit('${j.id}', 2)" title="Назначить в кокпит №2 боевым пилотом">
                        🏁 В Кокпит #2
                      </button>
                      <button class="btn s-btn cjc-btn fire" onclick="window.releaseJunior('${j.id}')" title="Расторгнуть соглашение">
                        ✕
                      </button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>

        <!-- Scouting Prospects Pool -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">GLOBAL SCOUTING RADAR (F4, F3, KARTING)</span>
              <h3>🔍 МОЛОДЫЕ ТАЛАНТЫ НА СКАУТИНГ-РАДАРЕ</h3>
            </div>
          </div>

          <div class="ceo-candidates-grid">
            ${candidates.map(c => {
              const canAfford = CEO_STATE.budget >= c.cost;
              return `
                <div class="ceo-candidate-card">
                  <div class="cc-head">
                    <span class="cc-trait">${c.tag}</span>
                    <span class="cc-skill">Рейтинг: <b>${c.ovr}</b> / Пот: <b class="gold">${c.pot}</b></span>
                  </div>
                  <div class="cc-name">${c.flag} ${c.name} (${c.age} лет)</div>
                  <div class="cc-desc">Высоко оценен скаутами за скорость на одном быстром круге и контроль износа резины.</div>
                  <div class="cc-salary">Вступительный бонус: <b>${formatMoney(c.cost)}</b></div>
                  <div class="cc-actions">
                    <button class="btn s-btn ${canAfford ? 'sc-buy' : 'sc-locked'}" onclick="window.signAcademyCandidate('${c.id}')" ${!canAfford ? 'disabled' : ''}>
                      ${canAfford ? 'Подписать в Академию' : 'Недостаточно средств'}
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderBoardTab(container) {
    const history = CEO_STATE.history || [];
    const inv = CEO_STATE.investors || { equitySold: 0, deals: [], ipoDone: false };

    const meetsIpo = (CEO_STATE.marketCap >= 1500000000 && CEO_STATE.boardApproval >= 75);

    container.innerHTML = `
      <div class="ceo-board-content">
        <!-- Board Hero -->
        <div class="ceo-board-hero">
          <div class="cbh-left">
            <span class="f1-mono-sub">BOARD OF DIRECTORS CONFIDENCE</span>
            <div class="cbh-title">🏛️ ДОВЕРИЕ СОВЕТА АКЦИОНЕРОВ: <b>${CEO_STATE.boardApproval}%</b></div>
            <div class="cbh-desc">
              Как управляющий совладелец, вы несете персональную ответственность перед советом директоров. 
              ${CEO_STATE.boardApproval >= 70 ? 
                '✅ Акционеры довольны текущим курсом развития и одобряют выбранную стратегию.' : 
                '⚠️ Внимание: Низкий уровень доверия акционеров! Совет настаивает на кадровых перестановках в техническом штабе.'}
            </div>
          </div>
          <div class="cbh-gauge-wrap">
            <div class="cbh-gauge-bar">
              <div class="cbh-gauge-fill" style="width: ${CEO_STATE.boardApproval}%; background: ${CEO_STATE.boardApproval >= 70 ? '#10b981' : CEO_STATE.boardApproval >= 45 ? '#f59e0b' : '#ef4444'};"></div>
            </div>
          </div>
        </div>

        <!-- Section: Investors, Sovereign Wealth Funds & NYSE IPO -->
        <div class="ceo-sec-block">
          <div class="csb-header">
            <div>
              <span class="f1-mono-sub">VENTURE CAPITAL, SOVEREIGN FUNDS & WALL STREET IPO</span>
              <h3>📈 ИНВЕСТОРЫ, АКЦИОНЕРНЫЙ КАПИТАЛ И БИРЖА NYSE</h3>
            </div>
          </div>

          <div class="ceo-investors-grid">
            <!-- Deal 1: Sovereign Wealth Fund -->
            <div class="ceo-invest-card ${inv.deals && inv.deals.includes('swo_fund') ? 'deal-done' : ''}">
              <div class="cic-top">
                <span class="cic-tag">СУВЕРЕННЫЙ ФОНД БЛИЖНЕГО ВОСТОКА</span>
                <span class="cic-equity">10% Долей</span>
              </div>
              <div class="cic-name">Нефтяной консорциум Персидского залива</div>
              <div class="cic-desc">Мгновенное вливание $95,000,000 прямых инвестиций в бюджет команды для модернизации фабрики.</div>
              <div class="cic-footer">
                ${inv.deals && inv.deals.includes('swo_fund') ? `
                  <div class="cic-badge-done">✅ СДЕЛКА ЗАКРЫТА (+$95M В БЮДЖЕТ)</div>
                ` : `
                  <button class="btn s-btn sc-buy" onclick="window.sellMinorityEquity('swo_fund')">
                    Продать 10% за $95,000,000
                  </button>
                `}
              </div>
            </div>

            <!-- Deal 2: US Sports Capital Partners -->
            <div class="ceo-invest-card ${inv.deals && inv.deals.includes('us_capital') ? 'deal-done' : ''}">
              <div class="cic-top">
                <span class="cic-tag">АМЕРИКАНСКИЙ СПОРТИВНЫЙ ФОНД</span>
                <span class="cic-equity">15% Долей</span>
              </div>
              <div class="cic-name">US Sports Capital Partners (Нью-Йорк)</div>
              <div class="cic-desc">Инвестиции $140,000,000 + рост ежегодных медиа-доходов конюшни на +$12M за счёт аудитории США.</div>
              <div class="cic-footer">
                ${inv.deals && inv.deals.includes('us_capital') ? `
                  <div class="cic-badge-done">✅ СДЕЛКА ЗАКРЫТА (+$140M + $12M/ГОД)</div>
                ` : `
                  <button class="btn s-btn sc-buy" onclick="window.sellMinorityEquity('us_capital')">
                    Продать 15% за $140,000,000
                  </button>
                `}
              </div>
            </div>

            <!-- Deal 3: Wall Street NYSE IPO -->
            <div class="ceo-invest-card ipo-card ${inv.ipoDone ? 'deal-done ipo-done' : ''}">
              <div class="cic-top">
                <span class="cic-tag gold">NEW YORK STOCK EXCHANGE (NYSE)</span>
                <span class="cic-equity gold">ТИКЕР: $GLRY</span>
              </div>
              <div class="cic-name">Первичное публичное размещение акций (IPO)</div>
              <div class="cic-desc">
                Размещение 20% акций на бирже. Приносит $250M в команду, <b>+$50,000,000 личной выплаты основателю</b> на банковский счет, и <b>+$20,000,000 личных дивидендов</b> каждый сезон!
              </div>
              <div class="cic-req-box">
                <div class="cic-r-item ${CEO_STATE.marketCap >= 1500000000 ? 'ok' : 'fail'}">
                  ${CEO_STATE.marketCap >= 1500000000 ? '✅' : '❌'} Оценка конюшни > $1.5B (Текущая: ${formatMoney(CEO_STATE.marketCap)})
                </div>
                <div class="cic-r-item ${CEO_STATE.boardApproval >= 75 ? 'ok' : 'fail'}">
                  ${CEO_STATE.boardApproval >= 75 ? '✅' : '❌'} Доверие совета директоров > 75% (Текущее: ${CEO_STATE.boardApproval}%)
                </div>
              </div>
              <div class="cic-footer">
                ${inv.ipoDone ? `
                  <div class="cic-badge-done gold">🏛️ NYSE LISTED: $GLRY · ДИВИДЕНДЫ $20M/ГОД</div>
                ` : `
                  <button class="btn s-btn ${meetsIpo ? 'sc-buy btn-ipo-trigger' : 'sc-locked'}" onclick="window.launchWallStreetIpo()" ${!meetsIpo ? 'disabled' : ''}>
                    🔔 ПРОВЕСТИ IPO НА УОЛЛ-СТРИТ
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>

        <!-- WCC History Table -->
        <div class="ceo-history-block">
          <div class="chb-title">🏆 ХРОНИКА ВЫСТУПЛЕНИЙ В КУБКЕ КОНСТРУКТОРОВ</div>
          ${history.length === 0 ? `
            <div class="ceo-empty-history">
              🏎️ Команда находится в межсезонье и готовится к дебютному чемпионату. Нажмите «СИМУЛИРОВАТЬ СЕЗОН» внизу!
            </div>
          ` : `
            <div class="ceo-history-table">
              <div class="cht-head">
                <span>СЕЗОН</span>
                <span>ПОЗИЦИЯ КК</span>
                <span>ОЧКИ</span>
                <span>ПОБЕДЫ</span>
                <span>ПОДИУМЫ</span>
                <span>ФИНАНСОВЫЙ РЕЗУЛЬТАТ</span>
              </div>
              ${history.map(h => `
                <div class="cht-row ${h.wccPos === 1 ? 'gold-row' : ''}">
                  <span class="cht-season">Сезон ${h.seasonNum} (${h.year})</span>
                  <span class="cht-pos"><b>P${h.wccPos}</b> ${h.wccPos === 1 ? '🏆' : ''}</span>
                  <span class="cht-pts">${h.wccPoints}</span>
                  <span class="cht-wins">${h.wins}</span>
                  <span class="cht-pods">${h.podiums}</span>
                  <span class="cht-profit ${h.profit >= 0 ? 'cfb-green' : 'cfb-red'}">
                    ${h.profit >= 0 ? '+' : ''}${formatMoney(h.profit)}
                  </span>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `;
  }

  function renderLegacyTab(container) {
    const drvName = (typeof pName === "function" ? pName() : "Пилот");
    const num = (typeof sel !== "undefined" && sel.num) ? sel.num : 10;
    const flag = (typeof sel !== "undefined" && sel.flag) ? sel.flag : "🏁";
    const seasons = (typeof S !== "undefined" && S.seasons) ? S.seasons : [];
    const titlesF1 = (typeof S !== "undefined" && S.titles && S.titles.f1) || 0;
    const titlesConstr = (typeof S !== "undefined" && S.titles && S.titles.constr) || 0;
    const wins = (typeof S !== "undefined" && S.wins) || 0;
    const pods = (typeof S !== "undefined" && S.podiums) || 0;
    const poles = (typeof S !== "undefined" && S.poles) || 0;
    const gp = (typeof S !== "undefined" && S.gp) || 0;
    const pts = (typeof S !== "undefined" && S.ptsF1) || 0;
    const bank = (typeof S !== "undefined" && S.bankAccount) || 0;
    const age = (typeof S !== "undefined" && S.age) || 36;
    const startYr = (typeof S !== "undefined" && S.baseYear) || 2026;
    const retireYr = (typeof yearNow === "function") ? yearNow() : (startYr + Math.max(0, age - 16));
    const flagStr = (typeof flg === "function") ? flg(flag) : (flag || "🏁");

    container.innerHTML = `
      <div class="ceo-legacy-content">
        <div class="ceo-legacy-hero">
          <div class="clh-badge">🏆 FOUNDER & RACING LEGEND · HALL OF FAME</div>
          <div class="clh-title-row">
            <span class="clh-flag">${flagStr}</span>
            <h2>${drvName} #${num}</h2>
          </div>
          <div class="clh-subtitle">Карьера пилота: ${startYr} – ${retireYr} · Завершил карьеру в ${age} лет ради статуса Владельца & CEO команды</div>
          <div class="clh-verdict">«От триумфов на трассе к величию в паддоке: легендарный пилот теперь руководит собственной чемпионской конюшней Формулы-1!»</div>
        </div>

        <div class="ceo-legacy-stats-grid">
          <div class="cls-box gold">
            <span class="cls-val">${titlesF1}</span>
            <span class="cls-lbl">Титулы Чемпиона мира</span>
          </div>
          <div class="cls-box gold">
            <span class="cls-val">${titlesConstr}</span>
            <span class="cls-lbl">Кубки Конструкторов</span>
          </div>
          <div class="cls-box">
            <span class="cls-val">${wins}</span>
            <span class="cls-lbl">Победы в Гран-при</span>
          </div>
          <div class="cls-box">
            <span class="cls-val">${pods}</span>
            <span class="cls-lbl">Подиумы</span>
          </div>
          <div class="cls-box">
            <span class="cls-val">${poles}</span>
            <span class="cls-lbl">Поул-позиции</span>
          </div>
          <div class="cls-box">
            <span class="cls-val">${gp}</span>
            <span class="cls-lbl">Старты в Гран-при</span>
          </div>
          <div class="cls-box">
            <span class="cls-val">${pts}</span>
            <span class="cls-lbl">Очки в Формуле-1</span>
          </div>
          <div class="cls-box blue">
            <span class="cls-val">${formatMoney(bank)}</span>
            <span class="cls-lbl">Личный капитал</span>
          </div>
        </div>

        <!-- Driver Career Seasons Table -->
        <div class="ceo-history-block">
          <div class="chb-title">🏁 ХРОНОЛОГИЯ ВЫСТУПЛЕНИЙ ОСНОВАТЕЛЯ ЗА РУЛЁМ</div>
          ${seasons.length === 0 ? `
            <div class="ceo-empty-history">Архив сезонов основателя сохранен в официальной летописи FIA.</div>
          ` : `
            <div class="ceo-history-table">
              <div class="cht-head">
                <span>СЕЗОН</span>
                <span>КАТЕГОРИЯ</span>
                <span>КОМАНДА</span>
                <span>ИТОГ</span>
                <span>ПОБЕДЫ</span>
                <span>ПОДИУМЫ</span>
                <span>ОЧКИ</span>
              </div>
              ${seasons.map(s => `
                <div class="cht-row ${s.pos === 1 ? 'gold-row' : ''}">
                  <span class="cht-season">${s.year || s.age + ' лет'}</span>
                  <span class="cht-cat"><b>${s.cat || 'F1'}</b></span>
                  <span class="cht-team">${(s.team && s.team.name) || s.team || '—'}</span>
                  <span class="cht-pos"><b>P${s.pos || '-'}</b> ${s.pos === 1 ? '🏆' : ''}</span>
                  <span class="cht-wins">${s.wins || 0}</span>
                  <span class="cht-pods">${s.pods || 0}</span>
                  <span class="cht-profit">${s.pts || 0} pts</span>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `;
  }

  window.selectEngineSupplier = function(id) {
    if(!CEO_STATE) loadCeoState();
    const eng = ENGINE_SUPPLIERS.find(e => e.id === id);
    if(eng) {
      CEO_STATE.engine = Object.assign({}, eng);
      saveCeoState();
      renderCeoModal();
      if(window.showF1Toast) window.showF1Toast(`🔧 Контракт с поставщиком моторов ${eng.name} утвержден!`, "success");
    }
  };

  window.selectTitleSponsor = function(id) {
    if(!CEO_STATE) loadCeoState();
    const sp = TITLE_SPONSORS.find(s => s.id === id);
    if(sp) {
      CEO_STATE.sponsor = Object.assign({}, sp);
      saveCeoState();
      renderCeoModal();
      if(window.showF1Toast) window.showF1Toast(`💼 Спонсорское соглашение с ${sp.name} подписано!`, "success");
    }
  };

  // Switch tabs
  window.switchCeoTab = function(tab) {
    activeCeoTab = tab;
    renderCeoPage();
  };

  // Fullscreen Page Transition
  window.transitionToCeoPage = function(isEditing) {
    loadCeoState();

    // 1. Hide all standard career & modal sections
    const hideIds = ["career", "intro", "identity", "careerHud", "endModal", "reopenBtn", "wealthModal", "ceoModal"];
    hideIds.forEach(id => {
      const el = document.getElementById(id);
      if(el) el.style.display = "none";
    });

    // 2. Check if team branding is needed
    const needsBranding = !CEO_STATE || !CEO_STATE.teamName || (!CEO_STATE.teamCustomized && !isEditing);
    if(needsBranding) {
      openTeamCreationModal(false);
      return;
    }

    // 3. Reveal standalone CEO Page
    showCeoPage();
  };

  function showCeoPage() {
    window.scrollTo(0, 0);
    const ceoPage = document.getElementById("ceoPage");
    if(ceoPage) ceoPage.style.display = "block";
    renderCeoPage();
    updateCeoIntroCard();
  }

  window.exitCeoToMenu = function() {
    saveCeoState();
    const ceoPage = document.getElementById("ceoPage");
    if(ceoPage) {
      ceoPage.style.display = "none";
      const body = document.getElementById("ceoTabContent");
      if(body) body.textContent = "";
    }
    const intro = document.getElementById("intro");
    if(intro) intro.style.display = "flex";
    updateCeoIntroCard();
    window.scrollTo(0, 0);
    if(window.showF1Toast) window.showF1Toast("Прогресс команды сохранен!", "info");
  };

  function updateCeoIntroCard() {
    const card = document.getElementById("ceoModeCard");
    if(!card) return;
    try {
      const saved = localStorage.getItem("f1g_ceo_state");
      if(saved) {
        const parsed = JSON.parse(saved);
        if(parsed && parsed.teamName) {
          card.style.display = "flex";
          const t = document.getElementById("ceoIntroTitle");
          if(t) t.textContent = `🏛️ ${parsed.teamName}`;
          const s = document.getElementById("ceoIntroSub");
          if(s) s.textContent = `Сезон ${parsed.seasonNum} · ${parsed.year} · Бюджет ${formatMoney(parsed.budget)}`;
          return;
        }
      }
    } catch(e){}
    card.style.display = "none";
  }
  window.updateCeoIntroCard = updateCeoIntroCard;

  window.openCeoModal = function() {
    window.transitionToCeoPage(false);
  };

  window.closeCeoModal = function() {
    window.exitCeoToMenu();
  };

  window.fireCeoTechDirector = function() {
    fireTechDirector();
  };

  window.fireCeoTeamPrincipal = function() {
    fireTeamPrincipal();
  };

  window.openCeoDriverMarket = function(seatIndex) {
    openDriverMarketModal(seatIndex);
  };

  window.upgradeCeoFacility = function(key) {
    upgradeFacility(key);
  };

  window.runCeoSeasonSimulation = function() {
    if(!CEO_STATE) loadCeoState();
    if(CEO_STATE.simMode === "calendar") {
      window.openCeoCalendarModal();
    } else {
      simulateCeoSeason();
    }
  };

  window.updateTcName = function(val) {
    tempTeamData.name = val;
    const tcp = document.querySelector(".tc-preview-card .tcp-name");
    if(tcp) tcp.textContent = val || 'Shelby F1 Team';
  };

  window.applyTcPreset = function(preset) {
    tempTeamData.name = preset;
    const input = document.getElementById("tcInputName");
    if(input) input.value = preset;
    const tcp = document.querySelector(".tc-preview-card .tcp-name");
    if(tcp) tcp.textContent = preset;
  };

  window.setTcHq = function(id) {
    tempTeamData.hqId = id;
    renderTeamCreationModal(window._tcIsEditing || false);
  };

  window.setTcLivery = function(id) {
    tempTeamData.liveryId = id;
    renderTeamCreationModal(window._tcIsEditing || false);
  };

  window.setTcStory = function(id) {
    tempTeamData.storyId = id;
    renderTeamCreationModal(window._tcIsEditing || false);
  };

  window.openTeamCreationModal = function(isEditing) {
    window._tcIsEditing = !!isEditing;
    openTeamCreationModal(!!isEditing);
  };

  window.confirmTeamCreation = function(isEditing) {
    const hq = HQ_LOCATIONS.find(h => h.id === tempTeamData.hqId) || HQ_LOCATIONS[0];
    const livery = LIVERY_PALETTES.find(l => l.id === tempTeamData.liveryId) || LIVERY_PALETTES[0];
    const story = ORIGIN_STORIES.find(s => s.id === tempTeamData.storyId) || ORIGIN_STORIES[0];

    CEO_STATE.teamName = (tempTeamData.name || getDefaultTeamName()).trim();
    CEO_STATE.teamHq = `${hq.name} (${hq.country})`;
    CEO_STATE.teamFlag = hq.flag;
    CEO_STATE.teamColor = livery.primary;
    CEO_STATE.teamLivery = livery.id;
    CEO_STATE.teamStory = story.title;
    CEO_STATE.teamCustomized = true;

    saveCeoState();
    window.closeTeamCreationModal();

    // Show standalone CEO page!
    showCeoPage();

    if(window.showF1Toast) {
      window.showF1Toast(`🏛️ Конюшня «${CEO_STATE.teamName}» официально зарегистрирована в FIA! Добро пожаловать в кабинет CEO!`, "success");
    }
  };

  // Wire up retirement / career end transition to CEO
  window.launchCeoFromRetirement = function() {
    if(typeof S !== "undefined" && S) {
      S.retired = true;
      S.retiredByCeo = true;
      S.retireReason = "Выкуп команды F1 за $85M и переход на пост Владельца & CEO";
      S.assets = S.assets || [];
      if(!S.assets.includes("f1_team_share")) S.assets.push("f1_team_share");
    }
    const endM = document.getElementById("endModal");
    if(endM) endM.style.display = "none";
    const reopenBtn = document.getElementById("reopenBtn");
    if(reopenBtn) reopenBtn.style.display = "none";

    initCeoState();
    window.transitionToCeoPage(false);
  };

  // Global keydown listener for Escape key to close open CEO modals cleanly and free memory
  window.addEventListener("keydown", function(e) {
    if(e.key === "Escape") {
      const staffM = document.getElementById("ceoStaffMarketModal");
      if(staffM && staffM.style.display === "flex") { window.closeCeoStaffMarketModal(); return; }
      const drvM = document.getElementById("ceoDriverMarketModal");
      if(drvM && drvM.style.display === "flex") { window.closeCeoDriverMarketModal(); return; }
      const debM = document.getElementById("ceoDebriefModal");
      if(debM && debM.style.display === "flex") { window.closeCeoDebriefModal(); return; }
      const tcM = document.getElementById("teamCreationModal");
      if(tcM && tcM.style.display === "flex") { window.closeTeamCreationModal(); return; }
      const calM = document.getElementById("ceoCalendarModal");
      if(calM && calM.style.display === "flex") { window.closeCeoCalendarModal(); return; }
      const dilM = document.getElementById("ceoDilemmaModal");
      if(dilM && dilM.style.display === "flex") { window.closeCeoDilemmaModal(); return; }
    }
  });

  // Global reset for career start / state clear
  window.resetCeoMode = function() {
    window.closeCeoStaffMarketModal();
    window.closeCeoDriverMarketModal();
    window.closeCeoDebriefModal();
    window.closeTeamCreationModal();
    window.closeCeoCalendarModal();
    window.closeCeoDilemmaModal();
    const ceoPage = document.getElementById("ceoPage");
    if(ceoPage) ceoPage.style.display = "none";
    CEO_STATE = null;
    try {
      localStorage.removeItem("f1g_ceo_state");
    } catch(e) {}
    updateCeoIntroCard();
  };

  // Expose global init
  window.initCeoMode = function() {
    loadCeoState();
    updateCeoIntroCard();
  };

  document.addEventListener("DOMContentLoaded", function(){
    loadCeoState();
    updateCeoIntroCard();
  });
})();
