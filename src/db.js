// Mock Database and Simulator for AllCare

const SEED_CAREGIVERS = [
  {
    id: "cg_1",
    role: "caregiver",
    name: "Maria Silva",
    username: "mariasilva",
    email: "maria@allcare.com",
    avatar: "👵",
    specialty: "Idosos / Alzheimer",
    bio: "20+ anos de experiência dedicados ao cuidado com idosos de forma humanizada. Especializada em suporte para Alzheimer, Parkinson e administração cuidadosa de medicamentos. Amo ler histórias e dar atenção.",
    rate: 45,
    rating: 4.9,
    experience: "12 anos",
    location: "São Paulo, SP",
    phone: "(11) 98765-4321",
    reviews: [
      { id: "r_1", clientName: "João Pereira", rating: 5, comment: "Excelente profissional. Cuidou da minha mãe com muito carinho e paciência. Muito pontual.", date: "2026-05-15" },
      { id: "r_2", clientName: "Carla Ramos", rating: 5, comment: "Super atenciosa e prestativa. Recomendo muito para quem precisa de ajuda com idosos.", date: "2026-05-10" },
      { id: "r_3", clientName: "Marcos Lima", rating: 4, comment: "Muito profissional, conhece bastante sobre medicação. Recomendo.", date: "2026-04-22" }
    ],
    replies: {
      greeting: "Olá! Muito prazer. Como posso ajudar com os cuidados da sua família hoje?",
      proposal_high: "Perfeito! Achei a proposta excelente e o valor está de acordo. Acabei de aceitar o serviço, estou muito animada para ajudar!",
      proposal_low: "Olá, vi a sua proposta. Como tenho muita experiência com essa especialidade, meu valor mínimo é de R$ 45 por hora. Conseguimos ajustar?",
      info: "Tenho curso de cuidadora de idosos, primeiros socorros e bastante prática diária. Podemos agendar uma visita sem compromisso para nos conhecermos!",
      fallback: "Entendo. Estou disponível para tirar quaisquer dúvidas e ajustar a rotina conforme sua necessidade. Se quiser, pode enviar a proposta formal de contratação!"
    }
  },
  {
    id: "cg_2",
    role: "caregiver",
    name: "Pedro Santos",
    username: "pedrosantos",
    email: "pedro@allcare.com",
    avatar: "👨‍⚕️",
    specialty: "Pós-Operatório / Enfermagem",
    bio: "Enfermeiro técnico qualificado. Foco em reabilitação domiciliar, pós-operatório ortopédico, curativos complexos e assistência ao paciente acamado. Fisioterapia básica e estimulação motora.",
    rate: 60,
    rating: 4.8,
    experience: "5 anos",
    location: "Campinas, SP",
    phone: "(19) 99123-4567",
    reviews: [
      { id: "r_4", clientName: "Lucia Mendes", rating: 5, comment: "Excelente trabalho na recuperação da cirurgia de quadril do meu pai.", date: "2026-05-20" },
      { id: "r_5", clientName: "Roberto Silveira", rating: 4, comment: "Muito técnico e cuidadoso. Passa muita segurança.", date: "2026-05-02" }
    ],
    replies: {
      greeting: "Olá! Sou o Pedro. Como está o quadro do paciente e o que ele necessita no momento?",
      proposal_high: "Excelente. Proposta de horas e valores aceita. Vou separar os materiais necessários e estarei pronto no horário agendado.",
      proposal_low: "Boa tarde, meu valor por hora é R$ 60 devido aos procedimentos de enfermagem que realizo. Se puder ajustar a proposta para esse valor, fechamos na hora!",
      info: "Tenho formação técnica em enfermagem, registro ativo e experiência em UTI e homecare de alta complexidade.",
      fallback: "Certo. Fico à disposição para planejar o melhor cuidado pós-cirúrgico para seu familiar. Envie a proposta quando estiver pronto!"
    }
  },
  {
    id: "cg_3",
    role: "caregiver",
    name: "Ana Souza",
    username: "anasouza",
    email: "ana@allcare.com",
    avatar: "👩‍🏫",
    specialty: "Crianças / Necessidades Especiais",
    bio: "Pedagoga apaixonada por crianças. Trabalho com cuidado infantil focado em estimulação cognitiva, jogos educativos e cuidados específicos para crianças com autismo ou TDAH.",
    rate: 35,
    rating: 5.0,
    experience: "7 anos",
    location: "Santo André, SP",
    phone: "(11) 97777-8888",
    reviews: [
      { id: "r_6", clientName: "Juliana Costa", rating: 5, comment: "Incrível! Minha filha com autismo adorou a Ana. Ela usa métodos pedagógicos maravilhosos.", date: "2026-05-28" }
    ],
    replies: {
      greeting: "Olá! Que alegria conversar com você. Conte-me um pouco sobre a rotina da criança e o que ela mais gosta de fazer.",
      proposal_high: "Que ótimo! Adorei a proposta. Já confirmei aqui o agendamento. Vai ser um prazer cuidar e brincar com seu pequeno!",
      proposal_low: "Olá, agradeço o contato. Para esse tipo de atendimento especializado, meu valor hora é R$ 35. Se puder subir um pouco a proposta, ficarei feliz em atender!",
      info: "Além de cuidadora, sou pedagoga com pós em neuroeducação infantil. Trabalho muito com reforço escolar lúdico.",
      fallback: "Entendi! Me avise qual a rotina ideal. Você pode lançar a proposta diretamente na nossa conversa para eu confirmar."
    }
  },
  {
    id: "cg_4",
    role: "caregiver",
    name: "Carla Oliveira",
    username: "carlaoliveira",
    email: "carla@allcare.com",
    avatar: "👩",
    specialty: "Companhia e Rotina",
    bio: "Ofereço companhia ativa para passeios, consultas médicas, preparo de refeições saudáveis e estímulo cognitivo diário (jogos de tabuleiro, leitura, conversas agradáveis). Trabalho com muito afeto.",
    rate: 25,
    rating: 4.7,
    experience: "3 anos",
    location: "Osasco, SP",
    phone: "(11) 96543-2109",
    reviews: [
      { id: "r_7", clientName: "Fernanda Dias", rating: 5, comment: "Carla é uma companhia doce e paciente. Minha avó adora os dias que ela vem fazer palavras cruzadas.", date: "2026-05-18" },
      { id: "r_8", clientName: "Daniel Rossi", rating: 4, comment: "Responsável e prestativa nos compromissos de transporte e consultas médicas.", date: "2026-04-10" }
    ],
    replies: {
      greeting: "Olá! Tudo bem? Fazer companhia e ajudar no dia a dia é minha especialidade. Do que seu familiar está precisando?",
      proposal_high: "Que notícia maravilhosa! Proposta aceita. Combinado então. Vai ser ótimo passar esse tempo juntos!",
      proposal_low: "Olá! A proposta está um pouquinho abaixo do meu custo de transporte. Conseguimos ajustar para R$ 25 a hora?",
      info: "Tenho referências de famílias anteriores. Trabalho principalmente com acompanhamento para consultas, compras, caminhadas e jogos de estímulo mental.",
      fallback: "Fico no aguardo da sua resposta. Havendo interesse, envie a proposta pelo chat para que eu possa agendar!"
    }
  }
];

