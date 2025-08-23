require('module-alias/register')
const { createContainer, renderContainer, updateElement } = require('@root/src/utils/StartResultRenderer');


createContainer('1');

updateElement('1', { key: 'e1', value: 'here el 1' });
renderContainer('1');


setTimeout(() => {
    updateElement('1', { key: 'e1', value: 'e1 updated!' });
    renderContainer('1');
}, 1000)