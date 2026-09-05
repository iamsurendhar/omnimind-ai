$(document).ready(function () {
  feather.replace();

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  /* ==========================================================
     1. STATE & STORAGE MANAGEMENT (PERMANENT DELETION)
  ========================================================== */
  const STORAGE_KEY = "omnimind_ai_v14_chats";

  let currentModel = "qwen/qwen3.6-27b";
  let currentTheme = localStorage.getItem("omnimind_theme") || "dark";
  let currentLang = localStorage.getItem("omnimind_language") || "en";
  let currentActiveCodeForPreview = "";
  let chatPendingRenameId = null;

  const savedData = localStorage.getItem(STORAGE_KEY);
  let chats = savedData !== null ? JSON.parse(savedData) : [];

  let activeChatId = chats.length > 0 ? chats[0].id : null;

  function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }

  function escapeHtml(text) {
    return $("<div>").text(text).html();
  }

  /* ==========================================================
     2. MULTI-LANGUAGE (i18n) DICTIONARY
  ========================================================== */
  const translations = {
    en: {
      new_chat: "New chat",
      conversations: "Conversations",
      personalization: "Personalization",
      profile: "Profile",
      settings: "Settings",
      help: "Help",
      hero_title: "What can I help with today?",
      input_placeholder: "Message OmniMind...",
      disclaimer:
        "OmniMind AI can make mistakes. Verify important information.",
      theme: "Theme",
      theme_desc: "Switch light / dark mode",
      language: "Language",
      language_desc: "Select your preferred user interface language",
      clear_chats: "Clear all chats",
      clear_chats_desc: "Permanently delete all conversation records",
      clear: "Clear",
      done: "Done",
      cancel: "Cancel",
      save: "Save",
      rename_chat: "Rename Conversation",
      no_chats: "No conversations yet.",
    },
    ta: {
      new_chat: "புதிய அரட்டை",
      conversations: "உரையாடல்கள்",
      personalization: "தனிப்பயனாக்கம் (Personalization)",
      profile: "சுயவிவரம் (Profile)",
      settings: "அமைப்புகள் (Settings)",
      help: "உதவி (Help)",
      hero_title: "இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
      input_placeholder: "OmniMind-க்கு செய்தி அனுப்பவும்...",
      disclaimer:
        "OmniMind AI தவறுகளைச் செய்யலாம். முக்கியமான தகவல்களைச் சரிபார்க்கவும்.",
      theme: "தீம் (Theme)",
      theme_desc: "Light மற்றும் Dark மோடுகளுக்கு இடையே மாற்றவும்",
      language: "மொழி (Language)",
      language_desc: "நீங்கள் விரும்பும் இடைமுக மொழியைத் தேர்ந்தெடுக்கவும்",
      clear_chats: "அனைத்து அரட்டைகளையும் அழிக்கவும்",
      clear_chats_desc: "அனைத்து உரையாடல் பதிவுகளையும் நிரந்தரமாக நீக்கவும்",
      clear: "அழி",
      done: "முடிந்தது",
      cancel: "ரத்து செய்",
      save: "சேமி",
      rename_chat: "பெயரை மாற்றவும்",
      no_chats: "உரையாடல்கள் எதுவும் இல்லை.",
    },
    es: {
      new_chat: "Nuevo chat",
      conversations: "Conversaciones",
      personalization: "Personalización",
      profile: "Perfil",
      settings: "Configuración",
      help: "Ayuda",
      hero_title: "¿En qué puedo ayudarte hoy?",
      input_placeholder: "Enviar mensaje a OmniMind...",
      disclaimer:
        "OmniMind AI puede cometer errores. Verifica la información importante.",
      theme: "Tema",
      theme_desc: "Cambia entre modo claro y oscuro",
      language: "Idioma",
      language_desc: "Selecciona el idioma de la interfaz",
      clear_chats: "Borrar todos los chats",
      clear_chats_desc: "Elimina de forma permanente todo el historial",
      clear: "Borrar",
      done: "Listo",
      cancel: "Cancelar",
      save: "Guardar",
      rename_chat: "Renombrar conversación",
      no_chats: "No hay conversaciones aún.",
    },
    fr: {
      new_chat: "Nouvelle discussion",
      conversations: "Conversations",
      personalization: "Personnalisation",
      profile: "Profil",
      settings: "Paramètres",
      help: "Aide",
      hero_title: "Comment puis-je vous aider aujourd'hui ?",
      input_placeholder: "Envoyer un message à OmniMind...",
      disclaimer:
        "OmniMind AI peut faire des erreurs. Vérifiez les informations.",
      theme: "Thème",
      theme_desc: "Basculez entre le mode clair et sombre",
      language: "Langue",
      language_desc: "Choisissez la langue de l'interface",
      clear_chats: "Effacer toutes les discussions",
      clear_chats_desc: "Supprime définitivement tous les historiques",
      clear: "Effacer",
      done: "Terminé",
      cancel: "Annuler",
      save: "Enregistrer",
      rename_chat: "Renommer la conversation",
      no_chats: "Aucune conversation pour le moment.",
    },
    de: {
      new_chat: "Neuer Chat",
      conversations: "Unterhaltungen",
      personalization: "Personalisierung",
      profile: "Profil",
      settings: "Einstellungen",
      help: "Hilfe",
      hero_title: "Wie kann ich dir heute helfen?",
      input_placeholder: "Nachricht an OmniMind...",
      disclaimer:
        "OmniMind AI kann Fehler machen. Überprüfen Sie wichtige Infos.",
      theme: "Erscheinungsbild",
      theme_desc: "Zwischen Hell- und Dunkelmodus wechseln",
      language: "Sprache",
      language_desc: "Wählen Sie Ihre bevorzugte Sprache",
      clear_chats: "Alle Chats löschen",
      clear_chats_desc: "Gesamten Gesprächsverlauf unwiderruflich löschen",
      clear: "Löschen",
      done: "Fertig",
      cancel: "Abbrechen",
      save: "Speichern",
      rename_chat: "Unterhaltung umbenennen",
      no_chats: "Noch keine Unterhaltungen.",
    },
  };

  /* ==========================================================
     3. CLEAN FILTER: STRIPS ALL THINKING TRACES
  ========================================================== */
  function removeThinkingProcess(rawText) {
    if (!rawText) return "";
    let text = rawText;

    text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");

    if (/Here's a thinking process:/i.test(text)) {
      const parts = text.split(/\n\s*\n/);
      const cleanParts = parts.filter((p) => {
        const lower = p.toLowerCase();
        return (
          !lower.includes("thinking process") &&
          !lower.includes("analyze user input") &&
          !lower.includes("identify intent") &&
          !lower.includes("determine scope")
        );
      });
      text = cleanParts.join("\n\n");
    }

    return text.trim();
  }

  /* ==========================================================
     4. CODE PARSER (EXACT SCREENSHOT HEADER WITH ALL 4 ICONS)
  ========================================================== */
  function parseAIResponse(content) {
    if (!content) return "";
    let cleanText = removeThinkingProcess(content);

    let parsedHtml = "";
    try {
      parsedHtml = marked.parse(cleanText);
    } catch (e) {
      parsedHtml = escapeHtml(cleanText);
    }

    const $temp = $("<div>").html(parsedHtml);

    $temp.find("pre").each(function () {
      const $code = $(this).find("code");
      const codeText = $code.text();
      const langClass = $code.attr("class") || "";
      const langMatch = langClass.match(/language-(\w+)/);
      const rawLang = langMatch ? langMatch[1] : "html";
      const displayLang =
        rawLang.charAt(0).toUpperCase() + rawLang.slice(1).toLowerCase();

      let highlightedCode = "";
      try {
        highlightedCode = hljs.highlight(codeText, {
          language: hljs.getLanguage(rawLang) ? rawLang : "plaintext",
        }).value;
      } catch (e) {
        highlightedCode = escapeHtml(codeText);
      }

      const isWebCode = [
        "html",
        "htm",
        "xml",
        "svg",
        "css",
        "javascript",
        "js",
      ].includes(rawLang.toLowerCase());

      const playIconHtml = isWebCode
        ? `<button class="run-preview-btn code-action-icon-btn" title="Live Preview">
             <i data-feather="play-circle" class="w-4 h-4"></i>
           </button>`
        : ``;

      const codeContainerHtml = `
        <div class="code-container">
          <div class="code-header">
            <div class="flex items-center gap-2 font-medium text-xs text-zinc-700 dark:text-zinc-200">
              <i data-feather="code" class="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400"></i>
              <span class="code-lang-label">${displayLang}</span>
            </div>
            <div class="flex items-center gap-1.5">
              ${playIconHtml}
              <button class="download-code-btn code-action-icon-btn" title="Download File">
                <i data-feather="download" class="w-4 h-4"></i>
              </button>
              <button class="copy-code-btn code-action-icon-btn" title="Copy Code">
                <i data-feather="copy" class="w-4 h-4"></i>
              </button>
              <button class="toggle-collapse-code-btn code-action-icon-btn" title="Collapse / Expand Code">
                <i data-feather="chevron-down" class="w-4 h-4 transition-transform duration-200"></i>
              </button>
            </div>
          </div>
          <pre class="code-content-block"><code>${highlightedCode}</code></pre>
        </div>
      `;

      $(this).replaceWith(codeContainerHtml);
    });

    return $temp.html();
  }

  /* ==========================================================
     5. CODE ACTION LISTENERS (PREVIEW, DOWNLOAD, COPY, COLLAPSE)
  ========================================================== */
  $(document).on("click", ".toggle-collapse-code-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $container = $(this).closest(".code-container");
    const $pre = $container.find("pre.code-content-block");
    const $icon = $(this).find("svg");

    if ($pre.is(":visible")) {
      $pre.slideUp(180);
      $icon.addClass("rotate-180");
    } else {
      $pre.slideDown(180);
      $icon.removeClass("rotate-180");
    }
  });

  $(document).on("click", ".run-preview-btn", function () {
    const $container = $(this).closest(".code-container");
    const codeText = $container.find("pre.code-content-block code").text();
    currentActiveCodeForPreview = codeText;

    renderPreviewInFrame(codeText);
    $("#live-preview-modal").removeClass("hidden");
    feather.replace();
  });

  function renderPreviewInFrame(code) {
    const frame = document.getElementById("live-preview-frame");
    const frameDoc = frame.contentDocument || frame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(code);
    frameDoc.close();
  }

  $("#refresh-preview-btn").on("click", function () {
    if (currentActiveCodeForPreview) {
      renderPreviewInFrame(currentActiveCodeForPreview);
    }
  });

  $(document).on("click", ".download-code-btn", function () {
    const $container = $(this).closest(".code-container");
    const codeText = $container.find("pre.code-content-block code").text();
    const language = (
      $container.find(".code-lang-label").text() || "txt"
    ).toLowerCase();

    const extMap = {
      html: "html",
      htm: "html",
      javascript: "js",
      js: "js",
      python: "py",
      py: "py",
      css: "css",
      json: "json",
      php: "php",
      sql: "sql",
      cpp: "cpp",
      java: "java",
    };

    const ext = extMap[language] || "txt";
    const filename = `code-${Date.now()}.${ext}`;

    const blob = new Blob([codeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  $(document).on("click", ".copy-code-btn", function () {
    const $btn = $(this);
    const codeText = $btn
      .closest(".code-container")
      .find("pre.code-content-block code")
      .text();

    navigator.clipboard.writeText(codeText).then(() => {
      $btn.html(
        '<i data-feather="check" class="w-4 h-4 text-emerald-500"></i>',
      );
      feather.replace();
      setTimeout(() => {
        $btn.html('<i data-feather="copy" class="w-4 h-4"></i>');
        feather.replace();
      }, 2000);
    });
  });

  /* ==========================================================
     6. SIDEBAR RENDERING & ACTIONS (PIN, RENAME, DELETE)
  ========================================================== */
  function renderSidebarChats() {
    const $list = $("#chat-list");
    $list.empty();
    const dict = translations[currentLang] || translations.en;

    if (!chats || chats.length === 0) {
      $list.append(
        `<p class="text-xs text-zinc-400 px-3 py-2">${dict.no_chats}</p>`,
      );
      return;
    }

    const sortedChats = [...chats].sort((a, b) => {
      if (a.pinned === b.pinned) return b.createdAt - a.createdAt;
      return a.pinned ? -1 : 1;
    });

    sortedChats.forEach((chat) => {
      const isActive = chat.id === activeChatId;
      const activeClass = isActive
        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium shadow-sm"
        : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70";
      const pinBadge = chat.pinned
        ? '<i data-feather="pin" class="w-3 h-3 text-amber-500 shrink-0"></i>'
        : "";

      const chatItemHtml = `
        <div class="chat-row group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition select-none ${activeClass}" data-chat-id="${chat.id}">
          <div class="flex items-center gap-2 truncate flex-1 pr-2">
            ${pinBadge}
            <span class="chat-title truncate">${escapeHtml(chat.title)}</span>
          </div>

          <button class="chat-item-menu-btn opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition shrink-0" title="Options">
            <i data-feather="more-horizontal" class="w-3.5 h-3.5"></i>
          </button>

          <div class="chat-item-menu hidden absolute right-2 top-10 w-36 bg-white dark:bg-[#262626] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl p-1 z-30 space-y-0.5">
            <button class="pin-chat-action w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-200">
              <i data-feather="pin" class="w-3 h-3 text-amber-500"></i>
              <span>${chat.pinned ? "Unpin" : "Pin"}</span>
            </button>
            <button class="rename-chat-action w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-200">
              <i data-feather="edit-2" class="w-3 h-3"></i>
              <span>Rename</span>
            </button>
            <div class="border-t border-zinc-200 dark:border-zinc-700 my-0.5"></div>
            <button class="delete-chat-action w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-xs text-red-500">
              <i data-feather="trash-2" class="w-3 h-3"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>
      `;
      $list.append(chatItemHtml);
    });

    feather.replace();
  }

  function switchChat(chatId) {
    activeChatId = chatId;
    renderSidebarChats();

    const currentChat = chats.find((c) => c.id === chatId);

    if (!currentChat || currentChat.messages.length === 0) {
      $("#messages-container").empty().addClass("hidden");
      $("#empty-state").removeClass("hidden");
    } else {
      $("#empty-state").addClass("hidden");
      $("#messages-container").empty().removeClass("hidden");

      currentChat.messages.forEach((msg) => {
        appendMessage(
          msg.role,
          msg.content,
          msg.id,
          msg.liked,
          msg.disliked,
          false,
        );
      });
      scrollToBottom();
    }

    if ($(window).width() < 768) $("#sidebar").addClass("-translate-x-full");
  }

  // Pin / Unpin
  $(document).on("click", ".pin-chat-action", function (e) {
    e.stopPropagation();
    const chatId = $(this).closest(".chat-row").data("chat-id");
    const targetChat = chats.find((c) => c.id === chatId);
    if (targetChat) {
      targetChat.pinned = !targetChat.pinned;
      persistState();
      renderSidebarChats();
    }
  });

  // Rename
  $(document).on("click", ".rename-chat-action", function (e) {
    e.stopPropagation();
    $(".chat-item-menu").addClass("hidden");
    const chatId = $(this).closest(".chat-row").data("chat-id");
    const targetChat = chats.find((c) => c.id === chatId);
    if (targetChat) {
      chatPendingRenameId = chatId;
      $("#rename-input").val(targetChat.title);
      $("#rename-modal").removeClass("hidden");
      $("#rename-input").focus();
    }
  });

  $("#save-rename-btn").on("click", function () {
    const newTitle = $("#rename-input").val().trim();
    if (newTitle && chatPendingRenameId) {
      const targetChat = chats.find((c) => c.id === chatPendingRenameId);
      if (targetChat) {
        targetChat.title = newTitle;
        persistState();
        renderSidebarChats();
      }
    }
    $("#rename-modal").addClass("hidden");
  });

  $("#cancel-rename-btn").on("click", function () {
    $("#rename-modal").addClass("hidden");
  });

  // Delete
  $(document).on("click", ".delete-chat-action", function (e) {
    e.stopPropagation();
    const chatId = $(this).closest(".chat-row").data("chat-id");
    chats = chats.filter((c) => c.id !== chatId);
    persistState();

    if (activeChatId === chatId) {
      if (chats.length > 0) switchChat(chats[0].id);
      else {
        activeChatId = null;
        renderSidebarChats();
        $("#messages-container").empty().addClass("hidden");
        $("#empty-state").removeClass("hidden");
      }
    } else {
      renderSidebarChats();
    }
  });

  $(document).on("click", ".chat-item-menu-btn", function (e) {
    e.stopPropagation();
    $(".chat-item-menu")
      .not($(this).siblings(".chat-item-menu"))
      .addClass("hidden");
    $(this).siblings(".chat-item-menu").toggleClass("hidden");
  });

  $(document).on("click", ".chat-row", function (e) {
    if ($(e.target).closest(".chat-item-menu-btn, .chat-item-menu").length)
      return;
    const chatId = $(this).data("chat-id");
    switchChat(chatId);
  });

  /* ==========================================================
     7. THEME, LANGUAGE & DESKTOP SIDEBAR TOGGLE
  ========================================================== */
  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === "dark") {
      $("html").addClass("dark");
    } else {
      $("html").removeClass("dark");
    }
    $("#theme-select").val(theme);
    localStorage.setItem("omnimind_theme", theme);
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("omnimind_language", lang);
    $("#language-select").val(lang);

    const dict = translations[lang] || translations.en;

    $("[data-i18n]").each(function () {
      const key = $(this).data("i18n");
      if (dict[key]) $(this).text(dict[key]);
    });

    $("[data-i18n-placeholder]").each(function () {
      const key = $(this).data("i18n-placeholder");
      if (dict[key]) $(this).attr("placeholder", dict[key]);
    });

    renderSidebarChats();
  }

  applyTheme(currentTheme);
  applyLanguage(currentLang);
  if (activeChatId) switchChat(activeChatId);

  $("#theme-select").on("change", function () {
    applyTheme($(this).val());
  });

  $("#language-select").on("change", function () {
    applyLanguage($(this).val());
  });

  // Desktop Smooth Slide Collapse (md:-ml-64) & Mobile Drawer Toggle
  $("#toggle-sidebar").on("click", function (e) {
    e.stopPropagation();
    if ($(window).width() < 768) {
      $("#sidebar").toggleClass("-translate-x-full");
      $("#sidebar-overlay").toggleClass("hidden");
    } else {
      $("#sidebar").toggleClass("md:-ml-64");
    }
  });

  $("#close-sidebar-btn, #sidebar-overlay").on("click", function () {
    $("#sidebar").addClass("-translate-x-full");
    $("#sidebar-overlay").addClass("hidden");
  });

  /* ==========================================================
     8. MODALS LISTENERS
  ========================================================== */
  $("#open-personalization-btn").on("click", function (e) {
    e.stopPropagation();
    $("#profile-menu").addClass("hidden");
    $("#custom-instructions").val(
      localStorage.getItem("omnimind_instructions") || "",
    );
    $("#personalization-modal").removeClass("hidden");
  });

  $("#save-personalization-btn").on("click", function () {
    const val = $("#custom-instructions").val().trim();
    localStorage.setItem("omnimind_instructions", val);
    $("#personalization-modal").addClass("hidden");
  });

  $("#open-profile-btn").on("click", function (e) {
    e.stopPropagation();
    $("#profile-menu").addClass("hidden");
    $("#profile-modal").removeClass("hidden");
  });

  $("#open-settings-btn, #quick-settings-btn").on("click", function (e) {
    e.stopPropagation();
    $("#profile-menu").addClass("hidden");
    $("#settings-modal").removeClass("hidden");
  });

  $("#close-settings-btn, #done-settings-btn").on("click", function () {
    $("#settings-modal").addClass("hidden");
  });

  $("#open-help-btn").on("click", function (e) {
    e.stopPropagation();
    $("#profile-menu").addClass("hidden");
    $("#help-modal").removeClass("hidden");
  });

  $(".close-modal-btn").on("click", function () {
    $(this).closest(".fixed").addClass("hidden");
  });

  $("#clear-all-chats-btn").on("click", function () {
    chats = [];
    activeChatId = null;
    persistState();
    renderSidebarChats();
    $("#messages-container").empty().addClass("hidden");
    $("#empty-state").removeClass("hidden");
    $("#settings-modal").addClass("hidden");
  });

  // Load Models
  $.getJSON("/api/models", function (res) {
    if (res && res.models && res.models.length > 0) {
      currentModel = res.models[0];
      $("#current-model-label").text(
        currentModel.split("/")[1] || currentModel,
      );

      const $menu = $("#model-menu");
      $menu.empty();

      res.models.forEach((modelName, idx) => {
        const isSelected = idx === 0;
        const checkClass = isSelected ? "" : "hidden";
        const displayName = modelName.split("/")[1] || modelName;

        const itemHtml = `
          <button class="model-option w-full flex items-start justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700/60 text-left transition" data-model="${modelName}">
            <div>
              <p class="text-xs font-semibold text-zinc-800 dark:text-zinc-100">${displayName}</p>
              <p class="text-[10px] text-emerald-500 font-medium">${modelName}</p>
            </div>
            <i data-feather="check" class="check-icon w-4 h-4 text-emerald-500 mt-0.5 ${checkClass}"></i>
          </button>
        `;
        $menu.append(itemHtml);
      });

      feather.replace();
    }
  });

  $(document).on("click", ".model-option", function () {
    currentModel = $(this).data("model");
    $("#current-model-label").text(currentModel.split("/")[1] || currentModel);
    $(".check-icon").addClass("hidden");
    $(this).find(".check-icon").removeClass("hidden");
    $("#model-menu").addClass("hidden");
  });

  /* ==========================================================
     9. CHAT INPUT & FORM DISPATCH WITH PERSONALIZATION
  ========================================================== */
  $("#user-input").on("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
    const text = $(this).val().trim();
    $("#send-btn").prop("disabled", text.length === 0);
    $("#clear-input-btn").toggleClass("hidden", text.length === 0);
  });

  $("#clear-input-btn").on("click", function () {
    $("#user-input").val("").css("height", "auto").focus();
    $("#send-btn").prop("disabled", true);
    $(this).addClass("hidden");
  });

  $("#user-input").on("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $("#chat-form").submit();
    }
  });

  $(".prompt-chip").on("click", function () {
    const text =
      $(this).find("span").text() +
      " - " +
      $(this).contents().last().text().trim();
    $("#user-input").val(text);
    $("#send-btn").prop("disabled", false);
    $("#clear-input-btn").removeClass("hidden");
    $("#chat-form").submit();
  });

  $("#chat-form").on("submit", function (e) {
    e.preventDefault();
    const inputVal = $("#user-input").val().trim();
    if (!inputVal) return;

    if (!activeChatId) {
      const newChat = {
        id: "chat-" + Date.now(),
        title: inputVal.slice(0, 24) + "...",
        pinned: false,
        createdAt: Date.now(),
        messages: [],
      };
      chats.unshift(newChat);
      activeChatId = newChat.id;
    }

    const currentChat = chats.find((c) => c.id === activeChatId);

    if (currentChat.messages.length === 0) {
      currentChat.title =
        inputVal.slice(0, 25) + (inputVal.length > 25 ? "..." : "");
    }

    $("#empty-state").addClass("hidden");
    $("#messages-container").removeClass("hidden");

    const userMsgId = "msg-" + Date.now();
    appendMessage("user", inputVal, userMsgId, false, false, true);
    currentChat.messages.push({
      id: userMsgId,
      role: "user",
      content: inputVal,
    });
    persistState();
    renderSidebarChats();

    $("#user-input").val("").css("height", "auto");
    $("#send-btn").prop("disabled", true);
    $("#clear-input-btn").addClass("hidden");

    const loadingId = "loading-" + Date.now();
    showLoadingAssistant(loadingId);
    scrollToBottom();

    // STRICT PERSONALIZATION INJECTION
    const userCustomInstructions = (
      localStorage.getItem("omnimind_instructions") || ""
    ).trim();
    let systemInstruction =
      "You are OmniMind AI. Answer directly, helpfully and concisely. Do NOT output internal thoughts, reasoning steps, or thinking processes. Do not say 'Here is a thinking process'. Provide only the clean final answer and complete code in standard markdown codeblocks.";

    if (userCustomInstructions.length > 0) {
      systemInstruction += `\n\nCRITICAL USER PERSONALIZATION INSTRUCTIONS (YOU MUST STRICTLY OBEY):\n"""\n${userCustomInstructions}\n"""\nAdapt all formatting, language, tone, and answers to follow these instructions precisely.`;
    }

    const apiMessages = [
      { role: "system", content: systemInstruction },
      ...currentChat.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    $.ajax({
      url: "/api/chat",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        model: currentModel,
        messages: apiMessages,
      }),
      success: function (response) {
        $(`#${loadingId}`).remove();
        const rawReply = response.choices[0].message.content;
        const cleanReply = removeThinkingProcess(rawReply);
        const aiMsgId = "msg-" + Date.now();

        appendMessage("assistant", cleanReply, aiMsgId, false, false, true);
        currentChat.messages.push({
          id: aiMsgId,
          role: "assistant",
          content: cleanReply,
          liked: false,
          disliked: false,
        });
        persistState();
      },
      error: function () {
        $(`#${loadingId}`).remove();
        const errId = "msg-" + Date.now();
        appendMessage(
          "assistant",
          "Something went wrong. Please try again later.",
          errId,
          false,
          false,
          true,
        );
      },
      complete: function () {
        scrollToBottom();
      },
    });
  });

  /* ==========================================================
     10. MESSAGE RENDERING & ACTIONS
  ========================================================== */
  function appendMessage(
    role,
    content,
    msgId,
    liked = false,
    disliked = false,
    shouldScroll = true,
  ) {
    const isUser = role === "user";
    let messageHtml = "";

    if (isUser) {
      messageHtml = `
        <div class="message-group flex flex-col items-end group/user mb-4" data-msg-id="${msgId}">
          <div class="msg-text-content w-fit max-w-[85%] bg-zinc-200 dark:bg-[#2f2f2f] text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words">${escapeHtml(content.trim())}</div>
          <div class="flex items-center gap-1.5 mt-1 opacity-0 group-hover/user:opacity-100 transition text-zinc-400 text-xs pr-1">
            <button class="copy-msg-btn p-1 hover:text-zinc-800 dark:hover:text-white" title="Copy prompt"><i data-feather="copy" class="w-3 h-3"></i></button>
            <button class="delete-msg-btn p-1 hover:text-red-500" title="Delete prompt"><i data-feather="trash-2" class="w-3 h-3"></i></button>
          </div>
        </div>
      `;
    } else {
      const likeClass = liked ? "text-emerald-500" : "";
      const dislikeClass = disliked ? "text-red-500" : "";
      const formattedContent = parseAIResponse(content);

      messageHtml = `
        <div class="message-group flex items-start gap-3 md:gap-4 text-sm text-zinc-800 dark:text-zinc-200 mb-5" data-msg-id="${msgId}">
          <div class="w-7 h-7 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-500">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 12 2"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="flex-1 space-y-1.5 overflow-hidden">
            <div class="msg-ai-body pt-0.5 leading-relaxed break-words">${formattedContent}</div>
            <div class="flex items-center gap-2 pt-1 text-zinc-400 text-xs">
              <button class="copy-msg-btn p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg transition" title="Copy response">
                <i data-feather="copy" class="w-3.5 h-3.5"></i>
              </button>
              <button class="like-btn p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-emerald-500 rounded-lg transition ${likeClass}" title="Good response">
                <i data-feather="thumbs-up" class="w-3.5 h-3.5"></i>
              </button>
              <button class="dislike-btn p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-red-500 rounded-lg transition ${dislikeClass}" title="Bad response">
                <i data-feather="thumbs-down" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    $("#messages-container").append(messageHtml);
    feather.replace();
    if (shouldScroll) scrollToBottom();
  }

  function showLoadingAssistant(id) {
    const loadingHtml = `
      <div id="${id}" class="flex items-start gap-3 md:gap-4 text-sm text-zinc-400">
        <div class="w-7 h-7 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-500">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 12 2"/></svg>
        </div>
        <div class="flex items-center gap-1.5 pt-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [animation-delay:200ms]"></div>
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [animation-delay:400ms]"></div>
        </div>
      </div>
    `;
    $("#messages-container").append(loadingHtml);
    feather.replace();
  }

  function scrollToBottom() {
    const chatStream = $("#chat-stream");
    chatStream.scrollTop(chatStream[0].scrollHeight);
  }

  // Delete message permanently
  $(document).on("click", ".delete-msg-btn", function () {
    const $msgGroup = $(this).closest(".message-group");
    const msgId = $msgGroup.data("msg-id");
    const currentChat = chats.find((c) => c.id === activeChatId);

    if (currentChat) {
      currentChat.messages = currentChat.messages.filter((m) => m.id !== msgId);
      persistState();
      $msgGroup.remove();
      if (currentChat.messages.length === 0) {
        $("#messages-container").addClass("hidden");
        $("#empty-state").removeClass("hidden");
      }
    }
  });

  // Copy raw message
  $(document).on("click", ".copy-msg-btn", function () {
    const $btn = $(this);
    const textToCopy = $btn
      .closest(".message-group")
      .find(".msg-text-content, .msg-ai-body")
      .text()
      .trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      $btn.html(
        '<i data-feather="check" class="w-3.5 h-3.5 text-emerald-500"></i>',
      );
      feather.replace();
      setTimeout(() => {
        $btn.html('<i data-feather="copy" class="w-3.5 h-3.5"></i>');
        feather.replace();
      }, 2000);
    });
  });

  // Like & Dislike
  $(document).on("click", ".like-btn", function () {
    const $btn = $(this);
    const $msgGroup = $btn.closest(".message-group");
    const msgId = $msgGroup.data("msg-id");
    const currentChat = chats.find((c) => c.id === activeChatId);
    const targetMsg = currentChat?.messages.find((m) => m.id === msgId);

    if (targetMsg) {
      targetMsg.liked = !targetMsg.liked;
      if (targetMsg.liked) targetMsg.disliked = false;
      persistState();
      $btn.toggleClass("text-emerald-500", targetMsg.liked);
      $msgGroup.find(".dislike-btn").removeClass("text-red-500");
    }
  });

  $(document).on("click", ".dislike-btn", function () {
    const $btn = $(this);
    const $msgGroup = $btn.closest(".message-group");
    const msgId = $msgGroup.data("msg-id");
    const currentChat = chats.find((c) => c.id === activeChatId);
    const targetMsg = currentChat?.messages.find((m) => m.id === msgId);

    if (targetMsg) {
      targetMsg.disliked = !targetMsg.disliked;
      if (targetMsg.disliked) targetMsg.liked = false;
      persistState();
      $btn.toggleClass("text-red-500", targetMsg.disliked);
      $msgGroup.find(".like-btn").removeClass("text-emerald-500");
    }
  });

  // New chat button
  $("#new-chat-btn, #new-chat-top-btn, #mobile-new-chat-btn").on(
    "click",
    function () {
      const newChat = {
        id: "chat-" + Date.now(),
        title: "New chat",
        pinned: false,
        createdAt: Date.now(),
        messages: [],
      };
      chats.unshift(newChat);
      persistState();
      switchChat(newChat.id);
    },
  );

  // Modals & Menu Toggles
  $("#profile-btn").on("click", function (e) {
    e.stopPropagation();
    $("#model-menu").addClass("hidden");
    $("#profile-menu").toggleClass("hidden");
  });

  $("#model-btn").on("click", function (e) {
    e.stopPropagation();
    $("#profile-menu").addClass("hidden");
    $("#model-menu").toggleClass("hidden");
  });

  // Outside click dismissals
  $(document).on("click", function (e) {
    if (!$(e.target).closest("#profile-dropdown-container").length)
      $("#profile-menu").addClass("hidden");
    if (!$(e.target).closest("#model-dropdown-container").length)
      $("#model-menu").addClass("hidden");
    if (!$(e.target).closest(".chat-item-menu, .chat-item-menu-btn").length)
      $(".chat-item-menu").addClass("hidden");
  });
});
