const searchInput = document.getElementById('searchInput');
const resultContainer = document.querySelector('.resultado');
const wordCountContainer = document.getElementById('wordCount');
const nextButton = document.getElementById('nextButton');
let currentIndex = -1;
let highlightedElements = [];
let accordionElements = [];
let matchingTabs = [];
let currentTabIndex = 0;

searchInput.addEventListener('input', searchAccordion);
nextButton.addEventListener('click', goToNextHighlight);

function clearSearchResults() {
    searchInput.value = '';
    resultContainer.innerHTML = '';
    wordCountContainer.textContent = '';
    removeHighlights();
}

function removeHighlights() {
    highlightedElements.forEach(element => {
        const parent = element.parentNode;
        parent.replaceChild(document.createTextNode(element.textContent), element);
        parent.normalize();
    });
    highlightedElements = [];
    currentIndex = -1;
    nextButton.style.display = 'none';
}

function addClassToTabs() { 
    var elemento = document.querySelectorAll(".5o1dv9Xd_content");
    for (var i = 0; i < elemento.length; i++) {
        elemento[i].classList.add("accordion__item");
    }

    const divsWithNav = document.querySelectorAll('div > nav');
    divsWithNav.forEach(nav => {
        const div = nav.parentNode;
        const anchors = nav.querySelectorAll('a');
        anchors.forEach(anchor => {
            anchor.classList.add('accordion__header');
        });
    });
}

function searchAccordion() {
    addClassToTabs();

    const searchText = searchInput.value.toLowerCase();
    resultContainer.innerHTML = '';
    wordCountContainer.textContent = '';
    removeHighlights();
    accordionElements = [];
    matchingTabs = [];
    currentTabIndex = 0;

    if (searchText === '') {
        nextButton.style.display = 'none';
        return;
    }

    const contenedor = document.querySelector('.contenedor');
    const accordionItems = contenedor.querySelectorAll('.accordion__item');
    let wordCount = 0;

    function searchElement(element) {
        const header = element.querySelector('.accordion__header');
        const content = element.querySelector('._WDJGyJgk');
        
        const title = header ? header.textContent.toLowerCase() : '';
        const contentText = content ? content.textContent.toLowerCase() : '';
        const hasAdditionalClass = header && header.classList.contains('dif');

        const titleMatchCount = (title.match(new RegExp(escapeRegExp(searchText), 'gi')) || []).length;
        const contentMatchCount = (contentText.match(new RegExp(escapeRegExp(searchText), 'gi')) || []).length;
        const matchCount = titleMatchCount + contentMatchCount;
        wordCount += matchCount;

        if (matchCount > 0) {
            accordionElements.push({ element, matchCount });

            const resultItem = document.createElement('div');
            resultItem.textContent = header.textContent;
            if (hasAdditionalClass) {
                resultItem.classList.add('additional');
            }

            resultItem.addEventListener('click', () => {
                openParentAccordions(element);
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                highlightText(header, searchText);
                highlightText(content, searchText);
            });

            resultContainer.appendChild(resultItem);
        }

        highlightText(header, searchText);
        if (content) {
            highlightText(content, searchText);
        }
    }

    function searchTabs() {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].textContent.toLowerCase().includes(searchText)) {
                matchingTabs.push(i);
                wordCount++;
            }
        }
    }

    function highlightText(element, searchText) {
        if (!element || !searchText) return;
        const regex = new RegExp((`${escapeRegExp(searchText)}`), 'gi');
        traverseNodes(element, regex);
    }

    function traverseNodes(node, regex) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const parentNode = node.parentNode;
            const fragments = [];
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
                const beforeMatch = document.createTextNode(text.substring(lastIndex, match.index));
                const span = document.createElement('span');
                span.className = 'highlight';
                span.textContent = match[0];
                fragments.push(beforeMatch, span);
                lastIndex = regex.lastIndex;
                highlightedElements.push(span);
            }

            const remainder = document.createTextNode(text.substring(lastIndex));
            fragments.push(remainder);

            fragments.forEach(fragment => parentNode.insertBefore(fragment, node));
            parentNode.removeChild(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(child => traverseNodes(child, regex));
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function openTabs(tabs, searchText) {
        tabs.forEach(tab => {
            const tabContent = tab.querySelector('.tab-pane');
            const tabText = tabContent ? tabContent.textContent.toLowerCase() : '';
            if (tabText.includes(searchText)) {
                const tabId = tabContent.getAttribute('id');
                const tabTrigger = document.querySelector(`[data-bs-target="#${tabId}"]`);
                if (tabTrigger && !tabTrigger.classList.contains('active')) {
                    tabTrigger.click();
                }
            }
        });
    }

    accordionItems.forEach(item => searchElement(item));
    searchTabs(); // Buscar también en los tabs

    wordCountContainer.textContent = `Número de coincidencias: ${wordCount}`;

    if (highlightedElements.length > 1 || matchingTabs.length > 1) {
        nextButton.style.display = 'block';
    } else {
        nextButton.style.display = 'none';
    }

    currentIndex = -1;
}

function goToNextHighlight() {
    if (accordionElements.length === 0 && matchingTabs.length === 0) return;

    if (accordionElements.length > 0) {
        currentIndex = (currentIndex + 1) % accordionElements.length;
        const nextAccordion = accordionElements[currentIndex].element;

        openParentAccordions(nextAccordion);

        setTimeout(() => {
            nextAccordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nextAccordion.querySelector('._WDJGyJgk').classList.add('current-highlight');

            if (currentIndex > 0) {
                accordionElements[currentIndex - 1].element.querySelector('._WDJGyJgk').classList.remove('current-highlight');
            } else {
                accordionElements[accordionElements.length - 1].element.querySelector('._WDJGyJgk').classList.remove('current-highlight');
            }
        }, 300);
    } else {
        openNextTab();
    }
}

function openNextTab() {
    currentTabIndex++;
    if (currentTabIndex < matchingTabs.length) {
        openTab(matchingTabs[currentTabIndex]);
    } else {
        alert("No hay más tabs que coincidan.");
        document.getElementById("nextButton").disabled = true;
    }
}

function openTab(searchText) {    
    var tabs = document.getElementsByClassName("5o1dv9Xd_content");
        tabs.forEach(tab => {
            const tabContent = tab.querySelector('accordion__header');
            const tabText = tabContent ? tabContent.textContent.toLowerCase() : '';
            if (tabText.includes(searchText)) {
                tab.setAttribute("data-active", "true");
                console.log("Tab data-active: " + tabs.getAttribute("data-active"));
            }
        });
    }


function openParentAccordions(element) {
    let parentElement = element.closest('.accordion_item, ._5o1dv9Xd_content');
    while (parentElement) {
        const content = parentElement.querySelector('._WDJGyJgk');
        if (content && content.style.display !== 'block') {
            content.style.display = 'block';
        }
        parentElement = parentElement.parentElement.closest('.accordion_item, ._5o1dv9Xd_content');
    }
}

const accordionItems = document.querySelectorAll('.accordion__item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    header.addEventListener('click', () => {
        const content = item.querySelector('._WDJGyJgk');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});