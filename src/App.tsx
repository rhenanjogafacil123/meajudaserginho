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
  LocateFixed,
  MapPin,
  Menu,
  MessageSquareText,
  Navigation,
  Plus,
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
type Screen = "home" | "new" | "calls" | "detail" | "notices" | "success";

type CallItem = {
  id: string;
  protocol: string;
  category: string;
  address: string;
  neighborhood: string;
  description: string;
  reference?: string;
  status: Status;
  date: string;
  mediaName?: string;
  mediaType?: string;
  mediaPreview?: string;
  coordinates?: { lat: number; lng: number };
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
  reference: string;
  mediaName: string;
  mediaType: string;
  mediaPreview: string;
  coordinates?: { lat: number; lng: number };
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
  "Anil", "Bancários", "Bangu", "Barra da Tijuca", "Barra de Guaratiba",
  "Barros Filho", "Benfica", "Bento Ribeiro", "Bonsucesso", "Botafogo",
  "Brás de Pina", "Cachambi", "Cacuia", "Caju", "Camorim", "Campinho",
  "Campo dos Afonsos", "Campo Grande", "Cascadura", "Catete", "Catumbi",
  "Cavalcanti", "Centro", "Cidade de Deus", "Cidade Nova", "Cidade Universitária",
  "Cocotá", "Coelho Neto", "Colégio", "Complexo do Alemão", "Copacabana",
  "Cordovil", "Cosme Velho", "Cosmos", "Costa Barros", "Curicica",
  "Del Castilho", "Deodoro", "Encantado", "Engenheiro Leal", "Engenho da Rainha",
  "Engenho de Dentro", "Engenho Novo", "Estácio", "Flamengo",
  "Freguesia (Ilha)", "Freguesia (Jacarepaguá)", "Galeão", "Gamboa",
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
  "São Cristóvão", "São Francisco Xavier", "Saúde", "Senador Camará",
  "Senador Vasconcelos", "Sepetiba", "Tanque", "Taquara", "Tauá", "Tijuca",
  "Todos os Santos", "Tomás Coelho", "Turiaçu", "Urca", "Vargem Grande",
  "Vargem Pequena", "Vasco da Gama", "Vaz Lobo", "Vicente de Carvalho",
  "Vidigal", "Vigário Geral", "Vila da Penha", "Vila Isabel", "Vila Kennedy",
  "Vila Kosmos", "Vila Militar", "Vila Valqueire", "Vista Alegre", "Zumbi"
];

