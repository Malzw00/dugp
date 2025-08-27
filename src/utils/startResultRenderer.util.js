let _render_function = console.log;
let _clear_function = console.clear;

const containers = {

}

function render(content) {

    _clear_function();
    _render_function(content);
}

function setRenderFunction (render_function) {
    if(!typeof render_function === 'function') 
    throw new Error("render_function is not function");
    
    _render_function = render_function;
}

function setClearFunction (clear_function) {
    if(!typeof clear_function === 'function') 
    throw new Error("render_function is not function");
    
    _clear_function = clear_function;
}

function createContainer (key, elements = []) {
    const container = {};
    elements.forEach(element => {
        container[element.key] = element.value;
    });
    containers[key] = container;
    return key;
}

function createElement(key, value) {
    return { key, value };
}

function updateElement(containerKey, element) {
    containers[containerKey][element.key] = element.value;
}

function renderContainer(key) {
    _clear_function();
    _render_function(Object.values(containers[key]).join('\n'));
}


module.exports = {
    render,
    setRenderFunction,
    setClearFunction,
    renderContainer,
    updateElement,
    createElement,
    createContainer,
}