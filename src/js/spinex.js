(() => {
  const REFERRAL = 'gg60164';
  const MAIN_HOSTS = ['spinex.fun', 'www.spinex.fun', 'spinex88.com', 'www.spinex88.com'];

  window.spinexLink = (input = '/') => {
    const url = new URL(input, 'https://www.spinex.fun');
    url.searchParams.set('referral', REFERRAL);
    return url.toString();
  };

  const markOutbound = (anchor) => {
    anchor.target = '_blank';
    const existing = anchor.getAttribute('rel') || '';
    const rel = new Set(existing.split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('nofollow');
    rel.add('sponsored');
    anchor.rel = Array.from(rel).join(' ');
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (href === '#cta') {
        anchor.href = window.spinexLink('/');
        markOutbound(anchor);
        return;
      }
      try {
        const url = new URL(href, window.location.href);
        if (MAIN_HOSTS.includes(url.hostname)) {
          if (!url.searchParams.has('referral')) url.searchParams.set('referral', REFERRAL);
          anchor.href = url.toString();
          markOutbound(anchor);
        }
      } catch (_) {}
    });

    const navToggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(open));
      });
    }

    document.querySelectorAll('.faq-question').forEach((button) => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        if (panel) panel.hidden = expanded;
      });
    });
  });
})();