const seedCalls: CallItem[] = [
  {
    id: "seed-1",
    protocol: "MAS-2026-1038",
    category: "Buraco na rua",
    address: "Rua das Palmeiras, 82",
    neighborhood: "Centro",
    description: "Buraco aumentando próximo à faixa de pedestres.",
    status: "Em análise",
    date: "18/09/2026"
  },
  {
    id: "seed-2",
    protocol: "MAS-2026-1021",
    category: "Iluminação",
    address: "Av. Central, 310",
    neighborhood: "Jardim Novo",
    description: "Poste sem iluminação há alguns dias.",
    status: "Encaminhado",
    date: "16/09/2026"
  },
  {
    id: "seed-3",
    protocol: "MAS-2026-0994",
    category: "Lixo/Entulho",
    address: "Rua do Sol, 14",
    neighborhood: "Boa Vista",
    description: "Entulho acumulado ao lado da calçada.",
    status: "Resolvido",
    date: "12/09/2026"
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
  city: "",
  state: "",
  description: "",
  reference: "",
  mediaName: "",
  mediaType: "",
  mediaPreview: ""
};

const statusOrder: Status[] = ["Recebido", "Em análise", "Encaminhado", "Resolvido"];

function loadCalls() {
  try {
    const stored = localStorage.getItem("mas-calls");
    return stored ? (JSON.parse(stored) as CallItem[]) : seedCalls;
  } catch {
    return seedCalls;
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [step, setStep] = useState(1);
  const [calls, setCalls] = useState<CallItem[]>(loadCalls);
  const [selectedCall, setSelectedCall] = useState<CallItem | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [latestProtocol, setLatestProtocol] = useState("");
  const galleryInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const persistCalls = (next: CallItem[]) => {
    setCalls(next);
    localStorage.setItem("mas-calls", JSON.stringify(next));
  };

  const startNew = (category = "") => {
    setForm({ ...initialForm, category });
    setStep(category && category !== "Outro" ? 2 : 1);
    setLocationMessage("");
    setScreen("new");
  };

  const openCall = (item: CallItem) => {
    setSelectedCall(item);
    setScreen("detail");
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        mediaName: file.name,
        mediaType: file.type,
        mediaPreview: typeof reader.result === "string" ? reader.result : ""
      }));
    };
    if (isImage && file.size <= 2_000_000) {
      reader.readAsDataURL(file);
    } else {
      const url = URL.createObjectURL(file);
      setForm((current) => ({
        ...current,
        mediaName: file.name,
        mediaType: file.type,
        mediaPreview: url
      }));
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Seu navegador não oferece geolocalização.");
      return;
    }

    setLocating(true);
    setLocationMessage("Buscando uma localização mais precisa...");

    let bestPosition: GeolocationPosition | null = null;
    let finished = false;
    let watchId = -1;

    const normalizeAddressPart = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .replace(/\b(rua|r\.?|avenida|av\.?|estrada|travessa|tv\.?)\b/g, "")
        .replace(/[^a-z0-9]/g, "");

    const stopWatching = () => {
      if (watchId >= 0) navigator.geolocation.clearWatch(watchId);
    };

    const resolveAddress = async (position: GeolocationPosition) => {
      if (finished) return;
      finished = true;
      stopWatching();

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy);

      setForm((current) => ({
        ...current,
        coordinates: { lat, lng }
      }));
      setLocationMessage(
        `Melhor localização encontrada (~${accuracy} m). Identificando o endereço...`
      );

      try {
        const reverseResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1&accept-language=pt-BR`
        );

        if (!reverseResponse.ok) {
          throw new Error("Falha no serviço de endereço.");
        }

        const reverse = await reverseResponse.json();
        const address = reverse.address || {};

        let street =
          address.road ||
          address.pedestrian ||
          address.residential ||
          address.footway ||
          address.path ||
          address.cycleway ||
          "";

        let number = accuracy <= 35 ? address.house_number || "" : "";
        let neighborhood =
          address.suburb ||
          address.neighbourhood ||
          address.quarter ||
          address.borough ||
          address.city_district ||
          "";

        let city =
          address.city ||
          address.town ||
          address.municipality ||
          address.village ||
          "";

        let state =
          String(address["ISO3166-2-lvl4"] || address["ISO3166-2-lvl6"] || "")
            .split("-")
            .pop() || "";

        let cep = accuracy <= 45 ? address.postcode || "" : "";

        const normalizedNeighborhood = String(neighborhood).trim().toLocaleLowerCase("pt-BR");
        const normalizedCity = String(city).trim().toLocaleLowerCase("pt-BR");
        const normalizedState = String(address.state || "").trim().toLocaleLowerCase("pt-BR");

        if (
          normalizedNeighborhood === normalizedCity ||
          normalizedNeighborhood === normalizedState ||
          normalizedNeighborhood === "rio de janeiro" ||
          normalizedNeighborhood === "rj"
        ) {
          neighborhood = "";
        }

        const cepDigits = String(cep).replace(/\D/g, "");

        if (cepDigits.length === 8) {
          try {
            const cepResponse = await fetch(
              `https://brasilapi.com.br/api/cep/v1/${cepDigits}`
            );

            if (cepResponse.ok) {
              const cepData = await cepResponse.json();
              const reverseStreet = normalizeAddressPart(String(street || ""));
              const cepStreet = normalizeAddressPart(String(cepData.street || ""));

              const streetsMatch =
                !reverseStreet ||
                !cepStreet ||
                reverseStreet.includes(cepStreet) ||
                cepStreet.includes(reverseStreet);

              if (streetsMatch) {
                street = street || cepData.street || "";

                const cepNeighborhood = String(cepData.neighborhood || "").trim();
                if (
                  cepNeighborhood &&
                  cepNeighborhood.toLocaleLowerCase("pt-BR") !==
                    String(cepData.city || city).trim().toLocaleLowerCase("pt-BR")
                ) {
                  neighborhood = cepNeighborhood;
                }

                city = cepData.city || city;
                state = cepData.state || state;
                cep = cepData.cep || cep;
              } else {
                cep = "";
              }
            }
          } catch {
            // Mantém somente os dados confiáveis obtidos pelas coordenadas.
          }
        }

        setForm((current) => ({
          ...current,
          coordinates: { lat, lng },
          address: street || current.address,
          number,
          neighborhood: neighborhood || current.neighborhood,
          cep,
          city: city || current.city,
          state: state || current.state
        }));

        const missing: string[] = [];
        if (!street) missing.push("rua");
        if (!number) missing.push("número");
        if (!neighborhood) missing.push("bairro");
        if (!cep) missing.push("CEP");

        if (missing.length === 0) {
          setLocationMessage(
            `Endereço encontrado com precisão aproximada de ${accuracy} m. Confira antes de continuar.`
          );
        } else {
          setLocationMessage(
            `Localização com precisão aproximada de ${accuracy} m. Confira e complete: ${missing.join(", ")}.`
          );
        }
      } catch {
        setLocationMessage(
          `Coordenadas obtidas com precisão aproximada de ${accuracy} m, mas o endereço não pôde ser confirmado. Preencha os campos manualmente.`
        );
      } finally {
        setLocating(false);
      }
    };

    const samplingTimer = window.setTimeout(() => {
      if (finished) return;

      if (bestPosition) {
        void resolveAddress(bestPosition);
      } else {
        finished = true;
        stopWatching();
        setLocating(false);
        setLocationMessage(
          "Não foi possível obter uma localização confiável. Tente novamente em um local com melhor sinal."
        );
      }
    }, 12000);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (finished) return;

        if (
          !bestPosition ||
          position.coords.accuracy < bestPosition.coords.accuracy
        ) {
          bestPosition = position;
          const currentAccuracy = Math.round(position.coords.accuracy);
          setLocationMessage(
            currentAccuracy <= 25
              ? `Boa precisão encontrada (~${currentAccuracy} m). Confirmando endereço...`
              : `Melhorando a precisão... agora ~${currentAccuracy} m.`
          );
        }

        if (position.coords.accuracy <= 25) {
          window.clearTimeout(samplingTimer);
          void resolveAddress(position);
        }
      },
      (error) => {
        if (finished) return;

        if (error.code === error.PERMISSION_DENIED) {
          finished = true;
          window.clearTimeout(samplingTimer);
          stopWatching();
          setLocating(false);
          setLocationMessage(
            "A localização precisa está bloqueada para este site. Libere a permissão de localização precisa no navegador e tente novamente."
          );
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    );
  };

  const submitCall = () => {
    const random = String(Math.floor(1000 + Math.random() * 8999));
    const protocol = "MAS-2026-" + random;
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
        "Localização informada pelo celular",
      neighborhood:
        [form.neighborhood, form.city, form.state, form.cep]
          .filter(Boolean)
          .join(" · ") ||
        "Bairro não informado",
      description: form.description || "Sem detalhes adicionais.",
      reference: form.reference,
      status: "Recebido",
      date: new Date().toLocaleDateString("pt-BR"),
      mediaName: form.mediaName,
      mediaType: form.mediaType,
      mediaPreview: form.mediaType.startsWith("image/") ? form.mediaPreview : undefined,
      coordinates: form.coordinates
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
        text: (calls[0]?.protocol || "MAS-2026-1048") + " entrou na fila de atendimento.",
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

  const HomeScreen = () => (
    <>
      {renderHeader()}
      <main className="content">
        <section className="hero">
          <span className="eyebrow">Cuidar do bairro começa por aqui</span>
          <h1>Como podemos ajudar seu bairro hoje?</h1>
          <p>Registre um problema em poucos passos e acompanhe o andamento pelo protocolo.</p>
          <button type="button" className="primary hero-action" onClick={() => startNew()}>
            <Camera size={20} />
            Registrar um problema
          </button>
        </section>

        <section>
          <div className="section-heading">
            <div>
              <small>Atalhos</small>
              <h2>O que você encontrou?</h2>
            </div>
          </div>
          <div className="category-grid">
            {categories.map(({ label, icon: Icon }) => (
              <button type="button" key={label} className="category-card" onClick={() => startNew(label)}>
                <span className="category-icon"><Icon size={21} /></span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="section-heading">
            <div>
              <small>Acompanhamento</small>
              <h2>Seus últimos chamados</h2>
            </div>
            <button type="button" className="text-button" onClick={() => setScreen("calls")}>Ver todos</button>
          </div>
          <div className="stack">
            {calls.slice(0, 2).map((item) => (
              <button type="button" className="call-card" key={item.id} onClick={() => openCall(item)}>
                <div className="call-main">
                  <span className="call-icon"><CircleDot size={18} /></span>
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
            <p className="page-subtitle">Uma foto ou vídeo ajuda a equipe a entender melhor a situação.</p>

            {form.mediaPreview ? (
              <div className="media-preview">
                {form.mediaType.startsWith("video/") ? (
                  <video src={form.mediaPreview} controls playsInline />
                ) : (
                  <img src={form.mediaPreview} alt="Prévia selecionada" />
                )}
                <button type="button" className="remove-media" onClick={() => setForm({ ...form, mediaName: "", mediaType: "", mediaPreview: "" })}>
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
                <span>É recomendado, mas não obrigatório nesta demonstração.</span>
              </div>
            )}

            <div className="media-actions">
              <button type="button" onClick={() => photoInput.current?.click()}><Camera size={19} /> Tirar foto</button>
              <button type="button" onClick={() => videoInput.current?.click()}><Video size={19} /> Gravar vídeo</button>
              <button type="button" onClick={() => galleryInput.current?.click()}><Upload size={19} /> Escolher da galeria</button>
            </div>
            <input ref={photoInput} hidden type="file" accept="image/*" capture="environment" onChange={(e) => handleFile(e.target.files?.[0])} />
            <input ref={videoInput} hidden type="file" accept="video/*" capture="environment" onChange={(e) => handleFile(e.target.files?.[0])} />
            <input ref={galleryInput} hidden type="file" accept="image/*,video/*" onChange={(e) => handleFile(e.target.files?.[0])} />

            <button type="button" className="primary full" onClick={() => setStep(3)}>
              Continuar <ChevronRight size={19} />
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <span className="eyebrow">Localização</span>
            <h1 className="page-title">Onde fica?</h1>
            <p className="page-subtitle">Use sua localização ou informe o endereço manualmente.</p>

            <button type="button" className="location-button" onClick={requestLocation} disabled={locating}>
              <LocateFixed size={21} />
              <div>
                <strong>{locating ? "Identificando localização..." : "Usar minha localização"}</strong>
                <span>Usaremos apenas para identificar a ocorrência.</span>
              </div>
              <ChevronRight size={18} />
            </button>

            {locationMessage && (
              <div className={"location-message " + (form.coordinates ? "success" : "")}>
                {form.coordinates ? <CheckCircle2 size={18} /> : <MapPin size={18} />}
                <span>{locationMessage}</span>
              </div>
            )}

            {form.coordinates && (
              <div className="coordinates">
                <MapPin size={17} />
                <div>
                  <strong>Localização identificada</strong>
                  <span>{form.coordinates.lat.toFixed(5)}, {form.coordinates.lng.toFixed(5)}</span>
                </div>
              </div>
            )}

            <div className="divider"><span>confira ou preencha os dados</span></div>

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
                placeholder="Ex.: 40000-000"
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Cidade</span>
              <input
                value={form.city}
                placeholder="Ex.: Salvador"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </label>

            <label className="field">
              <span>UF</span>
              <input
                maxLength={2}
                value={form.state}
                placeholder="Ex.: BA"
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
                    .join(", ") || "Localização do celular"
                }
              />
              <SummaryRow
                label="Bairro"
                value={[form.neighborhood, form.city, form.state].filter(Boolean).join(" · ") || "Não informado"}
              />
              <SummaryRow label="CEP" value={form.cep || "Não informado"} />
              <SummaryRow label="Mídia" value={form.mediaName || "Sem mídia"} />
            </div>

            <button type="button" className="primary full send" onClick={submitCall}>
              <Send size={19} /> Enviar chamado
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
            {filtered.map((item) => (
              <button type="button" className="call-card vertical" key={item.id} onClick={() => openCall(item)}>
                <div className="call-card-top">
                  <div className="call-main">
                    <span className="call-icon"><CircleDot size={18} /></span>
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

  const DetailScreen = () => {
    if (!selectedCall) return null;
    const currentIndex = statusOrder.indexOf(selectedCall.status);
    return (
      <>
        {renderHeader("Detalhes do chamado", () => setScreen("calls"))}
        <main className="content">
          {selectedCall.mediaPreview && (
            <div className="detail-media"><img src={selectedCall.mediaPreview} alt="Registro da ocorrência" /></div>
          )}
          <div className="detail-header">
            <div>
              <span className="protocol">{selectedCall.protocol}</span>
              <h1 className="page-title">{selectedCall.category}</h1>
            </div>
            <StatusBadge status={selectedCall.status} />
          </div>

          <div className="detail-info">
            <InfoLine icon={<MapPin size={18} />} label="Local" value={selectedCall.address + " · " + selectedCall.neighborhood} />
            <InfoLine icon={<MessageSquareText size={18} />} label="Descrição" value={selectedCall.description} />
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
      <button type="button" className="primary full" onClick={() => selectedCall && openCall(selectedCall)}>
        <ClipboardList size={19} /> Acompanhar chamado
      </button>
      <button type="button" className="secondary full" onClick={() => setScreen("home")}>Voltar ao início</button>
    </main>
  );

  return (
    <div className="app-shell">
      <div className="phone">
        {screen === "home" && <HomeScreen />}
        {screen === "new" && renderNewCallScreen()}
        {screen === "calls" && <CallsScreen />}
        {screen === "detail" && <DetailScreen />}
        {screen === "notices" && <NoticesScreen />}
        {screen === "success" && <SuccessScreen />}
      </div>
    </div>
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