const SEED_CLIENTS = [
  {
    id: "cl_1",
    role: "client",
    name: "João Pereira",
    username: "joaopereira",
    email: "joao@allcare.com",
    avatar: "👨",
    location: "São Paulo, SP",
    phone: "(11) 99999-8888",
    bio: "Procuro cuidadora atenciosa para meu pai de 82 anos que necessita de auxílio na locomoção e lembretes de remédios."
  }
];

// Initialize DB if not present
export const initDB = () => {
  if (!localStorage.getItem("allcare_users")) {
    const allUsers = [...SEED_CAREGIVERS, ...SEED_CLIENTS];
    localStorage.setItem("allcare_users", JSON.stringify(allUsers));
  }
  if (!localStorage.getItem("allcare_messages")) {
    localStorage.setItem("allcare_messages", JSON.stringify([]));
  }
  if (!localStorage.getItem("allcare_proposals")) {
    localStorage.setItem("allcare_proposals", JSON.stringify([]));
  }
  if (!localStorage.getItem("allcare_current_user")) {
    // Auto-login as João (Client) for instant demonstration experience!
    localStorage.setItem("allcare_current_user", JSON.stringify(SEED_CLIENTS[0]));
  }
};

export const getDB = (key) => {
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const saveDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("allcare_current_user")) || null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem("allcare_current_user", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("allcare_current_user");
};

