// initialize default value
function getTheme() {
    return localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
}

function setTheme(style) {
    document.documentElement.setAttribute('data-theme', style);
    localStorage.setItem('theme', style);
}

function init() {
    // initialize default value
    const theme = getTheme();

    if (theme === null) {
        if (!document.documentElement.getAttribute('data-theme')) {
            setTheme('light');
        } else {
            setTheme(document.documentElement.getAttribute('data-theme'));
        }
    } else {
        // load a stored theme
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
}


// switch themes
function switchTheme() {
    const theme = getTheme();
    if (theme === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitcher = document.querySelector('.theme-switch');
    themeSwitcher.addEventListener('click', switchTheme, false);
}, false);

init();
