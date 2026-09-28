document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mobileNav.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) {
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const accountDialog = document.querySelector("[data-account-modal]");
  document.querySelectorAll("[data-account-dialog]").forEach((button) => {
    button.addEventListener("click", () => accountDialog?.showModal());
  });
  document.querySelector("[data-dialog-close]")?.addEventListener("click", () => accountDialog?.close());
  accountDialog?.addEventListener("click", (event) => {
    if (event.target === accountDialog) accountDialog.close();
  });

  const dashboard = document.querySelector("[data-dashboard]");
  if (!dashboard) return;

  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
  sidebarToggle?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(isOpen));
  });

  const toolDefinitions = {
    lesson: {
      title: "Lesson note generator",
      description: "Set the context for your next lesson note.",
      fields: [
        ["Subject", "text", "e.g. Mathematics"],
        ["Class or grade", "text", "e.g. Grade 5"],
        ["Topic", "text", "What are you teaching?", "wide"],
        ["Learning objectives", "textarea", "What should learners know or be able to do?", "wide"],
        ["Lesson duration", "select", ["Select duration", "30 minutes", "40 minutes", "60 minutes", "Other"]],
      ],
    },
    presentation: {
      title: "Presentation maker",
      description: "Outline a classroom presentation that brings your topic to life.",
      fields: [
        ["Subject", "text", "e.g. Science"],
        ["Class or grade", "text", "e.g. Grade 6"],
        ["Presentation topic", "text", "What is the presentation about?", "wide"],
        ["Key points", "textarea", "What should the class take away?", "wide"],
        ["Visual direction", "select", ["Choose a visual direction", "Diagrams and labels", "Classroom examples", "Simple illustrations", "Photo suggestions"]],
      ],
    },
    worksheet: {
      title: "Worksheet generator",
      description: "Set up a practice sheet for your learners.",
      fields: [
        ["Subject", "text", "e.g. English"],
        ["Class or grade", "text", "e.g. Grade 4"],
        ["Topic", "text", "What will learners practise?", "wide"],
        ["Instructions or skills", "textarea", "What should the worksheet help learners practise?", "wide"],
        ["Activity type", "select", ["Choose an activity type", "Short answer", "Multiple choice", "Matching", "Mixed practice"]],
      ],
    },
    assessment: {
      title: "Test & quiz maker",
      description: "Plan an assessment around the knowledge you want to check.",
      fields: [
        ["Subject", "text", "e.g. Social Studies"],
        ["Class or grade", "text", "e.g. Grade 7"],
        ["Topics to assess", "text", "What have learners studied?", "wide"],
        ["Assessment focus", "textarea", "What should this assessment help you find out?", "wide"],
        ["Question format", "select", ["Choose a question format", "Multiple choice", "Short answer", "Written response", "Mixed format"]],
      ],
    },
    term: {
      title: "Term planner",
      description: "Set up the shape of your upcoming term.",
      fields: [
        ["Subject", "text", "e.g. Integrated Science"],
        ["Class or grade", "text", "e.g. Grade 5"],
        ["Term or dates", "text", "e.g. Term 1, January-April", "wide"],
        ["Topics or curriculum goals", "textarea", "Add the topics or learning goals to cover this term.", "wide"],
        ["Number of teaching weeks", "select", ["Select number of weeks", "8 weeks", "9 weeks", "10 weeks", "12 weeks"]],
      ],
    },
  };

  const toolScreen = document.querySelector('[data-screen="tool"]');
  const resourcesScreen = document.querySelector('[data-screen="resources"]');
  const overviewScreen = document.querySelector('[data-screen="overview"]');
  const breadcrumb = document.querySelector("[data-breadcrumb]");
  const navButtons = [...document.querySelectorAll("[data-dashboard-nav] [data-view]")];

  function createField([label, type, detail, width]) {
    const field = document.createElement("div");
    field.className = `field${width === "wide" ? " field-wide" : ""}`;
    const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const labelElement = document.createElement("label");
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    field.append(labelElement);

    if (type === "select") {
      const select = document.createElement("select");
      select.id = id;
      detail.forEach((optionText, index) => {
        const option = document.createElement("option");
        option.textContent = optionText;
        option.value = index === 0 ? "" : optionText;
        option.disabled = index === 0;
        option.selected = index === 0;
        select.append(option);
      });
      field.append(select);
      return field;
    }

    const control = document.createElement(type);
    control.id = id;
    if (type === "textarea") control.rows = 3;
    else control.type = "text";
    control.placeholder = detail;
    field.append(control);
    return field;
  }

  function renderTool(view) {
    const definition = toolDefinitions[view];
    if (!definition) return;
    toolScreen.replaceChildren();

    const header = document.createElement("div");
    header.className = "tool-view-header";
    header.innerHTML = `<p class="eyebrow">TEACHING TOOL</p><h1>${definition.title}</h1><p>${definition.description}</p>`;
    const notice = document.createElement("div");
    notice.className = "tool-notice";
    notice.innerHTML = '<i data-lucide="construction"></i><span>This planning interface is a preview. AI-assisted creation is not connected yet.</span>';

    const workspace = document.createElement("div");
    workspace.className = "tool-workspace";
    const form = document.createElement("section");
    form.className = "generator-form";
    form.setAttribute("aria-label", definition.title);
    form.innerHTML = '<h2>Resource details</h2><p class="form-intro">Your class context will shape the resource.</p>';
    const fields = document.createElement("div");
    fields.className = "form-grid";
    definition.fields.forEach((field) => fields.append(createField(field)));
    form.append(fields);
    const footer = document.createElement("div");
    footer.className = "form-footer";
    footer.innerHTML = '<span class="form-footer-note"><i data-lucide="lock-keyhole"></i> Available when AI tools launch</span><button class="button button-disabled button-small" type="button" disabled>Generate resource <i data-lucide="sparkles"></i></button>';
    form.append(footer);

    const preview = document.createElement("aside");
    preview.className = "preview-panel";
    preview.setAttribute("aria-label", "Resource preview");
    preview.innerHTML = '<h2>Resource preview</h2><div class="preview-canvas" aria-hidden="true"><div class="preview-lines"><span class="preview-line"></span><span class="preview-line"></span><span class="preview-line"></span><span class="preview-line"></span><span class="preview-line"></span></div><p class="preview-caption">Your resource preview will appear here once creation is available.</p></div>';
    workspace.append(form, preview);
    toolScreen.append(header, notice, workspace);
    setScreen("tool");
    breadcrumb.textContent = definition.title;
    if (window.lucide) window.lucide.createIcons();
  }

  function renderResources() {
    resourcesScreen.innerHTML = '<div class="resources-header"><p class="eyebrow">YOUR LIBRARY</p><h1>My resources</h1><p>Teaching materials you create will be kept together here.</p></div><div class="resource-empty-state"><span class="empty-icon"><i data-lucide="library-big"></i></span><h2>Your library is ready when you are</h2><p>Saved lesson notes, worksheets, assessments, and other teaching materials will appear here.</p><button class="button button-outline button-small" type="button" data-view="lesson">Explore lesson notes <i data-lucide="arrow-right"></i></button></div>';
    setScreen("resources");
    breadcrumb.textContent = "My resources";
    if (window.lucide) window.lucide.createIcons();
  }

  function setScreen(screen) {
    overviewScreen.hidden = screen !== "overview";
    toolScreen.hidden = screen !== "tool";
    resourcesScreen.hidden = screen !== "resources";
  }

  function navigate(view) {
    navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    if (view === "overview") {
      setScreen("overview");
      breadcrumb.textContent = "Overview";
    } else if (view === "resources") {
      renderResources();
    } else {
      renderTool(view);
    }
    sidebar?.classList.remove("is-open");
    sidebarToggle?.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-view]");
    if (trigger && dashboard.contains(trigger)) navigate(trigger.dataset.view);
  });
});