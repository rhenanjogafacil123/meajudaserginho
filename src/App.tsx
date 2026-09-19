import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardList,
  Construction,
  FileImage,
  Home,
  Lightbulb,
  MapPin,
  Menu,
  MessageSquareText,
  Navigation,
  Plus,
  Play,
  Route,
  Send,
  Trash2,
  Upload,
  Video,
  Waves,
  X
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

type Status = "Recebido" | "Em análise" | "Encaminhado" | "Resolvido";
type Screen = "home" | "new" | "calls" | "detail" | "notices" | "resolved" | "success";

type CallItem = {
  id: string;
  protocol: string;
  category: string;
  address: string;
  neighborhood: string;
  description: string;
  requesterName?: string;
  reference?: string;
  status: Status;
  date: string;
  mediaName?: string;
  mediaType?: string;
  mediaPreview?: string;
  mediaThumbnail?: string;
  city?: string;
  state?: string;
  cep?: string;
};

type FormState = {
  category: string;
  otherDetails: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  cep: string;
  city: string;
  state: string;
  description: string;
  requesterName: string;
  reference: string;
  mediaName: string;
  mediaType: string;
  mediaPreview: string;
  mediaThumbnail: string;
};

const categories = [
  { label: "Buraco na rua", icon: Construction },
  { label: "Rua sem asfalto", icon: Route },
  { label: "Iluminação", icon: Lightbulb },
  { label: "Lixo/Entulho", icon: Trash2 },
  { label: "Drenagem", icon: Waves },
  { label: "Calçada", icon: Navigation },
  { label: "Sinalização", icon: MapPin },
  { label: "Outro", icon: Menu }
];

const rioNeighborhoods = [
  "Abolição", "Acari", "Água Santa", "Alto da Boa Vista", "Anchieta", "Andaraí",
  "Anil", "Bancários", "Bangu", "Barra da Tijuca", "Barra de Guaratiba", "Barra Olímpica",
  "Barros Filho", "Benfica", "Bento Ribeiro", "Bonsucesso", "Botafogo",
  "Brás de Pina", "Cachambi", "Cacuia", "Caju", "Camorim", "Campinho",
  "Campo dos Afonsos", "Campo Grande", "Cascadura", "Catete", "Catumbi",
  "Cavalcanti", "Centro", "Cidade de Deus", "Cidade Nova", "Cidade Universitária",
  "Cocotá", "Coelho Neto", "Colégio", "Complexo do Alemão", "Copacabana",
  "Cordovil", "Cosme Velho", "Cosmos", "Costa Barros", "Curicica",
  "Del Castilho", "Deodoro", "Encantado", "Engenheiro Leal", "Engenho da Rainha",
  "Engenho de Dentro", "Engenho Novo", "Estácio", "Flamengo",
  "Freguesia (Ilha do Governador)", "Freguesia Jacarepaguá", "Galeão", "Gamboa",
  "Gardênia Azul", "Gávea", "Gericinó", "Glória", "Grajaú", "Grumari",
  "Guadalupe", "Guaratiba", "Higienópolis", "Honório Gurgel", "Humaitá",
  "Inhaúma", "Inhoaíba", "Ipanema", "Irajá", "Itanhangá", "Jabour",
  "Jacaré", "Jacarepaguá", "Jacarezinho", "Jardim América", "Jardim Botânico",
  "Jardim Carioca", "Jardim Guanabara", "Jardim Sulacap", "Joá", "Lagoa",
  "Lapa", "Laranjeiras", "Leblon", "Leme", "Lins de Vasconcelos",
  "Madureira", "Magalhães Bastos", "Mangueira", "Manguinhos", "Maracanã",
  "Maré", "Marechal Hermes", "Maria da Graça", "Méier", "Moneró", "Olaria",
  "Oswaldo Cruz", "Paciência", "Padre Miguel", "Paquetá", "Parada de Lucas",
  "Parque Anchieta", "Parque Colúmbia", "Pavuna", "Pechincha",
  "Pedra de Guaratiba", "Penha", "Penha Circular", "Piedade", "Pilares",
  "Pitangueiras", "Portuguesa", "Praia da Bandeira", "Praça da Bandeira",
  "Praça Seca", "Quintino Bocaiúva", "Ramos", "Realengo",
  "Recreio dos Bandeirantes", "Riachuelo", "Ribeira", "Ricardo de Albuquerque",
  "Rio Comprido", "Rocinha", "Rocha", "Rocha Miranda", "Sampaio",
  "Santa Cruz", "Santa Teresa", "Santíssimo", "Santo Cristo", "São Conrado",
  "Imperial de São Cristóvão", "São Francisco Xavier", "Saúde", "Senador Camará",
  "Senador Vasconcelos", "Sepetiba", "Tanque", "Taquara", "Tauá", "Tijuca",
  "Todos os Santos", "Tomás Coelho", "Tubiacanga", "Turiaçu", "Urca", "Vargem Grande",
  "Vargem Pequena", "Vasco da Gama", "Vaz Lobo", "Vicente de Carvalho",
  "Vidigal", "Vigário Geral", "Vila da Penha", "Vila Isabel", "Vila Kennedy",
  "Vila Kosmos", "Vila Militar", "Vila Valqueire", "Vista Alegre", "Zumbi"
];

