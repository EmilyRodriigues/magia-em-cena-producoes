document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Mobile
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    const icon = mobileBtn.querySelector('i');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark'); 
    });

    // 2. Sombra no Header ao "Scrollar"
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.style.boxShadow = '5px 1px 5px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // 3. Highlight Dinâmico do Menu
    const sections = document.querySelectorAll('section, div.quem-somos');
    const navItems = document.querySelectorAll('.nav-item');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px', 
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-item a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.parentElement.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // 4. ScrollReveal (Limpo, sem o ".dish" que estava quebrando o carrossel)
    ScrollReveal().reveal('#cta, .quem-somos-text', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    // 5. Swiper Depoimentos
    new Swiper(".swiper", {
        loop: true,
        grabCursor: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 18 },
            768: { slidesPerView: 2, spaceBetween: 18 },
            1188: { slidesPerView: 3, spaceBetween: 24 }
        }
    });

    // 6. Ativação do Carrossel 3D de Personagens (AGORA DENTRO DO BLOCO SEGURO!)
    new Swiper(".characters-swiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        observer: true,       // Fundamental para consertar o bug ao iniciar a página
        observeParents: true, // Fundamental para consertar o bug ao iniciar a página
        coverflowEffect: {
            rotate: 25,       
            stretch: 0,       
            depth: 250,       
            modifier: 1,
            slideShadows: true,
        },
        autoplay: {
            delay: 2500,      
            disableOnInteraction: false,
        }
    });

    // 7. ScrollReveal Título Personagens
    ScrollReveal().reveal('.menu-header', {
        origin: 'top',
        distance: '50px',
        duration: 1000,
    });
    
    // 8. Animação de contagem dos números na Hero Section
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        counter.innerText = '0'; 
        
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const c = +counter.innerText;
            const increment = target / 80; 
            
            if (c < target) {
                counter.innerText = `${Math.ceil(c + increment)}`;
                setTimeout(updateCounter, 30); 
            } else {
                counter.innerText = target; 
            }
        };
        
        updateCounter();
    });

    // 9. LÓGICA DO MODAL DE ORÇAMENTO (VIA WHATSAPP)
    const modal = document.getElementById('orcamentoModal');
    const btnsOpenModal = document.querySelectorAll('.btn-open-modal');
    const btnCloseModal = document.querySelector('.close-modal');
    const modalEventoInput = document.getElementById('modalEvento');
    
    btnsOpenModal.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const servicoEscolhido = btn.getAttribute('data-servico'); 
            modalEventoInput.value = servicoEscolhido; 
            modal.classList.add('show');
        });
    });

    btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    const btnEnviarWhatsApp = document.getElementById('btnEnviarWhatsApp');
    
    btnEnviarWhatsApp.addEventListener('click', () => {
        const nome = document.getElementById('modalNome').value.trim();
        const telefone = document.getElementById('modalTelefone').value.trim();
        const evento = document.getElementById('modalEvento').value.trim();
        const data = document.getElementById('modalData').value;
        const mensagem = document.getElementById('modalMensagem').value.trim();

        if(!nome || !telefone || !evento) {
            alert("Por favor, preencha pelo menos seu Nome, Telefone e o Tipo de Evento!");
            return;
        }

        let textoMsg = `Olá! Me chamo *${nome}* (Tel: ${telefone}).\n`;
        textoMsg += `Gostaria de solicitar um orçamento para *${evento}*`;
        
        if(data) {
            const dataFormatada = data.split('-').reverse().join('/');
            textoMsg += `, previsto para o dia *${dataFormatada}*`;
        }
        textoMsg += `.\n\n`;
        
        if(mensagem) {
            textoMsg += `*Detalhes adicionais:*\n${mensagem}`;
        }

        const numeroZap = "5511970300363"; 
        const urlZap = `https://wa.me/${numeroZap}?text=${encodeURIComponent(textoMsg)}`;
        
        window.open(urlZap, '_blank');
        modal.classList.remove('show');
    });
});