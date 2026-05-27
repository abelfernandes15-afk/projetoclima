/* =========================
    HASH DE SENHA
========================= */
async function hashSenha(senha) {
    const encoded = new TextEncoder().encode(senha);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* =========================
    MENU LATERAL
========================= */
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.classList.toggle("active");
    if (overlay) overlay.classList.toggle("active");
}

/* =========================
    MODAL DOS ESTADOS
========================= */
function abrirModal(event, nome, climaTexto, pop, alt, veg) {
    if (event) event.preventDefault();

    const modal = document.getElementById("minhaModal");
    if (!modal) return;

    document.getElementById("titulo").innerHTML    = nome;
    document.getElementById("clima").innerHTML     = climaTexto;
    document.getElementById("populacao").innerHTML = pop;
    document.getElementById("altitude").innerHTML  = alt;
    document.getElementById("vegetacao").innerHTML = veg;

    modal.showModal();
}

document.addEventListener("DOMContentLoaded", function () {
    const modal  = document.getElementById("minhaModal");
    const fechar = document.getElementById("fecharModal");

    if (!modal) return;

    if (fechar) {
        fechar.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", function (e) {
        const r = modal.getBoundingClientRect();
        if (
            e.clientX < r.left || e.clientX > r.right ||
            e.clientY < r.top  || e.clientY > r.bottom
        ) {
            modal.close();
        }
    });
});

/* =========================
   VALIDAR EMAIL
========================= */
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =========================
   CADASTRO
========================= */
async function cadastrar() {
    const nome           = document.getElementById("nome")?.value.trim();
    const email          = document.getElementById("email")?.value.trim();
    const senha          = document.getElementById("senha")?.value;
    const confirmarSenha = document.getElementById("confirmarSenha")?.value;

    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos!");
        return;
    }
    if (!validarEmail(email)) {
        alert("Digite um e-mail válido!");
        return;
    }
    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
    }
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const senhaHash = await hashSenha(senha);

    localStorage.setItem("nome",  nome);
    localStorage.setItem("email", email);
    localStorage.setItem("senha", senhaHash);
    localStorage.removeItem("logado");

    alert("Cadastro realizado com sucesso! Faça o login.");
    window.location.href = "login.html";
}

/* =========================
    LOGIN
========================= */
async function login() {
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    if (!emailInput || !senhaInput) return;

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {
        alert("Preencha e-mail e senha!");
        return;
    }

    const emailSalvo = localStorage.getItem("email");
    const senhaSalva = localStorage.getItem("senha");

    if (!emailSalvo || !senhaSalva) {
        alert("Nenhuma conta encontrada. Cadastre-se primeiro.");
        return;
    }

    const senhaHash = await hashSenha(senha);

    if (email === emailSalvo && senhaHash === senhaSalva) {
        localStorage.setItem("logado", "true");
        window.location.replace("home.html");
    } else {
        alert("E-mail ou senha incorretos!");
        senhaInput.value = "";
        senhaInput.focus();
    }
}

/* =========================
    SAIR
========================= */
function sair() {
    localStorage.removeItem("logado");
    window.location.replace("login.html");
}

/* =========================
    EXIBIR NOME DO USUÁRIO
========================= */
document.addEventListener("DOMContentLoaded", function () {
    const nome = localStorage.getItem("nome");
    const el   = document.getElementById("nomeUsuario");
    if (el && nome) el.textContent = nome;
});
