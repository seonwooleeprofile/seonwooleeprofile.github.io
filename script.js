// ========================================
// 이선우 캐릭터 사이트 - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 초기화
    initLoader();
    initHeader();
    initMobileMenu();
    initBGM();
    initGallery();
    initScrollAnimations();
    initBackToTop();
    initSmoothScroll();
});

// ========================================
// 로딩 화면
// ========================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    // 모든 이미지 로드 대기 또는 최대 3초
    const hideLoader = () => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
    };
    
    // 페이지 로드 완료 시
    window.addEventListener('load', () => {
        setTimeout(hideLoader, 500);
    });
    
    // 최대 3초 후 강제 숨김
    setTimeout(hideLoader, 3000);
}

// ========================================
// 헤더 스크롤 효과
// ========================================
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // 스크롤 방향에 따른 헤더 스타일
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// 모바일 메뉴
// ========================================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav a');
    
    const openMenu = () => {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenu = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    hamburger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    mobileMenuClose.addEventListener('click', closeMenu);
    mobileMenuOverlay.addEventListener('click', closeMenu);
    
    // 링크 클릭 시 메뉴 닫기
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ========================================
// BGM 컨트롤
// ========================================
function initBGM() {
    const bgmToggle = document.getElementById('bgm-toggle');
    const bgm = document.getElementById('bgm');
    const bgmOnIcon = document.querySelector('.bgm-on');
    const bgmOffIcon = document.querySelector('.bgm-off');
    
    let isPlaying = false;
    
    bgmToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgm.pause();
            bgmToggle.classList.remove('playing');
            bgmOnIcon.style.display = 'none';
            bgmOffIcon.style.display = 'block';
        } else {
            bgm.volume = 0.3;
            bgm.play().catch(e => {
                console.log('자동 재생 차단됨:', e);
            });
            bgmToggle.classList.add('playing');
            bgmOnIcon.style.display = 'block';
            bgmOffIcon.style.display = 'none';
        }
        isPlaying = !isPlaying;
    });
}

// ========================================
// 갤러리 기능
// ========================================
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentIndex = 0;
    let visibleItems = [];
    
    // 필터링
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // 활성 버튼 변경
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 아이템 필터링
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            
            updateVisibleItems();
        });
    });
    
    // 보이는 아이템 목록 업데이트
    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }
    
    updateVisibleItems();
    
    // 모달 열기
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            currentIndex = visibleItems.indexOf(item);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 모달 닫기
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 이전/다음 이미지
    const showImage = (index) => {
        if (visibleItems.length === 0) return;
        
        // 인덱스 순환
        if (index < 0) index = visibleItems.length - 1;
        if (index >= visibleItems.length) index = 0;
        
        currentIndex = index;
        const img = visibleItems[currentIndex].querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
    };
    
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });
    
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showImage(currentIndex - 1);
                break;
            case 'ArrowRight':
                showImage(currentIndex + 1);
                break;
        }
    });
    
    // 터치 스와이프 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;
    
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 왼쪽으로 스와이프 → 다음
                showImage(currentIndex + 1);
            } else {
                // 오른쪽으로 스와이프 → 이전
                showImage(currentIndex - 1);
            }
        }
    }
}

// ========================================
// 스크롤 애니메이션
// ========================================
function initScrollAnimations() {
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.personality-card, .profile-info-section, .greeting-paragraph, .greeting-dialogue');
    
    // 섹션 헤더들
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    // 요소에 클래스 추가
    animatedElements.forEach(el => el.classList.add('fade-in'));
    sectionHeaders.forEach(el => el.classList.add('fade-in'));
    
    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 모든 대상 관찰
    [...animatedElements, ...sectionHeaders].forEach(el => observer.observe(el));
    
    // 프로필 이미지 애니메이션
    const profileImages = document.querySelectorAll('.profile-main-image, .profile-sub-images img');
    profileImages.forEach((img, index) => {
        img.classList.add('fade-in');
        img.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(img);
    });
    
    // 갤러리 아이템 애니메이션 (순차적)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
        item.classList.add('fade-in');
        galleryObserver.observe(item);
    });
}

// ========================================
// 맨 위로 버튼
// ========================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// 부드러운 스크롤 (앵커 링크)
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// 패럴랙스 효과 (히어로 섹션)
// ========================================
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image-wrapper');
    const heroText = document.querySelector('.hero-text');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxRate = scrolled * 0.3;
            heroImage.style.transform = `translateY(${parallaxRate * 0.5}px)`;
            heroText.style.transform = `translateY(${parallaxRate * 0.3}px)`;
        }
    });
}

// ========================================
// 타이핑 효과 (히어로 타이틀)
// ========================================
function initTypingEffect() {
    const tagline = document.querySelector('.hero-tagline');
    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // 페이지 로드 후 딜레이
    setTimeout(typeWriter, 1500);
}

// ========================================
// 커서 효과 (데스크톱)
// ========================================
function initCustomCursor() {
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // 호버 효과
        document.querySelectorAll('a, button, .gallery-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
}

// ========================================
// 페이지 전환 효과
// ========================================
function initPageTransition() {
    // 외부 링크 클릭 시 페이드 아웃
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname !== window.location.hostname) return;
            
            e.preventDefault();
            const href = this.href;
            
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// ========================================
// 이미지 지연 로딩 (Intersection Observer)
// ========================================
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ========================================
// 스크롤 프로그레스 바
// ========================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const bar = progressBar.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        bar.style.width = scrollPercent + '%';
    });
}

// ========================================
// 테마 변경 (다크/라이트) - 선택적
// ========================================
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    }
    
    // 테마 토글 버튼이 있다면
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.dataset.theme || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }
}

