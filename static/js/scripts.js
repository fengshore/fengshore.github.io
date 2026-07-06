

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'news', 'publications', 'awards']
const publication_images = [
    { pattern: /InduceKV/i, src: 'static/assets/img/InduceKV.png', alt: 'InduceKV preview' },
    { pattern: /MultiModal Compensation|Detection Transformers/i, src: 'static/assets/img/MM_DETR.png', alt: 'MM-DETR preview' },
    { pattern: /TrustRoboReward/i, src: 'static/assets/img/trustreboreward.png', alt: 'TrustRoboReward preview' },
    { pattern: /Deep-Research Agents|Span-Level Error Localization/i, src: 'static/assets/img/DRIFT.png', alt: 'DRIFT preview' },
    { pattern: /Memoria-Bench/i, src: 'static/assets/img/Memoria.png', alt: 'Memoria-Bench preview' },
    { pattern: /Remote Sensing Image Captioning|JSTARS/i, src: 'static/assets/img/JSTAR.png', alt: 'Remote sensing captioning preview' },
]

function getPublicationImage(text) {
    return publication_images.find(image => image.pattern.test(text));
}

function separatePublicationLinks(body) {
    const links = Array.from(body.querySelectorAll('a'));
    if (links.length === 0) {
        return;
    }

    const linkRow = document.createElement('div');
    linkRow.className = 'publication-links';
    links.forEach(link => {
        linkRow.appendChild(link);
    });
    body.appendChild(linkRow);
}

function enhancePublications(container) {
    const items = Array.from(container.querySelectorAll('li'));
    items.forEach((item, index) => {
        item.classList.add('publication-item');

        const cover = document.createElement('div');
        cover.className = 'publication-cover';
        const image = getPublicationImage(item.textContent);
        if (image) {
            cover.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
        } else {
            cover.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>`;
        }
        item.prepend(cover);

        const body = document.createElement('div');
        body.className = 'publication-body';
        while (item.childNodes.length > 1) {
            body.appendChild(item.childNodes[1]);
        }
        separatePublicationLinks(body);
        item.appendChild(body);
    });
}

function enhanceNews(container) {
    Array.from(container.querySelectorAll('li')).forEach(item => {
        item.classList.add('news-item');
    });
}


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                const container = document.getElementById(name + '-md');
                container.innerHTML = html;
                if (name === 'publications') {
                    enhancePublications(container);
                }
                if (name === 'news') {
                    enhanceNews(container);
                }
            }).then(() => {
                // MathJax
                if (window.MathJax && MathJax.typeset) {
                    MathJax.typeset();
                }
            })
            .catch(error => console.log(error));
    })

}); 
