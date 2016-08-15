module.exports = {
  '@tags': ['e2e'],

  'Add and remove word': (client) => {
    let homepage = client.page.homepage();
    let addWordSection = homepage.section.addWord;

    homepage.navigate();

    addWordSection.waitForElementVisible('@btnAddWord');


  // featuredProducts.waitForElementVisible('@itemNext')
  //     .assert.elementNotPresent('@itemPrev');

  // // Wait for all featured products to be loaded
  // client.pause(100);

  // featureduredProducts.click('@itemNext')
  //     .assert.visible('@itemPrev')

  //   client.end();
  },


  // afterEach: function(_, done){
  //  setupAndTearDown.afterEach(this, done);
  // },

  // after: function(client, done){
  // setupAndTearDown.after(client, done);
  // }
};
