const helpers = require('../modules/helpers.js');

module.exports = {
  '@tags': ['e2e'],

  'Add and remove word': (client) => {
    const homepage = client.page.homepage();
    const wordsList = homepage.section.wordsList;
    const wordSingular = 'Auto';
    homepage.navigate();

    helpers.log(client.perform, 'Add word');
    homepage.section.addWord
      .waitForElementVisible('@btnAddWord')
      .setValue('@inputSingular', wordSingular)
      .setValue('@inputPlural', 'Autos')
      .setValue('@inputTranslation', 'Car')
      .click('@btnAddWord');


    homepage.section.wordsGroups.click('@btnStep0');

    wordsList
      .expect.element('@lastTranslation').text.equal('Car');

    helpers.log(client.perform, 'Remove word');
    wordsList
      .click('@lastDelete')
      .api.getAlertText(
        ({value}) => client.assert.ok(
            value.endsWith('"' + wordSingular + '"'),
            'alert ends with word title'
        )
      )
      .acceptAlert();

    wordsList
      .expect.element('@lastTranslation').text.not.equal('Car');

    client.end();
  },

};