// Database queries & updates
export const dbRegister = (userData) => {
  const users = getDB("allcare_users");
  if (users.some(u => u.username === userData.username || u.email === userData.email)) {
    return { success: false, error: "Nome de usuário ou e-mail já cadastrado!" };
  }
  const newUser = {
    id: userData.role === "caregiver" ? `cg_${Date.now()}` : `cl_${Date.now()}`,
    rating: userData.role === "caregiver" ? 5.0 : undefined,
    reviews: userData.role === "caregiver" ? [] : undefined,
    ...userData
  };
  users.push(newUser);
  saveDB("allcare_users", users);
  return { success: true, user: newUser };
};

export const dbLogin = (username, password, role) => {
  const users = getDB("allcare_users");
  // In a simulated database, password verification is simple: matches anything with 4+ chars
  if (!password || password.length < 4) {
    return { success: false, error: "Senha inválida (mínimo de 4 caracteres)." };
  }
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.role === role);
  if (!user) {
    return { success: false, error: "Usuário não encontrado para este perfil!" };
  }
  setCurrentUser(user);
  return { success: true, user };
};

export const dbUpdateProfile = (userId, updatedFields) => {
  const users = getDB("allcare_users");
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return { success: false, error: "Usuário não encontrado" };

  users[userIndex] = { ...users[userIndex], ...updatedFields };
  saveDB("allcare_users", users);
  
  // If current logged-in user is updated, sync their session storage too
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(users[userIndex]);
  }
  return { success: true, user: users[userIndex] };
};

export const dbGetCaregivers = () => {
  const users = getDB("allcare_users");
  return users.filter(u => u.role === "caregiver");
};

export const dbGetCaregiverDetail = (id) => {
  const caregivers = dbGetCaregivers();
  return caregivers.find(c => c.id === id);
};

// Chat/Messaging APIs
export const dbGetMessagesForRoom = (user1Id, user2Id) => {
  const messages = getDB("allcare_messages");
  return messages.filter(m => 
    (m.senderId === user1Id && m.receiverId === user2Id) ||
    (m.senderId === user2Id && m.receiverId === user1Id)
  ).sort((a,b) => a.timestamp - b.timestamp);
};

export const dbSendMessage = (senderId, receiverId, text, type = "text", proposalData = null) => {
  const messages = getDB("allcare_messages");
  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId,
    receiverId,
    text,
    type,
    proposalData, // contains { rate, date, hours, total, status: 'pending'|'accepted'|'declined'|'completed' }
    timestamp: Date.now()
  };
  messages.push(newMessage);
  saveDB("allcare_messages", messages);
  return newMessage;
};

// Contract Proposals
export const dbUpdateProposalStatus = (messageId, status) => {
  const messages = getDB("allcare_messages");
  const msgIndex = messages.findIndex(m => m.id === messageId);
  if (msgIndex === -1) return null;

  messages[msgIndex].proposalData.status = status;
  saveDB("allcare_messages", messages);
  
  // If accepted, let's also trigger a system message in the chat
  const senderId = messages[msgIndex].senderId;
  const receiverId = messages[msgIndex].receiverId;
  
  if (status === "accepted") {
    dbSendMessage("system", receiverId, "Contrato fechado! O serviço foi agendado.", "system");
  } else if (status === "declined") {
    dbSendMessage("system", receiverId, "A proposta de serviço foi recusada.", "system");
  } else if (status === "completed") {
    dbSendMessage("system", receiverId, "O serviço foi finalizado! Avalie o cuidador na tela de serviços.", "system");
  }
  
  return messages[msgIndex];
};

