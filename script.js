document.addEventListener("DOMContentLoaded", function () {
  const initialScreen = document.getElementById("initial-screen");
  const successScreen = document.getElementById("success-screen");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const restartBtn = document.getElementById("restart-btn");
  const noCount = document.getElementById("no-count");

  let noCountValue = 0;
  const maxNoClicks = 5;

  // Detectar se é dispositivo móvel
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Otimizações para dispositivos móveis
  if (isMobile || isTouchDevice) {
    // Prevenir zoom em toques duplos
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      function (event) {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    // Prevenir scroll horizontal
    document.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    // Otimizar performance em dispositivos móveis
    const hearts = document.querySelectorAll(".heart");
    hearts.forEach((heart) => {
      heart.style.willChange = "transform";
    });
  }

  // Função para mover o botão "Não" para uma posição aleatória
  function moveNoButton() {
    const container = document.querySelector(".buttons-container");
    const containerRect = container.getBoundingClientRect();

    // Calcular posições aleatórias dentro do container
    const maxX = containerRect.width - noBtn.offsetWidth;
    const maxY = containerRect.height - noBtn.offsetHeight;

    // Garantir que o botão não saia da tela visível
    const minX = Math.max(0, maxX * 0.1);
    const minY = Math.max(0, maxY * 0.1);
    const adjustedMaxX = Math.min(
      maxX * 0.9,
      window.innerWidth - noBtn.offsetWidth
    );
    const adjustedMaxY = Math.min(
      maxY * 0.9,
      window.innerHeight - noBtn.offsetHeight
    );

    const randomX = Math.random() * (adjustedMaxX - minX) + minX;
    const randomY = Math.random() * (adjustedMaxY - minY) + minY;

    // Aplicar posição absoluta temporariamente
    noBtn.style.position = "fixed"; // Usar fixed para melhor controle em mobile
    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    noBtn.style.zIndex = "1000";

    // Adicionar classe de animação
    noBtn.classList.add("running");

    // Remover a classe após a animação
    setTimeout(() => {
      noBtn.classList.remove("running");
    }, 500);
  }

  // Função para atualizar o contador
  function updateCounter() {
    noCountValue++;
    noCount.textContent = noCountValue;

    // Mudar a mensagem baseada no número de tentativas
    const counterText = document.querySelector(".love-counter");
    if (noCountValue === 1) {
      counterText.innerHTML = `<span id="no-count">${noCountValue}</span> tentativa de dizer não... 😏`;
    } else if (noCountValue < maxNoClicks) {
      counterText.innerHTML = `<span id="no-count">${noCountValue}</span> tentativas de dizer não... 😏`;
    } else {
      counterText.innerHTML = `<span id="no-count">${noCountValue}</span> tentativas! Desiste! 😂`;
    }
  }

  // Event listener para o botão "Não" (suporte para touch e click)
  function handleNoButtonClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (noCountValue < maxNoClicks) {
      moveNoButton();
      updateCounter();

      // Efeito sonoro (opcional - usando Web Audio API)
      playClickSound();
    } else {
      // Após 5 tentativas, o botão "Não" desaparece
      noBtn.style.display = "none";
      const counterText = document.querySelector(".love-counter");
      counterText.innerHTML = "Agora só resta dizer SIM! 💕";
      counterText.style.color = "#e91e63";
      counterText.style.fontWeight = "bold";
    }
  }

  // Adicionar listeners para touch e click
  noBtn.addEventListener("click", handleNoButtonClick);
  noBtn.addEventListener("touchend", handleNoButtonClick);

  // Event listener para o botão "Sim"
  function handleYesButtonClick() {
    // Efeito de confete antes de mudar de tela
    createConfetti();

    // Tocar som de celebração
    playCelebrationSound();

    // Mudar para a tela de sucesso após um pequeno delay
    setTimeout(() => {
      initialScreen.classList.remove("active");
      successScreen.classList.add("active");

      // Scroll para o topo da tela de sucesso
      successScreen.scrollTop = 0;
    }, 1000);
  }

  yesBtn.addEventListener("click", handleYesButtonClick);
  yesBtn.addEventListener("touchend", handleYesButtonClick);

  // Event listener para o botão "Ver novamente"
  function handleRestartButtonClick() {
    // Resetar tudo
    noCountValue = 0;
    noCount.textContent = "0";

    // Resetar o botão "Não"
    noBtn.style.display = "block";
    noBtn.style.position = "static";
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.zIndex = "";

    // Resetar o contador
    const counterText = document.querySelector(".love-counter");
    counterText.innerHTML =
      '<span id="no-count">0</span> tentativas de dizer não... 😏';
    counterText.style.color = "#666";
    counterText.style.fontWeight = "normal";

    // Voltar para a tela inicial
    successScreen.classList.remove("active");
    initialScreen.classList.add("active");
  }

  restartBtn.addEventListener("click", handleRestartButtonClick);
  restartBtn.addEventListener("touchend", handleRestartButtonClick);

  // Função para criar efeito de confete (otimizada para mobile)
  function createConfetti() {
    const colors = ["#ff6b9d", "#c44569", "#f093fb", "#ffd93d", "#6bcf7f"];
    const confettiCount = isMobile ? 30 : 50; // Menos confete em mobile para performance

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = "8px";
      confetti.style.height = "8px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-10px";
      confetti.style.zIndex = "9999";
      confetti.style.borderRadius = "50%";
      confetti.style.animation = `fall ${
        Math.random() * 3 + 2
      }s linear forwards`;

      document.body.appendChild(confetti);

      // Remover confete após a animação
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }

  // Adicionar animação de queda para o confete
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Função para tocar som de clique (usando Web Audio API)
  function playClickSound() {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Fallback silencioso se o áudio não funcionar
    }
  }

  // Função para tocar som de celebração
  function playCelebrationSound() {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Criar uma sequência de notas musicais
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C (oitava superior)

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContext.currentTime
        );

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
      });
    } catch (e) {
      // Fallback silencioso se o áudio não funcionar
    }
  }

  // Efeito de hover no botão "Sim" para torná-lo mais atrativo (apenas em desktop)
  if (!isTouchDevice) {
    yesBtn.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) translateY(-5px)";
      this.style.boxShadow = "0 20px 40px rgba(255, 107, 157, 0.5)";
    });

    yesBtn.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) translateY(0)";
      this.style.boxShadow = "0 10px 20px rgba(255, 107, 157, 0.3)";
    });
  }

  // Adicionar efeito de digitação na declaração
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = "";

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Inicializar efeitos quando a tela de sucesso aparecer
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        if (successScreen.classList.contains("active")) {
          // Adicionar efeito de digitação na declaração
          const declarationText = document.querySelector(".declaration p");
          if (declarationText) {
            const originalText = declarationText.textContent;
            typeWriter(declarationText, originalText, 30);
          }
        }
      }
    });
  });

  observer.observe(successScreen, {
    attributes: true,
  });

  // Adicionar efeito de parallax suave no fundo (apenas em desktop)
  if (!isMobile) {
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const hearts = document.querySelectorAll(".heart");

      hearts.forEach((heart, index) => {
        const speed = 0.5 + index * 0.1;
        heart.style.transform = `rotate(45deg) translateY(${
          scrolled * speed
        }px)`;
      });
    });
  }

  // Adicionar efeito de clique em qualquer lugar da tela inicial para dar dicas
  function handleScreenClick(e) {
    // Só ativar se clicar fora dos botões
    if (!e.target.closest(".btn")) {
      // Criar um pequeno coração temporário no local do clique
      const heart = document.createElement("div");
      heart.innerHTML = "💕";
      heart.style.position = "absolute";
      heart.style.left = e.clientX - 10 + "px";
      heart.style.top = e.clientY - 10 + "px";
      heart.style.fontSize = "20px";
      heart.style.pointerEvents = "none";
      heart.style.zIndex = "1000";
      heart.style.animation = "fadeOut 1s ease-out forwards";

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
  }

  initialScreen.addEventListener("click", handleScreenClick);
  initialScreen.addEventListener("touchend", handleScreenClick);

  // Adicionar animação de fadeOut
  const fadeOutStyle = document.createElement("style");
  fadeOutStyle.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.5); }
        }
    `;
  document.head.appendChild(fadeOutStyle);

  // Adicionar efeito de vibração no botão "Não" quando hover (apenas em desktop)
  if (!isTouchDevice) {
    noBtn.addEventListener("mouseenter", function () {
      this.style.animation = "shake 0.5s ease-in-out";
    });

    noBtn.addEventListener("mouseleave", function () {
      this.style.animation = "";
    });
  }

  // Adicionar animação de shake
  const shakeStyle = document.createElement("style");
  shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
  document.head.appendChild(shakeStyle);

  // Prevenir scroll em dispositivos móveis durante interações
  if (isMobile) {
    document.addEventListener(
      "touchstart",
      function (e) {
        if (e.target.closest(".btn")) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  console.log("💕 Site de declaração carregado com sucesso! 💕");
  console.log("📱 Dispositivo móvel detectado:", isMobile);
  console.log("👆 Dispositivo touch detectado:", isTouchDevice);
});
