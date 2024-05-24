import 'cypress-file-upload';

describe('Storage Manager Test', () => {
  let fileContent;
  before(() => {
    cy.fixture('LogoF1FanApp.png').then((content) => {
      fileContent = content;
    });
  });

  it('Add Media', () => {
    cy.login();

    cy.get('#changeHomeBTN').click({force:true});

    cy.get('#test').click({force:true});
    cy.wait(5000);
    cy.get('#addBTN').click({force:true});
    cy.wait(100);

    cy.window().then((win) => {
      // Create the file input element dynamically (if needed)
      const fileInput = win.document.createElement('input');
      fileInput.type = 'file';
      fileInput.className = 'file-input'; // Set class name if required
  
      // Append the input to the DOM (optional, depending on your test)
      win.document.body.appendChild(fileInput);
  
      // Use Cypress command to attach the file
      cy.get('.file-input').attachFile({
        fileContent: fileContent,
        fileName: 'LogoF1FanApp.png',
        mimeType: 'image/png'
      });
  
      // Trigger change event on the element
      cy.get('.file-input').trigger('change', {force:true});
  
      
      cy.get('#AddMediaBTN').click({force:true});
      cy.wait(1000);
      cy.contains('LogoF1FanApp').should('be.visible');
    });

    
  });

  it('Delete Media', () => {
    cy.login();

    cy.get('#changeHomeBTN').click({force:true});

    cy.get('#test').click({force:true});
    cy.wait(5000);
    
    cy.contains('LogoF1FanApp').parent().parent().find('td').last().find('span').first().click({force:true});
    cy.wait(100);

    cy.get('#deleteButton').click({force:true});
    cy.contains('LogoF1FanApp').should('not.exist');
  });

  it('View Media', () => {
    cy.login();

    cy.get('#changeHomeBTN').click({force:true});

    cy.get('#test').click({force:true});
    cy.wait(5000);
    
    cy.contains('IMG_1298').click({force:true});
    cy.wait(100);

    cy.get('img').should('have.attr', 'src').and('not.be.empty');
  });
})