const seedCalls: CallItem[] = [
  {
    id: "seed-1",
    protocol: "MAS-2026-1038",
    category: "Buraco na rua",
    address: "Rua do Lavradio, 82",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
    requesterName: "Mônica Silva",
    description: "Buraco aumentando próximo à faixa de pedestres.",
    status: "Em análise",
    date: "18/09/2026"
  },
  {
    id: "seed-2",
    protocol: "MAS-2026-1021",
    category: "Iluminação",
    address: "Rua Conde de Bonfim, 310",
    neighborhood: "Tijuca",
    city: "Rio de Janeiro",
    state: "RJ",
    requesterName: "José Santos",
    description: "Poste sem iluminação há alguns dias.",
    status: "Encaminhado",
    date: "16/09/2026"
  },
  {
    id: "seed-3",
    protocol: "MAS-2026-0994",
    category: "Lixo/Entulho",
    address: "Rua Barata Ribeiro, 214",
    neighborhood: "Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
    requesterName: "Carla Souza",
    description: "Entulho acumulado ao lado da calçada.",
    status: "Resolvido",
    date: "12/09/2026"
  },
  {
    id: "seed-4",
    protocol: "MAS-2026-1052",
    category: "Iluminação",
    address: "Rua do Riachuelo, 156",
    neighborhood: "Centro",
    city: "Rio de Janeiro",
    state: "RJ",
    requesterName: "André Lima",
    description: "Trecho da rua permanece escuro durante a noite.",
    status: "Recebido",
    date: "18/09/2026"
  },
  {
    id: "seed-5",
    protocol: "MAS-2026-1044",
    category: "Buraco na rua",
    address: "Rua Uruguai, 441",
    neighborhood: "Tijuca",
    city: "Rio de Janeiro",
    state: "RJ",
    requesterName: "Renata Oliveira",
    description: "Buraco próximo ao meio-fio dificultando a passagem.",
    status: "Em análise",
    date: "17/09/2026"
  }
];

const initialForm: FormState = {
  category: "",
  otherDetails: "",
  address: "",
  number: "",
  complement: "",
  neighborhood: "",
  cep: "",
  city: "Rio de Janeiro",
  state: "RJ",
  description: "",
  requesterName: "",
  reference: "",
  mediaName: "",
  mediaType: "",
  mediaPreview: "",
  mediaThumbnail: ""
};

const statusOrder: Status[] = ["Recebido", "Em análise", "Encaminhado", "Resolvido"];

function loadNeighborhood() {
  try {
    return localStorage.getItem("mas-neighborhood") || "";
  } catch {
    return "";
  }
}

function loadCalls() {
  try {
    const stored = localStorage.getItem("mas-calls");
    if (!stored) return seedCalls;

    return (JSON.parse(stored) as CallItem[]).map((item) => ({
      ...item,
      address:
        item.address === "Localização informada pelo celular"
          ? "Endereço não informado"
          : item.address
    }));
  } catch {
    return seedCalls;
  }
}

function makeImageThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        resolve("");
        return;
      }

      const image = new Image();
      image.onload = () => {
        const size = 180;
        const scale = Math.min(size / image.width, size / image.height, 1);
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          resolve("");
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.68));
      };
      image.onerror = () => resolve("");
      image.src = reader.result;
    };

    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function makeVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    let finished = false;

    const finish = (value = "") => {
      if (finished) return;
      finished = true;
      URL.revokeObjectURL(url);
      resolve(value);
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.onloadeddata = () => {
      try {
        const canvas = document.createElement("canvas");
        const max = 180;
        const scale = Math.min(max / video.videoWidth, max / video.videoHeight, 1);
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          finish();
          return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        finish(canvas.toDataURL("image/jpeg", 0.65));
      } catch {
        finish();
      }
    };

    video.onerror = () => finish();
    video.src = url;
  });
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [step, setStep] = useState(1);
  const [calls, setCalls] = useState<CallItem[]>(loadCalls);
  const [selectedCall, setSelectedCall] = useState<CallItem | null>(null);
  const [detailReturnScreen, setDetailReturnScreen] = useState<Screen>("calls");
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(loadNeighborhood);
  const [neighborhoodDraft, setNeighborhoodDraft] = useState<string>(loadNeighborhood);
  const [showNeighborhoodPicker, setShowNeighborhoodPicker] = useState(() => !loadNeighborhood());
  const [latestProtocol, setLatestProtocol] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMoreNeighborhoodCalls, setShowMoreNeighborhoodCalls] = useState(false);
  const galleryInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const confirmNeighborhood = () => {
    const neighborhood = neighborhoodDraft.trim();
    if (!rioNeighborhoods.includes(neighborhood)) return;

    setSelectedNeighborhood(neighborhood);
    setShowNeighborhoodPicker(false);
    setForm((current) => ({
      ...current,
      neighborhood: current.neighborhood || neighborhood
    }));

    try {
      localStorage.setItem("mas-neighborhood", neighborhood);
    } catch {
      // A escolha continua válida durante a sessão mesmo sem armazenamento local.
    }
  };

  const openNeighborhoodPicker = () => {
    setNeighborhoodDraft(selectedNeighborhood);
    setShowNeighborhoodPicker(true);
  };

  const persistCalls = (next: CallItem[]) => {
    setCalls(next);
    try {
      const safeForStorage = next.map(({ mediaPreview, ...item }) => item);
      localStorage.setItem("mas-calls", JSON.stringify(safeForStorage));
    } catch {
      // O protótipo continua funcionando na sessão mesmo se o armazenamento local estiver cheio.
    }
  };

  const startNew = (category = "") => {
    setForm({ ...initialForm, category, neighborhood: selectedNeighborhood });
    setMediaError("");
    setIsSubmitting(false);
    setStep(category && category !== "Outro" ? 2 : 1);
    setScreen("new");
  };

  const openCall = (item: CallItem, returnTo: Screen = "calls") => {
    setSelectedCall(item);
    setDetailReturnScreen(returnTo);
    setScreen("detail");
  };

  const clearSelectedMedia = () => {
    setForm((current) => {
      if (current.mediaPreview.startsWith("blob:")) {
        URL.revokeObjectURL(current.mediaPreview);
      }
      return {
        ...current,
        mediaName: "",
        mediaType: "",
        mediaPreview: "",
        mediaThumbnail: ""
      };
    });
    setMediaError("");
    if (photoInput.current) photoInput.current.value = "";
    if (videoInput.current) videoInput.current.value = "";
    if (galleryInput.current) galleryInput.current.value = "";
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setMediaError("Escolha uma foto ou um vídeo válido.");
      return;
    }

    const maxSize = isImage ? 12_000_000 : 100_000_000;
    if (file.size > maxSize) {
      setMediaError(
        isImage
          ? "Essa foto está muito grande. Escolha uma imagem de até 12 MB."
          : "Esse vídeo está muito grande. Escolha um vídeo de até 100 MB."
      );
      return;
    }

    setMediaError("");

    const thumbnailPromise = isImage ? makeImageThumbnail(file) : makeVideoThumbnail(file);
    thumbnailPromise.then((thumbnail) => {
      if (!thumbnail) return;

      setForm((current) =>
        current.mediaName === file.name && current.mediaType === file.type
          ? { ...current, mediaThumbnail: thumbnail }
          : current
      );
    });

    setForm((current) => {
      if (current.mediaPreview.startsWith("blob:")) {
        URL.revokeObjectURL(current.mediaPreview);
      }
      return current;
    });

    if (isImage && file.size <= 1_500_000) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((current) => ({
          ...current,
          mediaName: file.name,
          mediaType: file.type,
          mediaPreview: typeof reader.result === "string" ? reader.result : "",
          mediaThumbnail: ""
        }));
      };
      reader.readAsDataURL(file);
      return;
    }

    const url = URL.createObjectURL(file);
    setForm((current) => ({
      ...current,
      mediaName: file.name,
      mediaType: file.type,
      mediaPreview: url,
      mediaThumbnail: ""
    }));
  };

  const submitCall = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const year = new Date().getFullYear();
    let suffix = Number(String(Date.now()).slice(-6));
    let protocol = `MAS-${year}-${String(suffix).padStart(6, "0")}`;

    while (calls.some((item) => item.protocol === protocol)) {
      suffix += 1;
      protocol = `MAS-${year}-${String(suffix).padStart(6, "0")}`;
    }

    const item: CallItem = {
      id: String(Date.now()),
      protocol,
      category: form.category === "Outro"
        ? form.otherDetails.trim() || "Outro"
        : form.category || "Outro",
      address:
        [form.address, form.number && "nº " + form.number, form.complement]
          .filter(Boolean)
          .join(", ") ||
        "Endereço não informado",
      neighborhood: form.neighborhood || "Bairro não informado",
      city: form.city || undefined,
      state: form.state || undefined,
      cep: form.cep || undefined,
      description: form.description.trim() || "Sem detalhes adicionais.",
      requesterName: form.requesterName.trim().replace(/\s+/g, " ") || undefined,
      reference: form.reference.trim() || undefined,
      status: "Recebido",
      date: new Date().toLocaleDateString("pt-BR"),
      mediaName: form.mediaName || undefined,
      mediaType: form.mediaType || undefined,
      mediaPreview: form.mediaPreview || undefined,
      mediaThumbnail: form.mediaThumbnail || undefined
    };

    persistCalls([item, ...calls]);
    setSelectedCall(item);
    setLatestProtocol(protocol);
    setScreen("success");
  };

  const notices = useMemo(
    () => [
      {
        title: "Chamado recebido",
        text: calls[0]
          ? calls[0].protocol + " entrou na fila de atendimento."
          : "Quando você registrar um chamado, as atualizações aparecerão aqui.",
        time: "Agora"
      },
      {
        title: "Ocorrência encaminhada",
        text: "Uma solicitação de iluminação foi encaminhada para análise da equipe responsável.",
        time: "Hoje"
      },
      {
        title: "Atualização concluída",
        text: "Uma ocorrência anterior foi marcada como resolvida.",
        time: "Ontem"
      }
    ],
    [calls]
  );

  const neighborhoodCalls = useMemo(
    () =>
      calls.filter(
        (item) =>
          item.neighborhood.trim().toLocaleLowerCase("pt-BR") ===
          selectedNeighborhood.trim().toLocaleLowerCase("pt-BR")
      ),
    [calls, selectedNeighborhood]
  );

  const resolvedCalls = useMemo(
    () =>
      calls
        .filter((item) => item.status === "Resolvido")
        .sort((a, b) => b.date.localeCompare(a.date, "pt-BR")),
    [calls]
  );

  const resolvedNeighborhoodCount = useMemo(
    () => new Set(resolvedCalls.map((item) => item.neighborhood).filter(Boolean)).size,
    [resolvedCalls]
  );

  const latestResolved = resolvedCalls[0];
  const activeCallCount = calls.filter((item) => item.status !== "Resolvido").length;

  const similarCalls = useMemo(() => {
    if (!form.category || form.category === "Outro") return [];

    return calls.filter(
      (item) =>
        item.category === form.category &&
        item.neighborhood.trim().toLocaleLowerCase("pt-BR") ===
          (form.neighborhood || selectedNeighborhood).trim().toLocaleLowerCase("pt-BR") &&
        item.status !== "Resolvido"
    );
  }, [calls, form.category, form.neighborhood, selectedNeighborhood]);

  const renderHeader = (title?: string, back?: () => void) => (
    <header className="topbar">
      <div className="topbar-row">
        {back ? (
          <button type="button" className="icon-button" onClick={back} aria-label="Voltar">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="brand-mark"><MapPin size={18} /></div>
        )}
        <div className="topbar-title">
          <strong>{title || "Me Ajuda Serginho"}</strong>
          {!title && <span>Protótipo demonstrativo</span>}
        </div>
        <div className="topbar-spacer" />
      </div>
    </header>
  );

  const BottomNav = () => (
    <nav className="bottom-nav">
      <button type="button" className={screen === "home" ? "active" : ""} onClick={() => setScreen("home")}>
        <Home size={20} />
        <span>Início</span>
      </button>
      <button type="button" className={screen === "calls" ? "active" : ""} onClick={() => setScreen("calls")}>
        <ClipboardList size={20} />
        <span>Chamados</span>
      </button>
      <button type="button" className="new-button" onClick={() => startNew()}>
        <Plus size={20} />
        <span>Novo</span>
      </button>
      <button type="button" className={screen === "notices" ? "active" : ""} onClick={() => setScreen("notices")}>
        <Bell size={20} />
        <span>Avisos</span>
      </button>
    </nav>
  );

  const NeighborhoodPicker = () => (
    <main className="neighborhood-screen">
      <div className="neighborhood-brand">
        <div className="brand-mark"><MapPin size={22} /></div>
        <span>Me Ajuda Serginho</span>
      </div>

      <div className="neighborhood-intro">
        <span className="eyebrow">Seu bairro</span>
        <h1>Qual bairro você quer acompanhar?</h1>
        <p>
          Escolha um bairro do Rio de Janeiro para deixar o app mais prático para você.
          Essa escolha será usada como padrão nos novos chamados e pode ser alterada quando quiser.
        </p>
      </div>

      <label className="neighborhood-select-card">
        <span>Selecione o bairro</span>
        <select
          value={neighborhoodDraft}
          onChange={(e) => setNeighborhoodDraft(e.target.value)}
        >
          <option value="">Escolha um bairro...</option>
          {rioNeighborhoods.map((neighborhood) => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </label>

      <div className="neighborhood-note">
        <MapPin size={18} />
        <span>
          O bairro escolhido aqui não precisa ser o seu endereço residencial. Nos chamados,
          você sempre poderá informar o bairro exato onde o problema está.
        </span>
      </div>

      <button
        type="button"
        className="primary full neighborhood-continue"
        disabled={!rioNeighborhoods.includes(neighborhoodDraft)}
        onClick={confirmNeighborhood}
      >
        Continuar <ChevronRight size={19} />
      </button>

      {selectedNeighborhood && (
        <button
          type="button"
          className="neighborhood-cancel"
          onClick={() => {
            setNeighborhoodDraft(selectedNeighborhood);
            setShowNeighborhoodPicker(false);
          }}
        >
          Cancelar
        </button>
      )}
    </main>
  );

  const HomeScreen = () => (
    <>
      {renderHeader()}
      <main className="content home-content">
        {selectedNeighborhood && (
          <button type="button" className="home-neighborhood" onClick={openNeighborhoodPicker}>
            <span className="home-neighborhood-icon"><MapPin size={17} /></span>
            <div>
              <small>Bairro acompanhado</small>
              <strong>{selectedNeighborhood}</strong>
            </div>
            <span className="home-neighborhood-change">Trocar</span>
          </button>
        )}

        <section className="home-primary-action">
          <div className="home-primary-copy">
            <span className="eyebrow">Novo chamado</span>
            <h1>Encontrou um problema no bairro?</h1>
            <p>Envie o local, uma foto ou vídeo e acompanhe o andamento.</p>
          </div>
          <button type="button" className="primary home-primary-button" onClick={() => startNew()}>
            <Camera size={19} />
            Registrar problema
          </button>
        </section>

        <section className="home-section">
          <div className="section-heading home-section-heading">
            <div>
              <small>Comunidade</small>
              <h2>Acontecendo em {selectedNeighborhood || "seu bairro"}</h2>
            </div>
            <span className="community-count">
              {neighborhoodCalls.length} {neighborhoodCalls.length === 1 ? "pedido" : "pedidos"}
            </span>
          </div>

          {neighborhoodCalls.length === 0 ? (
            <div className="community-empty">
              <MapPin size={22} />
              <strong>Ainda não há pedidos neste bairro</strong>
              <span>Quando alguém registrar um problema aqui, ele aparecerá nesta área.</span>
            </div>
          ) : (
            <>
              <div className="community-list">
                {neighborhoodCalls
                  .slice(0, showMoreNeighborhoodCalls ? 8 : 3)
                  .map((item) => (
                    <button
                      type="button"
                      className="community-card"
                      key={item.id}
                      onClick={() => openCall(item, "home")}
                    >
                      <CallThumbnail item={item} />
                      <div className="community-card-body">
                        <strong>{item.category}</strong>
                        <span className="community-author">
                          Enviado por {item.requesterName || "Morador(a)"}
                        </span>
                        <small>{item.address}</small>
                      </div>
                      <StatusBadge status={item.status} />
                    </button>
                  ))}
              </div>

              {neighborhoodCalls.length > 3 && (
                <button
                  type="button"
                  className="home-inline-action"
                  onClick={() => setShowMoreNeighborhoodCalls((current) => !current)}
                >
                  {showMoreNeighborhoodCalls ? "Mostrar menos" : "Ver mais pedidos"}
                  <ChevronRight size={16} />
                </button>
              )}
            </>
          )}
        </section>

        <section className="home-section">
          <div className="section-heading home-section-heading">
            <div>
              <small>Atalhos</small>
              <h2>O que você encontrou?</h2>
            </div>
          </div>

          <div className="home-category-grid">
            {categories.slice(0, 4).map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                className="home-category-card"
                onClick={() => startNew(label)}
              >
                <span className="home-category-icon"><Icon size={19} /></span>
                <span>{label.replace(" na rua", "")}</span>
              </button>
            ))}
            <button type="button" className="home-category-card" onClick={() => startNew()}>
              <span className="home-category-icon"><Menu size={19} /></span>
              <span>Mais</span>
            </button>
          </div>
        </section>

        <section className="resolved-home-section">
          <div className="impact-panel">
            <div className="impact-panel-top">
              <div>
                <span className="impact-kicker">Resultados registrados</span>
                <h2>O que já foi resolvido</h2>
                <p>Chamados finalizados com local e data registrados no sistema.</p>
              </div>
              <span className="impact-seal"><CheckCircle2 size={24} /></span>
            </div>

            <div className="impact-stats">
              <div className="impact-stat">
                <strong>{resolvedCalls.length}</strong>
                <span>{resolvedCalls.length === 1 ? "serviço concluído" : "serviços concluídos"}</span>
              </div>
              <div className="impact-stat">
                <strong>{resolvedNeighborhoodCount}</strong>
                <span>{resolvedNeighborhoodCount === 1 ? "bairro com resolução" : "bairros com resolução"}</span>
              </div>
            </div>

            {latestResolved ? (
              <button
                type="button"
                className="impact-featured"
                onClick={() => openCall(latestResolved, "home")}
              >
                <div className="impact-featured-media">
                  <CallThumbnail item={latestResolved} />
                  <span><Check size={12} /> Concluído</span>
                </div>
                <div className="impact-featured-body">
                  <small>Conclusão mais recente</small>
                  <strong>{latestResolved.category}</strong>
                  <span>{latestResolved.address}</span>
                  <em>{latestResolved.neighborhood} · {latestResolved.date}</em>
                </div>
                <ChevronRight size={18} />
              </button>
            ) : (
              <div className="resolved-empty impact-empty">
                <CheckCircle2 size={23} />
                <strong>Nenhum serviço concluído registrado ainda</strong>
                <span>Quando um chamado for finalizado, ele aparecerá aqui.</span>
              </div>
            )}

            <button type="button" className="impact-history-button" onClick={() => setScreen("resolved")}>
              Ver histórico completo <ChevronRight size={17} />
            </button>
          </div>
        </section>

        <section className="home-section home-my-calls">
          <div className="section-heading home-section-heading">
            <div>
              <small>Acompanhamento</small>
              <h2>Seus chamados</h2>
            </div>
            <button type="button" className="text-button" onClick={() => setScreen("calls")}>Ver todos</button>
          </div>

          <div className="my-calls-summary">
            <div>
              <strong>{activeCallCount}</strong>
              <span>em andamento</span>
            </div>
            <div>
              <strong>{resolvedCalls.length}</strong>
              <span>resolvidos</span>
            </div>
          </div>

          <div className="stack home-call-stack">
            {calls.slice(0, 2).map((item) => (
              <button type="button" className="call-card" key={item.id} onClick={() => openCall(item, "home")}>
                <div className="call-main">
                  <CallThumbnail item={item} />
                  <div>
                    <strong>{item.category}</strong>
                    <span>{item.address}</span>
                    <small>{item.protocol}</small>
                  </div>
                </div>
                <div className="call-side">
                  <StatusBadge status={item.status} />
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );

  const renderNewCallScreen = () => (
    <>
      {renderHeader("Novo chamado", () => {
        if (step > 1) setStep(step - 1);
        else setScreen("home");
      })}
      <main className="content form-content">
        <div className="progress-wrap">
          <div className="progress-label"><span>Etapa {step} de 4</span><span>{step * 25}%</span></div>
          <div className="progress-track"><div style={{ width: step * 25 + "%" }} /></div>
        </div>

        {step === 1 && (
          <section>
            <span className="eyebrow">Identifique</span>
            <h1 className="page-title">O que está acontecendo?</h1>
            <p className="page-subtitle">Escolha a opção que melhor descreve o problema.</p>
            <div className="category-grid large">
              {categories.map(({ label, icon: Icon }) => (
                <button type="button"
                  key={label}
                  className={"category-card " + (form.category === label ? "selected" : "")}
                  onClick={() =>
                    setForm({
                      ...form,
                      category: label,
                      otherDetails: label === "Outro" ? form.otherDetails : ""
                    })
                  }
                >
                  <span className="category-icon"><Icon size={22} /></span>
                  <span>{label}</span>
                  {form.category === label && <CheckCircle2 size={18} className="selected-check" />}
                </button>
              ))}
            </div>

            {form.category === "Outro" && (
              <div className="other-problem-box">
                <label className="field">
                  <span>Qual é o problema?</span>
                  <input
                    autoFocus
                    value={form.otherDetails}
                    placeholder="Ex.: árvore caída, vazamento, praça danificada..."
                    onChange={(e) => setForm({ ...form, otherDetails: e.target.value })}
                  />
                </label>
                <p className="other-problem-help">
                  Escreva em poucas palavras para a equipe identificar corretamente o tipo de ocorrência.
                </p>
              </div>
            )}

            {similarCalls.length > 0 && (
              <div className="similar-reports">
                <div className="similar-reports-heading">
                  <span className="similar-reports-icon"><ClipboardList size={18} /></span>
                  <div>
                    <strong>Já existe {similarCalls.length === 1 ? "um pedido parecido" : "pedidos parecidos"} neste bairro</strong>
                    <span>Confira antes de registrar outro chamado para o mesmo problema.</span>
                  </div>
                </div>

                <div className="similar-reports-list">
                  {similarCalls.slice(0, 3).map((item) => (
                    <button type="button" key={item.id} onClick={() => openCall(item, "new")}>
                      <div>
                        <strong>{item.category}</strong>
                        <span>{item.address}</span>
                        <small>Enviado por {item.requesterName || "Morador(a)"}</small>
                      </div>
                      <ChevronRight size={17} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="button"
              className="primary full"
              disabled={!form.category || (form.category === "Outro" && !form.otherDetails.trim())}
              onClick={() => setStep(2)}
            >
              Continuar <ChevronRight size={19} />
            </button>
          </section>
        )}

        {step === 2 && (
          <section>
            <span className="eyebrow">Evidência</span>
            <h1 className="page-title">Mostre o problema</h1>
            <p className="page-subtitle">
              Registre imagens que ajudem a equipe a entender o que aconteceu e a encontrar o ponto certo quando chegar ao local.
            </p>

            <div className="media-guidance">
              <div className="media-guidance-item">
                <Camera size={18} />
                <div>
                  <strong>Na foto</strong>
                  <span>Mostre o problema de forma clara e, se puder, inclua algum detalhe do entorno que ajude a reconhecer o local.</span>
                </div>
              </div>
              <div className="media-guidance-item">
                <Video size={18} />
                <div>
                  <strong>No vídeo</strong>
                  <span>Mostre o problema e um pouco da localidade ao redor, como esquina, fachada, poste, placa ou outro ponto de referência.</span>
                </div>
              </div>
            </div>

            {form.mediaPreview ? (
              <div className="media-preview">
                {form.mediaType.startsWith("video/") ? (
                  <video src={form.mediaPreview} controls playsInline />
                ) : (
                  <img src={form.mediaPreview} alt="Prévia selecionada" />
                )}
                <button type="button" className="remove-media" onClick={clearSelectedMedia} aria-label="Remover mídia">
                  <X size={18} />
                </button>
                <div className="media-caption">
                  <FileImage size={17} />
                  <span>{form.mediaName}</span>
                </div>
              </div>
            ) : (
              <div className="media-empty">
                <div className="media-empty-icon"><Camera size={32} /></div>
                <strong>Adicione uma foto ou vídeo</strong>
                <span>Quanto mais fácil for reconhecer o problema e o local, melhor será para a equipe encontrar o ponto correto.</span>
              </div>
            )}

            {mediaError && <div className="media-error">{mediaError}</div>}

            <div className="media-actions">
              <button type="button" onClick={() => photoInput.current?.click()}><Camera size={19} /> Tirar foto</button>
              <button type="button" onClick={() => videoInput.current?.click()}><Video size={19} /> Gravar vídeo</button>
              <button type="button" onClick={() => galleryInput.current?.click()}><Upload size={19} /> Escolher da galeria</button>
            </div>
            <input ref={photoInput} hidden type="file" accept="image/*" capture="environment" onChange={(e) => { handleFile(e.target.files?.[0]); e.currentTarget.value = ""; }} />
            <input ref={videoInput} hidden type="file" accept="video/*" capture="environment" onChange={(e) => { handleFile(e.target.files?.[0]); e.currentTarget.value = ""; }} />
            <input ref={galleryInput} hidden type="file" accept="image/*,video/*" onChange={(e) => { handleFile(e.target.files?.[0]); e.currentTarget.value = ""; }} />

            <button type="button" className="primary full" onClick={() => setStep(3)}>
              Continuar <ChevronRight size={19} />
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <span className="eyebrow">Local da ocorrência</span>
            <h1 className="page-title">Onde está o problema?</h1>
            <p className="page-subtitle">
              Informe o endereço do ponto que precisa de atenção.
            </p>

            <div className="occurrence-location-note">
              <MapPin size={19} />
              <div>
                <strong>Informe o local do problema</strong>
                <span>
                  Esses dados servem apenas para localizar a ocorrência. Não precisam ser o endereço da sua residência.
                </span>
              </div>
            </div>

            <label className="field">
              <span>Rua / Avenida</span>
              <input
                value={form.address}
                placeholder="Ex.: Rua das Flores"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Número</span>
              <input
                inputMode="numeric"
                value={form.number}
                placeholder="Ex.: 120"
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Complemento <em>opcional</em></span>
              <input
                value={form.complement}
                placeholder="Ex.: casa 2, bloco B"
                onChange={(e) => setForm({ ...form, complement: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Bairro</span>
              <input
                list={
                  form.city.trim().toLocaleLowerCase("pt-BR").includes("rio de janeiro")
                    ? "rio-neighborhoods"
                    : undefined
                }
                value={form.neighborhood}
                placeholder="Ex.: Tijuca"
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
              />
              {form.city.trim().toLocaleLowerCase("pt-BR").includes("rio de janeiro") && (
                <datalist id="rio-neighborhoods">
                  {rioNeighborhoods.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood} />
                  ))}
                </datalist>
              )}
            </label>

            <label className="field">
              <span>CEP</span>
              <input
                inputMode="numeric"
                value={form.cep}
                placeholder="Ex.: 20000-000"
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Cidade</span>
              <input
                value={form.city}
                placeholder="Ex.: Rio de Janeiro"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>

            <label className="field">
              <span>UF</span>
              <input
                maxLength={2}
                value={form.state}
                placeholder="Ex.: RJ"
                onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
              />
            </label>

            <button type="button"
              className="primary full"
              disabled={
                !form.address.trim() ||
                !form.neighborhood.trim() ||
                !form.city.trim() ||
                !form.state.trim()
              }
              onClick={() => setStep(4)}
            >
              Continuar <ChevronRight size={19} />
            </button>
          </section>
        )}

        {step === 4 && (
          <section>
            <span className="eyebrow">Últimos detalhes</span>
            <h1 className="page-title">Conte mais detalhes</h1>
            <p className="page-subtitle">Descreva o que está acontecendo para facilitar a análise.</p>

            <div className="public-name-note">
              <span className="public-name-icon"><MapPin size={17} /></span>
              <div>
                <strong>Como seu pedido aparecerá no bairro</strong>
                <span>Seu nome e sobrenome ficarão visíveis junto ao chamado para ajudar os moradores a identificar pedidos já existentes.</span>
              </div>
            </div>

            <label className="field">
              <span>Nome e sobrenome</span>
              <input
                autoComplete="name"
                value={form.requesterName}
                placeholder="Ex.: Mônica Silva"
                onChange={(e) => setForm({ ...form, requesterName: e.target.value })}
              />
              <small className="field-help">Informe pelo menos nome e sobrenome.</small>
            </label>

            <label className="field">
              <span>Descrição</span>
              <textarea
                rows={5}
                value={form.description}
                placeholder="Conte o que você observou..."
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Ponto de referência <em>opcional</em></span>
              <input
                value={form.reference}
                placeholder="Ex.: em frente à farmácia"
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
              />
            </label>

            <div className="summary-card">
              <div className="summary-title"><MessageSquareText size={19} /> Resumo do chamado</div>
              <SummaryRow
                label="Categoria"
                value={form.category === "Outro" ? form.otherDetails || "Outro" : form.category}
              />
              <SummaryRow
                label="Local"
                value={
                  [form.address, form.number && "nº " + form.number, form.complement]
                    .filter(Boolean)
                    .join(", ") || "Endereço não informado"
                }
              />
              <SummaryRow
                label="Bairro"
                value={[form.neighborhood, form.city, form.state].filter(Boolean).join(" · ") || "Não informado"}
              />
              <SummaryRow label="CEP" value={form.cep || "Não informado"} />
              <SummaryRow label="Enviado por" value={form.requesterName.trim().replace(/\s+/g, " ") || "Não informado"} />
              <SummaryRow label="Mídia" value={form.mediaName || "Sem mídia"} />
            </div>

            <button
              type="button"
              className="primary full send"
              onClick={submitCall}
              disabled={
                isSubmitting ||
                form.requesterName.trim().split(/\s+/).filter(Boolean).length < 2
              }
            >
              <Send size={19} /> {isSubmitting ? "Enviando..." : "Enviar chamado"}
            </button>
          </section>
        )}
      </main>
    </>
  );

  const CallsScreen = () => {
    const [filter, setFilter] = useState<"Todos" | Status>("Todos");
    const filtered = filter === "Todos" ? calls : calls.filter((item) => item.status === filter);
    return (
      <>
        {renderHeader("Meus chamados")}
        <main className="content">
          <div className="page-intro">
            <span className="eyebrow">Acompanhamento</span>
            <h1 className="page-title">Meus chamados</h1>
            <p className="page-subtitle">Acompanhe cada solicitação pelo protocolo e pelo status.</p>
          </div>
          <div className="filter-row">
            {(["Todos", ...statusOrder] as const).map((item) => (
              <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="stack">
            {filtered.length === 0 && (
              <div className="empty-state">
                <ClipboardList size={24} />
                <strong>Nenhum chamado por aqui</strong>
                <span>Não há solicitações com esse status no momento.</span>
              </div>
            )}
            {filtered.map((item) => (
              <button type="button" className="call-card vertical" key={item.id} onClick={() => openCall(item, "calls")}>
                <div className="call-card-top">
                  <div className="call-main">
                    <CallThumbnail item={item} />
                    <div>
                      <strong>{item.category}</strong>
                      <span>{item.address}</span>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="call-meta">
                  <span>{item.protocol}</span>
                  <span>{item.date}</span>
                  <ChevronRight size={17} />
                </div>
              </button>
            ))}
          </div>
        </main>
        <BottomNav />
      </>
    );
  };

  const ResolvedScreen = () => (
    <>
      {renderHeader("Serviços concluídos", () => setScreen("home"))}
      <main className="content">
        <div className="resolved-page-hero">
          <span className="eyebrow">Histórico público</span>
          <h1>Resultados registrados</h1>
          <p>Chamados concluídos com local, data e situação registrados no sistema.</p>

          <div className="resolved-page-stats">
            <div>
              <strong>{resolvedCalls.length}</strong>
              <span>concluídos</span>
            </div>
            <div>
              <strong>{resolvedNeighborhoodCount}</strong>
              <span>bairros</span>
            </div>
          </div>
        </div>

        {resolvedCalls.length === 0 ? (
          <div className="resolved-empty large">
            <CheckCircle2 size={28} />
            <strong>Nenhum chamado resolvido registrado ainda</strong>
            <span>Os atendimentos concluídos aparecerão aqui automaticamente.</span>
          </div>
        ) : (
          <div className="resolved-wall">
            {resolvedCalls.map((item) => (
              <button
                type="button"
                className="resolved-wall-card"
                key={item.id}
                onClick={() => openCall(item, "resolved")}
              >
                <div className="resolved-wall-media">
                  <CallThumbnail item={item} />
                  <span className="resolved-badge">
                    <Check size={12} /> Resolvido
                  </span>
                </div>
                <div className="resolved-wall-body">
                  <strong>{item.category}</strong>
                  <span>{item.address}</span>
                  <small>{item.neighborhood} · {item.date}</small>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );

  const DetailScreen = () => {
    if (!selectedCall) return null;
    const currentIndex = statusOrder.indexOf(selectedCall.status);
    return (
      <>
        {renderHeader("Detalhes do chamado", () => setScreen(detailReturnScreen))}
        <main className="content">
          {selectedCall.mediaPreview ? (
            <div className="detail-media">
              {selectedCall.mediaType?.startsWith("video/") ? (
                <video src={selectedCall.mediaPreview} controls playsInline />
              ) : (
                <img src={selectedCall.mediaPreview} alt="Registro da ocorrência" />
              )}
            </div>
          ) : selectedCall.mediaName ? (
            <div className="media-saved-note">
              <FileImage size={18} />
              <div>
                <strong>Mídia registrada</strong>
                <span>{selectedCall.mediaName}</span>
              </div>
            </div>
          ) : null}
          <div className="detail-header">
            <div>
              <span className="protocol">{selectedCall.protocol}</span>
              <h1 className="page-title">{selectedCall.category}</h1>
            </div>
            <StatusBadge status={selectedCall.status} />
          </div>

          <div className="detail-info">
            <InfoLine
              icon={<MapPin size={18} />}
              label="Local"
              value={[
                selectedCall.address,
                selectedCall.neighborhood,
                [selectedCall.city, selectedCall.state].filter(Boolean).join(" - "),
                selectedCall.cep
              ].filter(Boolean).join(" · ")}
            />
            <InfoLine
              icon={<MessageSquareText size={18} />}
              label="Enviado por"
              value={selectedCall.requesterName || "Morador(a)"}
            />
            <InfoLine icon={<MessageSquareText size={18} />} label="Descrição" value={selectedCall.description} />
            {selectedCall.reference && (
              <InfoLine icon={<MapPin size={18} />} label="Ponto de referência" value={selectedCall.reference} />
            )}
          </div>

          <section className="timeline-card">
            <div className="summary-title"><ClipboardList size={19} /> Andamento</div>
            <div className="timeline">
              {statusOrder.map((status, index) => (
                <div className={"timeline-item " + (index <= currentIndex ? "done" : "")} key={status}>
                  <div className="timeline-dot">{index <= currentIndex ? <Check size={14} /> : null}</div>
                  <div>
                    <strong>{status}</strong>
                    <span>{index === currentIndex ? "Etapa atual" : index < currentIndex ? "Concluída" : "Aguardando"}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="update-card">
            <div className="update-icon"><Bell size={20} /></div>
            <div>
              <small>Atualização da equipe</small>
              <strong>Seu chamado está registrado no sistema.</strong>
              <p>As próximas atualizações aparecerão aqui conforme o atendimento avançar.</p>
            </div>
          </section>
        </main>
      </>
    );
  };

  const NoticesScreen = () => (
    <>
      {renderHeader("Avisos")}
      <main className="content">
        <div className="page-intro">
          <span className="eyebrow">Atualizações</span>
          <h1 className="page-title">Avisos</h1>
          <p className="page-subtitle">Acompanhe novidades relacionadas aos seus chamados.</p>
        </div>
        <div className="notice-list">
          {notices.map((notice, index) => (
            <div className="notice-card" key={index}>
              <span className="notice-icon"><Bell size={18} /></span>
              <div>
                <strong>{notice.title}</strong>
                <p>{notice.text}</p>
                <small>{notice.time}</small>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );

  const SuccessScreen = () => (
    <main className="success-screen">
      <div className="success-icon"><Check size={42} /></div>
      <span className="eyebrow">Tudo certo</span>
      <h1>Chamado enviado!</h1>
      <p>Sua solicitação foi registrada. Guarde o protocolo para acompanhar o andamento.</p>
      <div className="protocol-card">
        <small>Seu protocolo</small>
        <strong>{latestProtocol}</strong>
      </div>
      <button type="button" className="primary full" onClick={() => selectedCall && openCall(selectedCall, "calls")}>
        <ClipboardList size={19} /> Acompanhar chamado
      </button>
      <button type="button" className="secondary full" onClick={() => setScreen("home")}>Voltar ao início</button>
    </main>
  );

  return (
    <div className="app-shell">
      <div className="phone">
        {showNeighborhoodPicker ? (
          <NeighborhoodPicker />
        ) : (
          <>
            {screen === "home" && <HomeScreen />}
        {screen === "new" && renderNewCallScreen()}
        {screen === "calls" && <CallsScreen />}
        {screen === "detail" && <DetailScreen />}
        {screen === "notices" && <NoticesScreen />}
            {screen === "resolved" && <ResolvedScreen />}
            {screen === "success" && <SuccessScreen />}
          </>
        )}
      </div>
    </div>
  );
}

function CallThumbnail({ item }: { item: CallItem }) {
  const thumbnail = item.mediaThumbnail || (
    item.mediaType?.startsWith("image/") ? item.mediaPreview : undefined
  );

  if (!thumbnail) {
    return <span className="call-icon"><CircleDot size={18} /></span>;
  }

  const isVideo = item.mediaType?.startsWith("video/");

  return (
    <span className="call-thumbnail">
      <img src={thumbnail} alt="" />
      {isVideo && (
        <span className="call-thumbnail-play" aria-hidden="true">
          <Play size={11} fill="currentColor" />
        </span>
      )}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const key = status.toLowerCase().replace(" ", "-").replace("á", "a");
  return <span className={"status " + key}>{status}</span>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="summary-row"><span>{label}</span><strong>{value}</strong></div>;
}

function InfoLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="info-line">
      <span className="info-icon">{icon}</span>
      <div><small>{label}</small><strong>{value}</strong></div>
    </div>
  );
}

export default App;
