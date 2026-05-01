import { supabase } from '../config/supabase.js'

export async function initNavbar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    renderNavbar(profile, user.email)
}

function renderNavbar(profile, email) {
    const nav = document.createElement('nav')
    nav.className = 'top-nav'
    
    const role = profile?.role || 'colaborador'
    const name = profile?.full_name || email

    let menuItems = ''
    
    if (role === 'admin') {
        menuItems = `
            <a href="/src/pages/admin/empresas.html" class="nav-link">Empresas</a>
            <a href="/src/pages/dashboard-gestor.html" class="nav-link">Relatórios</a>
            <a href="/src/pages/meus-cursos.html" class="nav-link">Meus Cursos</a>
        `
    } else if (role === 'gestor') {
        menuItems = `
            <a href="/src/pages/dashboard-gestor.html" class="nav-link">Dashboard</a>
            <a href="/src/pages/meus-cursos.html" class="nav-link">Meus Cursos</a>
        `
    } else {
        menuItems = `
            <a href="/src/pages/meus-cursos.html" class="nav-link">Meus Cursos</a>
        `
    }

    nav.innerHTML = `
        <div class="nav-container">
            <div class="nav-brand">
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

    // Adicionar estilos se não existirem
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
        document.body.prepend(nav)
    }

    // Evento de logout
    document.getElementById('nav-logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.href = '/src/pages/login.html'
    })

    // Marcar link ativo
    const currentPath = window.location.pathname
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active')
        }
    })
}
