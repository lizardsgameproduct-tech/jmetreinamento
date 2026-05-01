import { supabase } from '../config/supabase.js'

export async function initNavbar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Buscar perfil com retry simples para garantir que os dados do banco carreguem
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Erro ao carregar perfil na navbar:', error)
    }

    renderNavbar(profile, user.email)
}

function renderNavbar(profile, email) {
    const nav = document.createElement('nav')
    nav.className = 'top-nav'
    
    const role = profile?.role || 'colaborador'
    const name = profile?.full_name || email

    console.log('Navbar renderizada para role:', role) // Debug no console do navegador

    let menuItems = ''
    
    // Admin vê tudo
    if (role === 'admin') {
        menuItems = `
            <a href="/src/pages/admin/empresas.html" class="nav-link">Empresas</a>
            <a href="/src/pages/dashboard-gestor.html" class="nav-link">Relatórios</a>
            <a href="/src/pages/meus-cursos.html" class="nav-link">Meus Cursos</a>
        `
    } 
    // Gestor vê sua empresa e cursos
    else if (role === 'gestor') {
        menuItems = `
            <a href="/src/pages/dashboard-gestor.html" class="nav-link">Minha Empresa</a>
            <a href="/src/pages/meus-cursos.html" class="nav-link">Meus Cursos</a>
        `
    } 
    // Colaborador vê apenas cursos
    else {
        menuItems = `
            <a href="/src/pages/meus-cursos.html" class="nav-link">Meus Cursos</a>
        `
    }

    nav.innerHTML = `
        <div class="nav-container">
            <div class="nav-brand" onclick="window.location.href='/src/pages/meus-cursos.html'" style="cursor:pointer">
                <span class="brand-logo">JMR</span>
                <span class="brand-name">JMR Tecnologia</span>
            </div>
            <div class="nav-menu">
                ${menuItems}
            </div>
            <div class="nav-user">
                <span class="user-name">${name}</span>
                <button id="nav-logout-btn" class="logout-btn-small">Sair</button>
            </div>
        </div>
    `

    // Estilos da Navbar
    if (!document.getElementById('nav-styles')) {
        const style = document.createElement('style')
        style.id = 'nav-styles'
        style.innerHTML = `
            .top-nav {
                background: #111827;
                border-bottom: 1px solid #1F2937;
                padding: 0 40px;
                height: 64px;
                display: flex;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 1000;
                width: 100%;
            }
            .nav-container {
                width: 100%;
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .nav-brand { display: flex; align-items: center; gap: 12px; }
            .brand-logo { 
                background: #00FF41; color: #000; padding: 4px 8px; 
                border-radius: 6px; font-weight: 800; font-size: 14px;
            }
            .brand-name { font-weight: 700; font-size: 18px; color: #F9FAFB; font-family: 'Syne', sans-serif; }
            .nav-menu { display: flex; gap: 24px; }
            .nav-link { 
                color: #9CA3AF; text-decoration: none; font-size: 14px; 
                font-weight: 600; transition: color 0.2s;
            }
            .nav-link:hover, .nav-link.active { color: #00FF41; }
            .nav-user { display: flex; align-items: center; gap: 16px; }
            .user-name { color: #D1D5DB; font-size: 13px; }
            .logout-btn-small {
                background: transparent; border: 1px solid #1F2937; color: #F9FAFB;
                padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;
                transition: all 0.2s;
            }
            .logout-btn-small:hover { background: #1F2937; border-color: #374151; }
            
            @media (max-width: 768px) {
                .nav-menu { display: none; }
                .top-nav { padding: 0 20px; }
            }
        `
        document.head.appendChild(style)
    }

    // Inserir no topo do body ou substituir header existente
    const existingHeader = document.querySelector('.header')
    if (existingHeader) {
        existingHeader.replaceWith(nav)
    } else {
        const navExists = document.querySelector('.top-nav')
        if (!navExists) {
            document.body.prepend(nav)
        } else {
            navExists.replaceWith(nav)
        }
    }

    // Evento de logout
    const logoutBtn = document.getElementById('nav-logout-btn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut()
            window.location.href = '/src/pages/login.html'
        })
    }

    // Marcar link ativo
    const currentPath = window.location.pathname
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active')
        }
    })
}
