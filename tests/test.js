require('module-alias/register')
const { createContainer, renderContainer, updateElement } = require('@root/src/utils/start_result_renderer.util');


createContainer('1');

updateElement('1', { key: 'e1', value: 'here el 1' });
renderContainer('1');


setTimeout(() => {
    updateElement('1', { key: 'e1', value: 'e1 updated!' });
    renderContainer('1');
}, 1000)