export const dbGetContractsForUser = (userId) => {
  const messages = getDB("allcare_messages");
  // Find all messages that contain proposalData and where user is sender or receiver
  return messages
    .filter(m => m.type === "proposal" && (m.senderId === userId || m.receiverId === userId))
    .map(m => {
      // Find counterpart details
      const users = getDB("allcare_users");
      const counterpartId = m.senderId === userId ? m.receiverId : m.senderId;
      const counterpart = users.find(u => u.id === counterpartId);
      
      return {
        messageId: m.id,
        caregiverId: m.senderId.startsWith("cg_") ? m.senderId : m.receiverId,
        clientId: m.senderId.startsWith("cl_") ? m.senderId : m.receiverId,
        counterpartName: counterpart ? counterpart.name : "Usuário",
        counterpartAvatar: counterpart ? counterpart.avatar : "👤",
        rate: m.proposalData.rate,
        date: m.proposalData.date,
        hours: m.proposalData.hours,
        total: m.proposalData.total,
        status: m.proposalData.status,
        timestamp: m.timestamp
      };
    }).sort((a,b) => b.timestamp - a.timestamp);
};

// Reviews
export const dbAddReview = (caregiverId, clientName, rating, comment) => {
  const users = getDB("allcare_users");
  const caregiverIndex = users.findIndex(u => u.id === caregiverId);
  if (caregiverIndex === -1) return { success: false, error: "Cuidador não encontrado" };

  const newReview = {
    id: `rev_${Date.now()}`,
    clientName,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  const caregiver = users[caregiverIndex];
  if (!caregiver.reviews) caregiver.reviews = [];
  caregiver.reviews.unshift(newReview); // add at start

  // Recalculate average rating
  const totalRating = caregiver.reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = (totalRating / caregiver.reviews.length).toFixed(1);
  caregiver.rating = parseFloat(avgRating);

  users[caregiverIndex] = caregiver;
  saveDB("allcare_users", users);
  
  return { success: true, caregiver };
};

// CHAT SIMULATOR ENGINE (for demonstration)
export const runChatSimulator = (senderId, receiverId, userText, onReply) => {
  // If the receiver is not a caregiver, no simulation is needed (or vice versa, we simulate caregiver responding to client)
  if (!receiverId.startsWith("cg_")) return;

  const caregivers = dbGetCaregivers();
  const caregiver = caregivers.find(c => c.id === receiverId);
  if (!caregiver) return;

  setTimeout(() => {
    let replyText = caregiver.replies.fallback;
    const txt = userText.toLowerCase();

    if (txt.includes("oi") || txt.includes("olá") || txt.includes("bom dia") || txt.includes("boa tarde") || txt.includes("boa noite")) {
      replyText = caregiver.replies.greeting;
    } else if (txt.includes("experiência") || txt.includes("trabalha") || txt.includes("curso") || txt.includes("formação")) {
      replyText = caregiver.replies.info;
    } else if (txt.includes("tarifa") || txt.includes("preço") || txt.includes("quanto cobra") || txt.includes("valor")) {
      replyText = `Minha tarifa padrão é de R$ ${caregiver.rate} por hora. Dependendo da rotina ou quantidade de horas por semana, podemos negociar!`;
    }

    const replyMsg = dbSendMessage(receiverId, senderId, replyText, "text");
    onReply(replyMsg);
  }, 1800); // 1.8 seconds delay feels natural
};

export const runProposalSimulator = (senderId, receiverId, proposalData, onReply) => {
  if (!receiverId.startsWith("cg_")) return;

  const caregivers = dbGetCaregivers();
  const caregiver = caregivers.find(c => c.id === receiverId);
  if (!caregiver) return;

  setTimeout(() => {
    const isRateAcceptable = proposalData.rate >= caregiver.rate;
    let replyText = "";
    
    if (isRateAcceptable) {
      replyText = caregiver.replies.proposal_high;
      // Send the reply message
      const replyMsg = dbSendMessage(receiverId, senderId, replyText, "text");
      onReply(replyMsg, true); // true signifies accept
    } else {
      replyText = caregiver.replies.proposal_low;
      const replyMsg = dbSendMessage(receiverId, senderId, replyText, "text");
      onReply(replyMsg, false); // false signifies negotiation/decline
    }
  }, 2200);
};
